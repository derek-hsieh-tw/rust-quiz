/* 編輯區下方的假終端機
 *
 * 純裝飾:輸入框可以打字,Enter 會把那一行回顯上去然後給你新的提示字元,
 * 但不解析、不執行任何指令,也不碰頁面上其他東西。
 * 唯一的動態內容是啟動時算一次的 HMR 時間戳,之後沒有任何計時器在跑。
 * 版面上可以做兩件真事:頂緣拖曳調整高度(記在 localStorage),以及分頁列右邊的收合鈕。
 */
const Terminal = (() => {
  const MAX_LINES = 200; // 回顯太多會拖慢捲動,超過就從最舊的丟

  let body, input, promptRow;

  /* ---- 高度:CSS 變數 --term-h 控制 #terminal,拖曳時只改這個變數 ---- */
  const HEIGHT_KEY = "rustlesson.termHeight";
  const MIN_H = 90; // 分頁列 28px 再加上一兩行內容

  // 上限跟著視窗走,免得把題目區擠沒了
  function maxHeight() {
    return Math.max(MIN_H, Math.min(600, Math.round(window.innerHeight * 0.7)));
  }

  function applyHeight(px, term) {
    const h = Math.round(Math.min(Math.max(px, MIN_H), maxHeight()));
    term.style.setProperty("--term-h", h + "px");
    return h;
  }

  function loadHeight(term) {
    try {
      const saved = parseInt(localStorage.getItem(HEIGHT_KEY), 10);
      if (saved > 0) applyHeight(saved, term);
    } catch (_) { /* 私密視窗或封鎖站台資料:維持 CSS 預設高度就好 */ }
  }

  function saveHeight(h) {
    try { localStorage.setItem(HEIGHT_KEY, String(h)); } catch (_) { /* 同上 */ }
  }

  function initResize(term) {
    const handle = term.querySelector(".term-resize");
    if (!handle) return;

    handle.addEventListener("pointerdown", ev => {
      ev.preventDefault();
      const startY = ev.clientY;
      const startH = term.getBoundingClientRect().height;
      let h = startH;

      term.classList.add("resizing");
      handle.setPointerCapture(ev.pointerId);

      const onMove = e => {
        // 終端機在下方,所以往上拖(clientY 變小)是變高
        h = applyHeight(startH + (startY - e.clientY), term);
      };
      const onUp = () => {
        handle.releasePointerCapture(ev.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);
        term.classList.remove("resizing");
        saveHeight(h);
      };

      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
    });

    // 視窗變矮時重新套一次上限,拖高過的終端機才不會吃掉整個畫面
    window.addEventListener("resize", () => {
      const cur = term.style.getPropertyValue("--term-h");
      if (cur) applyHeight(parseInt(cur, 10), term);
    });
  }

  function stamp() {
    const d = new Date();
    const h = d.getHours();
    const half = h < 12 ? "上午" : "下午";
    const hh = h % 12 || 12;
    const pad = n => String(n).padStart(2, "0");
    return `${half}${pad(hh)}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function echo(text) {
    const line = document.createElement("div");
    line.className = "tl";
    line.innerHTML = `<span class="c-green">PS D:\\Projects\\RustLesson&gt;</span> `;
    line.appendChild(document.createTextNode(text)); // 使用者輸入一律當純文字
    body.insertBefore(line, promptRow);

    while (body.querySelectorAll(".tl").length > MAX_LINES) {
      body.removeChild(body.querySelector(".tl"));
    }
    body.scrollTop = body.scrollHeight;
  }

  function init() {
    const term = document.getElementById("terminal");
    if (!term) return;
    body = document.getElementById("term-body");
    input = document.getElementById("term-input");
    promptRow = term.querySelector(".term-prompt");

    const ts = document.getElementById("term-stamp");
    if (ts) ts.textContent = stamp();

    // Enter 只回顯,不執行;其他按鍵交給瀏覽器預設行為
    input.addEventListener("keydown", ev => {
      if (ev.key !== "Enter") return;
      ev.preventDefault();
      echo(input.value);
      input.value = "";
    });

    // 點終端機任何空白處都聚焦到輸入框(選取文字時不搶焦點)
    body.addEventListener("mouseup", () => {
      if (!String(window.getSelection())) input.focus();
    });

    document.getElementById("term-toggle").addEventListener("click", () => {
      const collapsed = term.classList.toggle("collapsed");
      document.getElementById("term-toggle").textContent = collapsed ? "⌃" : "⌄";
    });

    loadHeight(term);
    initResize(term);
  }

  document.addEventListener("DOMContentLoaded", init);
  return {};
})();
