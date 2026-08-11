/* 課程索引:類別 → 課程清單
 * available: true  = 資料檔已建置,可點擊作答
 * available: false = 規劃中,sidebar 顯示灰色
 * 新增課程:1) 建立 data/<類別>/<id>.js  2) 把這裡對應項目改成 available: true
 */
window.RUST_INDEX = {
  categories: [
    {
      id: "basic",
      title: "基礎",
      lessons: [
        { id: "lesson1-1",  title: "Rust 全貌與開發環境",        file: "data/basic/lesson1-1.js",  available: true },
        { id: "lesson1-2",  title: "變數、可變性與基本型別",      file: "data/basic/lesson1-2.js",  available: true },
        { id: "lesson1-3",  title: "函式、運算式與控制流程",      file: "data/basic/lesson1-3.js",  available: true },
        { id: "lesson1-4",  title: "所有權(Ownership)",         file: "data/basic/lesson1-4.js",  available: true },
        { id: "lesson1-5",  title: "借用與參考",                 file: "data/basic/lesson1-5.js",  available: true },
        { id: "lesson1-6",  title: "Slice 與 String/&str 概觀",  file: "data/basic/lesson1-6.js",  available: true },
        { id: "lesson1-7",  title: "Struct 與方法",              file: "data/basic/lesson1-7.js",  available: true },
        { id: "lesson1-8",  title: "Enum、Option 與模式匹配",    file: "data/basic/lesson1-8.js",  available: true },
        { id: "lesson1-9",  title: "常用集合:Vec、HashMap",     file: "data/basic/lesson1-9.js",  available: true },
        { id: "lesson1-10", title: "錯誤處理:panic 與 Result",  file: "data/basic/lesson1-10.js", available: true },
        { id: "lesson1-11", title: "泛型(Generics)",           file: "data/basic/lesson1-11.js", available: false },
        { id: "lesson1-12", title: "Trait 基礎",                 file: "data/basic/lesson1-12.js", available: false },
        { id: "lesson1-13", title: "生命週期入門",               file: "data/basic/lesson1-13.js", available: false },
        { id: "lesson1-14", title: "模組系統與專案結構",         file: "data/basic/lesson1-14.js", available: false },
        { id: "lesson1-15", title: "測試、文件與基礎總整理",     file: "data/basic/lesson1-15.js", available: false },
      ],
    },
    {
      id: "advanced",
      title: "進階",
      lessons: [
        { id: "lesson2-1",  title: "閉包(Closures)",           file: "data/advanced/lesson2-1.js",  available: false },
        { id: "lesson2-2",  title: "迭代器(Iterators)",        file: "data/advanced/lesson2-2.js",  available: false },
        { id: "lesson2-3",  title: "智慧指標與內部可變性",       file: "data/advanced/lesson2-3.js",  available: false },
        { id: "lesson2-4",  title: "生命週期進階",               file: "data/advanced/lesson2-4.js",  available: false },
        { id: "lesson2-5",  title: "Trait 進階與 Trait 物件",    file: "data/advanced/lesson2-5.js",  available: false },
        { id: "lesson2-6",  title: "錯誤處理進階",               file: "data/advanced/lesson2-6.js",  available: false },
        { id: "lesson2-7",  title: "並行程式設計",               file: "data/advanced/lesson2-7.js",  available: false },
        { id: "lesson2-8",  title: "非同步 async/await",         file: "data/advanced/lesson2-8.js",  available: false },
        { id: "lesson2-9",  title: "型別轉換與轉換 Trait",       file: "data/advanced/lesson2-9.js",  available: false },
        { id: "lesson2-10", title: "模式匹配進階",               file: "data/advanced/lesson2-10.js", available: false },
        { id: "lesson2-11", title: "巨集入門(Macros)",         file: "data/advanced/lesson2-11.js", available: false },
        { id: "lesson2-12", title: "Cargo 生態與實戰慣用法",     file: "data/advanced/lesson2-12.js", available: false },
      ],
    },
    {
      id: "supplement",
      title: "進階・補充教材(底層 30%)",
      lessons: [
        { id: "lesson2-13", title: "Unsafe Rust",                file: "data/supplement/lesson2-13.js", available: false },
        { id: "lesson2-14", title: "String 與 UTF-8 底層",       file: "data/supplement/lesson2-14.js", available: false },
        { id: "lesson2-15", title: "記憶體布局深入",             file: "data/supplement/lesson2-15.js", available: false },
        { id: "lesson2-16", title: "Drop 與 RAII 深入",          file: "data/supplement/lesson2-16.js", available: false },
        { id: "lesson2-17", title: "Future 與 async 底層",       file: "data/supplement/lesson2-17.js", available: false },
        { id: "lesson2-18", title: "程序式巨集",                 file: "data/supplement/lesson2-18.js", available: false },
        { id: "lesson2-19", title: "FFI 與跨語言互操作",         file: "data/supplement/lesson2-19.js", available: false },
        { id: "lesson2-20", title: "編譯器與型別系統深水區",     file: "data/supplement/lesson2-20.js", available: false },
      ],
    },
  ],
};
