/* 題目渲染、作答判定、詳解顯示 */
const Quiz = (() => {

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---- 編輯器風格程式碼區塊(行號 / 縮排線 / 整行 hover;手機版由 CSS 降級成純區塊) ---- */

  function highlightCode(code, lang) {
    if (window.hljs && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch { /* 失敗就退回純文字 */ }
    }
    return escapeHtml(code);
  }

  /* 把 highlight.js 的輸出逐行切開。
   * 上色的 <span> 可能跨行(多行字串/註解),切行時要先關閉所有未閉合的
   * span,下一行再重新展開,每行才是獨立合法的 HTML。 */
  function splitHighlightedLines(html) {
    const lines = [];
    const openTags = [];
    let current = "";
    let i = 0;
    while (i < html.length) {
      const ch = html[i];
      if (ch === "<") {
        const end = html.indexOf(">", i);
        const tag = html.slice(i, end + 1);
        if (tag[1] === "/") openTags.pop();
        else openTags.push(tag);
        current += tag;
        i = end + 1;
      } else if (ch === "\n") {
        lines.push(current + "</span>".repeat(openTags.length));
        current = openTags.join("");
        i++;
      } else {
        current += ch;
        i++;
      }
    }
    lines.push(current + "</span>".repeat(openTags.length));
    return lines;
  }

  /* 縮排線:依該行前導空白,每 4 格畫一條垂直線(空白行不畫) */
  function indentGuides(rawLine) {
    if (!rawLine.trim()) return "";
    const leading = (rawLine.match(/^ +/) || [""])[0].length;
    let guides = "";
    for (let col = 0; col + 4 <= leading; col += 4) {
      guides += `<span class="ig" style="left:${col}ch"></span>`;
    }
    return guides;
  }

  function codeBlock(code, lang) {
    const language = lang || "rust";
    const rawLines = code.split("\n");
    const htmlLines = splitHighlightedLines(highlightCode(code, language));
    const gutterWidth = String(rawLines.length).length; // 行號位數

    const rows = htmlLines.map((lineHtml, i) => {
      const guides = indentGuides(rawLines[i] || "");
      return (
        `<span class="code-line">` +
        `<span class="line-no" style="min-width:${gutterWidth}ch">${i + 1}</span>` +
        `<span class="line-content">${guides}${lineHtml}</span>` +
        `</span>`
      );
    });

    return `<pre class="code-block"><code class="hljs language-${language}">${rows.join("")}</code></pre>`;
  }

  /* ---- 逐行說明區塊(walkthrough)----
   * 資料格式:{ label?, intro?, outro?, lang?, lines: [{ code, note }] }
   * 完整程式碼由 lines 的 code 依序接起來,因此程式碼與說明永遠對齊,
   * 不會出現「改了程式碼忘了改行號」的問題。note 留空即該行不加註解。
   * 詳細規範見 專案根目錄的 AUTHORING.md。 */
  function annotatedBlock(wt) {
    const language = wt.lang || "rust";
    const lines = wt.lines || [];
    const code = lines.map(l => l.code).join("\n");
    const rawLines = code.split("\n");
    const htmlLines = splitHighlightedLines(highlightCode(code, language));
    const gutterWidth = String(rawLines.length).length;

    const rows = htmlLines.map((lineHtml, i) => {
      const guides = indentGuides(rawLines[i] || "");
      let row =
        `<span class="code-line">` +
        `<span class="line-no" style="min-width:${gutterWidth}ch">${i + 1}</span>` +
        `<span class="line-content">${guides}${lineHtml}</span>` +
        `</span>`;
      const note = (lines[i] || {}).note;
      if (note) {
        row +=
          `<span class="note-line">` +
          `<span class="line-no" style="min-width:${gutterWidth}ch"></span>` +
          `<span class="note-content">${escapeHtml(note)}</span>` +
          `</span>`;
      }
      return row;
    });

    return `<pre class="code-block annotated"><code class="hljs language-${language}">${rows.join("")}</code></pre>`;
  }

  function walkthroughHtml(wt) {
    let html = `<div class="walkthrough">`;
    html += `<div class="wt-label">${escapeHtml(wt.label || "Walkthrough")}</div>`;
    if (wt.intro) html += `<div class="wt-note">${escapeHtml(wt.intro)}</div>`;
    html += annotatedBlock(wt);
    if (wt.outro) html += `<div class="wt-note">${escapeHtml(wt.outro)}</div>`;
    return html + `</div>`;
  }

  const LABELS = ["A", "B", "C", "D", "E", "F"];

  /* 選項洗牌:資料檔中正確答案固定寫在第一個(answer: 0),
   * 顯示時以「題目 id」為種子做確定性洗牌——同一題每次載入順序相同,
   * localStorage 記錄的是原始索引,因此進度不受洗牌影響。
   * (詳解因此禁止用「選項 B」等字母指涉,必須描述選項內容) */
  function hashSeed(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function shuffledOrder(n, seedStr) {
    let s = hashSeed(seedStr);
    const rand = () => { // mulberry32 PRNG
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const order = Array.from({ length: n }, (_, i) => i); // 顯示位置 -> 原始索引
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }

  function renderLesson(lesson) {
    const content = document.getElementById("content");
    content.innerHTML = "";
    content.scrollTop = 0;

    const header = document.createElement("div");
    header.className = "lesson-header";
    header.innerHTML =
      `<h1>${escapeHtml(lesson.title)}</h1>` +
      (lesson.goal ? `<div class="lesson-goal">${escapeHtml(lesson.goal)}</div>` : "");
    content.appendChild(header);

    if (lesson.primer) content.appendChild(buildPrimer(lesson.primer));

    lesson.questions.forEach((q, qi) => {
      content.appendChild(buildQuestionCard(lesson, q, qi));
    });

    content.appendChild(buildFooter(lesson));
    updateLessonStatus(lesson);
  }

  /* 課前導讀(primer,選填):{ intro, examples: [{ code, note, lang? }], csharp? }
   * 放在課程標題與第一題之間;沒有 primer 的課程(基礎類)什麼都不畫。
   * 規範見 AUTHORING.md §1.1。 */
  function buildPrimer(primer) {
    const section = document.createElement("section");
    section.className = "lesson-primer";
    let html = `<div class="primer-label">Primer</div>`;
    if (primer.intro) html += `<div class="primer-intro">${escapeHtml(primer.intro)}</div>`;
    (primer.examples || []).forEach(ex => {
      html += codeBlock(ex.code, ex.lang);
      if (ex.note) html += `<div class="primer-note">${escapeHtml(ex.note)}</div>`;
    });
    if (primer.csharp) {
      html += `<div class="csharp-compare"><div class="cs-label">C# comparison</div><div class="cs-body">${escapeHtml(primer.csharp)}</div></div>`;
    }
    section.innerHTML = html;
    return section;
  }

  function buildQuestionCard(lesson, q, qi) {
    const card = document.createElement("div");
    card.className = "question-card";
    card.dataset.qid = q.id;

    let html = `<div class="question-title"><span class="q-no">Q${qi + 1}.</span>${escapeHtml(q.question)}</div>`;
    if (q.questionCode) html += codeBlock(q.questionCode, q.questionLang);
    card.innerHTML = html;

    const feedback = document.createElement("div");
    feedback.className = "answer-feedback";

    const order = shuffledOrder(q.options.length, q.id);
    const optionEls = {}; // 原始索引 -> 元素
    order.forEach((origIdx, pos) => {
      const opt = q.options[origIdx];
      const el = document.createElement("div");
      el.className = "option";
      const body = opt.code !== undefined
        ? codeBlock(opt.code, opt.lang)
        : `<div class="option-text">${escapeHtml(opt.text)}</div>`;
      el.innerHTML = `<span class="option-label">${LABELS[pos]}.</span><div class="option-body">${body}</div>`;
      el.addEventListener("click", () => answer(lesson, q, card, optionEls, feedback, origIdx, order));
      optionEls[origIdx] = el;
      card.appendChild(el);
    });

    card.appendChild(feedback);

    // 詳解區(預設隱藏)
    const exp = document.createElement("div");
    exp.className = "explanation";
    let expHtml = `<div class="exp-label">Explanation</div><div class="exp-body">${escapeHtml(q.explanation)}</div>`;
    if (q.walkthrough) {
      const wts = Array.isArray(q.walkthrough) ? q.walkthrough : [q.walkthrough];
      expHtml += wts.map(walkthroughHtml).join("");
    }
    if (q.csharp) {
      expHtml += `<div class="csharp-compare"><div class="cs-label">C# comparison</div><div class="cs-body">${escapeHtml(q.csharp)}</div></div>`;
    }
    exp.innerHTML = expHtml;
    card.appendChild(exp);

    // 還原之前的作答(記錄的是原始索引,與洗牌後的顯示順序無關)
    const prev = Progress.getAnswer(q.id);
    if (prev !== null && optionEls[prev]) showResult(q, card, optionEls, feedback, prev, order);

    return card;
  }

  function answer(lesson, q, card, optionEls, feedback, chosenOrig, order) {
    if (card.classList.contains("answered")) return; // 已作答不可改,重整頁面也保留
    Progress.setAnswer(q.id, chosenOrig);
    showResult(q, card, optionEls, feedback, chosenOrig, order);
    updateLessonStatus(lesson);
  }

  function showResult(q, card, optionEls, feedback, chosenOrig, order) {
    card.classList.add("answered");
    optionEls[q.answer].classList.add("correct");
    if (chosenOrig === q.answer) {
      feedback.className = "answer-feedback ok";
      feedback.textContent = "Passed!";
    } else {
      optionEls[chosenOrig].classList.add("wrong");
      feedback.className = "answer-feedback ng";
      feedback.textContent = `Failed — the answer is ${LABELS[order.indexOf(q.answer)]}`;
    }
    card.querySelector(".explanation").classList.add("show");
  }

  function buildFooter(lesson) {
    const footer = document.createElement("div");
    footer.className = "lesson-footer";

    const btnExp = document.createElement("button");
    btnExp.className = "btn";
    btnExp.textContent = "Show explanations";
    btnExp.addEventListener("click", () => {
      const exps = document.querySelectorAll(".explanation");
      const anyHidden = [...exps].some(e => !e.classList.contains("show"));
      exps.forEach(e => e.classList.toggle("show", anyHidden));
      btnExp.textContent = anyHidden ? "Hide explanations" : "Show explanations";
    });

    const btnDone = document.createElement("button");
    refreshDoneBtn(btnDone, lesson.id);
    btnDone.addEventListener("click", () => {
      Progress.setCompleted(lesson.id, !Progress.isCompleted(lesson.id));
      refreshDoneBtn(btnDone, lesson.id);
      Sidebar.render(lesson.id);
      App.updateGlobalStatus();
    });

    const btnClear = document.createElement("button");
    btnClear.className = "btn danger";
    btnClear.textContent = "Reset answers";
    btnClear.addEventListener("click", () => {
      if (!confirm("Clear all answers for this lesson? (Completion status is not affected.)")) return;
      Progress.clearAnswers(lesson.questions.map(q => q.id));
      renderLesson(lesson); // 重新渲染:所有題目回到未作答狀態
    });

    footer.appendChild(btnExp);
    footer.appendChild(btnDone);
    footer.appendChild(btnClear);
    return footer;
  }

  function refreshDoneBtn(btn, lessonId) {
    if (Progress.isCompleted(lessonId)) {
      btn.className = "btn done";
      btn.textContent = "Done — click to undo";
    } else {
      btn.className = "btn primary";
      btn.textContent = "Mark as done";
    }
  }

  function updateLessonStatus(lesson) {
    const answered = lesson.questions.filter(q => Progress.getAnswer(q.id) !== null);
    const correct = answered.filter(q => Progress.getAnswer(q.id) === q.answer).length;
    document.getElementById("status-lesson").textContent =
      `Lesson: ${correct}/${answered.length} correct (${lesson.questions.length} questions)`;
  }

  return { renderLesson };
})();
