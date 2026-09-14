/* 裝飾用的假「尋找及取代」面板(樣式見 css/find-widget.css)
 *
 * 模仿 Visual Studio 編輯區右上角那個浮動視窗。這裡只做三件真事:
 *   1. 兩個輸入框可以打字(純粹讓它有手感,不會去搜尋題目內容)
 *   2. 左上角的 ⌃ 可以把「取代」與比對選項那兩列收起來,跟 VS 一樣
 *   3. ✕ 把面板收成右上角一顆 ⌕ 小按鈕,點它再展開(比照診斷工具的細條)
 * 其餘的放大鏡、上一個/下一個、Aa/Ab/.*、「整個解決方案」全是圖案,點了不會有事。
 * 刻意不攔 Ctrl+F,把它留給瀏覽器自己的頁內搜尋。
 * 不讀題目資料,也不參與作答邏輯。
 */
(() => {
  "use strict";

  function init() {
    const fw = document.querySelector(".find-widget");
    if (!fw) return;

    // 摺疊鈕:只留尋找那一列
    const toggle = fw.querySelector(".fw-toggle");
    toggle.addEventListener("click", () => {
      const collapsed = fw.classList.toggle("collapsed");
      toggle.textContent = collapsed ? "⌄" : "⌃";
      toggle.title = collapsed ? "展開取代" : "摺疊";
    });

    // ✕ 收起來,縮成一顆 ⌕;點 ⌕ 再展開並把游標放進尋找框
    const reopen = document.getElementById("find-reopen");
    const findInput = fw.querySelector(".fw-row input");

    function setVisible(on) {
      fw.classList.toggle("hidden", !on);
      if (reopen) reopen.classList.toggle("show", !on);
    }

    fw.querySelector(".fw-btn.close").addEventListener("click", () => setVisible(false));
    if (reopen) {
      reopen.addEventListener("click", () => {
        setVisible(true);
        findInput.focus();
      });
    }

    // 輸入框:Enter 不做事,但擋掉表單預設行為;Esc 收起面板,跟 VS 一樣
    fw.querySelectorAll("input").forEach(input => {
      input.addEventListener("keydown", ev => {
        if (ev.key === "Enter") ev.preventDefault();
        if (ev.key === "Escape") {
          input.blur();
          setVisible(false);
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
