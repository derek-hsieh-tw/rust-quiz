/* 題目資料驗證(CI 部署前的守門員;本機執行:node scripts/validate-data.js)
 * 檢查項目:
 *  1. index.js 中 available: true 的課程,資料檔必須存在且正確註冊
 *  2. 每題:選項數 = 4、answer 必須為 0(出題慣例)、explanation 非空
 *  3. 每個選項必須是 { code } 或 { text } 其中一種
 *  4. 題目 id 不得重複
 *  5. 詳解不得出現「選項 A/B/C/D」字母指涉(選項會洗牌,字母對不上)
 *  6. walkthrough(逐行說明):有程式碼的題目必須有、每行程式碼都要有註解、
 *     code 不得含換行、反面案例(X)必須同時附上正確寫法(√)
 *  7. √ 區塊裡的 Rust 程式碼必須完整可編譯(含 fn main 或測試模組),
 *     讀者要能整段複製去跑
 *  8. △ 去糖區塊:錯誤訊息提到讀者沒親手寫過的去糖識別字(Add / From /
 *     IntoIterator / Deref / Display / Ord …)時,該題要附 △ 區塊把糖攤開
 *     ——既有題目已補完,預設與其他規則一樣擋下部署(--no-strict 可降級為警告)。
 *  9. primer(課前導讀,選填):有的話格式要對(intro / examples 1~2 個 / csharp),
 *     不得有未知欄位、選項字母指涉或 emoji(規範見 AUTHORING.md §1.1)
 *
 * CLI 選項:
 *   --lesson <id>[,<id>...]  只驗指定課程,忽略 index.js 的 available 旗標
 *                            (新課程開發期間用這個——課程還沒上架也能驗自己的檔案)
 *   --no-strict              △ 去糖檢查降級為警告,不擋部署(可與 --lesson 並用)
 *
 * 不帶 --lesson 時,行為與過去完全一致:只驗 index.js 裡 available: true 的課程
 * ——CI 的 .github/workflows/deploy.yml 依賴這個預設行為,不能變。
 *
 * 規範全文見專案根目錄 AUTHORING.md。
 */
const fs = require("fs");
const path = require("path");

const DOCS = path.join(__dirname, "..", "docs");
global.window = {};

function loadScript(rel) {
  const file = path.join(DOCS, rel);
  if (!fs.existsSync(file)) return false;
  eval(fs.readFileSync(file, "utf8"));
  return true;
}

const argv = process.argv.slice(2);
const errors = [];
const warnings = [];
const seenIds = new Set();

/* --lesson 解析:支援 `--lesson id` 與 `--lesson=id`,逗號分隔可指定多課。
 * 沒有帶 --lesson 時回傳 null,呼叫端會走「只驗 available: true」的舊行為。 */
function parseLessonArg(list) {
  let raw = null;
  const eqArg = list.find(a => a.startsWith("--lesson="));
  if (eqArg) {
    raw = eqArg.slice("--lesson=".length);
  } else {
    const idx = list.indexOf("--lesson");
    if (idx !== -1) raw = list[idx + 1];
  }
  if (raw === null) return null; // 沒有指定 --lesson,走預設行為

  if (!raw || raw.startsWith("--")) {
    console.error(
      "✗ --lesson 需要指定課程 id,例如:--lesson lesson2-1 或 --lesson lesson2-1,lesson2-2"
    );
    process.exit(1);
  }
  const ids = raw.split(",").map(s => s.trim()).filter(Boolean);
  if (ids.length === 0) {
    console.error("✗ --lesson 的課程 id 清單是空的");
    process.exit(1);
  }
  return ids;
}

const lessonFilter = parseLessonArg(argv);

/* △ 去糖檢查(規範見 AUTHORING.md §4 與 §9)
 * 讀者學到的是語法糖,編譯器罵的是去糖後的東西。這些識別字一旦出現在錯誤訊息裡、
 * 而讀者在該題程式碼中從沒親手寫過,就是「糖底下露出來的實體」,必須攤開給他看。 */
