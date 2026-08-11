/* 出題慣例:answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌。
 * 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容。 */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-7"] = {
  id: "lesson1-7",
  title: "Struct 與方法",
  goal: "用 struct + impl 組織資料與行為:欄位可變性、更新語法、方法的 &self/&mut self/self、關聯函式。",
  questions: [
    {
      id: "1-7-01",
      question: "定義並實例化一個 struct,正確的寫法是?",
      options: [
        { code: "struct User {\n    username: String,\n    active: bool,\n}\n\nlet u = User {\n    username: String::from(\"derek\"),\n    active: true,\n};" },
        { code: "struct User {\n    username: String;\n    active: bool;\n}\n\nlet u = new User(\"derek\", true);" },
        { code: "class User {\n    username: String,\n    active: bool,\n}\n\nlet u = User { \"derek\", true };" },
        { code: "struct User(username: String, active: bool);\n\nlet u = User::create(\"derek\", true);" },
      ],
      answer: 0,
      explanation: `struct 欄位用「逗號」分隔(不是分號),實例化直接寫「型別名 { 欄位: 值 }」,沒有 new 關鍵字,而且每個欄位都必須給值(不存在未初始化的欄位)。
用分號分隔欄位、new 關鍵字、class 關鍵字都不是 Rust 語法;具名欄位的 struct 實例化時也必須寫欄位名,不能只按順序給值(那是 tuple struct 的行為,後面會考)。`,
      csharp: `對照 C# 的物件初始化器 new User { Username = "derek", Active = true }——形狀很像,但 C# 允許漏填(拿預設值),Rust 強制填滿所有欄位,「忘了初始化某欄位」這種 bug 在編譯期就不存在。`,
    },
    {
      id: "1-7-02",
      question: "修改 struct 的欄位。以下程式碼的結果是?",
      questionCode: "struct User {\n    email: String,\n    active: bool,\n}\n\nfn main() {\n    let user = User {\n        email: String::from(\"a@example.com\"),\n        active: true,\n    };\n    user.email = String::from(\"b@example.com\");\n}",
      options: [
        { text: "編譯錯誤:user 未宣告為 mut,不能修改任何欄位" },
        { text: "正常執行:欄位預設可以修改" },
        { text: "編譯錯誤:email 欄位需要單獨標記 mut 才能修改" },
        { text: "正常執行,但 active 欄位仍不可修改" },
      ],
      answer: 0,
      explanation: `可變性掛在「整個實例」上:let mut user 之後所有欄位都可改;沒有 mut 就全部不可改。Rust 刻意不支援「單一欄位標 mut」——一個值要嘛整個可變、要嘛整個不可變,規則簡單且和借用系統一致(&mut user 能改所有欄位)。
修法:第一行改成 let mut user = ...。`,
      csharp: `C# 的可變性掛在「型別定義」上:欄位少了 readonly 就永遠可改,init/required 屬性則另有規則,散落在型別各處。Rust 把決定權移到「使用端」:同一個 struct,這裡宣告 mut 就可變、那裡不宣告就唯讀,型別本身不用分成可變/不可變兩個版本。`,
    },
    {
      id: "1-7-03",
      question: "欄位初始化簡寫(field init shorthand)。以下哪段函式可以編譯,且是慣用寫法?",
      questionCode: "struct User {\n    username: String,\n    active: bool,\n}",
      options: [
        { code: "fn build_user(username: String) -> User {\n    User {\n        username,\n        active: true,\n    }\n}" },
        { code: "fn build_user(username: String) -> User {\n    User {\n        username: username,\n        active: true,\n    };\n}" },
        { code: "fn build_user(username: String) -> User {\n    return new User(username, true);\n}" },
        { code: "fn build_user(username: String) -> User {\n    User.username = username;\n    User.active = true;\n    User\n}" },
      ],
      answer: 0,
      explanation: `參數名與欄位名相同時,可以只寫一次:username 等同 username: username,這是慣用的簡寫。
寫 username: username 本身合法(編譯器只會提醒可簡寫),但那個版本尾端多了分號——運算式變陳述式,函式拿不到回傳值,編譯錯誤(lesson1-3 的老朋友)。new 關鍵字不存在;把 User 當物件直接賦值欄位更不是 Rust 語法。`,
      csharp: `C# 沒有這個簡寫(屬性初始化器一定要寫 Username = username),不過 record 的主要建構子 record User(string Username) 解決了同樣的「重複打名字」問題,方向類似。`,
    },
    {
      id: "1-7-04",
      question: "struct 更新語法(..)與所有權的互動。以下程式碼的結果是?",
      questionCode: "struct User {\n    username: String,\n    email: String,\n    active: bool,\n}\n\nfn main() {\n    let user1 = User {\n        username: String::from(\"derek\"),\n        email: String::from(\"a@example.com\"),\n        active: true,\n    };\n    let user2 = User {\n        email: String::from(\"b@example.com\"),\n        ..user1\n    };\n    println!(\"{}\", user1.active);\n    println!(\"{}\", user1.username);\n}",
      options: [
        { text: "編譯錯誤:username 已被 move 進 user2,但 user1.active 那行合法(bool 是 Copy)" },
        { text: "兩行都正常印出:..user1 會複製所有欄位" },
        { text: "編譯錯誤:..user1 之後 user1 整個失效,連 active 都不能碰" },
        { text: "執行期 panic:存取已搬移的欄位" },
      ],
      answer: 0,
      explanation: `..user1 表示「其餘欄位從 user1 搬過來」——搬移遵守各欄位自己的規則:username 是 String(非 Copy)被 move,active 是 bool(Copy)被複製。結果是「部分搬移(partial move)」:user1.username 失效、user1.active 依然可用,整個 user1 則不能再整體使用(不能傳遞或賦值)。
所以第一個 println(active)合法、第二個(username)編譯錯誤。這題把 lesson1-4 的 Copy/move 規則落到 struct 場景——搬移永遠是逐欄位判定的。`,
      csharp: `對照 C# record 的 with 運算式:user1 with { Email = "b@..." }——語意是「複製一份、改幾個欄位」,原物件完好。Rust 的 .. 語法長得像,但做的是「搬移」不是「複製」;要 C# 那種行為,得讓 struct derive Clone 再明確 ..user1.clone()。`,
    },
    {
      id: "1-7-05",
      question: "tuple struct(元組結構體)。以下程式碼的輸出是?",
      questionCode: "struct Point(i32, i32);\nstruct Meters(i32);\n\nfn main() {\n    let p = Point(3, 4);\n    let m = Meters(100);\n    println!(\"{} {} {}\", p.0, p.1, m.0);\n}",
      options: [
        { text: "3 4 100" },
        { text: "編譯錯誤:tuple struct 需要欄位名才能存取" },
        { text: "編譯錯誤:struct 定義不能用小括號" },
        { text: "(3, 4) 100" },
      ],
      answer: 0,
      explanation: `tuple struct 是「有名字的 tuple」:欄位沒有名字,用 .0、.1 存取。適合欄位意義不言自明的場景(Point 的 x、y)。
單欄位的 Meters(i32) 是 newtype 模式:給 i32 一個獨立型別,讓「公尺」和「秒」即使底層都是 i32 也不能混用——編譯器幫你擋掉單位錯誤,零執行期成本。這個模式在 Rust 生態使用頻率很高。`,
      csharp: `C# 沒有直接對應;record struct Meters(int Value) 可模擬 newtype,但欄位一定有名字。以型別區分同底層資料的思路,在 C# 通常靠自訂 struct + 運算子多載達成,Rust 的 tuple struct 一行搞定。`,
    },
    {
      id: "1-7-06",
      question: "為 struct 定義方法,正確的寫法是?",
      options: [
        { code: "struct Rectangle {\n    width: u32,\n    height: u32,\n}\n\nimpl Rectangle {\n    fn area(&self) -> u32 {\n        self.width * self.height\n    }\n}" },
        { code: "struct Rectangle {\n    width: u32,\n    height: u32,\n\n    fn area(&self) -> u32 {\n        self.width * self.height\n    }\n}" },
        { code: "impl Rectangle {\n    fn area(this) -> u32 {\n        this.width * this.height\n    }\n}" },
        { code: "struct Rectangle {\n    width: u32,\n    height: u32,\n}\n\nfn Rectangle.area(&self) -> u32 {\n    self.width * self.height\n}" },
      ],
      answer: 0,
      explanation: `Rust 把「資料」與「行為」分開:struct 區塊只放欄位,方法寫在獨立的 impl 區塊裡,第一個參數 &self 表示借用實例來讀取。
方法直接寫進 struct 大括號、用 this 當關鍵字、用「型別.方法名」在外面定義,都不是 Rust 語法。一個型別可以有多個 impl 區塊(常用來分組方法或配合泛型)。`,
      csharp: `C# 的方法寫在 class 本體內,資料與行為綁在同一個大括號。Rust 的 impl 分離設計有個好處:你甚至能為「別人的型別」加方法(透過 trait,lesson1-12)——類似 C# 擴充方法,但整合進型別系統的程度深得多。`,
    },
    {
      id: "1-7-07",
      question: "方法接收者 self 的三種形式。以下程式碼的結果是?",
      questionCode: "struct Counter {\n    n: i32,\n}\n\nimpl Counter {\n    fn get(&self) -> i32 {\n        self.n\n    }\n    fn consume(self) -> i32 {\n        self.n\n    }\n}\n\nfn main() {\n    let c = Counter { n: 5 };\n    let a = c.consume();\n    let b = c.get();\n    println!(\"{} {}\", a, b);\n}",
      options: [
        { text: "編譯錯誤:consume(self) 拿走了 c 的所有權,之後不能再呼叫 c.get()" },
        { text: "印出 5 5" },
        { text: "編譯錯誤:同一個 impl 不能同時有 &self 和 self 的方法" },
        { text: "執行期 panic:c 已被消耗" },
      ],
      answer: 0,
      explanation: `方法的接收者遵守 lesson1-4/1-5 的同一套規則:&self 借用(用完歸還)、&mut self 可變借用、self 拿走所有權。consume(self) 呼叫後 c 被 move 進方法、方法結束即 drop,再呼叫 c.get() 就是 borrow of moved value。
「拿走 self」的方法是刻意的設計手段:表示「這個物件到此為止,轉換成別的東西」——例如 builder 的 build(self) 防止蓋完房子還改藍圖。兩種接收者並存於同一個 impl 完全合法。`,
      csharp: `C# 方法裡的 this 永遠等同 Rust 的 &mut self(隨時可讀可寫,物件也不會失效),「呼叫方法後物件不能再用」這件事在 C# 無法表達。Rust 把「這個方法會不會消耗物件」寫進簽名,呼叫端一看就知道。`,
    },
    {
      id: "1-7-08",
      question: "關聯函式(associated function)。以下程式碼的輸出是?",
      questionCode: "struct Rectangle {\n    width: u32,\n    height: u32,\n}\n\nimpl Rectangle {\n    fn square(size: u32) -> Self {\n        Self {\n            width: size,\n            height: size,\n        }\n    }\n}\n\nfn main() {\n    let sq = Rectangle::square(3);\n    println!(\"{}\", sq.width * sq.height);\n}",
      options: [
        { text: "印出 9:square 是關聯函式,用 :: 呼叫,Self 是 Rectangle 的別名" },
        { text: "編譯錯誤:建構函式必須命名為 new" },
        { text: "編譯錯誤:應該寫 sq.square(3) 用點呼叫" },
        { text: "印出 6:width 與 height 分別是 3 和 2" },
      ],
      answer: 0,
      explanation: `沒有 self 參數的函式叫「關聯函式」,掛在型別上、用 Rectangle::square(3) 呼叫(:: 而非 .)。impl 區塊裡 Self 就是當前型別的別名,回傳型別與建構處都能用。
Rust 沒有建構子語法,new 只是「最常見的關聯函式名字」,不是關鍵字——square、from_size、with_capacity 都是合法慣用的建構名,一個型別可以有很多個。`,
      csharp: `關聯函式 ≈ C# 的靜態方法;Rectangle::square ≈ 靜態工廠方法 Rectangle.Square(3)。差別在 C# 另有專門的建構子語法 new Rectangle(...),Rust 統一都是關聯函式——「建構」沒有特殊地位,也因此天生鼓勵語意化命名的工廠方法。`,
    },
    {
      id: "1-7-09",
      question: "印出整個 struct。以下程式碼的結果是?",
      questionCode: "#[derive(Debug)]\nstruct Rectangle {\n    width: u32,\n    height: u32,\n}\n\nfn main() {\n    let r = Rectangle { width: 3, height: 4 };\n    println!(\"{}\", r);\n}",
      options: [
        { text: "編譯錯誤:{} 需要 Display 實作;derive(Debug) 只提供 {:?} 的格式化" },
        { text: "印出 Rectangle { width: 3, height: 4 }" },
        { text: "印出記憶體位址" },
        { text: "編譯錯誤:derive 屬性不能用在 struct 上" },
      ],
      answer: 0,
      explanation: `{} 佔位符走 Display trait(「給使用者看的格式」),{:?} 走 Debug trait(「給開發者看的格式」)。#[derive(Debug)] 只自動生成後者,所以 println!("{:?}", r) 可以印出 Rectangle { width: 3, height: 4 },{} 則編譯錯誤——Display 被認為該由人來設計,編譯器不代勞。
除錯還有個更方便的 dbg! 巨集:dbg!(&r) 會連檔名行號一起印。derive 屬性正是為 struct/enum 設計的。`,
      csharp: `C# 每個物件都有預設 ToString()(印型別名),Console.WriteLine(r) 永遠能編譯,只是輸出通常沒用;record 則自動生成漂亮的 ToString。Rust 把「可印」拆成 Debug/Display 兩個明確的能力,沒實作就直接編譯錯誤——沒有「能跑但印出垃圾」的中間狀態。`,
    },
    {
      id: "1-7-10",
      question: "C# 開發者視角:Rust 的 struct 與 C# 的 class,最根本的差異是?",
      options: [
        { text: "Rust struct 沒有繼承——共享行為靠 trait、共享資料靠組合;而且實例遵守所有權/借用規則,不是 GC 管理的共享參考" },
        { text: "只是關鍵字不同,Rust 的 struct 就是 C# 的 class" },
        { text: "Rust struct 只能放資料,完全不能定義方法" },
        { text: "Rust struct 一律配置在 stack,因此不能包含 String 這類 heap 資料" },
      ],
      answer: 0,
      explanation: `兩個根本差異:(1)沒有實作繼承——Rust 沒有基底類別、沒有 virtual/override,共享行為用 trait(介面 + 預設實作)、共享資料用組合,直接跳過「繼承階層深不可測」的老問題。(2)記憶體語意——C# class 實例是 GC 堆上的共享參考;Rust struct 是「值」,擁有它的變數遵守 move/borrow 規則。
struct 當然能有方法(impl 區塊);struct 本體在 stack 但欄位可以擁有 heap 資料(String、Vec 的緩衝區在 heap,由 struct 擁有並隨之 drop)。`,
      csharp: `最容易踩的心智慣性:C# 習慣「到處傳物件參考、誰都能改」;Rust 得先想清楚「誰擁有、誰借用、借多久」。初期會覺得綁手綁腳,但這正是不用 GC 也能記憶體安全的代價與紅利——資料流向在編譯期就一目瞭然。`,
    },
  ],
};
