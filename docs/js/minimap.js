/* 編輯區右側的縮圖(minimap),模仿 VS Code 的那一條
 *
 * 看不出字,但位置是真的:色塊是量實際元素的幾何位置畫出來的,
 * 所以縮圖的比例、密度跟畫面上的內容一一對應,slider 也就跟捲軸同步。
 * 程式碼的顏色沿用 highlight.js 的 token 類別,文字段落用該區塊的主色。
 *
 * 效能:整張畫在單一 <canvas>,只在內容變動(切換課程、展開詳解、作答)
 * 與視窗縮放時重畫一次;捲動時只改 slider 的 transform,不重畫。
 * 內容變動靠 MutationObserver 偵測並以 rAF 合併,所以 quiz.js 不必改。
 */
const Minimap = (() => {
  const W = 64;       // CSS 寬度(px)
  const CHAR = 0.85;  // 一個等寬字元在縮圖上的寬度(px)
  const CJK = 1.7;    // 中文段落的字寬倍率(比等寬字元寬)

  /* highlight.js 的 token class -> 顏色,沒列到的用預設前景色 */
  const TOKEN = {
    "hljs-keyword": "#569cd6",
    "hljs-built_in": "#4ec9b0",
    "hljs-type": "#4ec9b0",
    "hljs-literal": "#569cd6",
    "hljs-string": "#ce9178",
    "hljs-number": "#b5cea8",
    "hljs-comment": "#6a9955",
    "hljs-title": "#dcdcaa",
    "hljs-function": "#dcdcaa",
    "hljs-meta": "#c586c0",
    "hljs-symbol": "#d16969",
    "hljs-attr": "#9cdcfe",
    "hljs-params": "#9cdcfe",
    "hljs-variable": "#9cdcfe",
  };
  const FG = "#9d9d9d";

  /* 文字區塊:選擇器 -> 顏色(大致對應畫面上該區塊的文字色) */
  const TEXT_BLOCKS = [
    [".lesson-header h1", "#d8d8d8"],
    [".lesson-goal", "#7c7c7c"],
    [".question-title", "#c8c8c8"],
    [".option-text", "#a9a9a9"],
    [".answer-feedback", "#89b3a4"],
    [".exp-label", "#c9c48f"],
    [".exp-body", "#8d8d8d"],
    [".wt-label", "#6fb5a2"],
    [".wt-note", "#8d8d8d"],
    [".note-content", "#6d8894"],
    [".cs-label", "#7ea9cf"],
    [".cs-body", "#8b939c"],
  ];

  let mm, cv, slider, content;
  let scrollTick = false, drawTick = false, dragging = false;

  function tokenColor(el) {
    for (const cls of el.classList) {
      if (TOKEN[cls]) return TOKEN[cls];
    }
    return null;
  }

  function bar(g, col, y, len, color, barH) {
    const x = col * CHAR;
    if (x >= W) return;
    g.fillStyle = color;
    g.fillRect(x, y, Math.min(len * CHAR, W - x), barH);
  }

  /* 逐段畫出「非空白的字串」,縮排因此自然留白,看起來就有程式碼的輪廓 */
  function paintCode(g, node, state, y, barH, inherited) {
    if (node.nodeType === 3) {
      const re = /\S+/g;
      let m;
      while ((m = re.exec(node.nodeValue))) {
        bar(g, state.col + m.index, y, m[0].length, inherited, barH);
      }
      state.col += node.nodeValue.length;
      return;
    }
    if (node.nodeType !== 1) return;
    if (node.classList.contains("ig")) return; // 縮排線不是文字
    const color = tokenColor(node) || inherited;
    node.childNodes.forEach(c => paintCode(g, c, state, y, barH, color));
  }

  function draw() {
    if (!mm || !cv) return;
    const hasContent = !!content.querySelector(".question-card");
    mm.classList.toggle("empty", !hasContent); // 歡迎頁沒東西可縮,整條收掉
    if (!hasContent) return;

    const h = mm.clientHeight;
    const docH = content.scrollHeight;
    if (!h || !docH) return;

    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(h * dpr);
    cv.style.width = W + "px";
    cv.style.height = h + "px";

    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, h);

    // 整份文件壓縮進縮圖的高度;base 是「文件座標原點」的螢幕位置
    const scale = h / docH;
    const base = content.getBoundingClientRect().top - content.scrollTop;

    // 收合中的詳解是 display:none,量到的高度為 0,自然會被跳過
    content.querySelectorAll(".code-line").forEach(line => {
      const r = line.getBoundingClientRect();
      if (!r.height) return;
      const lc = line.querySelector(".line-content");
      if (!lc) return;
      paintCode(g, lc, { col: 0 }, (r.top - base) * scale,
                Math.max(r.height * scale * 0.8, 0.5), FG);
    });

    TEXT_BLOCKS.forEach(([sel, color]) => {
      content.querySelectorAll(sel).forEach(el => {
        const r = el.getBoundingClientRect();
        if (!r.height) return;
        const len = el.textContent.trim().length;
        if (!len) return;
        g.fillStyle = color;
        g.fillRect(2, (r.top - base) * scale,
                   Math.min(W - 4, len * CHAR * CJK),
                   Math.max(r.height * scale * 0.85, 0.6));
      });
    });
  }

  /* 捲動時只動 transform,不重畫 canvas */
  function syncSlider() {
    if (!mm || !mm.clientHeight) return;
    const h = mm.clientHeight;
    const docH = content.scrollHeight;
    const viewH = content.clientHeight;
    const sh = docH > viewH ? Math.max(18, (viewH / docH) * h) : h;
    const max = docH - viewH;
    slider.style.height = sh + "px";
    slider.style.transform = `translateY(${max > 0 ? (content.scrollTop / max) * (h - sh) : 0}px)`;
  }

  function onScroll() {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(() => { scrollTick = false; syncSlider(); });
  }

  /* 內容變動可能一次來很多筆(作答會連續改好幾個 class),用 rAF 合併成一次 */
  function refresh() {
    if (drawTick) return;
    drawTick = true;
    requestAnimationFrame(() => { drawTick = false; draw(); syncSlider(); });
  }

  /* 點縮圖跳到對應位置,可以按著拖 */
  function jumpTo(clientY) {
    const rect = mm.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);
    content.scrollTop = ratio * (content.scrollHeight - content.clientHeight);
  }

  function init() {
    mm = document.getElementById("minimap");
    content = document.getElementById("content");
    if (!mm || !content) return;
    cv = mm.querySelector("canvas");
    slider = mm.querySelector(".mm-slider");

    content.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", refresh);

    mm.addEventListener("mousedown", ev => { dragging = true; jumpTo(ev.clientY); ev.preventDefault(); });
    window.addEventListener("mousemove", ev => { if (dragging) jumpTo(ev.clientY); });
    window.addEventListener("mouseup", () => { dragging = false; });

    // 課程切換、詳解展開收合、作答都會改動 #content,一律重畫
    new MutationObserver(refresh).observe(content, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    refresh();
  }

  document.addEventListener("DOMContentLoaded", init);
  return { refresh };
})();
