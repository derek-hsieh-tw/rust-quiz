/* 出題慣例:answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌。
 * 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容。 */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-3"] = {
  id: "lesson1-3",
  title: "函式、運算式與控制流程",
  goal: "理解「Rust 幾乎所有東西都是運算式」:區塊尾端無分號即回傳值、if 是運算式、loop 能帶值跳出。",
  questions: [
    {
      id: "1-3-01",
      question: "以下哪一個函式定義「無法」編譯?",
      options: [
        { code: "fn five() -> i32 {\n    5;\n}" },
        { code: "fn five() -> i32 {\n    5\n}" },
        { code: "fn five() -> i32 {\n    return 5;\n}" },
        { code: "fn five() -> i32 {\n    let x = 5;\n    x\n}" },
      ],
      answer: 0,
      explanation: `這是 Rust 最經典的新手坑:區塊「最後一個運算式不加分號」就是回傳值。5 是運算式,加了分號變成陳述式 5;,整個區塊的值變成 unit 型別 (),與宣告的回傳型別 i32 不符 → mismatched types。
編譯器甚至會貼心提示「help: remove this semicolon」。尾端直接寫 5(無分號)是慣用寫法;用 return 5; 也合法(通常只用在提早返回);先 let 再把 x 放在尾端同樣合法。`,
      csharp: `C# 只能用 return 陳述式回傳(expression-bodied 的 => 算語法糖)。Rust 的「尾端運算式即回傳值」貫穿整個語言——區塊、if、match 全都適用,習慣後會非常順手。`,
    },
    {
      id: "1-3-02",
      question: "Rust 的 if 是運算式。以下程式碼的輸出是?",
      questionCode: "fn main() {\n    let condition = true;\n    let number = if condition { 5 } else { 6 };\n    println!(\"{}\", number);\n}",
      options: [
        { text: "印出 5" },
        { text: "編譯錯誤:if 不能放在賦值右邊" },
        { text: "印出 true" },
        { text: "印出 6" },
      ],
      answer: 0,
      explanation: `if 是運算式,會產出值,可以直接接在 let 後面。condition 為 true,取第一個分支的 5。
每個分支同樣遵守「尾端運算式無分號即為該分支的值」。這讓 Rust 不需要三元運算子 ?:——if/else 本身就能當值用。`,
      csharp: `等同 C# 的三元運算子 var number = condition ? 5 : 6;。C# 的 if 是陳述式不能當值;Rust 用同一個 if 統一了兩種用途,也因此 Rust 沒有 ?: 運算子。`,
    },
    {
      id: "1-3-03",
      question: "以下程式碼的結果是?",
      questionCode: "fn main() {\n    let condition = false;\n    let number = if condition { 5 } else { \"six\" };\n    println!(\"{}\", number);\n}",
      options: [
        { text: "編譯錯誤:if 與 else 分支的型別不一致(i32 vs &str)" },
        { text: "印出 six" },
        { text: "印出 6" },
        { text: "執行期才報型別錯誤" },
      ],
      answer: 0,
      explanation: `if 是運算式就必須有「單一確定的型別」,兩個分支一個是整數、一個是字串,編譯器無法決定 number 的型別,直接編譯錯誤(if and else have incompatible types)。
Rust 是靜態型別語言,每個變數的型別必須在編譯期完全確定——不存在「執行時再看情況」。`,
      csharp: `C# 三元運算子有同樣限制:condition ? 5 : "six" 也編譯不過(除非兩邊能轉成共同型別如 object)。概念相同,但 Rust 沒有「全部退化成 object」的逃生門,型別必須真正一致。`,
    },
    {
      id: "1-3-04",
      question: "陳述式(statement)與運算式(expression)的區別。以下程式碼的結果是?",
      questionCode: "fn main() {\n    let x = (let y = 6);\n    println!(\"{}\", x);\n}",
      options: [
        { text: "編譯錯誤:let 是陳述式,不會產出值" },
        { text: "印出 6" },
        { text: "印出 ()" },
        { text: "x 和 y 都是 6,印出 6" },
      ],
      answer: 0,
      explanation: `let y = 6 是「陳述式」,不產出值,所以不能拿來賦給 x。這條界線在 Rust 很清楚:陳述式做事不產值,運算式產值。
對照:5 + 1 是運算式、函式呼叫是運算式、{ } 區塊是運算式、if/match/loop 都是運算式;let 和以分號結尾的東西是陳述式。`,
      csharp: `C# 的賦值「是」運算式,int x = (y = 6); 合法且連鎖賦值 a = b = c 很常見。Rust 刻意不允許,避免 if (x = 5) 這類把賦值誤當比較的經典 bug。`,
    },
    {
      id: "1-3-05",
      question: "loop 可以帶著值跳出。以下程式碼的輸出是?",
      questionCode: "fn main() {\n    let mut counter = 0;\n    let result = loop {\n        counter += 1;\n        if counter == 10 {\n            break counter * 2;\n        }\n    };\n    println!(\"{}\", result);\n}",
      options: [
        { text: "印出 20" },
        { text: "印出 10" },
        { text: "編譯錯誤:break 不能帶值" },
        { text: "無窮迴圈,不會印出任何東西" },
      ],
      answer: 0,
      explanation: `loop 是無條件迴圈,但它也是「運算式」:break 後面接的值就是整個 loop 的值。counter 累加到 10 時,break 10 * 2 讓 loop 以 20 作結,賦給 result。
這個模式常用於「重試直到成功並取得結果」的場景。注意只有 loop 能 break 帶值,while/for 不行(因為它們可能因條件不成立而正常結束,無值可回)。`,
      csharp: `C# 的 break 純粹是跳出,不能帶值;要達成同樣效果得在迴圈外宣告變數、迴圈內賦值再 break,多一段樣板。Rust 把這個常見模式做進語言。`,
    },
    {
      id: "1-3-06",
      question: "以下程式碼的輸出是?",
      questionCode: "fn main() {\n    for i in 1..4 {\n        print!(\"{} \", i);\n    }\n    for i in (1..=3).rev() {\n        print!(\"{} \", i);\n    }\n}",
      options: [
        { text: "1 2 3 3 2 1" },
        { text: "1 2 3 4 3 2 1" },
        { text: "1 2 3 4 4 3 2 1" },
        { text: "編譯錯誤:Range 沒有 rev 方法" },
      ],
      answer: 0,
      explanation: `1..4 是「半開區間」:含 1 不含 4,產出 1 2 3。1..=3 是「閉區間」:含尾端,產出 1 2 3,.rev() 反轉成 3 2 1。合計輸出 1 2 3 3 2 1。
..(不含尾)與 ..=(含尾)的區別是高頻考點,配合切片時尤其重要。`,
      csharp: `對應 Enumerable.Range(1, 3) 與 LINQ 的 .Reverse()。C# 的 Range(start, count) 第二個參數是「數量」,Rust 的 1..4 是「終點(不含)」——兩邊語意不同,轉換時容易踩。C# 12 的 1..4 range 語法也是半開,與 Rust 一致。`,
    },
    {
      id: "1-3-07",
      question: "巢狀迴圈想「一次跳出外層」,Rust 的正確寫法是?",
      options: [
        { code: "'outer: for i in 0..5 {\n    for j in 0..5 {\n        if i * j > 6 {\n            break 'outer;\n        }\n    }\n}" },
        { code: "for i in 0..5 {\n    for j in 0..5 {\n        if i * j > 6 {\n            break 2;\n        }\n    }\n}" },
        { code: "for i in 0..5 {\n    for j in 0..5 {\n        if i * j > 6 {\n            goto end;\n        }\n    }\n}\nend:" },
        { text: "Rust 無法直接跳出多層迴圈,只能設旗標變數逐層 break" },
      ],
      answer: 0,
      explanation: `迴圈標籤語法:'label: 放在迴圈前,break 'label 直接跳出指定層,continue 'label 同理。標籤以單引號開頭(和生命週期共用語法形式,但兩者無關)。
break 2(用數字指定跳幾層)的語法不存在;goto 在 Rust 不存在;「只能設旗標變數」也不對,標籤就是官方解法。`,
      csharp: `C# 沒有迴圈標籤也(實務上)不用 goto,跳出多層迴圈通常靠旗標變數或把迴圈抽成方法用 return——Rust 的標籤是最直接乾淨的解法。`,
    },
    {
      id: "1-3-08",
      question: "以下 match 程式碼的結果是?",
      questionCode: "fn main() {\n    let number = 7;\n    match number {\n        1 => println!(\"one\"),\n        3 => println!(\"three\"),\n        5 => println!(\"five\"),\n    }\n}",
      options: [
        { text: "編譯錯誤:match 沒有涵蓋所有可能(non-exhaustive patterns)" },
        { text: "什麼都不印,正常結束" },
        { text: "執行期 panic:沒有符合的分支" },
        { text: "印出 seven(自動轉英文)" },
      ],
      answer: 0,
      explanation: `match 必須「窮盡」所有可能值——i32 有幾十億個可能值,只列 1、3、5 當然不夠,編譯器直接報 non-exhaustive patterns 錯誤。
修法是補一個萬用分支:_ => println!("other") 或 other => println!("{}", other)(後者還能拿到值)。窮盡性檢查是 match 的靈魂:未來 enum 增加變體時,所有漏處理的 match 會被編譯器一個個抓出來。`,
      csharp: `C# 的 switch 陳述式沒 default 也能編譯(默默跳過);switch 運算式漏情況只給「警告」,執行期才丟例外。Rust 把這件事升級為硬性編譯錯誤——這正是 enum + match 成為 Rust 招牌的原因,lesson1-8 會深入。`,
    },
    {
      id: "1-3-09",
      question: "關於函式參數,以下程式碼的結果是?",
      questionCode: "fn add(x, y) {\n    x + y\n}\n\nfn main() {\n    println!(\"{}\", add(1, 2));\n}",
      options: [
        { text: "編譯錯誤:函式參數必須明確標註型別" },
        { text: "印出 3,型別由呼叫端自動推斷" },
        { text: "編譯錯誤:缺少 return" },
        { text: "印出 3,預設參數型別為 i32" },
      ],
      answer: 0,
      explanation: `函式簽名是刻意的「推斷邊界」:參數與回傳型別必須寫明,函式內部才隨你推斷。正確寫法:fn add(x: i32, y: i32) -> i32 { x + y }。
這是設計取捨:簽名寫死,錯誤訊息就能精準定位在函式內或呼叫端,也讓函式本身成為可靠的文件;若簽名也推斷,改一處內部實作可能讓天邊的呼叫端爆出難解的錯。`,
      csharp: `C# 方法同樣必須寫參數型別,這點兩邊一致。差別在區域變數:兩邊都能推斷(var / let),但 C# 的 lambda 參數在有目標型別時可省略型別,Rust 的閉包也可以——唯獨具名函式,兩邊都嚴格。`,
    },
    {
      id: "1-3-10",
      question: "以下程式碼的輸出是?",
      questionCode: "fn main() {\n    let x = 5;\n    let y = {\n        let x = 3;\n        x + 1\n    };\n    println!(\"{} {}\", x, y);\n}",
      options: [
        { text: "5 4" },
        { text: "3 4" },
        { text: "5 6" },
        { text: "編譯錯誤:區塊不能賦值給變數" },
      ],
      answer: 0,
      explanation: `{ } 區塊本身是運算式,值為其尾端運算式(x + 1,此處 x 是區塊內 shadowing 的 3,故為 4)。區塊結束後,內部的 x 消失,外部的 x 仍是 5。輸出 5 4。
這題綜合了三個觀念:區塊是運算式、尾端無分號即值、shadowing 有作用域範圍。`,
      csharp: `C# 的 { } 區塊是純陳述式,不能當值。最接近的是立即呼叫的 lambda:var y = new Func<int>(() => { var x2 = 3; return x2 + 1; })(); ——Rust 一個區塊就解決。`,
    },
  ],
};
