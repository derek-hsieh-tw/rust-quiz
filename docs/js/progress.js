/* localStorage 進度管理
 * 結構: {
 *   completed: { "lesson1-1": true, ... },
 *   answers:   { "1-1-01": 2, ... }   // 題目 id -> 使用者選的選項索引
 * }
 * key 加前綴,避免與同帳號其他 GitHub Pages 專案(同源 *.github.io)衝突
 */
const Progress = (() => {
  const KEY = "rustlesson.progress.v1";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || { completed: {}, answers: {} };
    } catch {
      return { completed: {}, answers: {} };
    }
  }

  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  return {
    isCompleted(lessonId) {
      return !!load().completed[lessonId];
    },
    setCompleted(lessonId, done) {
      const s = load();
      if (done) s.completed[lessonId] = true;
      else delete s.completed[lessonId];
      save(s);
    },
    getAnswer(questionId) {
      const a = load().answers[questionId];
      return a === undefined ? null : a;
    },
    setAnswer(questionId, optionIndex) {
      const s = load();
      s.answers[questionId] = optionIndex;
      save(s);
    },
    /* 清除指定題目的作答紀錄(整課重做用;不影響完成狀態) */
    clearAnswers(questionIds) {
      const s = load();
      questionIds.forEach(id => delete s.answers[id]);
      save(s);
    },
    /* 各分類完成數,給 status bar 用 */
    categoryStats(index) {
      const s = load();
      return index.categories.map(cat => ({
        title: cat.title,
        done: cat.lessons.filter(l => s.completed[l.id]).length,
        total: cat.lessons.length,
      }));
    },
  };
})();
