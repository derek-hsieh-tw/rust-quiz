# RustLesson

給 C# 開發者的 Rust 互動式選擇題網站,純靜態(GitHub Pages,根目錄 `docs/`),
無建置流程、無相依套件。

## 結構

功能:

- `docs/index.html` — 單頁殼層
- `docs/js/{app,sidebar,quiz,progress}.js` — 路由、課程樹、題目渲染、localStorage 進度
- `docs/css/vscode-theme.css` — 外框版面與主題變數
- `docs/css/app.css` — 題目答案區(題目卡、選項、詳解、逐行說明)
- `docs/data/index.js` — 課程索引(新增課程要把 `available` 改 `true`)
- `docs/data/<類別>/lesson<X-Y>.js` — 題庫,每檔一課

裝飾(模擬 IDE 外觀,內容全部是假的,與課程資料無關):

- `docs/{js,css}/vs-header.*` — 頂部 Visual Studio 功能表與工具列(只有全螢幕鈕是真的)
- `docs/{js,css}/minimap.*` — 編輯區右側縮圖(色塊由實際內容的幾何位置算出,位置是準的)
- `docs/{js,css}/terminal.*` — 底部假終端機(可以打字,Enter 只回顯,不執行)
- `docs/{js,css}/diagnostics.*` — 右側「診斷工具」面板(CSS transform 動畫)

裝飾層不參與作答邏輯,也不讀題目資料;**新增或修改課程時完全不用理會它們**。

## 出題

**新增或修改任何題目前,必須先讀 `AUTHORING.md`** —— 那是題目資料格式的唯一依據,
特別是 `walkthrough`(逐行說明)欄位的規範:有程式碼的題目每一行都要有註解,
反面案例還要附上完整的正確寫法。

改動 `docs/css/app.css` 的文字顏色前也要先讀 `AUTHORING.md` §8 —— 題目答案區的
文字亮度是刻意壓低的,不是沒調好。
