/* 題目資料驗證(CI 部署前的守門員;本機執行:node scripts/validate-data.js)
 * 檢查項目:
 *  1. index.js 中 available: true 的課程,資料檔必須存在且正確註冊
 *  2. 每題:選項數 = 4、answer 必須為 0(出題慣例)、explanation 非空
 *  3. 每個選項必須是 { code } 或 { text } 其中一種
 *  4. 題目 id 不得重複
 *  5. 詳解不得出現「選項 A/B/C/D」字母指涉(選項會洗牌,字母對不上)
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
const seenIds = new Set();

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
    }
    console.log(`✓ ${meta.id}(${lesson.questions.length} 題)`);
  }
}

if (errors.length) {
  console.error(`\n✗ 驗證失敗,共 ${errors.length} 個問題:`);
  errors.forEach(e => console.error("  - " + e));
  process.exit(1);
}
console.log("\n✅ 題目資料驗證通過");
