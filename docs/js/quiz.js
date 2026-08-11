/* 題目渲染、作答判定、詳解顯示 */
const Quiz = (() => {

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function codeBlock(code, lang) {
    return `<pre class="code-block"><code class="language-${lang || "rust"}">${escapeHtml(code)}</code></pre>`;
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

    lesson.questions.forEach((q, qi) => {
      content.appendChild(buildQuestionCard(lesson, q, qi));
    });

    content.appendChild(buildFooter(lesson));
    highlightAll(content);
    updateLessonStatus(lesson);
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
    let expHtml = `<div class="exp-label">📖 詳解</div><div class="exp-body">${escapeHtml(q.explanation)}</div>`;
    if (q.csharp) {
      expHtml += `<div class="csharp-compare"><div class="cs-label">🔷 C# 對照</div><div class="cs-body">${escapeHtml(q.csharp)}</div></div>`;
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
      feedback.textContent = "✔ 答對了!";
    } else {
      optionEls[chosenOrig].classList.add("wrong");
      feedback.className = "answer-feedback ng";
      feedback.textContent = `✘ 答錯了,正確答案是 ${LABELS[order.indexOf(q.answer)]}`;
    }
    card.querySelector(".explanation").classList.add("show");
  }

  function buildFooter(lesson) {
    const footer = document.createElement("div");
    footer.className = "lesson-footer";

    const btnExp = document.createElement("button");
    btnExp.className = "btn";
    btnExp.textContent = "顯示詳細答案說明";
    btnExp.addEventListener("click", () => {
      const exps = document.querySelectorAll(".explanation");
      const anyHidden = [...exps].some(e => !e.classList.contains("show"));
      exps.forEach(e => e.classList.toggle("show", anyHidden));
      btnExp.textContent = anyHidden ? "隱藏詳細答案說明" : "顯示詳細答案說明";
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
    btnClear.textContent = "清除答案,重新作答";
    btnClear.addEventListener("click", () => {
      if (!confirm("確定要清除本課所有作答紀錄嗎?(完成狀態不受影響)")) return;
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
      btn.textContent = "✓ 已完成本課(點擊取消)";
    } else {
      btn.className = "btn primary";
      btn.textContent = "完成本課";
    }
  }

  function updateLessonStatus(lesson) {
    const answered = lesson.questions.filter(q => Progress.getAnswer(q.id) !== null);
    const correct = answered.filter(q => Progress.getAnswer(q.id) === q.answer).length;
    document.getElementById("status-lesson").textContent =
      `本課答對 ${correct}/${answered.length}(共 ${lesson.questions.length} 題)`;
  }

  function highlightAll(root) {
    if (window.hljs) {
      root.querySelectorAll("pre code").forEach(el => hljs.highlightElement(el));
    }
  }

  return { renderLesson };
})();
