/* 出題慣例:answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌。
 * 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容。 */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-11"] = {
  id: "lesson1-11",
  title: "泛型(Generics)",
  goal: "用泛型消除重複程式碼:泛型函式、泛型 struct/enum、泛型方法,並理解單態化的零成本本質。",
  questions: [
    {
      id: "1-11-01",
      question: "宣告一個「回傳 slice 第一個元素」的泛型函式,正確的寫法是?",
      options: [
        { code: "fn first<T>(list: &[T]) -> &T {\n    &list[0]\n}" },
        { code: "fn first(list: &[T]) -> &T {\n    &list[0]\n}" },
        { code: "template<typename T>\nfn first(list: &[T]) -> &T {\n    &list[0]\n}" },
        { code: "fn first<T>(list: &[T]) -> T {\n    list[0]\n}" },
      ],
      answer: 0,
      explanation: `型別參數要先在函式名後的角括號「宣告」(fn first<T>),之後才能在參數與回傳型別使用。沒宣告就用 T,編譯器會問「T 是誰?」(cannot find type T)。
template 是 C++ 語法。回傳 T(而非 &T)的版本問題更隱晦:list[0] 想把元素「搬出」slice,但 T 不保證是 Copy——cannot move out of index 編譯錯誤;回傳參考 &T 才對任何 T 都成立。`,
      csharp: `C# 的 T First<T>(T[] list) 直接回傳 T 沒問題——class 元素複製的是參考,GC 罩著。Rust 的泛型函式必須對「T 可能不可複製」誠實,這是所有權系統滲進泛型設計的第一個例子。`,
    },
    {
      id: "1-11-02",
      question: "泛型 struct。以下程式碼的結果是?",
      questionCode: "struct Point<T> {\n    x: T,\n    y: T,\n}\n\nfn main() {\n    let p = Point { x: 5, y: 4.0 };\n    println!(\"{} {}\", p.x, p.y);\n}",
      options: [
        { text: "編譯錯誤:x 推斷出 T = 整數後,y 的 4.0(浮點)與 T 不符" },
        { text: "印出 5 4:編譯器把兩者統一成整數" },
        { text: "印出 5 4.0:x 和 y 可以各自決定型別" },
        { text: "執行期 panic:型別不一致" },
      ],
      answer: 0,
      explanation: `Point<T> 只有「一個」型別參數,x 和 y 必須同型別:x: 5 讓編譯器認定 T 是整數,y: 4.0 是浮點,mismatched types 編譯錯誤。
想讓兩個欄位型別獨立,得宣告兩個參數:struct Point<T, U>(下一題)。泛型的每個參數在「單一實例」裡只能代表一個具體型別——這是型別推斷的一致性要求,不是限制彈性的 bug。`,
      csharp: `C# 的 class Point<T> 同理:new Point<int> 之後所有 T 位置都是 int。這題兩個語言行為一致——差別只在 Rust 常靠推斷而 C# 常明寫型別參數,推斷讓錯誤訊息第一次看比較費解。`,
    },
    {
      id: "1-11-03",
      question: "想讓 x、y 可以是不同型別,正確的定義是?",
      options: [
        { code: "struct Point<T, U> {\n    x: T,\n    y: U,\n}" },
        { code: "struct Point<T> {\n    x: T,\n    y: T2,\n}" },
        { code: "struct Point<T | U> {\n    x: T,\n    y: U,\n}" },
        { code: "struct Point<dynamic> {\n    x: dynamic,\n    y: dynamic,\n}" },
      ],
      answer: 0,
      explanation: `多個型別參數用逗號並列:<T, U>,x 與 y 各綁一個——Point { x: 5, y: 4.0 } 推斷成 Point<i32, f64>,順利編譯。
T2 沒有被宣告過;| 分隔與 dynamic 關鍵字都不是 Rust 語法(Rust 沒有動態型別逃生門)。參數要幾個有幾個,但超過兩三個通常是重新設計的訊號。`,
      csharp: `與 C# 的 class Point<T, U> 完全同形。兩個語言在「多型別參數」的語法上幾乎複製貼上,可以直接沿用 C# 的直覺。`,
    },
    {
      id: "1-11-04",
      question: "關於標準函式庫與泛型的關係,正確的敘述是?",
      options: [
        { text: "Option<T>、Result<T, E>、Vec<T> 本身就是泛型型別——前兩課用的正是泛型 enum 與泛型 struct" },
        { text: "標準函式庫為每個型別各寫了一份 Option(OptionI32、OptionString⋯⋯)" },
        { text: "Option 與 Result 是編譯器內建的魔法型別,自己寫不出來" },
        { text: "泛型只能用在函式,enum 不能是泛型" },
      ],
      answer: 0,
      explanation: `enum Option<T> { Some(T), None } 與 enum Result<T, E> { Ok(T), Err(E) }——你天天在用的東西就是「泛型 enum」的標準定義,一份定義服務所有型別;Vec<T>、HashMap<K, V> 則是泛型 struct。
它們沒有編譯器魔法(除了 ? 運算子的語法支援),自己完全寫得出同樣的東西。學到這裡回頭看:前十課其實一直在使用泛型,本課只是揭開名字。`,
      csharp: `對應 Nullable<T>、List<T>、Dictionary<K,V>——C# 開發者對「標準庫靠泛型撐起來」毫不陌生。Rust 多走一步:連「可能失敗」(Result)這種控制流概念都是普通泛型 enum,沒有 exception 那樣的特殊機制。`,
    },
    {
      id: "1-11-05",
      question: "為泛型 struct 定義方法,正確的寫法是?",
      options: [
        { code: "impl<T> Point<T> {\n    fn x(&self) -> &T {\n        &self.x\n    }\n}" },
        { code: "impl Point<T> {\n    fn x(&self) -> &T {\n        &self.x\n    }\n}" },
        { code: "impl<T> Point {\n    fn x(&self) -> &T {\n        &self.x\n    }\n}" },
        { code: "fn Point<T>::x(&self) -> &T {\n    &self.x\n}" },
      ],
      answer: 0,
      explanation: `impl<T> Point<T> 要念成兩段:impl 後面的 <T> 是「宣告型別參數」,Point<T> 是「為哪個型別實作」。少了 impl 後的 <T>,Point<T> 裡的 T 沒有出處(cannot find type T);少了 Point 後的 <T> 則是為不存在的非泛型 Point 實作。
看似重複寫兩次,其實各有職責——之後你會看到 impl Point<f32>(只為特定具現實作,下一題),那時 impl 後就不需要宣告參數,兩段的分工就清楚了。`,
      csharp: `C# 方法寫在 class Point<T> 本體內,T 天然在作用域,沒有這個「宣告」步驟。Rust 因為 impl 與 struct 分離,才需要在 impl 上重新宣告——分離的代價,換來的是下一題那種「只為部分具現加方法」的能力。`,
    },
    {
      id: "1-11-06",
      question: "為「特定具現型別」實作方法。以下程式碼的結果是?",
      questionCode: "struct Point<T> {\n    x: T,\n    y: T,\n}\n\nimpl Point<f64> {\n    fn distance_from_origin(&self) -> f64 {\n        (self.x * self.x + self.y * self.y).sqrt()\n    }\n}\n\nfn main() {\n    let p = Point { x: 3, y: 4 };\n    println!(\"{}\", p.distance_from_origin());\n}",
      options: [
        { text: "編譯錯誤:p 是 Point<整數>,distance_from_origin 只存在於 Point<f64>" },
        { text: "印出 5:整數自動轉成 f64 後計算" },
        { text: "印出 5.0" },
        { text: "編譯錯誤:impl 不能指定具體型別,只能寫 impl<T>" },
      ],
      answer: 0,
      explanation: `impl Point<f64> 表示「只為 T = f64 的 Point 實作這些方法」——Point { x: 3, y: 4 } 推斷為整數版,身上根本沒有這個方法(method not found)。寫成 x: 3.0, y: 4.0 才能呼叫。
這是合法且常用的能力:泛型型別可以「部分型別才有某些方法」(標準庫例子:Vec<T> 人人有 push,但 concat 之類的方法要元素滿足特定條件才出現)。Rust 沒有整數到浮點的隱式轉換,自動轉型的說法在 lesson1-2 就出局了。`,
      csharp: `C# 做不到「只為 List<double> 加方法」——擴充方法 this List<double> 可以模擬,但那是外掛不是型別的一部分。Rust 的 impl 區塊天生按具現分組,配合 trait bound(下一課)還能寫「T 滿足某條件才有這方法」。`,
    },
    {
      id: "1-11-07",
      question: "泛型的執行期成本。關於單態化(monomorphization),正確的敘述是?",
      options: [
        { text: "編譯器為每個實際用到的具體型別各生成一份專屬程式碼:largest::<i32> 與 largest::<char> 是兩份獨立函式,執行期零額外開銷" },
        { text: "泛型函式在執行期查詢型別資訊再分派,比具體型別的函式慢" },
        { text: "泛型會把值裝箱成統一格式處理,有配置成本" },
        { text: "單態化發生在程式啟動時,由 runtime 動態生成程式碼" },
      ],
      answer: 0,
      explanation: `單態化 = 編譯期把泛型「展開」:你寫一份 fn largest<T>,程式裡用到 i32 和 char 兩種,編譯器就默默生成 largest_i32 和 largest_char 兩份具體程式碼——執行起來與手寫兩份完全相同,這就是「零成本抽象」:抽象不花執行期的錢。
沒有執行期型別查詢、沒有裝箱、沒有 runtime 代碼生成。代價在編譯期:用的型別多,編譯變慢、執行檔變大——成本被搬到編譯期一次付清。`,
      csharp: `C# 泛型走中間路線:實值型別由 JIT 為每種生成特化版(近似單態化),參考型別共用一份程式碼(傳遞參考,無需特化)。而 Java 的型別擦除是另一個極端(全部擦成 Object,裝箱伺候)。Rust 選擇全單態化:效能最高,編譯成本也最高。`,
    },
    {
      id: "1-11-08",
      question: "trait bound 的初見。以下程式碼的結果是?",
      questionCode: "fn largest<T>(list: &[T]) -> &T {\n    let mut largest = &list[0];\n    for item in list {\n        if item > largest {\n            largest = item;\n        }\n    }\n    largest\n}",
      options: [
        { text: "編譯錯誤:T 不保證可以比較,> 用不了;需要寫成 fn largest<T: PartialOrd>" },
        { text: "正常編譯:所有型別都能用 > 比較" },
        { text: "編譯錯誤:泛型函式裡不能用 for 迴圈" },
        { text: "正常編譯,但傳入不可比較的型別時執行期 panic" },
      ],
      answer: 0,
      explanation: `T 是「任意型別」——編譯器只允許你對 T 做「所有型別都保證會」的事,而比較大小不是:自訂 struct 憑什麼能 >?錯誤訊息會直接指路:binary operation > cannot be applied to type &T,並建議加上 T: PartialOrd。
加了 bound 之後:能傳入的型別縮小到「實作了 PartialOrd 的」,函式體內就能安心用 >。這是泛型與 trait 的接合點:bound 是對呼叫端的要求,也是對函式體的授權——完整展開在下一課。`,
      csharp: `就是 C# 的 where T : IComparable<T>——概念一對一。差別在檢查的徹底程度:Rust 函式體內「只能」用 bound 授權過的操作,一個不多;C# 的泛型加上 dynamic 或轉型仍有繞過空間。「執行期才發現不能比較」的情況在 Rust 不存在。`,
    },
    {
      id: "1-11-09",
      question: "同一個泛型函式服務多種型別。以下程式碼的輸出是?",
      questionCode: "fn first<T>(list: &[T]) -> &T {\n    &list[0]\n}\n\nfn main() {\n    let numbers = [10, 20, 30];\n    let words = [\"hello\", \"world\"];\n    println!(\"{} {}\", first(&numbers), first(&words));\n}",
      options: [
        { text: "10 hello:T 在兩次呼叫分別推斷為整數與 &str" },
        { text: "編譯錯誤:first 的 T 已被第一次呼叫固定為整數" },
        { text: "編譯錯誤:呼叫泛型函式必須寫 first::<i32>(&numbers) 明確指定型別" },
        { text: "10 [\"hello\", \"world\"]:第二次呼叫回傳整個陣列" },
      ],
      answer: 0,
      explanation: `每個「呼叫點」獨立推斷:第一次 T = i32、第二次 T = &str,單態化各生成一份,互不干擾——「T 被第一次呼叫固定」混淆了「函式定義」與「呼叫實例」。
turbofish(first::<i32>)只在推斷不出來時才需要(例如 collect 的目標型別),這裡參數型別明擺著,不用寫。回傳值是 &list[0](第一個元素的參考),不會是整個陣列。`,
      csharp: `C# 同樣支援呼叫點推斷:First(numbers) 不用寫 First<int>(numbers)。這題兩邊手感一致;turbofish ::<> 的怪語法是 Rust 特色(為了跟小於運算子區分),C# 直接用角括號沒有歧義問題。`,
    },
    {
      id: "1-11-10",
      question: "C# 對照總結題:Rust 泛型與 C# 泛型,最值得記住的差異是?",
      options: [
        { text: "實作機制與約束範圍:Rust 全面單態化(零執行期成本、無執行期型別資訊);約束用 trait(含運算子、關聯函式等),比 C# 的 where 介面約束表達力更廣" },
        { text: "語法完全相同,能力也完全相同,只是關鍵字不同" },
        { text: "Rust 泛型在執行期解析,比 C# 慢但更靈活" },
        { text: "Rust 泛型不支援約束,任何型別都能傳入任何泛型函式" },
      ],
      answer: 0,
      explanation: `兩個記憶點:(1)機制——Rust 一律編譯期單態化,沒有 typeof(T)、沒有執行期反射泛型;C# 泛型保留執行期型別資訊,能 new T[]、能反射。(2)約束——T: PartialOrd + Clone 這種 trait bound 能要求運算子、關聯函式、甚至靜態方法,C# 的 where T : interface 直到 C# 11 的 static abstract members 才追上一部分。
「執行期解析」說反了;「不支援約束」與上一題直接矛盾。`,
      csharp: `遷移提示:where T : IComparable<T> → T: PartialOrd;where T : new() → T: Default;where T : class 沒有直接對應(Rust 不分 class/struct,倒有 T: Copy、T: Clone 描述複製能力)。大原則:C# 約束「型別的出身」,Rust 約束「型別的能力」。`,
    },
  ],
};
