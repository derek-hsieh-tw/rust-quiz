/* 出題慣例:answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌。
 * 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容。 */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-12"] = {
  id: "lesson1-12",
  title: "Trait 基礎",
  goal: "用 trait 定義共享行為:定義與實作、預設方法、trait bound、常用 derive、孤兒規則。",
  questions: [
    {
      id: "1-12-01",
      question: "定義 trait 並為型別實作,正確的寫法是?",
      options: [
        { code: "trait Summary {\n    fn summarize(&self) -> String;\n}\n\nstruct Article {\n    title: String,\n}\n\nimpl Summary for Article {\n    fn summarize(&self) -> String {\n        format!(\"文章:{}\", self.title)\n    }\n}" },
        { code: "interface Summary {\n    fn summarize(&self) -> String;\n}\n\nstruct Article : Summary {\n    title: String,\n}" },
        { code: "trait Summary {\n    fn summarize(&self) -> String;\n}\n\nimpl Article for Summary {\n    fn summarize(&self) -> String {\n        format!(\"文章\")\n    }\n}" },
        { code: "trait Summary {\n    summarize(): String;\n}\n\nstruct Article impl Summary {\n    title: String,\n}" },
      ],
      answer: 0,
      explanation: `三段式:trait 區塊宣告方法簽名(分號結尾,不給實作);struct 正常定義;impl Summary for Article 把兩者接起來——語序是「為 Article 實作 Summary」,for 後面接型別。
interface 關鍵字與冒號繼承是 C# 語法;impl Article for Summary 把 trait 和型別寫反了(變成「為 Summary 實作 Article」);trait 裡的方法簽名也必須是完整的 fn 語法。`,
      csharp: `對照 C# 的 interface + class Article : ISummary。最大結構差異:C# 在「定義型別時」就得列出所有介面;Rust 的 impl 是獨立區塊,型別定義完之後,任何時候(甚至任何人,見孤兒規則那題)都能再補實作——型別與行為徹底解耦。`,
    },
    {
      id: "1-12-02",
      question: "trait 的預設方法。以下程式碼的輸出是?",
      questionCode: "trait Summary {\n    fn summarize(&self) -> String {\n        String::from(\"(Read more...)\")\n    }\n}\n\nstruct Tweet {\n    content: String,\n}\n\nimpl Summary for Tweet {}\n\nfn main() {\n    let t = Tweet {\n        content: String::from(\"hello\"),\n    };\n    println!(\"{}\", t.summarize());\n}",
      options: [
        { text: "(Read more...):impl 區塊為空,使用 trait 提供的預設實作" },
        { text: "編譯錯誤:impl Summary for Tweet 必須實作所有方法" },
        { text: "hello:預設實作會自動取用 struct 的欄位" },
        { text: "編譯錯誤:trait 的方法不能有函式本體" },
      ],
      answer: 0,
      explanation: `trait 方法可以附帶預設實作(有本體);實作者沒覆寫就直接繼承,所以空的 impl 完全合法,輸出預設的 (Read more...)。實作者也可以覆寫,呼叫時用覆寫版。
預設實作看不見具體型別的欄位(它只認識 trait 自己),要用欄位資料得透過「呼叫 trait 的其他方法」的模式組合(預設方法呼叫必須實作的方法)。`,
      csharp: `C# 8 的 default interface methods 是同一個概念,但生態使用率低,而且透過類別呼叫預設實作有轉型限制。Rust 的預設方法從第一天就是核心機制,標準庫大量使用——Iterator 有 70 多個方法,實作者只需提供 next 一個,其餘全是預設方法。`,
    },
    {
      id: "1-12-03",
      question: "trait 作為參數的兩種寫法。以下哪一組是「等價」的?",
      options: [
        { code: "fn notify(item: &impl Summary) { }\n// 等價於\nfn notify<T: Summary>(item: &T) { }" },
        { code: "fn notify(item: &impl Summary) { }\n// 等價於\nfn notify(item: &Summary) { }" },
        { code: "fn notify(item: &impl Summary) { }\n// 等價於\nfn notify(item: Summary) { }" },
        { code: "fn notify<T: Summary>(item: &T) { }\n// 等價於\nfn notify<T>(item: &T) where Summary: T { }" },
      ],
      answer: 0,
      explanation: `impl Trait 參數就是「trait bound 泛型」的語法糖:&impl Summary 與 <T: Summary>(item: &T) 編譯出同樣的單態化程式碼。糖版簡短,泛型版能表達更多(兩個參數同型別、回傳 T 等)。
裸寫 &Summary 是被淘汰的舊語法(現代 Rust 要寫 &dyn Summary,而且那是動態分派,語意不同——進階課);trait 不能直接當參數型別按值收;where Summary: T 把約束方向寫反了(變成要求 trait 實作型別)。`,
      csharp: `<T: Summary> 對應 C# 的 void Notify<T>(T item) where T : ISummary(泛型、可能特化);而 C# 最常寫的 void Notify(ISummary item) 其實對應 Rust 的 &dyn Summary(介面參考、虛擬呼叫)。C# 的習慣寫法在 Rust 是「進階選項」,Rust 預設走零成本的泛型路線。`,
    },
    {
      id: "1-12-04",
      question: "用 == 比較自訂 struct。以下程式碼的結果是?",
      questionCode: "struct Point {\n    x: i32,\n    y: i32,\n}\n\nfn main() {\n    let a = Point { x: 1, y: 2 };\n    let b = Point { x: 1, y: 2 };\n    println!(\"{}\", a == b);\n}",
      options: [
        { text: "編譯錯誤:Point 沒有實作 PartialEq,不能用 ==;加上 #[derive(PartialEq)] 即可" },
        { text: "印出 true:欄位相同就相等" },
        { text: "印出 false:比較的是兩個實例的記憶體位址" },
        { text: "執行期 panic:未定義的比較行為" },
      ],
      answer: 0,
      explanation: `Rust 的運算子背後都是 trait:== 走 PartialEq。自訂型別預設什麼都沒有——不能比較、不能印、不能複製,要哪個能力就 derive 哪個:#[derive(PartialEq)] 自動生成「逐欄位比較」的實作,之後 a == b 得到 true。
常用 derive 清單:Debug(能 {:?})、Clone(能 .clone())、Copy(賦值複製)、PartialEq(能 ==)、Default(能 ::default())——每個能力都是顯式選擇,不存在「預設用位址比較」這種隱含行為。`,
      csharp: `C# 的 == 對 class 預設比參考、對 struct 的 Equals 預設逐欄位反射比較——各有隱含行為,record 又是另一套(值語意)。Rust 一律「沒說就沒有」:行為全部來自看得見的 derive 或手寫 impl,讀型別定義就知道它會什麼。`,
    },
    {
      id: "1-12-05",
      question: "impl Trait 作為回傳型別。以下程式碼的敘述,正確的是?",
      questionCode: "trait Summary {\n    fn summarize(&self) -> String;\n}\n\nstruct Tweet {\n    content: String,\n}\n\nimpl Summary for Tweet {\n    fn summarize(&self) -> String {\n        self.content.clone()\n    }\n}\n\nfn make_summary() -> impl Summary {\n    Tweet {\n        content: String::from(\"hi\"),\n    }\n}",
      options: [
        { text: "合法:回傳「某個實作了 Summary 的型別」,呼叫端只能使用 Summary 的方法,看不到具體是 Tweet" },
        { text: "編譯錯誤:回傳型別必須寫具體的 Tweet" },
        { text: "合法,且呼叫端可以直接存取 .content 欄位" },
        { text: "合法,而且函式可以依條件回傳 Tweet 或 Article 兩種不同型別" },
      ],
      answer: 0,
      explanation: `impl Trait 回傳型別 = 「我回傳某個實作了 Summary 的東西,具體是誰不告訴你」。編譯器知道真身(零成本),但呼叫端的合約只有 Summary——只能呼叫 summarize(),碰 .content 是編譯錯誤。這是刻意的抽象:實作可以換,呼叫端不受影響。
限制:函式所有路徑必須回傳「同一個」具體型別——if 分支回 Tweet、else 回 Article 是編譯錯誤(那需要 Box<dyn Summary>,進階課)。這個語法最重要的舞台是閉包與迭代器(型別寫不出名字,只能 impl Fn / impl Iterator)。`,
      csharp: `C# 回傳 ISummary 什麼型別都能裝(執行期多型);Rust 的 impl Trait 是編譯期單一型別的「匿名化」。習慣上的對應反而是回傳介面但文件註明「實際上都是同一種」——Rust 把這個約定變成編譯器保證。`,
    },
    {
      id: "1-12-06",
      question: "多重約束與 where 子句。以下哪個改寫與原簽名等價且合法?",
      questionCode: "use std::fmt::{Debug, Display};\n\nfn stats<T: Display + Clone, U: Clone + Debug>(t: &T, u: &U) -> i32 {\n    42\n}",
      options: [
        { code: "fn stats<T, U>(t: &T, u: &U) -> i32\nwhere\n    T: Display + Clone,\n    U: Clone + Debug,\n{\n    42\n}" },
        { code: "fn stats<T, U>(t: &T, u: &U) -> i32\nwhere T = Display + Clone, U = Clone + Debug\n{\n    42\n}" },
        { code: "fn stats<T: Display, Clone, U: Clone, Debug>(t: &T, u: &U) -> i32 {\n    42\n}" },
        { code: "fn stats(t: &(Display + Clone), u: &(Clone + Debug)) -> i32 {\n    42\n}" },
      ],
      answer: 0,
      explanation: `where 子句是 bound 的「換行版」:語意與寫在角括號裡完全相同,約束多的時候簽名不會擠成一團,慣例上兩個以上的約束就搬到 where。多重能力用 + 串接(T: Display + Clone)。
where 裡用等號、把 + 串接寫成逗號(變成宣告了叫 Clone、Debug 的型別參數!)、把 trait 直接當參數型別,都不是合法語法。`,
      csharp: `C# 的 where T : IComparable, ICloneable 位置與精神都一樣——這是 Rust 從 C#/Haskell 這脈語言直接繼承的設計,遷移零成本。差別:C# 每個型別參數一個 where 子句,Rust 一個 where 裡逗號分隔多條。`,
    },
    {
      id: "1-12-07",
      question: "孤兒規則(orphan rule)。在你自己的 crate 裡,以下哪個 impl「不被允許」?",
      options: [
        { code: "use std::fmt::Display;\n\n// Display 與 Vec 都定義在外部\nimpl Display for Vec<i32> {\n    // ...\n}" },
        { code: "use std::fmt::Display;\n\nstruct Wrapper(Vec<i32>);\n\nimpl Display for Wrapper {\n    // ...\n}" },
        { code: "trait Pretty {\n    fn pretty(&self) -> String;\n}\n\nimpl Pretty for Vec<i32> {\n    fn pretty(&self) -> String {\n        format!(\"{:?}\", self)\n    }\n}" },
        { code: "trait Pretty {\n    fn pretty(&self) -> String;\n}\n\nstruct Point {\n    x: i32,\n}\n\nimpl Pretty for Point {\n    fn pretty(&self) -> String {\n        format!(\"({})\", self.x)\n    }\n}" },
      ],
      answer: 0,
      explanation: `孤兒規則:impl 要合法,trait「或」型別至少一個得是你 crate 的。Display(std 的)配 Vec(std 的)——兩個都是外人,禁止;其餘三個:自己的型別配外部 trait、外部型別配自己的 trait、全自家,都合法。
為什麼禁止:若兩個相依套件都幫 Vec<i32> 實作了 Display,用到它們的程式該聽誰的?孤兒規則從根源保證全世界不會出現衝突的實作。突圍方法就是選項中的 Wrapper(newtype 模式,lesson1-7 的 tuple struct 再就業)。`,
      csharp: `注意「為外部型別實作自己的 trait」這件事:C# 的擴充方法只能加方法,不能讓 List<int> 事後「成為某個介面的實作」;Rust 可以——impl Pretty for Vec<i32> 之後,Vec 就能傳給任何要求 T: Pretty 的泛型函式。這是 trait 系統超越 interface 的關鍵能力。`,
    },
    {
      id: "1-12-08",
      question: "同一個 trait、不同型別的多型。以下程式碼的輸出是?",
      questionCode: "trait Greet {\n    fn hello(&self) -> String;\n}\n\nstruct English;\nstruct Chinese;\n\nimpl Greet for English {\n    fn hello(&self) -> String {\n        String::from(\"Hello\")\n    }\n}\n\nimpl Greet for Chinese {\n    fn hello(&self) -> String {\n        String::from(\"你好\")\n    }\n}\n\nfn greet(g: &impl Greet) {\n    println!(\"{}\", g.hello());\n}\n\nfn main() {\n    greet(&English);\n    greet(&Chinese);\n}",
      options: [
        { text: "Hello\n你好" },
        { text: "編譯錯誤:greet 的參數型別在兩次呼叫不一致" },
        { text: "Hello\nHello:以第一次單態化的版本為準" },
        { text: "編譯錯誤:unit struct 不能實作 trait" },
      ],
      answer: 0,
      explanation: `greet 是泛型函式(impl Trait 參數 = trait bound 泛型),兩次呼叫各自單態化:greet::<English> 與 greet::<Chinese> 是兩份獨立程式碼,各呼叫各的 hello——這就是「編譯期多型」,輸出 Hello 與你好。
參數型別「不一致」不是問題,那正是泛型的意義;單態化是每個型別一份,不會「以第一次為準」;unit struct(English、Chinese 這種無欄位 struct)是完整的型別,實作 trait 毫無問題,English 這個運算式本身就是它的實例。`,
      csharp: `C# 用 interface 參數達成同樣效果,但那是執行期虛擬呼叫(vtable);Rust 這裡編譯完根本沒有「分派」這回事,兩個呼叫點直接內聯各自的 hello。想要 C# 那種執行期動態(集合裡混裝不同型別),Rust 用 dyn Trait——進階課的主角。`,
    },
    {
      id: "1-12-09",
      question: "derive Copy 的條件。以下程式碼的結果是?",
      questionCode: "#[derive(Copy, Clone)]\nstruct User {\n    name: String,\n    age: u32,\n}\n\nfn main() {\n    let a = User {\n        name: String::from(\"derek\"),\n        age: 30,\n    };\n    let b = a;\n    println!(\"{} {}\", a.name, b.age);\n}",
      options: [
        { text: "編譯錯誤:String 不是 Copy,含有它的 struct 不能 derive Copy" },
        { text: "印出 derek 30:derive 之後賦值就是複製" },
        { text: "編譯錯誤:Copy 和 Clone 不能同時 derive" },
        { text: "印出 derek 30,但 b 的 name 與 a 共享同一塊記憶體" },
      ],
      answer: 0,
      explanation: `derive(Copy) 不是「宣告」而是「申請」:編譯器檢查所有欄位是否都是 Copy——String 擁有 heap 資源(lesson1-4 論證過為什麼它不可能是 Copy),申請被駁回,編譯錯誤指著 name 欄位。
把 name 換成 u32 之類就能通過。Copy 與 Clone 必須同時 derive(Copy 是 Clone 的子集,語言規定 Copy: Clone);「共享記憶體的複製」正是 Copy 被設計來杜絕的東西。`,
      csharp: `C# 的 struct 含參考型別欄位照樣能複製(欄位複製參考,兩份共享同一物件)——語言不阻止,隱患自負。Rust 的 derive 會遞迴驗證語意成立才放行:「這個型別宣稱能安全按位元複製」是編譯器背書的承諾,不是作者的一廂情願。`,
    },
    {
      id: "1-12-10",
      question: "C# 對照總結題:trait 與 interface 最本質的差異是?",
      options: [
        { text: "實作的歸屬與時機:interface 必須由型別作者在定義時聲明;trait 可以事後由任何人(在孤兒規則內)為既有型別補實作,型別與行為徹底解耦" },
        { text: "沒有本質差異,trait 就是 interface 的別名" },
        { text: "trait 不能有預設實作,interface 可以" },
        { text: "trait 只能用於泛型約束,不能像 interface 一樣當作抽象來設計 API" },
      ],
      answer: 0,
      explanation: `最本質的差異是「誰能建立實作、什麼時候」:C# 的 class F : IFoo 寫死在型別定義;Rust 的 impl 是獨立區塊——你可以為標準庫的型別實作自己的 trait(本課孤兒規則題),第三方也可以為你的型別實作他們的 trait。型別發布多年後仍能長出新能力,不用改原始碼。
預設實作兩邊都有(trait 從第一天、C# 8 之後);trait 當然是 Rust 設計 API 抽象的主力(整個標準庫:Iterator、Display、From⋯⋯)。`,
      csharp: `加上前幾題的差異總表:實作位置(定義時 vs 事後)、分派方式(C# 一律虛擬呼叫 vs Rust 預設單態化、dyn 才動態)、能力範圍(方法 vs 方法+運算子+關聯型別)、衝突防護(無 vs 孤兒規則)。concept 相通、機制深度不同——這是 C# 開發者學 Rust 最划算的一章:直覺能用,上限更高。`,
    },
  ],
};