const DESUGAR_STRICT = !argv.includes("--no-strict"); // 既有題目已補完,預設硬擋
const DESUGAR_TOKENS = [
  [/\bAdd(Assign)?\b/,           "+ → Add::add(self, …)"],
  [/\bIndex(Mut)?\b/,            "v[i] → *v.index(i) / index_mut(i)"],
  [/\bFrom\b|\bInto\b/,          "? → From::from(e) / .into() → From"],
  [/\bIntoIterator\b|into_iter/, "for x in v → IntoIterator::into_iter(v)(按值取用!)"],
  [/\bDeref\b/,                  "x.m() 穿過指標 → Deref 遞迴解引用"],
  [/\bDisplay\b/,                "{} → Display::fmt"],
  [/\bPartialOrd\b|\bOrd\b/,     "sort() / < → Ord 或 PartialOrd"],
  [/\bFnOnce\b|\bFnMut\b/,       "閉包 → Fn / FnMut / FnOnce"],
  [/\bFuture\b|\bpoll\b/,        ".await → Future::poll(cx) 狀態機迴圈"],
  [/\bSend\b|\bSync\b/,          "跨執行緒共享/搬移 → 編譯器自動推導的 Send/Sync"],
  [/\bSized\b/,                  "dyn Trait → 動態大小型別,不是 Sized(?Sized)"],
];

if (!loadScript("data/index.js")) {
  console.error("找不到 docs/data/index.js");
  process.exit(1);
}

// 課程 id → meta,不論 available 與否,供 --lesson 查表用
const allLessons = new Map();
for (const cat of window.RUST_INDEX.categories) {
  for (const meta of cat.lessons) {
    allLessons.set(meta.id, meta);
  }
}

/* 驗證單一課程。資料檔不存在 / 未註冊 / 沒有題目時把錯誤塞進 errors 並返回,
 * 不會拋例外——CLI 永遠是「清楚的錯誤訊息 + exit 非 0」,不是 crash。 */
function validateLesson(meta) {
  if (!loadScript(meta.file)) {
    errors.push(`${meta.id}: 資料檔不存在(${meta.file})`);
    return;
  }
  const lesson = window.RUST_LESSONS[meta.id];
  if (!lesson) {
    errors.push(`${meta.id}: 資料檔未註冊到 window.RUST_LESSONS["${meta.id}"]`);
    return;
  }
  if (!lesson.questions || lesson.questions.length === 0) {
    errors.push(`${meta.id}: 沒有任何題目`);
    return;
  }

  if (lesson.primer !== undefined) validatePrimer(meta.id, lesson.primer, errors);

  for (const q of lesson.questions) {
    const tag = `${meta.id} / ${q.id}`;
    if (seenIds.has(q.id)) errors.push(`${tag}: 題目 id 重複`);
    seenIds.add(q.id);

    if (!Array.isArray(q.options) || q.options.length !== 4)
      errors.push(`${tag}: 選項數必須為 4(目前 ${q.options ? q.options.length : 0})`);
    if (q.answer !== 0)
      errors.push(`${tag}: answer 必須為 0(正確答案寫在第一個選項,由前端洗牌)`);
    if (!q.explanation || !q.explanation.trim())
      errors.push(`${tag}: 缺少 explanation`);

    (q.options || []).forEach((o, i) => {
      const hasCode = o.code !== undefined;
      const hasText = o.text !== undefined;
      if (hasCode === hasText)
        errors.push(`${tag}: 選項 ${i} 必須是 { code } 或 { text } 擇一`);
    });

    const letterRef = /選項\s*[A-D]|[A-D]\s*和\s*[A-D]\s*都/;
    for (const field of ["explanation", "csharp"]) {
      if (q[field] && letterRef.test(q[field]))
        errors.push(`${tag}: ${field} 出現選項字母指涉(洗牌後字母會對不上)`);
    }

    validateWalkthrough(tag, q, errors);
    validateDesugar(tag, q, DESUGAR_STRICT ? errors : warnings);
  }
  console.log(`✓ ${meta.id}(${lesson.questions.length} 題)`);
}

