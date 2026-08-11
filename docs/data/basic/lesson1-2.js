/* 出題慣例:answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌。
 * 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容。 */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-2"] = {
  id: "lesson1-2",
  title: "變數、可變性與基本型別",
  goal: "掌握 let 預設不可變的思維(與 C# 的第一個大差異)、shadowing,以及純量與複合型別。",
  questions: [
    {
      id: "1-2-01",
      question: "以下程式碼的結果是?",
      questionCode: "fn main() {\n    let x = 5;\n    x = 6;\n    println!(\"{}\", x);\n}",
      options: [
        { text: "編譯錯誤:cannot assign twice to immutable variable `x`" },
        { text: "印出 6" },
        { text: "印出 5" },
        { text: "執行期 panic" },
      ],
      answer: 0,
      explanation: `Rust 的 let 宣告「預設不可變」,對不可變變數重新賦值是編譯錯誤,程式根本跑不起來。
這是刻意的語言設計:大部分變數其實一輩子只被賦值一次,把「會變」標成例外(mut),讀程式碼時就能一眼看出哪些值可能在中途被改動。`,
      csharp: `C# 正好相反:變數預設可變,要不可變得主動加 readonly(欄位)或 const。Rust 把預設值反過來——從「什麼都能改」的世界來到 Rust,第一個要適應的就是這裡。`,
    },
    {
      id: "1-2-02",
      question: "要讓上一題的程式碼合法(可重新賦值),正確的修改是?",
      options: [
        { code: "let mut x = 5;\nx = 6;" },
        { code: "mut let x = 5;\nx = 6;" },
        { code: "var x = 5;\nx = 6;" },
        { code: "let x = 5;\nx := 6;" },
      ],
      answer: 0,
      explanation: `mut 關鍵字接在 let 之後、變數名之前:let mut x。加了 mut 的變數才能重新賦值。
mut let 的關鍵字順序寫反了;var 是 C#/JS 的關鍵字,Rust 沒有;:= 是 Go 的宣告語法。`,
      csharp: `注意方向相反:C# 的 var 宣告出來是可變的;Rust 要「多寫一個字」才能取得可變性。這讓 code review 時特別容易盯住所有 mut 出現的位置。`,
    },
    {
      id: "1-2-03",
      question: "以下程式碼的輸出是?",
      questionCode: "fn main() {\n    let x = 5;\n    let x = x + 1;\n    let x = x * 2;\n    println!(\"{}\", x);\n}",
      options: [
        { text: "印出 12" },
        { text: "編譯錯誤:x 已經宣告過,不能重複宣告" },
        { text: "印出 5" },
        { text: "印出 10" },
      ],
      answer: 0,
      explanation: `這叫 shadowing(遮蔽):用 let 重新宣告同名變數,新變數「遮住」舊變數。計算過程:5 → 5+1=6 → 6*2=12。
注意這不是修改——每次 let 都建立一個全新的變數,舊的還在只是取不到了。這與 mut 不同:shadowing 不需要 mut,而且(見下一題)連型別都可以換。`,
      csharp: `C# 在同一個 scope 重複宣告同名變數是編譯錯誤(CS0128)。shadowing 是 Rust 的慣用寫法,常用來做「同一個概念的逐步加工」,不用發明 x1、x2、xTemp 這種名字。`,
    },
    {
      id: "1-2-04",
      question: "shadowing 與 mut 的關鍵差異之一是「能否改變型別」。以下哪段程式碼可以編譯?",
      options: [
        { code: "let spaces = \"   \";\nlet spaces = spaces.len();" },
        { code: "let mut spaces = \"   \";\nspaces = spaces.len();" },
        { code: "let spaces = \"   \";\nspaces = spaces.len();" },
        { code: "let mut spaces = \"   \";\nspaces = \"     \";\nspaces = spaces.len();" },
      ],
      answer: 0,
      explanation: `只有「兩個 let」的 shadowing 版本可以編譯:第二個 let 建立「全新的變數」,型別從 &str 變成 usize 完全沒問題。
其餘三段都卡在同一件事——變數的「型別」終生不變:mut 允許改「值」,但把 usize 賦給 &str 型別的變數是 mismatched types 編譯錯誤;連 mut 都沒有的那段連重新賦值都不行;三行的那段前兩行合法(mut 變數換成另一個 &str 沒問題),第三行想塞 usize 進 &str 變數,一樣編譯錯誤。`,
      csharp: `C# 的變數同樣終生固定型別(var 只是推斷)。「用同名變數換型別」在 C# 無解,只能取新名字;Rust 的 shadowing 正是為這種「字串 → 解析成數字」的加工流程而生。`,
    },
    {
      id: "1-2-05",
      question: "Rust 中宣告常數,正確的寫法是?",
      options: [
        { code: "const MAX_POINTS: u32 = 100_000;" },
        { code: "const MAX_POINTS = 100_000;" },
        { code: "let const MAX_POINTS: u32 = 100_000;" },
        { code: "#define MAX_POINTS 100000" },
      ],
      answer: 0,
      explanation: `const 必須「明確標註型別」,這是它和 let 的硬性差別之一(let 可以靠推斷)。數字中的底線 100_000 只是可讀性分隔,等於 100000。
const 在編譯期求值、可宣告在任何作用域(包括全域),慣例命名全大寫蛇形。沒寫型別的 const 會編譯錯誤;let const 這種組合語法不存在;#define 是 C 語言的前置處理器。`,
      csharp: `C# 的 const 型別也要寫,概念接近。Rust 另有 static(有固定記憶體位址的全域變數),而 static mut 是 unsafe 的——這放在補充教材;現階段記住:要常數就用 const。`,
    },
    {
      id: "1-2-06",
      question: "以下程式碼的結果是?",
      questionCode: "fn main() {\n    let x: u8 = 255;\n    let y = x + 1;\n    println!(\"{}\", y);\n}",
      options: [
        { text: "以 debug 建置執行:執行期 panic(attempt to add with overflow)" },
        { text: "印出 256" },
        { text: "印出 0(自動環繞)" },
        { text: "編譯錯誤:255 + 1 超出 u8 範圍" },
      ],
      answer: 0,
      explanation: `u8 範圍是 0~255,255 + 1 溢位。Rust 的行為依建置模式而異:debug 版會插入溢位檢查,執行到就 panic;release 版則二補數環繞變成 0。
「編譯錯誤」的選項有一半道理——若寫成字面值 let x: u8 = 256; 編譯器確實會直接報錯,但這裡的加法是執行期運算,編譯器不會攔(除非能 const 求值)。想要明確行為可用 wrapping_add / checked_add / saturating_add。`,
      csharp: `C# 預設 unchecked(環繞、不報錯),要檢查得包 checked { } 區塊。Rust 反過來:開發時(debug)預設幫你抓溢位,把 bug 逼到最早期現形。`,
    },
    {
      id: "1-2-07",
      question: "以下哪一個是「合法的 char 字面值」?",
      options: [
        { code: "let c = '狗';" },
        { code: "let c = \"a\";" },
        { code: "let c = 'ab';" },
        { code: "let c: char = 97;" },
      ],
      answer: 0,
      explanation: `Rust 的 char 用「單引號」,而且是 4 bytes 的 Unicode 純量值——中文、emoji 都是一個合法的 char,所以 '狗' 完全沒問題。
雙引號的 "a" 是 &str(字串)不是 char;'ab' 在單引號裡放兩個字元不合法;let c: char = 97 也不行,Rust 不會把整數隱式轉成 char(可用 97 as char 或 char::from(97u8) 顯式轉)。`,
      csharp: `C# 的 char 是 2 bytes(UTF-16 code unit),放不下需要代理對(surrogate pair)的字,例如 '🦀' 在 C# 不是合法 char;Rust 的 char 是 4 bytes,任何 Unicode 純量值都裝得下。另外 C# 允許 char c = (char)97; 隱式程度也比 Rust 高。`,
    },
    {
      id: "1-2-08",
      question: "tuple(元組)的存取,以下程式碼的輸出是?",
      questionCode: "fn main() {\n    let t = (500, 6.4, 'x');\n    let (a, _b, _c) = t;\n    println!(\"{} {}\", a, t.2);\n}",
      options: [
        { text: "印出 500 x" },
        { text: "印出 500 6.4" },
        { text: "編譯錯誤:tuple 不能用 .2 存取" },
        { text: "印出 (500, 6.4, 'x') x" },
      ],
      answer: 0,
      explanation: `tuple 有兩種取法:解構 let (a, b, c) = t; 一次拆開,或用索引 t.0、t.1、t.2 取單一元素。t.2 是第三個元素 'x',所以印出 500 x。
變數名前綴底線(_b、_c)是告訴編譯器「我知道沒用到」,壓掉 unused variable 警告。tuple 可以混裝不同型別,長度固定。`,
      csharp: `C# 的 ValueTuple 語法幾乎一樣:var t = (500, 6.4, 'x'),解構 var (a, b, c) = t。差別在存取:C# 用 t.Item1(從 1 開始),Rust 用 t.0(從 0 開始)。`,
    },
    {
      id: "1-2-09",
      question: "以下程式碼的結果是?",
      questionCode: "fn main() {\n    let a = [1, 2, 3, 4, 5];\n    let i = 10;\n    println!(\"{}\", a[i]);\n}",
      options: [
        { text: "執行期 panic:index out of bounds" },
        { text: "印出記憶體裡的垃圾值(未定義行為)" },
        { text: "印出 0(超出範圍自動補 0)" },
        { text: "編譯錯誤:陣列長度只有 5" },
      ],
      answer: 0,
      explanation: `陣列 [i32; 5] 長度固定為 5,用變數索引存取會在「執行期」做邊界檢查,越界立刻 panic 中止,絕不會讀到陣列外的記憶體。
這就是 Rust 記憶體安全的體現:C/C++ 在這裡是未定義行為(可能讀到垃圾、可能 crash),Rust 保證乾淨地失敗。注意:若索引是編譯期常數(如 a[10]),編譯器甚至能直接在編譯期報錯。`,
      csharp: `C# 行為類似:丟 IndexOutOfRangeException,同樣有邊界檢查。差別在哲學:C# 的例外可以被 catch 後繼續;Rust 的 panic 預設直接終止,想要「可能失敗的存取」應該用 a.get(i) 回傳 Option(集合課會教)。`,
    },
    {
      id: "1-2-10",
      question: "關於 Rust 的型別推斷,以下程式碼的結果是?",
      questionCode: "fn main() {\n    let x = 2.0;\n    let y: f32 = 3.0;\n    let z = x + y;\n    println!(\"{}\", z);\n}",
      options: [
        { text: "編譯錯誤:x 是 f64、y 是 f32,不同型別不能相加" },
        { text: "印出 5(f32 自動提升為 f64 後相加)" },
        { text: "印出 5(f64 自動降為 f32 後相加)" },
        { text: "執行期 panic:型別不符" },
      ],
      answer: 0,
      explanation: `浮點字面值預設推斷為 f64,所以 x 是 f64;y 明確標註 f32。Rust「沒有任何隱式數值轉換」,f64 + f32 直接編譯錯誤(mismatched types)。
整數同理:i32 + i64 也不行,必須用 as 或 From 顯式轉換,例如 x + (y as f64)。這是 Rust 消滅「隱式轉換造成的精度陷阱」的手段——所有型別轉換都必須看得見。`,
      csharp: `C# 會把 float 隱式擴大成 double,double d = f + d2 沒問題;縮小方向才要顯式 cast。Rust 兩個方向都要顯式——第一次遇到會覺得囉嗦,但也永遠不會有「隱式轉換到底轉去哪」的猜謎。`,
    },
  ],
};
