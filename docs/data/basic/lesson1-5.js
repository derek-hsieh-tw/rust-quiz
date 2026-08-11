/* 出題慣例:answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌。
 * 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容。 */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-5"] = {
  id: "lesson1-5",
  title: "借用與參考",
  goal: "掌握借用規則:同時只能有「多個不可變借用」或「一個可變借用」,並理解這條規則防住了哪些 bug。",
  questions: [
    {
      id: "1-5-01",
      question: "上一課的痛點:函式拿走所有權。用「借用」解決後,以下程式碼的結果是?",
      questionCode: "fn calculate_length(s: &String) -> usize {\n    s.len()\n}\n\nfn main() {\n    let s = String::from(\"hello\");\n    let len = calculate_length(&s);\n    println!(\"{} 的長度是 {}\", s, len);\n}",
      options: [
        { text: "印出「hello 的長度是 5」:借用不轉移所有權,s 仍然有效" },
        { text: "編譯錯誤:s 已被 move 進函式" },
        { text: "編譯錯誤:函式不能回傳借用物的屬性" },
        { text: "印出長度但 s 印出空字串" },
      ],
      answer: 0,
      explanation: `&s 建立一個「參考」:讓函式暫時存取值,但不取得所有權——這個動作叫借用(borrow)。函式結束時參考失效,所有權從頭到尾都在 main 的 s 手上。
函式簽名的語意因此非常清楚:fn f(s: String) 是「給我」,fn f(s: &String) 是「借我看看」。日常 Rust 大多數參數都是借用。`,
      csharp: `C# 傳物件本來就是「傳參考」,所以感覺不到這個問題。差別在:C# 的參考人人可存、隨時可變;Rust 的參考分唯讀(&)與可變(&mut),而且有嚴格的數量規則——這是後面幾題的主角。`,
    },
    {
      id: "1-5-02",
      question: "想在函式裡「修改」借來的 String,以下程式碼的結果是?",
      questionCode: "fn change(s: &String) {\n    s.push_str(\", world\");\n}\n\nfn main() {\n    let mut s = String::from(\"hello\");\n    change(&s);\n    println!(\"{}\", s);\n}",
      options: [
        { text: "編譯錯誤:不能透過 & 不可變參考修改值,需要 &mut" },
        { text: "印出 hello, world" },
        { text: "印出 hello:修改只影響函式內的複本" },
        { text: "執行期 panic:違反借用規則" },
      ],
      answer: 0,
      explanation: `& 是「不可變借用」——只能看不能改,呼叫 push_str 這種會修改的方法直接編譯錯誤(cannot borrow as mutable)。
正確版本要改三個地方:函式參數 s: &mut String、呼叫端 change(&mut s)、變數本身 let mut s。三處缺一不可——「這個值可變、我要借可變的、函式收可變的」意圖在每一層都明明白白。`,
      csharp: `C# 傳個 List 進方法,方法能不能改它?簽名上完全看不出來,只能看文件或原始碼。Rust 的 & vs &mut 把「會不會被改」寫進型別:看簽名就知道副作用範圍。`,
    },
    {
      id: "1-5-03",
      question: "借用規則核心題:以下程式碼的結果是?",
      questionCode: "fn main() {\n    let mut s = String::from(\"hello\");\n    let r1 = &mut s;\n    let r2 = &mut s;\n    println!(\"{} {}\", r1, r2);\n}",
      options: [
        { text: "編譯錯誤:cannot borrow `s` as mutable more than once at a time" },
        { text: "印出 hello hello" },
        { text: "印出 hello hello,但有警告" },
        { text: "執行期偵測到資料競爭而 panic" },
      ],
      answer: 0,
      explanation: `借用規則:同一時間,一個值只能有「一個可變借用」。r1 還活著(後面 println 用到它)時又建立 r2,直接編譯錯誤。
為什麼?兩個可變參考代表兩條路徑能同時改同一份資料——單執行緒下會產生難追的別名(aliasing)bug,多執行緒下就是資料競爭。Rust 選擇在編譯期禁止,而不是等執行期出事。`,
      csharp: `C# 拿兩個參考指向同一個 List 然後都去改,完全合法——直到某天一邊在 foreach、另一邊 Add,丟出 InvalidOperationException,或者更慘:沒報錯但資料悄悄壞掉。Rust 把這類問題全數提前到編譯期。`,
    },
    {
      id: "1-5-04",
      question: "不可變與可變借用混用:以下程式碼的結果是?",
      questionCode: "fn main() {\n    let mut s = String::from(\"hello\");\n    let r1 = &s;\n    let r2 = &s;\n    let r3 = &mut s;\n    println!(\"{} {} {}\", r1, r2, r3);\n}",
      options: [
        { text: "編譯錯誤:已有不可變借用存活時,不能再建立可變借用" },
        { text: "印出 hello hello hello" },
        { text: "只有 r3 的內容正確,r1、r2 印出舊值" },
        { text: "編譯錯誤:不可變借用最多只能有一個" },
      ],
      answer: 0,
      explanation: `完整規則:「多個不可變借用」或「一個可變借用」,兩者互斥。r1、r2(唯讀)還會被使用時,r3(可寫)插進來 → cannot borrow \`s\` as mutable because it is also borrowed as immutable。
直覺:讀者可以很多個(反正沒人改),但只要有人要寫,就不准任何其他人同時在讀——不然讀者可能讀到改到一半的狀態。注意「不可變借用最多一個」是錯的:唯讀借用數量不限,「最多一個」的限制只針對可變借用。`,
      csharp: `這條規則就是資料庫「共享鎖/排他鎖」的概念,也像 ReaderWriterLockSlim——只是 C# 那些是執行期機制,要自己記得用;Rust 把讀寫互斥做成編譯期的型別規則,忘了用不會過編譯。`,
    },
    {
      id: "1-5-05",
      question: "上一題的變化:把 println 移到前面,結果是?",
      questionCode: "fn main() {\n    let mut s = String::from(\"hello\");\n    let r1 = &s;\n    let r2 = &s;\n    println!(\"{} {}\", r1, r2);\n    let r3 = &mut s;\n    r3.push_str(\"!\");\n    println!(\"{}\", r3);\n}",
      options: [
        { text: "可以編譯,印出 hello hello 和 hello!:r1、r2 用完就結束,r3 合法" },
        { text: "編譯錯誤:r1、r2 要到作用域結尾 } 才失效,r3 仍然衝突" },
        { text: "編譯錯誤:同一個作用域不能先後出現 & 和 &mut" },
        { text: "印出 hello hello 後執行期 panic" },
      ],
      answer: 0,
      explanation: `借用的存活範圍不是到 } 為止,而是到「最後一次被使用」為止——這叫 NLL(non-lexical lifetimes)。r1、r2 在第一個 println 之後不再被用,借用即告結束,r3 建立時已無衝突。
所以借錯順序時常常只要「調整使用順序」就能過編譯,不必真的重構。「要到作用域結尾 } 才失效」描述的是 2018 年以前的舊行為。`,
      csharp: `無直接對應(C# 沒有借用)。可以類比成編譯器自動幫你把鎖的持有範圍縮到最小——你只管寫,編譯器精確計算每個借用真正需要活多久。`,
    },
    {
      id: "1-5-06",
      question: "懸空參考(dangling reference):以下程式碼的結果是?",
      questionCode: "fn dangle() -> &String {\n    let s = String::from(\"hello\");\n    &s\n}\n\nfn main() {\n    let r = dangle();\n    println!(\"{}\", r);\n}",
      options: [
        { text: "編譯錯誤:missing lifetime specifier / 回傳了指向已釋放記憶體的參考" },
        { text: "印出 hello:參考會讓 s 延命" },
        { text: "執行期 panic:存取已釋放的記憶體" },
        { text: "印出亂碼(未定義行為)" },
      ],
      answer: 0,
      explanation: `s 在函式結束時被 drop,回傳 &s 就是指向已釋放記憶體的「懸空參考」。Rust 在編譯期直接拒絕(錯誤訊息會說 missing lifetime specifier,本質是:這個參考沒有可以合法指向的東西)。
對照 lesson1-4:回傳 s(move 所有權出去)完全合法;回傳 &s(值死了參考還在)才是問題。C/C++ 這裡是未定義行為的重災區,Rust 讓它根本無法編譯。`,
      csharp: `C# 不會有懸空參考:只要參考還在,GC 就不回收——「參考會讓 s 延命」正是 C# 的直覺!Rust 沒有 GC,改用編譯期證明「參考絕不活得比它指向的值久」——這正是生命週期(lesson1-13)要講的事。`,
    },
    {
      id: "1-5-07",
      question: "一邊走訪一邊修改:以下程式碼的結果是?",
      questionCode: "fn main() {\n    let mut v = vec![1, 2, 3];\n    for x in &v {\n        if *x == 2 {\n            v.push(99);\n        }\n    }\n}",
      options: [
        { text: "編譯錯誤:v 正被不可變借用(for 迴圈),不能同時可變借用(push)" },
        { text: "正常執行,v 變成 [1, 2, 3, 99]" },
        { text: "無窮迴圈:一直 push 一直走訪" },
        { text: "執行期丟出「集合已修改」的例外" },
      ],
      answer: 0,
      explanation: `for x in &v 在整個迴圈期間持有 v 的不可變借用;v.push(99) 需要可變借用——違反「讀寫互斥」,編譯錯誤。
這防住一個真實危險:push 可能觸發 Vec 擴容搬家(重新配置記憶體),迭代器手上的指標立刻變成懸空指標。C++ 的「iterator invalidation」未定義行為,在 Rust 是編譯錯誤。`,
      csharp: `C# 的對應經驗:foreach 中對 List Add/Remove → 執行期丟 InvalidOperationException: Collection was modified。C# 執行期才發現,Rust 編譯期就擋——同一個 bug,攔截時機差一個階段。`,
    },
    {
      id: "1-5-08",
      question: "透過可變參考修改數值:以下程式碼的輸出是?",
      questionCode: "fn main() {\n    let mut x = 5;\n    let r = &mut x;\n    *r += 1;\n    println!(\"{}\", x);\n}",
      options: [
        { text: "印出 6" },
        { text: "印出 5:r 是複本,修改不影響 x" },
        { text: "編譯錯誤:整數是 Copy 型別,不能建立可變參考" },
        { text: "編譯錯誤:println 使用 x 時 r 仍持有可變借用" },
      ],
      answer: 0,
      explanation: `*r 是解參考(dereference):透過參考存取到 x 本體,*r += 1 改的就是 x,輸出 6。
「Copy 型別不能建立可變參考」是干擾項:Copy 型別一樣可以被借用(& 和 &mut 都行),Copy 只影響「賦值時複製還是 move」。「println 時 r 仍持有借用」也不成立:*r += 1 是 r 的最後一次使用,借用在那之後就結束了(NLL,見前面的題目),println 用 x 沒有衝突。`,
      csharp: `最接近的是 ref 區域變數:ref int r = ref x; r += 1;(C# 7)。不過 C# 的 ref 用起來不需要 * 解參考,而且沒有數量限制;Rust 對 &mut 的「同時只能一個」管制才是本質差異。`,
    },
    {
      id: "1-5-09",
      question: "函式參數設計慣例:一個「只讀取字串內容」的函式,參數型別最慣用的選擇是?",
      options: [
        { code: "fn print_it(s: &str)      // 借用,且用 &str 而非 &String" },
        { code: "fn print_it(s: String)    // 取得所有權" },
        { code: "fn print_it(s: &mut String) // 可變借用" },
        { code: "fn print_it(s: String) -> String // 拿進來再還回去" },
      ],
      answer: 0,
      explanation: `原則:需要什麼權限就要什麼權限。只讀 → 不可變借用;要改 → &mut;要拿走存起來 → 才收所有權。
收 String 所有權會逼呼叫端交出值或 clone;收 &mut String 誇大了權限(呼叫端還得把變數掛上 mut);「拿進來再還回去」則是所有權還沒學通的搬運寫法,又醜又煩。至於為何用 &str 不用 &String:&str 同時接受 String 的借用與字串字面值,通用性更大——細節在下一課(lesson1-6)。`,
      csharp: `C# 較接近的思維是「參數宣告為最寬鬆的抽象」如 IReadOnlyList<T> / IEnumerable<T> 表達唯讀意圖。Rust 把這件事做到型別系統核心:唯讀是 &,可寫是 &mut,騙不了人。`,
    },
    {
      id: "1-5-10",
      question: "C# 對照總結題:C# 的 ref 參數與 Rust 的 &mut,最關鍵的差異是?",
      questionCode: "// C#: 兩個 ref 指向同一變數,合法\nstatic void F(ref int a, ref int b) { a += b; }\nint x = 1;\nF(ref x, ref x); // OK\n\n// Rust: 等價寫法\nfn f(a: &mut i32, b: &mut i32) { *a += *b; }\nlet mut x = 1;\nf(&mut x, &mut x); // ?",
      questionLang: "csharp",
      options: [
        { text: "Rust 版編譯錯誤:不能同時建立兩個指向 x 的 &mut——Rust 保證可變參考絕不重疊(no aliasing)" },
        { text: "兩邊行為相同,都把 x 變成 2" },
        { text: "Rust 版可編譯,但執行期 panic" },
        { text: "Rust 版需要把參數改成 &&mut i32 才能編譯" },
      ],
      answer: 0,
      explanation: `f(&mut x, &mut x) 需要同時存在兩個指向 x 的可變借用 → cannot borrow \`x\` as mutable more than once。
C# 的 F(ref x, ref x) 合法,a 和 b 是同一變數的兩個別名(aliasing)——這種「看似兩個參數其實同一個」的情況會讓程式行為依賴呼叫方式,是隱蔽 bug 與編譯器無法最佳化的根源。Rust 的 &mut 保證獨占,編譯器和讀者都能放心假設參考之間互不重疊。`,
      csharp: `本課總結:C# 的參考「自由但自負」,規範靠約定與文件;Rust 的參考「受規則管制」:任意多個唯讀、或恰好一個可寫、絕不懸空。這三條就是借用檢查器(borrow checker)的全部核心——之後所有看起來嚇人的借用錯誤,都只是這三條規則的具體展開。`,
    },
  ],
};
