/* 左側課程樹(仿 VS Code Explorer) */
const Sidebar = (() => {
  const collapsed = {}; // categoryId -> bool

  function render(activeLessonId) {
    const tree = document.getElementById("lesson-tree");
    tree.innerHTML = "";

    RUST_INDEX.categories.forEach(cat => {
      const doneCount = cat.lessons.filter(l => Progress.isCompleted(l.id)).length;

      const catEl = document.createElement("div");
      catEl.className = "tree-category";
      catEl.innerHTML =
        `<span class="arrow">${collapsed[cat.id] ? "▸" : "▾"}</span>` +
        `<span>${cat.title}</span>` +
        `<span class="cat-count">${doneCount}/${cat.lessons.length}</span>`;
      catEl.addEventListener("click", () => {
        collapsed[cat.id] = !collapsed[cat.id];
        render(activeLessonId);
      });
      tree.appendChild(catEl);

      const itemsEl = document.createElement("div");
      itemsEl.className = "tree-items" + (collapsed[cat.id] ? " collapsed" : "");

      cat.lessons.forEach(lesson => {
        const item = document.createElement("div");
        item.className = "tree-item";
        if (lesson.id === activeLessonId) item.classList.add("active");
        if (!lesson.available) item.classList.add("unavailable");
        item.title = lesson.title + (lesson.available ? "" : "(尚未建置)");

        item.innerHTML =
          `<span class="file-icon">🦀</span>` +
          `<span class="file-name">${lesson.id}.rs</span>` +
          `<span class="file-title">${lesson.title}</span>` +
          (Progress.isCompleted(lesson.id) ? `<span class="done-mark">✓</span>` : "");

        if (lesson.available) {
          item.addEventListener("click", () => { location.hash = lesson.id; });
        }
        itemsEl.appendChild(item);
      });
      tree.appendChild(itemsEl);
    });
  }

  return { render };
})();
