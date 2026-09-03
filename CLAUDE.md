# RustLesson

給 C# 開發者的 Rust 互動式選擇題網站,純靜態(GitHub Pages,根目錄 `docs/`),
無建置流程、無相依套件。

## 結構

- `docs/index.html` — 單頁殼層
- `docs/js/{app,sidebar,quiz,progress}.js` — 路由、課程樹、題目渲染、localStorage 進度
- `docs/css/app.css` — VS Code 深色主題
- `docs/data/index.js` — 課程索引(新增課程要把 `available` 改 `true`)
- `docs/data/<類別>/lesson<X-Y>.js` — 題庫,每檔一課

## 出題

**新增或修改任何題目前,必須先讀 `AUTHORING.md`** —— 那是題目資料格式的唯一依據,
特別是 `walkthrough`(逐行說明)欄位的規範:有程式碼的題目每一行都要有註解,
反面案例還要附上完整的正確寫法。
