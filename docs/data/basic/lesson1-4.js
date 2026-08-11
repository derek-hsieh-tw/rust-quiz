/* 出題慣例:answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌。
 * 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容。 */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-4"] = {
  id: "lesson1-4",
  title: "所有權(Ownership)",
  goal: "建立 Rust 最重要的心智模型:每個值有唯一擁有者,賦值/傳參即轉移(move),作用域結束即釋放(drop)。",
  questions: [
    {
      id: "1-4-01",
      question: "以下程式碼的結果是?",
      questionCode: "fn main() {\n    let s1 = String::from(\"hello\");\n    let s2 = s1;\n    println!(\"{}\", s1);\n}",
      options: [
        { text: "編譯錯誤:borrow of moved value: `s1`" },
        { text: "印出 hello(s1、s2 指向同一份資料)" },
        { text: "印出 hello(s2 是 s1 的複本)" },
        { text: "執行期 panic:s1 已失效" },
      ],
      answer: 0,
      explanation: `String 擁有 heap 上的資料。let s2 = s1 不是複製,是「move」:所有權從 s1 轉移到 s2,s1 從此失效,再使用就是編譯錯誤。
為什麼這樣設計?若允許兩個變數都「擁有」同一份 heap 資料,作用域結束時就會釋放兩次(double free)。Rust 的解法:同一時間只有一個擁有者,編譯期就把問題堵死——這就是無 GC 卻記憶體安全的根基。`,
      csharp: `C# 的 string s2 = s1; 之後兩個變數都能用——因為只是複製參考,GC 在背後追蹤這份資料被誰引用、何時能回收。Rust 把 GC 的工作換成編譯期的所有權規則:零執行期成本,代價是你要理解 move。`,
    },
    {
      id: "1-4-02",
      question: "把上一題的 String 換成整數,結果是?",
      questionCode: "fn main() {\n    let x = 5;\n    let y = x;\n    println!(\"{} {}\", x, y);\n}",
      options: [
        { text: "印出 5 5,完全合法" },
        { text: "編譯錯誤:x 已被 move" },
        { text: "印出 5 5,但編譯器給出警告" },
        { text: "只有 y 可用,x 印出 0" },
      ],
      answer: 0,
      explanation: `i32 實作了 Copy trait:賦值時直接「按位元複製」,x 和 y 是兩份獨立的值,都繼續有效。
判斷標準:整數、浮點、bool、char,以及全由 Copy 型別組成的 tuple/陣列,都是 Copy;凡是擁有 heap 資源的(String、Vec)都不是。直覺:複製成本便宜且無資源歸屬問題的,才配得上 Copy。`,
      csharp: `類似 C# 的實值型別(int、struct)賦值即複製。差別在 C# 的 class 一律參考語意、struct 一律複製語意,由「型別的種類」決定;Rust 由「是否實作 Copy」決定,而且不是 Copy 的就 move——沒有「多個變數共享可變資料」這個預設選項。`,
    },
    {
      id: "1-4-03",
      question: "想要真正複製一份 String(兩個變數都可用),正確的寫法是?",
      options: [
        { code: "let s1 = String::from(\"hello\");\nlet s2 = s1.clone();\nprintln!(\"{} {}\", s1, s2);" },
        { code: "let s1 = String::from(\"hello\");\nlet s2 = s1.copy();\nprintln!(\"{} {}\", s1, s2);" },
        { code: "let s1 = String::from(\"hello\");\nString s2 = new String(s1);\nprintln!(\"{} {}\", s1, s2);" },
        { code: "let s1 = String::from(\"hello\");\nlet s2 = &s1 as String;\nprintln!(\"{} {}\", s1, s2);" },
      ],
      answer: 0,
      explanation: `clone() 深複製 heap 資料,s2 得到獨立的一份,s1 保持有效。
Rust 刻意讓深複製「必須明寫 .clone()」:昂貴的操作要在程式碼上看得見,不會有隱形的效能損耗。.copy() 這個方法不存在(Copy 是隱式的位元複製,不是方法);new String(...) 是 C#/Java 語法;&s1 as String 也不行,as 不能把參考轉成擁有的 String。`,
      csharp: `C# 的 string 不可變所以從不需要複製;但對一般 class,「淺拷貝或深拷貝」是個要自己想清楚的問題(MemberwiseClone、手寫 Clone)。Rust 用 #[derive(Clone)] 自動生成正確的深複製,且呼叫點明確可見。`,
    },
    {
      id: "1-4-04",
      question: "把 String 傳進函式後,結果是?",
      questionCode: "fn takes_ownership(s: String) {\n    println!(\"{}\", s);\n}\n\nfn main() {\n    let s = String::from(\"hello\");\n    takes_ownership(s);\n    println!(\"{}\", s);\n}",
      options: [
        { text: "編譯錯誤:s 的所有權已移入函式,main 裡不能再用" },
        { text: "印出 hello 兩次" },
        { text: "印出 hello 一次後執行期 panic" },
        { text: "編譯錯誤:函式參數不能是 String 型別" },
      ],
      answer: 0,
      explanation: `傳參數與賦值遵守同一條規則:非 Copy 型別「move 進函式」。s 的所有權進了 takes_ownership,函式結束時 s 被 drop,main 裡的 s 早已失效。
這題是理解借用(下一課)的動機:如果只是想讓函式「看一下」值,每次都被搬走也太痛苦——所以才需要 &(借用)。`,
      csharp: `C# 傳 class 物件是複製參考,呼叫端的變數永遠可用,你從不需要思考「這個值還在不在」。Rust 把「誰擁有這個值」放上檯面,函式簽名 fn f(s: String) 唸作:「呼叫我,就把 s 交給我處置」。`,
    },
    {
      id: "1-4-05",
      question: "以下程式碼的結果是?",
      questionCode: "fn gives_ownership() -> String {\n    let s = String::from(\"yours\");\n    s\n}\n\nfn main() {\n    let s1 = gives_ownership();\n    println!(\"{}\", s1);\n}",
      options: [
        { text: "印出 yours:回傳值把所有權移交給呼叫端" },
        { text: "編譯錯誤:s 是區域變數,函式結束就被釋放,不能回傳" },
        { text: "執行期錯誤:懸空參考" },
        { text: "印出空字串:s 的內容已被清空" },
      ],
      answer: 0,
      explanation: `回傳值也是 move:s 的所有權透過回傳「移交」給呼叫端的 s1,資料本身不會被釋放(擁有者換人了,而不是消失)。
「區域變數不能回傳」的直覺來自 C 語言的「不能回傳區域陣列指標」——但這裡回傳的是「擁有權」不是「指標」,完全安全。注意對比:回傳 &s(參考)才會是編譯錯誤,那就真的是懸空參考了(lesson1-5 會考)。`,
      csharp: `C# 回傳物件沒這些顧慮(GC 管)。Rust 的規則其實很對稱:值進函式是 move,值出函式也是 move,所有權像接力棒一路傳遞,編譯器全程追蹤棒子在誰手上。`,
    },
    {
      id: "1-4-06",
      question: "關於值何時被釋放(drop),以下敘述正確的是?",
      options: [
        { text: "擁有者離開作用域的那一刻,值立即被 drop,時機在編譯期即可確定" },
        { text: "由背景執行緒定期掃描,把沒人用的值回收" },
        { text: "必須手動呼叫 free() 釋放,否則記憶體洩漏" },
        { text: "程式結束時一次全部釋放" },
      ],
      answer: 0,
      explanation: `Rust 的釋放是「確定性」的:擁有者走出作用域(} 那一刻),值的 drop 就被呼叫,先進後出。沒有 GC 執行緒、沒有手動 free、也不會等到程式結束。
這個機制(RAII)不只管記憶體:檔案控制代碼、網路連線、鎖,全都在擁有者離開作用域時自動釋放——資源管理跟著所有權走。`,
      csharp: `C# 的 GC 回收時機不確定,所以非記憶體資源需要 IDisposable + using 手動劃定釋放點。Rust 的 drop 等於「每個型別天生自帶 using」——這是無 GC 設計換來的最大紅利之一。`,
    },
    {
      id: "1-4-07",
      question: "tuple 的 Copy 行為。以下哪段程式碼「無法」編譯?",
      options: [
        { code: "let t = (String::from(\"hi\"), 5);\nlet u = t;\nprintln!(\"{}\", t.1);" },
        { code: "let t = (1, 2.0, 'c');\nlet u = t;\nprintln!(\"{}\", t.0);" },
        { code: "let t = (1, 2);\nlet u = t;\nprintln!(\"{} {}\", t.0, u.0);" },
        { code: "let t = ([1, 2, 3], false);\nlet u = t;\nprintln!(\"{}\", t.1);" },
      ],
      answer: 0,
      explanation: `複合型別是否 Copy,取決於「所有成員是否都 Copy」。含 String 的那組:String 非 Copy,整個 tuple 就不是 Copy,let u = t 是 move,之後用 t.1 → 編譯錯誤。
其餘三組(整數+浮點+字元、兩個整數、Copy 陣列+bool)的成員全是 Copy,tuple 整體是 Copy,複製後原變數照用。`,
      csharp: `C# 的 struct 也是「成員複製」語意,但含參考型別欄位的 struct 複製後兩份共享那個參考——不會禁止你用,只是埋下共享可變狀態的隱患。Rust 直接說:含非 Copy 成員就整個不准隱式複製。`,
    },
    {
      id: "1-4-08",
      question: "以下程式碼的結果是?",
      questionCode: "fn main() {\n    let s = String::from(\"hello\");\n    let mut v = Vec::new();\n    v.push(s);\n    println!(\"{}\", s);\n}",
      options: [
        { text: "編譯錯誤:s 已被 move 進 v" },
        { text: "印出 hello:v 存的是 s 的複本" },
        { text: "印出 hello:v 存的是 s 的參考" },
        { text: "執行期 panic" },
      ],
      answer: 0,
      explanation: `v.push(s) 的參數是 String(按值),所以 s 被 move 進 vector——集合「擁有」放進去的元素。之後再用 s 就是 borrow of moved value。
想繼續用有三個選擇:push(s.clone()) 付複製成本;先用完 s 再 push;或之後從 v 借出來用(&v[0])。「集合擁有元素」這個觀念在 lesson1-9 會全面展開。`,
      csharp: `C# 的 list.Add(s) 加的是參考,s 照用不誤,list 與 s 共享同一個物件——修改會互相看見,這正是 Rust 想在編譯期管住的「共享可變狀態」。`,
    },
    {
      id: "1-4-09",
      question: "為什麼 String 不能像 i32 一樣實作 Copy?最根本的原因是:",
      options: [
        { text: "String 擁有 heap 資源:若按位元複製,兩個 String 會指向同一塊 heap,作用域結束時同一塊記憶體被釋放兩次(double free)" },
        { text: "因為 String 太大,複製太慢,官方為了效能禁止" },
        { text: "因為 String 長度不固定,編譯器無法產生複製的程式碼" },
        { text: "歷史包袱:早期版本的限制,新版其實可以" },
      ],
      answer: 0,
      explanation: `Copy 的語意是「按位元複製即可得到獨立有效的值」。String 在 stack 上只是(指標、長度、容量)三個欄位,按位元複製會得到兩個指向「同一塊 heap」的 String——兩個擁有者、一塊資料,drop 兩次就是 double free,未定義行為。
所以規則是:實作了 Drop(擁有資源)的型別不可能是 Copy,兩者在語言層面互斥。效能顧慮是考量之一但不是根本原因——clone() 慢也照樣提供,重點是「隱式」複製不能有資源歸屬問題。`,
      csharp: `C# 不存在這個問題,因為釋放統一由 GC 執行,複製多少參考都無所謂,代價是執行期的 GC 成本與不確定的回收時機。Rust 選擇把這個複雜度搬到編譯期的型別系統裡。`,
    },
    {
      id: "1-4-10",
      question: "C# 開發者視角:下面這段 C# 程式碼,若逐字翻譯成 Rust(String 版本),行為上最大的差異是?",
      questionCode: "// C#\nvar s1 = \"hello\";\nvar s2 = s1;\nConsole.WriteLine(s1); // C# 中完全沒問題",
      questionLang: "csharp",
      options: [
        { text: "Rust 中 let s2 = s1; 之後 s1 即失效,編譯期就報錯——「值的唯一擁有者」取代了「GC 追蹤的共享參考」" },
        { text: "行為完全相同,Rust 也允許兩個變數指向同一字串" },
        { text: "Rust 需要手動釋放 s1,否則記憶體洩漏" },
        { text: "Rust 會自動深複製,只是效能較差" },
      ],
      answer: 0,
      explanation: `本課總結:C# 的心智模型是「變數是通往物件的參考,GC 管生死」;Rust 的模型是「變數擁有值,賦值即移交,離開作用域即釋放」。
同一行 let s2 = s1,C# 讀作「兩個名字指向同一物件」,Rust 讀作「所有權從 s1 交給 s2」。這不是語法差異,是整個記憶體管理哲學的差異——理解這一點,後面的借用、生命週期都是這個模型的自然推論。`,
      csharp: `補充:C# 的 string 剛好不可變,共享參考沒有副作用;但換成 List<T> 等可變物件,共享參考 + 到處修改就是許多 bug 的來源。Rust 的所有權系統正是把「誰能改、誰在看」這件事制度化。`,
    },
  ],
};
