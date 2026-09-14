/* 假 Visual Studio header 裡唯一真的會動的按鈕:最大化 = 全螢幕切換。
 * 其餘(最小化、關閉、功能表、工具列)都是裝飾,沒有事件。 */
const VsHeader = (() => {
  function isFull() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }

  function enter() {
    const el = document.documentElement;
    const fn = el.requestFullscreen || el.webkitRequestFullscreen;
    // 被瀏覽器擋下(例如非使用者操作觸發)時安靜略過,不要噴錯
    if (fn) Promise.resolve(fn.call(el)).catch(() => {});
  }

  function exit() {
    const fn = document.exitFullscreen || document.webkitExitFullscreen;
    if (fn) Promise.resolve(fn.call(document)).catch(() => {});
  }

  function init() {
    const btn = document.getElementById("win-maximize");
    if (!btn) return;

    // 全螢幕時換成 Windows 的「還原」圖示,按 Esc 離開也會同步
    const sync = () => {
      const full = isFull();
      btn.textContent = full ? "❐" : "▢";
      btn.title = full ? "結束全螢幕" : "全螢幕";
    };

    btn.addEventListener("click", () => (isFull() ? exit() : enter()));
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    sync();
  }

  document.addEventListener("DOMContentLoaded", init);
  return {};
})();
