/* 入口:hash 路由、課程資料動態載入(script 注入,file:// 與 GitHub Pages 都可用) */
const App = (() => {
  window.RUST_LESSONS = window.RUST_LESSONS || {};

  const GITHUB_REPO_URL = "https://github.com/derek-hsieh-tw/rust-quiz";

  function findLesson(id) {
    for (const cat of RUST_INDEX.categories) {
      const l = cat.lessons.find(x => x.id === id);
      if (l) return { lesson: l, category: cat };
    }
    return null;
  }

  /* 以 <script> 注入載入課程資料檔(取代 fetch,避免 file:// 的 CORS 限制) */
  function loadLessonData(meta) {
    return new Promise((resolve, reject) => {
      if (RUST_LESSONS[meta.id]) return resolve(RUST_LESSONS[meta.id]);
      const s = document.createElement("script");
      s.src = "./" + meta.file;
      s.onload = () => RUST_LESSONS[meta.id] ? resolve(RUST_LESSONS[meta.id]) : reject(new Error("資料格式錯誤"));
      s.onerror = () => reject(new Error("載入失敗"));
      document.body.appendChild(s);
    });
  }

  function setTab(text) {
    document.getElementById("tabbar").innerHTML = text
      ? `<div class="tab"><span>🦀 ${text}</span><span class="tab-close">×</span></div>`
      : "";
  }

  function setBreadcrumb(parts) {
    document.getElementById("breadcrumb").textContent = parts.join("  ›  ");
  }

  function showWelcome() {
    setTab("");
    setBreadcrumb([]);
    document.getElementById("content").innerHTML = `
      <div class="welcome">
        <div class="welcome-logo">🦀</div>
        <h1>Rust Lesson</h1>
        <p>以選擇題深入學習 Rust 的基礎與進階語法,<br>
           每題附完整詳解與 C# 特性對照。</p>
        <p class="start-hint">從左側 <span class="kbd">EXPLORER</span> 選擇一課開始 →
           建議由 <span class="kbd">lesson1-1.rs</span> 依序往下</p>
      </div>`;
    Sidebar.render(null);
    document.getElementById("status-lesson").textContent = "";
  }

  function showNotice(msg) {
    document.getElementById("content").innerHTML = `<div class="notice">${msg}</div>`;
  }

  async function route() {
    const id = location.hash.replace(/^#/, "");
    if (!id) return showWelcome();

    const found = findLesson(id);
    if (!found) return showNotice(`找不到課程「${id}」`);

    Sidebar.render(id);
    setTab(`${id}.rs`);
    setBreadcrumb([found.category.title, `${id} ${found.lesson.title}`]);

    if (!found.lesson.available) {
      document.getElementById("status-lesson").textContent = "";
      return showNotice("這一課還沒建置,敬請期待 🚧");
    }

    try {
      const lesson = await loadLessonData(found.lesson);
      Quiz.renderLesson(lesson);
    } catch (e) {
      showNotice(`課程資料載入失敗:${e.message}`);
    }
  }

  function updateGlobalStatus() {
    const stats = Progress.categoryStats(RUST_INDEX);
    document.getElementById("status-progress").textContent =
      "進度: " + stats.map(s => `${s.title} ${s.done}/${s.total}`).join(" · ");
  }

  /* 行動版抽屜選單 */
  function closeSidebar() {
    document.body.classList.remove("sidebar-open");
  }

  function initMobileMenu() {
    document.getElementById("menu-toggle").addEventListener("click", () => {
      document.body.classList.toggle("sidebar-open");
    });
    document.getElementById("backdrop").addEventListener("click", closeSidebar);
  }

  function init() {
    const gh = document.getElementById("github-link");
    if (gh) gh.href = GITHUB_REPO_URL;
    initMobileMenu();
    updateGlobalStatus();
    window.addEventListener("hashchange", () => {
      closeSidebar(); // 行動版:選完課自動收起抽屜
      route();
    });
    route();
  }

  document.addEventListener("DOMContentLoaded", init);
  return { updateGlobalStatus };
})();
