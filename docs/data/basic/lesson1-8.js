/* 出題慣例:answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌。
 * 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容。 */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-8"] = {
  id: "lesson1-8",
  title: "Enum、Option 與模式匹配",
  goal: "理解 Rust enum 是「可攜帶資料的和型別」,用 Option 取代 null,用 match 的窮盡性檢查寫出滴水不漏的分支。",
  questions: [
    {
      id: "1-8-01",
      question: "Rust 的 enum 與 C# 的 enum 有本質差異。以下哪個 enum 定義展現了「C# enum 做不到」的能力?",
      options: [
        { code: "enum Message {\n    Quit,\n    Move { x: i32, y: i32 },\n    Write(String),\n    ChangeColor(i32, i32, i32),\n}" },
        { code: "enum Color {\n    Red,\n    Green,\n    Blue,\n}" },
        { code: "enum Status {\n    Active = 1,\n    Inactive = 0,\n}" },
        { code: "enum Direction {\n    North,\n    South,\n    East,\n    West,\n}" },
      ],
      answer: 0,
      explanation: `Rust enum 的每個變體(variant)都可以「攜帶資料」,而且各變體攜帶的形狀可以不同:Quit 不帶資料、Move 帶具名欄位、Write 帶一個 String、ChangeColor 帶三個 i32——一個型別安全地表達「這個值是四種情況之一,每種情況有自己的資料」。這在型別理論叫「和型別(sum type)」。
只有純變體或指定整數值的 enum,C# 也能寫——那只是整數常數的集合。帶資料的 enum 才是 Rust 的招牌,Option 和 Result 都是靠這個能力建成的。`,
      csharp: `C# 的 enum 只是命名的整數。要表達「多種情況、各自帶資料」,C# 得用類別階層(抽象基底 + 子類)或 OneOf 之類的函式庫,而且編譯器不會檢查你是否處理了所有情況。C# 社群多年許願的 discriminated union 提案,就是想要 Rust enum 這個東西。`,
    },
    {
      id: "1-8-02",
      question: "Rust 沒有 null。以下程式碼的結果是?",
      questionCode: "fn main() {\n    let x: i8 = 5;\n    let y: Option<i8> = Some(5);\n    let sum = x + y;\n    println!(\"{}\", sum);\n}",
      options: [
        { text: "編譯錯誤:i8 和 Option<i8> 是不同型別,不能直接相加" },
        { text: "印出 10:Some(5) 自動解包成 5" },
        { text: "印出 5:None 視為 0,Some(5) 視為 5" },
        { text: "執行期 panic:Option 未解包" },
      ],
      answer: 0,
      explanation: `這就是 Option 的全部意義:i8 是「保證有值」,Option<i8> 是「可能有值可能沒有」——兩者是不同型別,編譯器強迫你先處理「沒有」的情況(match、unwrap_or 等)才能拿到裡面的值,不存在自動解包。
換句話說:在 Rust,「忘記檢查 null」不是執行期炸彈,而是編譯錯誤。billion-dollar mistake(null 參考)被型別系統直接封印。`,
      csharp: `C# 的 int? y = 5; int sum = x + y; 也不能直接編譯(要 .Value 或 ??)——Nullable<T> 和 Option 神似!但 C# 的參考型別直到 NRT(nullable reference types)出現前都可以隨意為 null,而且 NRT 只是「警告」;Rust 的 Option 是硬性的型別區分,沒有繞過的空間。`,
    },
    {
      id: "1-8-03",
      question: "match 綁定變體攜帶的資料。以下程式碼的輸出是?",
      questionCode: "enum Coin {\n    Penny,\n    Quarter(String),\n}\n\nfn value(coin: Coin) -> u8 {\n    match coin {\n        Coin::Penny => 1,\n        Coin::Quarter(state) => {\n            println!(\"State: {}\", state);\n            25\n        }\n    }\n}\n\nfn main() {\n    let v = value(Coin::Quarter(String::from(\"Alaska\")));\n    println!(\"{}\", v);\n}",
      options: [
        { text: "State: Alaska\n25" },
        { text: "25(match 分支裡的 println 不會執行)" },
        { text: "編譯錯誤:match 分支不能有多行區塊" },
        { text: "State: Alaska\n1" },
      ],
      answer: 0,
      explanation: `match 到 Coin::Quarter(state) 分支時,變體攜帶的 String 被「綁定」到變數 state,分支區塊裡就能使用——這是 enum 帶資料與 match 的合體技:分辨是哪種情況「同時」取出該情況的資料,一步完成。
分支可以是單一運算式,也可以是 { } 區塊(區塊尾端運算式 25 就是該分支的值)。輸出兩行:State: Alaska、25。`,
      csharp: `C# 8+ 的模式匹配也能做到:coin switch { Quarter q => ..., ... } 配合類別階層。差別在 Rust 的資料「只能」透過 match 這類模式取出——沒有先 is 判斷再強轉的裂縫,判斷與取值永遠是原子的一步。`,
    },
    {
      id: "1-8-04",
      question: "match 對 Option 的窮盡性檢查。以下程式碼的結果是?",
      questionCode: "fn plus_one(x: Option<i32>) -> Option<i32> {\n    match x {\n        Some(i) => Some(i + 1),\n    }\n}\n\nfn main() {\n    println!(\"{:?}\", plus_one(Some(5)));\n}",
      options: [
        { text: "編譯錯誤:non-exhaustive patterns,沒有涵蓋 None" },
        { text: "印出 Some(6)" },
        { text: "執行期 panic:遇到 None 才會出錯,這裡傳的是 Some 所以沒事" },
        { text: "印出 6" },
      ],
      answer: 0,
      explanation: `match 必須窮盡所有可能——Option 有 Some 和 None 兩個變體,少了 None 直接編譯錯誤,「這次呼叫剛好傳 Some」完全不重要:編譯器看的是型別的所有可能,不是這次的實際值。
這與 lesson1-3 的整數 match 同一條規則,但在 enum 上才顯出真正威力:未來幫 enum 加新變體時,專案裡所有漏掉新變體的 match 會被編譯器逐一點名——重構的安全網。`,
      csharp: `C# 的 switch 運算式對未涵蓋的情況只給警告(CS8509),執行期遇到才丟 SwitchExpressionException;針對類別階層的匹配,編譯器更難判斷是否窮盡。Rust 的 enum 是封閉集合,窮盡檢查是硬性編譯錯誤——「編譯過 = 每種情況都處理了」。`,
    },
    {
      id: "1-8-05",
      question: "if let 語法糖。以下 if let 寫法等價於哪一段 match?",
      questionCode: "let config_max = Some(3u8);\nif let Some(max) = config_max {\n    println!(\"max is {}\", max);\n}",
      options: [
        { code: "match config_max {\n    Some(max) => println!(\"max is {}\", max),\n    _ => (),\n}" },
        { code: "match config_max {\n    Some(max) => println!(\"max is {}\", max),\n    None => panic!(\"no value\"),\n}" },
        { code: "match config_max {\n    Some(3) => println!(\"max is 3\"),\n    _ => (),\n}" },
        { code: "if config_max != None {\n    println!(\"max is {}\", config_max);\n}" },
      ],
      answer: 0,
      explanation: `if let 就是「只關心一種模式、其餘全部忽略」的 match 語法糖:匹配 Some(max) 就執行區塊,其他情況(None)什麼都不做——等價於帶 _ => () 萬用分支的 match。
None 時 panic 的版本語意不同(if let 靜默跳過,不會炸);Some(3) 的版本只匹配「值恰好是 3」,不是綁定任意值;用 != None 判斷後直接印 config_max 則印出的是 Some(3) 而非 3,而且失去了「取出內部值」的能力。if let 也可以接 else 區塊處理其餘情況。`,
      csharp: `對應 C# 的 if (config_max is int max) { ... }(對 Nullable 的模式匹配)——判斷與解包一步完成,形狀幾乎一樣。Rust 的 if let 適用於任何 enum 模式,不限「有沒有值」。`,
    },
    {
      id: "1-8-06",
      question: "unwrap 家族的行為。以下程式碼的結果是?",
      questionCode: "fn main() {\n    let x: Option<i32> = None;\n    let v = x.unwrap();\n    println!(\"{}\", v);\n}",
      options: [
        { text: "執行期 panic:called Option::unwrap() on a None value" },
        { text: "印出 0:None 解包為預設值" },
        { text: "編譯錯誤:None 不能 unwrap" },
        { text: "印出 None" },
      ],
      answer: 0,
      explanation: `unwrap 的語意是「我賭裡面有值」:Some(v) 給你 v,None 直接 panic 讓程式炸掉。編譯器不會攔——這是合法的程式,只是把「沒有值」升級成不可恢復的錯誤。
安全的替代品:unwrap_or(0) 給預設值、unwrap_or_else 惰性計算預設值、expect("說明") 是 panic 訊息更清楚的 unwrap(至少除錯時知道賭輸在哪)。正式程式碼裡裸的 unwrap 通常是 code review 的紅旗,除非你能證明不可能是 None。`,
      csharp: `unwrap ≈ C# Nullable 的 .Value(None/null 時丟 InvalidOperationException),unwrap_or(0) ≈ x ?? 0,expect ≈ 帶訊息的 ArgumentNullException.ThrowIfNull。差別是文化:C# 到處都在隱式賭「不是 null」;Rust 讓每一次賭注都是看得見的 unwrap,可以被搜尋、被審查。`,
    },
    {
      id: "1-8-07",
      question: "match 當運算式用。以下程式碼的輸出是?",
      questionCode: "fn describe(n: i32) -> &'static str {\n    match n {\n        0 => \"zero\",\n        1..=9 => \"single digit\",\n        _ => \"big\",\n    }\n}\n\nfn main() {\n    println!(\"{} {} {}\", describe(0), describe(5), describe(42));\n}",
      options: [
        { text: "zero single digit big" },
        { text: "zero single digit single digit" },
        { text: "編譯錯誤:match 分支不能用 range" },
        { text: "zero big big" },
      ],
      answer: 0,
      explanation: `match 是運算式,每個分支的值就是整個 match 的值,直接當函式回傳值。1..=9 是「range 模式」:匹配 1 到 9(含),所以 5 落在 single digit;42 沒被前兩個分支接住,落到萬用的 _。
三個分支的型別必須一致(都是 &'static str)——和 if 運算式同一條規則。分支由上往下依序嘗試,第一個匹配的獲勝。`,
      csharp: `幾乎就是 C# 的 switch 運算式:n switch { 0 => "zero", >= 1 and <= 9 => "single digit", _ => "big" }。這是兩個語言長得最像的角落——C# 的 switch 運算式本來就是向函數式語言的 match 取經。`,
    },
    {
      id: "1-8-08",
      question: "while let 迴圈。以下程式碼的輸出是?",
      questionCode: "fn main() {\n    let mut stack = vec![1, 2, 3];\n    while let Some(top) = stack.pop() {\n        print!(\"{} \", top);\n    }\n}",
      options: [
        { text: "3 2 1" },
        { text: "1 2 3" },
        { text: "無窮迴圈:pop 之後又 push 回去" },
        { text: "編譯錯誤:while 不能搭配 let" },
      ],
      answer: 0,
      explanation: `Vec::pop 從「尾端」取出元素,回傳 Option<T>:有元素給 Some(值),空了給 None。while let 的語意:模式匹配成功就繼續迴圈,失敗(None)就結束——所以依序印出 3 2 1,棧空後乾淨地停下。
這是「用型別驅動迴圈終止」的漂亮示範:不用先檢查 is_empty 再取值,pop 的回傳型別本身就攜帶了「還有沒有」的資訊。`,
      csharp: `C# 對應 while (stack.TryPop(out var top)) { ... }——TryXxx + out 參數模式正是 C# 版的「回傳值攜帶成功與否」。Rust 用 Option 把同樣的事做進型別系統:不需要 out 參數這種特殊機制,任何函式都能回傳 Option。`,
    },
    {
      id: "1-8-09",
      question: "Option 的安全解包。以下程式碼的輸出是?",
      questionCode: "fn main() {\n    let a: Option<i32> = Some(5);\n    let b: Option<i32> = None;\n    println!(\"{} {}\", a.unwrap_or(0), b.unwrap_or(0));\n}",
      options: [
        { text: "5 0" },
        { text: "5 panic:b 是 None,unwrap_or 一樣會炸" },
        { text: "0 0" },
        { text: "編譯錯誤:unwrap_or 的參數必須是 Option" },
      ],
      answer: 0,
      explanation: `unwrap_or(預設值):Some(v) 給 v,None 給預設值,永不 panic——a 得到 5,b 得到 0。參數就是內部值的型別(i32),不是 Option。
家族還有:unwrap_or_default()(用型別的 Default,i32 是 0)、unwrap_or_else(|| 昂貴計算)(只在 None 時才執行計算)。先用 match/if let 思考,熟了之後這些方法讓程式碼更精簡。`,
      csharp: `unwrap_or(0) 就是 C# 的 b ?? 0(null 合併運算子)。C# 的 ?? 只服務 null;Rust 的 Option 方法家族(unwrap_or / map / and_then⋯⋯)是一整套組合子,同樣的思路也適用於 Result——學一套用兩處。`,
    },
    {
      id: "1-8-10",
      question: "C# 對照總結題:Option<T> 與 C# 的 null/Nullable<T>,最關鍵的差異是?",
      options: [
        { text: "Option 讓「可能沒有值」成為型別的一部分且強制處理:不處理 None 就編譯錯誤;C# 的 null 檢查(NRT)只是警告,執行期仍可能 NullReferenceException" },
        { text: "沒有差異,Option<T> 就是 Nullable<T> 換個名字" },
        { text: "Option 只能用於數值型別,參考型別仍然用 null" },
        { text: "Option 的檢查發生在執行期,比 C# 的編譯期檢查更慢但更靈活" },
      ],
      answer: 0,
      explanation: `三個層次的差異:(1)普遍性——Rust「所有」型別預設不可為空,可能缺值就包 Option,沒有例外;C# 實值型別靠 Nullable、參考型別靠 NRT 註記,兩套機制。(2)強制力——Option 不解包連編譯都過不了;NRT 是警告,加個 ! 就靜音。(3)成本——Option<&T> 經過編譯器最佳化後和裸指標一樣大(niche optimization),零額外開銷。
檢查全部發生在編譯期,「執行期檢查比較慢」的說法正好說反。`,
      csharp: `實務感受:寫 C# 時「這個參數會不會是 null」靠文件、註記和防禦性檢查;寫 Rust 時看型別就是答案——是 T 就保證有,是 Option<T> 就必須處理沒有。NullReferenceException 這個類別在 Rust 的字典裡不存在。`,
    },
  ],
};
