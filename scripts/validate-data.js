/* 題目資料驗證(CI 部署前的守門員;本機執行:node scripts/validate-data.js)
 * 檢查項目:
 *  1. index.js 中 available: true 的課程,資料檔必須存在且正確註冊
 *  2. 每題:選項數 = 4、answer 必須為 0(出題慣例)、explanation 非空
 *  3. 每個選項必須是 { code } 或 { text } 其中一種
 *  4. 題目 id 不得重複
 *  5. 詳解不得出現「選項 A/B/C/D」字母指涉(選項會洗牌,字母對不上)
 *  6. walkthrough(逐行說明):有程式碼的題目必須有、每行程式碼都要有註解、
 *     code 不得含換行、反面案例(❌)必須同時附上正確寫法(✅)
 *  7. ✅ 區塊裡的 Rust 程式碼必須完整可編譯(含 fn main 或測試模組),
 *     讀者要能整段複製去跑
 *  8. 🔧 去糖區塊:錯誤訊息提到讀者沒親手寫過的去糖識別字(Add / From /
 *     IntoIterator / Deref / Display / Ord …)時,該題要附 🔧 區塊把糖攤開
 *     ——既有題目已補完,預設與其他規則一樣擋下部署(--no-strict 可降級為警告)。
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

const errors = [];
const warnings = [];
const seenIds = new Set();

/* 🔧 去糖檢查(規範見 AUTHORING.md §4 與 §9)
 * 讀者學到的是語法糖,編譯器罵的是去糖後的東西。這些識別字一旦出現在錯誤訊息裡、
 * 而讀者在該題程式碼中從沒親手寫過,就是「糖底下露出來的實體」,必須攤開給他看。 */
const DESUGAR_STRICT = !process.argv.includes("--no-strict"); // 既有題目已補完,預設硬擋
const DESUGAR_TOKENS = [
  [/\bAdd(Assign)?\b/,           "+ → Add::add(self, …)"],
  [/\bIndex(Mut)?\b/,            "v[i] → *v.index(i) / index_mut(i)"],
  [/\bFrom\b|\bInto\b/,          "? → From::from(e) / .into() → From"],
  [/\bIntoIterator\b|into_iter/, "for x in v → IntoIterator::into_iter(v)(按值取用!)"],
  [/\bDeref\b/,                  "x.m() 穿過指標 → Deref 遞迴解引用"],
  [/\bDisplay\b/,                "{} → Display::fmt"],
  [/\bPartialOrd\b|\bOrd\b/,     "sort() / < → Ord 或 PartialOrd"],
  [/\bFnOnce\b|\bFnMut\b/,       "閉包 → Fn / FnMut / FnOnce"],
];

if (!loadScript("data/index.js")) {
  console.error("找不到 docs/data/index.js");
  process.exit(1);
}

for (const cat of window.RUST_INDEX.categories) {
  for (const meta of cat.lessons) {
    if (!meta.available) continue;

    if (!loadScript(meta.file)) {
      errors.push(`${meta.id}: 資料檔不存在(${meta.file})`);
      continue;
    }
    const lesson = window.RUST_LESSONS[meta.id];
    if (!lesson) {
      errors.push(`${meta.id}: 資料檔未註冊到 window.RUST_LESSONS["${meta.id}"]`);
      continue;
    }
    if (!lesson.questions || lesson.questions.length === 0) {
      errors.push(`${meta.id}: 沒有任何題目`);
      continue;
    }

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
  if (labels.some(l => l.startsWith("❌")) && !labels.some(l => l.startsWith("✅")))
    errors.push(`${tag}: 有 ❌ 區塊卻沒有 ✅ 正確寫法區塊`);

  // ✅ 區塊的 Rust 程式碼要能整段複製去跑,不能只給片段
  blocks.forEach(b => {
    if (!(b.label || "").startsWith("✅")) return;
    if (b.lang && b.lang !== "rust") return; // bash / ini / csharp 不適用
    const code = b.lines.map(l => l.code).join("\n");
    const isRustItem = /\bfn\s|\bimpl\s|\bstruct\s|\benum\s|\btrait\s/.test(code);
    if (!isRustItem) return; // 不是 Rust 定義(例如純設定檔或指令)就不檢查
    const runnable = /fn main\s*\(|#\[cfg\(test\)\]|#\[test\]/.test(code);
    if (!runnable)
      errors.push(`${tag}: ✅ 區塊「${b.label}」缺少 fn main,不是完整可執行的程式`);
  });
}

/* 🔧 去糖區塊:錯誤訊息提到讀者沒寫過的東西時,必須把糖攤開(AUTHORING.md §4) */
function validateDesugar(tag, q, sink) {
  const blocks = Array.isArray(q.walkthrough) ? q.walkthrough
    : (q.walkthrough ? [q.walkthrough] : []);
  const labels = blocks.map(b => b.label || "");
  if (!labels.some(l => l.startsWith("❌"))) return;      // 只管反面案例
  if (labels.some(l => l.startsWith("🔧"))) return;       // 已經攤開了
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
    sink.push(`${tag}: 錯誤訊息提到讀者沒寫過的去糖概念,建議補 🔧 區塊 —— ${hidden.join(";")}`);
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
