/* 編輯區下方的假終端機
 *
 * 純裝飾:輸入框可以打字,Enter 會把那一行回顯上去然後給你新的提示字元,
 * 但不解析、不執行任何指令,也不碰頁面上其他東西。
 * 唯一的動態內容是啟動時算一次的 HMR 時間戳,之後沒有任何計時器在跑。
 */
const Terminal = (() => {
  const MAX_LINES = 200; // 回顯太多會拖慢捲動,超過就從最舊的丟

  let body, input, promptRow;

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
  }

  document.addEventListener("DOMContentLoaded", init);
  return {};
})();
