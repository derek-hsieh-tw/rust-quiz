/* 診斷工具面板:唯一需要 JS 的兩件事——工作階段計時器與收合切換。
 * 圖表、泳道、刻度的動畫全部在 CSS(diagnostics.css),這裡不碰。
 *
 * 計時器一秒跳一次,而且只寫一個 textContent;分頁切到背景時瀏覽器會自動
 * 節流,再加上 visibilitychange 直接停掉,回到前景才補上經過的時間。 */
const Diagnostics = (() => {
  const START = Date.now();
  let timer = null;

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

    document.addEventListener("visibilitychange", () => {
      document.hidden ? stop() : start();
    });
    start();
  }

  document.addEventListener("DOMContentLoaded", init);
  return {};
})();