if (lessonFilter) {
  // 只驗指定課程,忽略 available 旗標。但題目 id 唯一性要跟全站對齊,
  // 所以先把所有 available: true 課程的 id 灌進 seenIds(目標課本身跳過,
  // 避免它稍後正式驗證時跟「自己」誤判重複),新課撞到既有 id 才抓得到。
  for (const cat of window.RUST_INDEX.categories) {
    for (const meta of cat.lessons) {
      if (!meta.available) continue;
      if (lessonFilter.includes(meta.id)) continue;
      if (!loadScript(meta.file)) continue;
      const seedLesson = window.RUST_LESSONS[meta.id];
      if (seedLesson && seedLesson.questions) {
        for (const q of seedLesson.questions) seenIds.add(q.id);
      }
    }
  }

  for (const id of lessonFilter) {
    const meta = allLessons.get(id);
    if (!meta) {
      errors.push(`--lesson ${id}: docs/data/index.js 裡找不到這個課程 id`);
      continue;
    }
    validateLesson(meta);
  }
} else {
  // 預設行為(不變):只驗 available: true 的課程
  for (const cat of window.RUST_INDEX.categories) {
    for (const meta of cat.lessons) {
      if (!meta.available) continue;
      validateLesson(meta);
    }
  }
}

/* walkthrough(逐行說明)的規範檢查,細節見 AUTHORING.md */
function validateWalkthrough(tag, q, errors) {
  const hasCode = q.questionCode !== undefined ||
    (q.options || []).some(o => o.code !== undefined);

  if (!q.walkthrough) {
    if (hasCode) errors.push(`${tag}: 題目含程式碼,必須提供 walkthrough(逐行說明)`);
    return;
  }

  const blocks = Array.isArray(q.walkthrough) ? q.walkthrough : [q.walkthrough];
  if (blocks.length === 0) {
    errors.push(`${tag}: walkthrough 是空陣列`);
    return;
  }

  blocks.forEach((b, bi) => {
    const at = `${tag} / walkthrough[${bi}]`;
    if (!Array.isArray(b.lines) || b.lines.length === 0) {
      errors.push(`${at}: 缺少 lines`);
      return;
    }
    b.lines.forEach((ln, li) => {
      if (typeof ln.code !== "string") {
        errors.push(`${at} 第 ${li + 1} 行:缺少 code 字串`);
        return;
      }
      // 完整程式碼由各行 code 接起來,含換行會讓行號與註解錯位
      if (ln.code.includes("\n"))
        errors.push(`${at} 第 ${li + 1} 行:code 不可含換行,請拆成多行`);
      // 空行與純結構行以外,每一行都要有說明
      if (ln.code.trim() && !(ln.note || "").trim())
        errors.push(`${at} 第 ${li + 1} 行缺少 note:${JSON.stringify(ln.code)}`);
    });
  });

  // 反面案例必須附上可直接編譯執行的正確寫法
  const labels = blocks.map(b => b.label || "");
  if (labels.some(l => l.startsWith("X")) && !labels.some(l => l.startsWith("√")))
    errors.push(`${tag}: 有 X 區塊卻沒有 √ 正確寫法區塊`);

  // √ 區塊的 Rust 程式碼要能整段複製去跑,不能只給片段
  blocks.forEach(b => {
    if (!(b.label || "").startsWith("√")) return;
    if (b.lang && b.lang !== "rust") return; // bash / ini / csharp 不適用
    const code = b.lines.map(l => l.code).join("\n");
    const isRustItem = /\bfn\s|\bimpl\s|\bstruct\s|\benum\s|\btrait\s/.test(code);
    if (!isRustItem) return; // 不是 Rust 定義(例如純設定檔或指令)就不檢查
    const runnable = /fn main\s*\(|#\[cfg\(test\)\]|#\[test\]/.test(code);
    if (!runnable)
      errors.push(`${tag}: √ 區塊「${b.label}」缺少 fn main,不是完整可執行的程式`);
  });
}

/* primer(課前導讀,選填):基礎類課程沒有,不強制。規範見 AUTHORING.md §1.1 */
function validatePrimer(lessonId, p, errors) {
  // 常數放函式內:這支腳本在檔案中段就開始跑驗證,頂層 const 此時還在 TDZ
  const PRIMER_KEYS = ["intro", "examples", "csharp"];
  const PRIMER_EXAMPLE_KEYS = ["code", "note", "lang"];
  const LETTER_REF = /選項\s*[A-D]|[A-D]\s*和\s*[A-D]\s*都/;
  const EMOJI = /\p{Extended_Pictographic}/u;
  const at = `${lessonId} / primer`;
  const isText = v => typeof v === "string" && v.trim() !== "";
  if (!p || typeof p !== "object" || Array.isArray(p)) {
    errors.push(`${at}: 必須是物件 { intro, examples, csharp? }`);
    return;
  }
  for (const k of Object.keys(p))
    if (!PRIMER_KEYS.includes(k)) errors.push(`${at}: 未知欄位「${k}」`);
  if (!isText(p.intro)) errors.push(`${at}: intro 必須是非空字串`);
  if (p.csharp !== undefined && !isText(p.csharp))
    errors.push(`${at}: csharp 有填就必須是非空字串`);

  const texts = [["intro", p.intro], ["csharp", p.csharp]];
  if (!Array.isArray(p.examples) || p.examples.length < 1 || p.examples.length > 2) {
    errors.push(`${at}: examples 必須是 1~2 個元素的陣列`);
  } else {
    p.examples.forEach((ex, i) => {
      const ea = `${at}.examples[${i}]`;
      if (!ex || typeof ex !== "object" || Array.isArray(ex)) {
        errors.push(`${ea}: 必須是物件 { code, note, lang? }`);
        return;
      }
      for (const k of Object.keys(ex))
        if (!PRIMER_EXAMPLE_KEYS.includes(k)) errors.push(`${ea}: 未知欄位「${k}」`);
      if (!isText(ex.code)) errors.push(`${ea}: code 必須是非空字串`);
      if (!isText(ex.note)) errors.push(`${ea}: note 必須是非空字串`);
      if (ex.lang !== undefined && !isText(ex.lang)) errors.push(`${ea}: lang 有填就必須是非空字串`);
      texts.push([`examples[${i}].note`, ex.note]);
    });
  }

  for (const [field, v] of texts) {
    if (typeof v !== "string") continue;
    if (LETTER_REF.test(v)) errors.push(`${at}: ${field} 出現選項字母指涉`);
    if (EMOJI.test(v)) errors.push(`${at}: ${field} 不可含 emoji`);
  }
}

/* △ 去糖區塊:錯誤訊息提到讀者沒寫過的東西時,必須把糖攤開(AUTHORING.md §4) */
function validateDesugar(tag, q, sink) {
  const blocks = Array.isArray(q.walkthrough) ? q.walkthrough
    : (q.walkthrough ? [q.walkthrough] : []);
  const labels = blocks.map(b => b.label || "");
  if (!labels.some(l => l.startsWith("X"))) return;       // 只管反面案例
  if (labels.some(l => l.startsWith("△"))) return;       // 已經攤開了
  if (q.desugarChecked) return;                           // 人工複核過:錯誤訊息沒有隱藏的去糖概念

  // 錯誤訊息:⛔ 標記的那幾行註解,加上詳解
  const errText = blocks
    .flatMap(b => (b.lines || []).map(l => l.note || ""))
    .filter(n => n.includes("⛔"))
    .join(String.fromCharCode(10));

  // 讀者在這一題裡親手寫過的程式碼(寫過就不算「陌生字」)
  const written = [
    q.questionCode || "",
    ...(q.options || []).map(o => o.code || ""),
    ...blocks.flatMap(b => (b.lines || []).map(l => l.code)),
  ].join(String.fromCharCode(10));

  const hidden = DESUGAR_TOKENS
    .filter(([re]) => re.test(errText) && !re.test(written))
    .map(([, hint]) => hint);

  if (hidden.length)
    sink.push(`${tag}: 錯誤訊息提到讀者沒寫過的去糖概念,建議補 △ 區塊 —— ${hidden.join(";")}`);
}

if (warnings.length) {
  console.warn(`
⚠ 去糖提醒(--no-strict 模式,不擋部署),共 ${warnings.length} 題:`);
  warnings.forEach(w => console.warn("  - " + w));
}

if (errors.length) {
  console.error(`\n✗ 驗證失敗,共 ${errors.length} 個問題:`);
  errors.forEach(e => console.error("  - " + e));
  process.exit(1);
}
console.log("\n✅ 題目資料驗證通過");
