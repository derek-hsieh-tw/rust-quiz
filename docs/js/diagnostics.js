/* 診斷工具面板:需要 JS 的三件事——工作階段計時器、收合切換、左緣拖曳調寬。
 * 圖表、泳道、刻度的動畫全部在 CSS(diagnostics.css),這裡不碰。
 *
 * 計時器一秒跳一次,而且只寫一個 textContent;分頁切到背景時瀏覽器會自動
 * 節流,再加上 visibilitychange 直接停掉,回到前景才補上經過的時間。 */
const Diagnostics = (() => {
  const START = Date.now();
  let timer = null;

  /* ---- 寬度:CSS 變數 --diag-w 控制 .diag-panel,拖曳時只改這個變數 ---- */
  const WIDTH_KEY = "rustlesson.diagWidth";
  const MIN_W = 220;

  // 上限跟著視窗走,免得把題目區擠沒了
  function maxWidth() {
    return Math.max(MIN_W, Math.min(700, Math.round(window.innerWidth * 0.55)));
  }

  function applyWidth(px, panel) {
    const w = Math.round(Math.min(Math.max(px, MIN_W), maxWidth()));
    panel.style.setProperty("--diag-w", w + "px");
    return w;
  }

  function loadWidth(panel) {
    try {
      const saved = parseInt(localStorage.getItem(WIDTH_KEY), 10);
      if (saved > 0) applyWidth(saved, panel);
    } catch (_) { /* 私密視窗或封鎖站台資料:維持 CSS 預設寬度就好 */ }
  }

  function saveWidth(w) {
    try { localStorage.setItem(WIDTH_KEY, String(w)); } catch (_) { /* 同上 */ }
  }

  function initResize(panel) {
    const handle = panel.querySelector(".diag-resize");
    if (!handle) return;

    handle.addEventListener("pointerdown", ev => {
      ev.preventDefault();
      const startX = ev.clientX;
      const startW = panel.querySelector(".diag-panel").getBoundingClientRect().width;
      let w = startW;

      panel.classList.add("resizing");
      handle.setPointerCapture(ev.pointerId);

      const onMove = e => {
        // 面板在右側,所以往左拖(clientX 變小)是變寬
        w = applyWidth(startW + (startX - e.clientX), panel);
      };
      const onUp = () => {
        handle.releasePointerCapture(ev.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);
        panel.classList.remove("resizing");
        saveWidth(w);
      };

      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
    });

    // 視窗縮小時重新套一次上限,拖寬過的面板才不會霸佔整個畫面
    window.addEventListener("resize", () => {
      const cur = panel.style.getPropertyValue("--diag-w");
      if (cur) applyWidth(parseInt(cur, 10), panel);
    });
  }

  function fmt(ms) {
    const total = Math.floor(ms / 1000);
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
  }

  function tick() {
    const el = document.getElementById("diag-clock");
    if (el) el.textContent = fmt(Date.now() - START);
  }

  function start() {
    if (timer) return;
    tick();
    timer = setInterval(tick, 1000);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  function init() {
    const panel = document.getElementById("diagnostics");
    if (!panel) return;

    // × 收合成右側細條,點細條再叫回來(VS 的自動隱藏行為)
    document.getElementById("diag-close").addEventListener("click", ev => {
      ev.stopPropagation();
      panel.classList.add("collapsed");
    });
    panel.querySelector(".diag-rail").addEventListener("click", () => {
      panel.classList.toggle("collapsed");
    });

    loadWidth(panel);
    initResize(panel);

    document.addEventListener("visibilitychange", () => {
      document.hidden ? stop() : start();
    });
    start();
  }

  document.addEventListener("DOMContentLoaded", init);
  return {};
})();
