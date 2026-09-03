/* 出題慣例見專案根目錄 AUTHORING.md:
 *   - answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌
 *   - 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容
 *   - 有程式碼的題目一律附 walkthrough(逐行說明);反面案例必須同時附上 ✅ 正確寫法 */
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
      walkthrough: [
        {
          label: "❌ 無法編譯的那一段",
          lines: [
            { code: "fn five() -> i32 {", note: "宣告回傳 i32 的函式。回傳型別一旦寫上,函式區塊的「值」就必須是 i32。" },
            { code: "    5;", note: "⛔ 問題所在:加了分號,5 從「運算式」變成「陳述式」,這個區塊就沒有尾端運算式了,整個區塊的值變成單位型別 ()。" },
            { code: "}", note: "⛔ 編譯失敗:mismatched types, expected `i32`, found `()`。編譯器還會提示 help: remove this semicolon。" },
          ],
        },
        {
          label: "✅ 三種都正確的寫法(完整可執行)",
          lines: [
            { code: "fn five_a() -> i32 {", note: "寫法一:最慣用的尾端運算式。" },
            { code: "    5", note: "改動處:沒有分號 = 這是區塊的尾端運算式,也就是函式的回傳值。" },
            { code: "}", note: "函式結束,回傳 5。" },
            { code: "", note: "" },
            { code: "fn five_b() -> i32 {", note: "寫法二:明寫 return。" },
            { code: "    return 5;", note: "return 是陳述式,直接結束函式並帶回值;合法,但慣例上只用在「提早返回」。" },
            { code: "}", note: "函式結束。" },
            { code: "", note: "" },
            { code: "fn five_c() -> i32 {", note: "寫法三:先算再回傳。" },
            { code: "    let x = 5;", note: "let 是陳述式,建立區域變數。" },
            { code: "    x", note: "尾端運算式是 x,值為 5,成為函式回傳值。" },
            { code: "}", note: "函式結束。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點,把三個函式都叫一次驗證行為相同。" },
            { code: "    println!(\"{} {} {}\", five_a(), five_b(), five_c());", note: "三者完全等價,印出 5 5 5。" },
            { code: "}", note: "main 結束。" },
          ],
          outro: "一句話記住:區塊的最後一行「有分號 = 不回傳」「沒分號 = 回傳」。這條規則貫穿整個 Rust——區塊、if、match、loop 全都適用。",
        },
      ],
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
      walkthrough: {
        label: "🔍 題目程式碼逐行說明(可正常執行)",
        lines: [
          { code: "fn main() {", note: "程式進入點。" },
          { code: "    let condition = true;", note: "建立一個 bool 變數。注意 Rust 的 if 條件必須是 bool,不接受整數當真假值。" },
          { code: "    let number = if condition { 5 } else { 6 };", note: "if 是「運算式」,會產出值,所以可以直接接在 let 後面。condition 為 true → 取第一個分支;分支裡的 5 沒有分號,是該分支的值。結尾的分號屬於整個 let 陳述式。" },
          { code: "    println!(\"{}\", number);", note: "印出 5。" },
          { code: "}", note: "main 結束。" },
        ],
        outro: "因為 if 本身就能當值用,Rust 不需要三元運算子 ?:——那個語法在 Rust 根本不存在。",
      },
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
      walkthrough: [
        {
          label: "❌ 題目程式碼(無法編譯)",
          lines: [
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let condition = false;", note: "建立 bool 變數。" },
            { code: "    let number = if condition { 5 } else { \"six\" };", note: "⛔ 編譯失敗:`if` and `else` have incompatible types, expected integer, found `&str`。if 當運算式用時,所有分支必須產出「同一個型別」,否則編譯器無法決定 number 的型別。注意錯誤在編譯期就出現,和 condition 實際是 true 還是 false 無關。" },
            { code: "    println!(\"{}\", number);", note: "因上一行失敗而無法執行。" },
            { code: "}", note: "main 結束。" },
          ],
        },
        {
          label: "✅ 正確寫法(讓兩個分支型別一致)",
          lines: [
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let condition = false;", note: "建立 bool 變數。" },
            { code: "    let number = if condition { \"five\" } else { \"six\" };", note: "改動處:兩個分支都產出 &str,型別一致,number 的型別確定是 &str。印出 six。" },
            { code: "    println!(\"{}\", number);", note: "印出 six。" },
            { code: "}", note: "main 結束。" },
          ],
          outro: "若真的需要「數字或字串」兩種可能,正確做法是定義一個 enum 把兩種情況包起來(lesson1-8),而不是讓型別在執行期才決定——Rust 是靜態型別語言,每個變數的型別必須在編譯期完全確定。",
        },
      ],
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
      walkthrough: [
        {
          label: "❌ 題目程式碼(無法編譯)",
          lines: [
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let x = (let y = 6);", note: "⛔ 編譯失敗:expected expression, found `let` statement。let y = 6 是「陳述式」,做事但不產出值,因此不能放在需要值的位置。" },
            { code: "    println!(\"{}\", x);", note: "因上一行失敗而無法執行。" },
            { code: "}", note: "main 結束。" },
          ],
          outro: "界線很清楚:陳述式做事不產值(let、以分號結尾的東西);運算式產值(5 + 1、函式呼叫、{ } 區塊、if、match、loop)。",
        },
        {
          label: "✅ 正確寫法(分成兩個陳述式)",
          lines: [
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let y = 6;", note: "改動處:先獨立宣告 y。" },
            { code: "    let x = y;", note: "改動處:再用 y 這個「運算式」去初始化 x(i32 是 Copy,y 之後仍可用)。" },
            { code: "    println!(\"{} {}\", x, y);", note: "印出 6 6。" },
            { code: "}", note: "main 結束。" },
          ],
          outro: "C# 的賦值是運算式,所以 a = b = c 這種連鎖賦值很常見;Rust 刻意不允許,順帶消滅了 if (x = 5) 這類把賦值誤當比較的經典 bug。",
        },
      ],
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
      walkthrough: {
        label: "🔍 題目程式碼逐行說明(可正常執行)",
        lines: [
          { code: "fn main() {", note: "程式進入點。" },
          { code: "    let mut counter = 0;", note: "計數器,因為要累加所以宣告成 mut。" },
          { code: "    let result = loop {", note: "loop 是無條件迴圈,同時也是「運算式」——它的值由 break 帶出來,所以可以直接接在 let 後面。" },
          { code: "        counter += 1;", note: "每圈加一。" },
          { code: "        if counter == 10 {", note: "檢查是否達到結束條件。" },
          { code: "            break counter * 2;", note: "break 後面接的運算式就是整個 loop 的值:counter 此時是 10,算出 20 後跳出迴圈。" },
          { code: "        }", note: "if 區塊結束;條件不成立就繼續下一圈。" },
          { code: "    };", note: "loop 結束。這裡的分號屬於 let 陳述式,result 得到 20。" },
          { code: "    println!(\"{}\", result);", note: "印出 20。" },
          { code: "}", note: "main 結束。" },
        ],
        outro: "只有 loop 能 break 帶值;while 與 for 不行,因為它們可能因條件不成立而「正常結束」,那種情況沒有值可以回傳。這個模式常用在「重試直到成功並取得結果」。",
      },
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
      walkthrough: {
        label: "🔍 題目程式碼逐行說明(可正常執行)",
        lines: [
          { code: "fn main() {", note: "程式進入點。" },
          { code: "    for i in 1..4 {", note: "1..4 是「半開區間」:含起點、不含終點,依序產出 1、2、3。" },
          { code: "        print!(\"{} \", i);", note: "print!(不換行)印出目前的值加一個空格,輸出 1 2 3。" },
          { code: "    }", note: "迴圈結束。" },
          { code: "    for i in (1..=3).rev() {", note: "1..=3 是「閉區間」:含尾端,產出 1、2、3;外面包一層括號後呼叫 .rev() 把迭代順序反轉成 3、2、1。" },
          { code: "        print!(\"{} \", i);", note: "接著輸出 3 2 1。" },
          { code: "    }", note: "迴圈結束。整體輸出:1 2 3 3 2 1。" },
          { code: "}", note: "main 結束。" },
        ],
        outro: "..(不含尾)與 ..=(含尾)的區別是高頻考點,配合切片時尤其重要。至於「Range 沒有 rev 方法」是錯的:Range 實作了 DoubleEndedIterator,所以可以 rev。",
      },
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
      walkthrough: [
        {
          label: "✅ 正確寫法逐行說明",
          lines: [
            { code: "fn main() {", note: "把選項補成完整程式。" },
            { code: "    'outer: for i in 0..5 {", note: "在迴圈前加上標籤 'outer:(以單引號開頭,和生命週期共用語法形式,但兩者無關)。標籤讓這一層迴圈有了名字。" },
            { code: "        for j in 0..5 {", note: "內層迴圈。" },
            { code: "            if i * j > 6 {", note: "檢查條件。" },
            { code: "                break 'outer;", note: "break 加上標籤 = 直接跳出「指定的那一層」,而不是只跳出目前這層。continue 'outer 同理,會跳到外層的下一圈。" },
            { code: "            }", note: "if 區塊結束。" },
            { code: "        }", note: "內層迴圈結束。" },
            { code: "    }", note: "外層迴圈結束,break 'outer 會直接跳到這裡之後。" },
            { code: "}", note: "main 結束。" },
          ],
        },
        {
          label: "❌ 另外三個寫法錯在哪",
          lines: [
            { code: "break 2;", note: "用數字指定「跳幾層」的語法在 Rust 不存在(在 loop 裡 break 2 會被理解成「帶值 2 跳出」,型別還會對不上)。" },
            { code: "goto end;", note: "Rust 沒有 goto,連關鍵字都沒有,直接是語法錯誤。" },
            { code: "let mut done = false;", note: "靠旗標變數逐層 break 雖然做得到,但不是「無法直接跳出」——標籤就是官方解法,旗標寫法只是把簡單的事複雜化。" },
          ],
        },
      ],
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
      walkthrough: [
        {
          label: "❌ 題目程式碼(無法編譯)",
          lines: [
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let number = 7;", note: "型別推斷為 i32。" },
            { code: "    match number {", note: "⛔ 編譯失敗的起點:non-exhaustive patterns。match 必須「窮盡」所有可能值。" },
            { code: "        1 => println!(\"one\"),", note: "匹配值 1。" },
            { code: "        3 => println!(\"three\"),", note: "匹配值 3。" },
            { code: "        5 => println!(\"five\"),", note: "匹配值 5。i32 有幾十億個可能值,只列三個當然不夠;編譯器會提示 `i32::MIN..=0_i32` and `2_i32` and ... not covered。" },
            { code: "    }", note: "match 結束。因為不窮盡,整支程式編譯失敗——不是「什麼都不印」,也不是執行期 panic。" },
            { code: "}", note: "main 結束。" },
          ],
        },
        {
          label: "✅ 正確寫法(補上萬用分支)",
          lines: [
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let number = 7;", note: "同樣的值。" },
            { code: "    match number {", note: "現在這個 match 是窮盡的。" },
            { code: "        1 => println!(\"one\"),", note: "匹配值 1。" },
            { code: "        3 => println!(\"three\"),", note: "匹配值 3。" },
            { code: "        5 => println!(\"five\"),", note: "匹配值 5。" },
            { code: "        other => println!(\"other: {}\", other),", note: "改動處:用一個變數名當萬用分支,它會匹配所有剩下的值並「綁定」到 other,因此還能拿到值。若不需要值就寫 _ => ...。這裡印出 other: 7。" },
            { code: "    }", note: "match 結束,窮盡性檢查通過。" },
            { code: "}", note: "main 結束。" },
          ],
          outro: "窮盡性檢查是 match 的靈魂:未來 enum 增加變體時,所有漏處理的 match 都會被編譯器一個個抓出來——這是 Rust 重構起來特別安心的主要原因之一。",
        },
      ],
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
      walkthrough: [
        {
          label: "❌ 題目程式碼(無法編譯)",
          lines: [
            { code: "fn add(x, y) {", note: "⛔ 編譯失敗:expected one of `:` ... 函式參數「必須」明確標註型別,Rust 不會從呼叫端反推。而且這裡也沒寫回傳型別。" },
            { code: "    x + y", note: "函式本體本身沒問題,但因為簽名不合法,整個函式無法通過。" },
            { code: "}", note: "函式結束。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    println!(\"{}\", add(1, 2));", note: "呼叫端寫法沒有問題,是函式簽名擋住了整支程式。" },
            { code: "}", note: "main 結束。" },
          ],
        },
        {
          label: "✅ 正確寫法(補上參數與回傳型別)",
          lines: [
            { code: "fn add(x: i32, y: i32) -> i32 {", note: "改動處:每個參數都標註型別,並用 -> 宣告回傳型別。函式簽名是刻意的「推斷邊界」——簽名寫死,函式內部才隨你推斷。" },
            { code: "    x + y", note: "尾端運算式沒有分號,就是回傳值。" },
            { code: "}", note: "函式結束。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    println!(\"{}\", add(1, 2));", note: "印出 3。" },
            { code: "}", note: "main 結束。" },
          ],
          outro: "為什麼要這樣設計?簽名寫死,錯誤訊息就能精準定位在函式內或呼叫端,函式本身也成為可靠的文件;若簽名也推斷,改一處內部實作可能讓天邊的呼叫端爆出難解的錯。",
        },
      ],
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
      walkthrough: {
        label: "🔍 題目程式碼逐行說明(可正常執行)",
        lines: [
          { code: "fn main() {", note: "程式進入點。" },
          { code: "    let x = 5;", note: "外層的 x,值是 5。" },
          { code: "    let y = {", note: "{ } 區塊本身就是運算式,值是它的尾端運算式,所以可以直接賦給 y。" },
          { code: "        let x = 3;", note: "區塊內用 shadowing 建立一個新的 x(值 3),只在這個區塊裡有效,外層的 x 毫髮無傷。" },
          { code: "        x + 1", note: "尾端運算式沒有分號:此處的 x 是區塊內那個 3,算出 4,成為整個區塊的值。" },
          { code: "    };", note: "區塊結束,內部的 x 在這裡消失;y 得到 4。分號屬於 let 陳述式。" },
          { code: "    println!(\"{} {}\", x, y);", note: "外層的 x 仍是 5,y 是 4,印出 5 4。" },
          { code: "}", note: "main 結束。" },
        ],
        outro: "這題綜合了三個觀念:區塊是運算式、尾端無分號即值、shadowing 有作用域範圍。若把 x + 1 加上分號,區塊的值會變成 (),y 的型別就不是數字了。",
      },
      csharp: `C# 的 { } 區塊是純陳述式,不能當值。最接近的是立即呼叫的 lambda:var y = new Func<int>(() => { var x2 = 3; return x2 + 1; })(); ——Rust 一個區塊就解決。`,
    },
  ],
};
