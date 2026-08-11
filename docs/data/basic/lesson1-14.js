/* 出題慣例:answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌。
 * 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容。 */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-14"] = {
  id: "lesson1-14",
  title: "模組系統與專案結構",
  goal: "把程式拆成模組與多檔案:mod/pub/use 的規則、路徑寫法、拆檔慣例,以及與 C# namespace 的對照。",
  questions: [
    {
      id: "1-14-01",
      question: "模組與路徑的基本形狀。以下程式碼中,從 main 呼叫 add_to_waitlist 的完整路徑是?",
      questionCode: "mod front_of_house {\n    pub mod hosting {\n        pub fn add_to_waitlist() {}\n    }\n}\n\nfn main() {\n    // 這裡怎麼呼叫?\n}",
      options: [
        { code: "crate::front_of_house::hosting::add_to_waitlist();\n// 或相對路徑\nfront_of_house::hosting::add_to_waitlist();" },
        { code: "front_of_house.hosting.add_to_waitlist();" },
        { code: "hosting::add_to_waitlist();" },
        { code: "import front_of_house;\nadd_to_waitlist();" },
      ],
      answer: 0,
      explanation: `模組形成一棵樹,根是 crate。路徑分隔符是 ::(絕對路徑從 crate:: 起頭;相對路徑從當前位置起算,main 與 front_of_house 同層所以直接寫)。
點號是方法呼叫的語法,不用於模組路徑;跳過中間層直接寫 hosting:: 找不到(hosting 不在 main 的這一層);import 不是 Rust 關鍵字(引入用 use,而且 use 也不是呼叫的必要條件——完整路徑隨時可用)。`,
      csharp: `C# 的 namespace 用點號:FrontOfHouse.Hosting.AddToWaitlist()。Rust 用 :: 且模組樹「就是」crate 的實體結構——下一題開始的隱私規則、拆檔規則都掛在這棵樹上,比 namespace 承擔更多職責。`,
    },
    {
      id: "1-14-02",
      question: "預設隱私。以下程式碼的結果是?",
      questionCode: "mod kitchen {\n    fn cook() {\n        println!(\"cooking\");\n    }\n}\n\nfn main() {\n    kitchen::cook();\n}",
      options: [
        { text: "編譯錯誤:cook 是私有的(function cook is private),模組內容預設不對外開放" },
        { text: "印出 cooking:同一個檔案裡的東西互相可見" },
        { text: "編譯錯誤:mod 區塊裡不能定義函式" },
        { text: "印出 cooking,但編譯器給出可見性警告" },
      ],
      answer: 0,
      explanation: `Rust 的隱私規則:模組內的一切「預設私有」,對外開放要逐一標 pub。main 在 kitchen 外面,呼叫私有的 cook 是硬性編譯錯誤——「同檔案」不是豁免條件,模組邊界才是判準(反過來,子模組可以用祖先模組的私有項目)。
修法:pub fn cook。這個預設方向是刻意的:公開介面必須顯式聲明,重構私有內容永遠不會破壞外部使用者。`,
      csharp: `C# 類別成員預設 private(方向相同),但頂層類別預設 internal、同專案暢行。Rust 的邊界更細:以「模組」為單位層層把關,pub 決定跨模組、pub(crate) 決定跨 crate(後面考)——內部結構的封裝粒度比 assembly/internal 細得多。`,
    },
    {
      id: "1-14-03",
      question: "pub struct 的欄位隱私。以下程式碼的結果是?",
      questionCode: "mod menu {\n    pub struct Breakfast {\n        pub toast: String,\n        fruit: String,\n    }\n\n    impl Breakfast {\n        pub fn summer(toast: &str) -> Breakfast {\n            Breakfast {\n                toast: String::from(toast),\n                fruit: String::from(\"peach\"),\n            }\n        }\n    }\n}\n\nfn main() {\n    let mut meal = menu::Breakfast::summer(\"Rye\");\n    meal.toast = String::from(\"Wheat\");\n    meal.fruit = String::from(\"apple\");\n}",
      options: [
        { text: "編譯錯誤:toast 那行合法,fruit 是私有欄位(field fruit is private)不能存取" },
        { text: "正常執行:struct 標了 pub,所有欄位就都公開" },
        { text: "編譯錯誤:兩個欄位都不能從外部修改" },
        { text: "編譯錯誤:pub struct 不允許含有私有欄位" },
      ],
      answer: 0,
      explanation: `pub struct 只公開「型別本身」,欄位各自獨立決定:toast 有 pub 可以讀寫,fruit 沒有就是私有——存取它編譯錯誤。也因為有私有欄位,外部無法用字面值語法建構 Breakfast,必須走 summer 這種公開的關聯函式:封裝的標準做法。
順帶一提,pub enum 則是一人得道全家公開(變體全部 pub)——變體藏起來的 enum 沒有使用意義,語言直接定了規則。`,
      csharp: `與 C# 的 public class + private 欄位精神一致,這題直覺可以平移。差別在習慣:C# 靠屬性(getter/setter)控制存取;Rust 沒有屬性語法,慣例是私有欄位 + 公開方法(fn fruit(&self) -> &str 讀、fn set_fruit 寫),樣板較多但一切顯式。`,
    },
    {
      id: "1-14-04",
      question: "use 的慣用深度。引入「函式」與「型別」,慣例上的寫法是?",
      options: [
        { code: "// 函式:引到父模組,呼叫時保留一層路徑\nuse crate::front_of_house::hosting;\nhosting::add_to_waitlist();\n\n// 型別:直接引到型別本身\nuse std::collections::HashMap;\nlet map: HashMap<i32, i32> = HashMap::new();" },
        { code: "// 函式與型別都引到最深,越短越好\nuse crate::front_of_house::hosting::add_to_waitlist;\nadd_to_waitlist();\n\nuse std::collections::HashMap;" },
        { code: "// 一律用萬用字元最省事\nuse crate::front_of_house::*;\nuse std::collections::*;" },
        { code: "// 不用 use,每次都寫完整路徑才是慣例\ncrate::front_of_house::hosting::add_to_waitlist();" },
      ],
      answer: 0,
      explanation: `社群慣例的分工:「函式」引到父模組——呼叫處保留 hosting::add_to_waitlist() 一層,讀者一眼看出這不是本地函式、來自哪個模組;「型別」引到本身——HashMap::new() 已經帶著型別名,再掛路徑徒增噪音。
引函式到最深「能編譯」但丟失來源資訊;萬用字元 * 讓讀者無從追蹤名字來源,慣例只用於 prelude 模式與測試;完整路徑寫到天荒地老則沒人受得了——use 存在就是為了消這個。`,
      csharp: `C# 的 using 只能引整個 namespace(等於 Rust 引到父模組),C# 6 的 using static 才能引成員。Rust 的 use 粒度全自選,於是社群長出了這套「函式留一層、型別到本身」的最佳實踐——寫給讀者看的設計。`,
    },
    {
      id: "1-14-05",
      question: "super 相對路徑。以下程式碼的結果是?",
      questionCode: "fn deliver_order() {\n    println!(\"delivered\");\n}\n\nmod back_of_house {\n    pub fn fix_order() {\n        cook_order();\n        super::deliver_order();\n    }\n\n    fn cook_order() {\n        println!(\"cooked\");\n    }\n}\n\nfn main() {\n    back_of_house::fix_order();\n}",
      options: [
        { text: "印出 cooked 和 delivered:super:: 指向父模組(crate 根),可以呼叫那裡的 deliver_order" },
        { text: "編譯錯誤:deliver_order 沒有 pub,子模組不能呼叫" },
        { text: "編譯錯誤:super 只能在 impl 區塊裡使用" },
        { text: "印出 cooked 後執行期找不到 deliver_order 而 panic" },
      ],
      answer: 0,
      explanation: `super:: 是「上一層模組」(類比檔案系統的 ..):back_of_house 的父層是 crate 根,super::deliver_order() 正確指到。cook_order 同模組內互相呼叫,不需要 pub。
關鍵的隱私方向:「子模組可以使用祖先模組的私有項目」(小孩看得到家裡的東西),pub 管的是反方向與旁系——所以沒 pub 的 deliver_order 被子模組呼叫完全合法。連結錯誤發生在編譯期,Rust 沒有「執行期找不到函式」這種事。`,
      csharp: `C# namespace 沒有「向上引用」的專用語法(名稱解析自動往外層找),也沒有「巢狀 namespace 的隱私方向」概念——internal 是平的。Rust 的模組樹隱私是有方向的:往上看得到、往下要 pub,這讓「模組 = 封裝單位」名副其實。`,
    },
    {
      id: "1-14-06",
      question: "模組拆檔。src/main.rs 裡寫一行 mod garden;(注意是分號結尾),它的意義是?",
      options: [
        { text: "宣告 garden 模組並指示編譯器從 src/garden.rs(或 src/garden/mod.rs)載入其內容——模組樹照樣由宣告構成,只是本體搬到別的檔案" },
        { text: "include 任意路徑的檔案內容,類似 C 的 #include" },
        { text: "匯入名為 garden 的外部套件,等同 Cargo.toml 加相依" },
        { text: "建立一個空模組,之後在其他檔案裡隨意往裡面加東西" },
      ],
      answer: 0,
      explanation: `mod garden;(分號版)= 「這裡有個 garden 模組,內容在對應檔案裡」:編譯器按固定規則找 src/garden.rs(現代慣例)或 src/garden/mod.rs(舊慣例),garden 的子模組再拆就放 src/garden/xxx.rs。重點:檔案不會自動變成模組——沒有 mod 宣告的 .rs 檔就是孤兒,根本不會被編譯。
它不是 #include(不能指任意路徑、不是文字貼上);外部套件走 Cargo.toml + use,與 mod 無關;模組內容也只能由被宣告的那個檔案提供,不能四散各處。`,
      csharp: `C# 反過來:專案裡每個 .cs 自動參與編譯,namespace 想寫哪就寫哪、一個 namespace 跨任意多檔。Rust 要求模組樹「顯式宣告、位置可預測」——看 main.rs 的 mod 清單就是整個 crate 的目錄,不用 IDE 全域搜尋才能拼出結構。`,
    },
    {
      id: "1-14-07",
      question: "pub use 重新匯出(re-export)的用途,正確的是?",
      questionCode: "// src/lib.rs\nmod front_of_house {\n    pub mod hosting {\n        pub fn add_to_waitlist() {}\n    }\n}\n\npub use crate::front_of_house::hosting;\n\n// 使用者現在可以:\n// my_crate::hosting::add_to_waitlist();",
      options: [
        { text: "把深層項目在當前模組「再公開」一次:使用者用短路徑 my_crate::hosting::...,不必知道 front_of_house 這層內部結構——對外 API 形狀與內部組織解耦" },
        { text: "pub use 與 use 完全相同,pub 只是可加可不加的修飾" },
        { text: "把 hosting 模組複製一份到根模組,之後有兩份獨立的程式碼" },
        { text: "讓 hosting 變成私有,只有當前 crate 能用" },
      ],
      answer: 0,
      explanation: `一般 use 只是「本模組內的別名」,對外不可見;加上 pub 之後,這個名字成為當前模組公開介面的一部分——外部使用者看到的路徑是 my_crate::hosting,內部的 front_of_house 完全隱形。之後內部怎麼重組(改名、搬層),只要 pub use 這行跟著調,外部 API 紋絲不動。
沒有任何程式碼被複製——匯出的是「名字」,指向同一個實體。實務上大量函式庫的 lib.rs 就是一串 pub use,精心設計「使用者看到的形狀」。`,
      csharp: `C# 幾乎沒有對應物(global using 別名和 TypeForwardedTo 只覆蓋零碎場景)——namespace 結構基本上直接暴露給使用者。Rust 的「內部樹」與「公開 API 樹」可以完全是兩棵樹,這是函式庫設計的重要自由度。`,
    },
    {
      id: "1-14-08",
      question: "use 的別名與巢狀語法。以下程式碼的意義,正確的是?",
      questionCode: "use std::fmt::Result;\nuse std::io::Result as IoResult;\nuse std::io::{self, Write};",
      options: [
        { text: "as 給同名型別取別名避免衝突;{self, Write} 一行同時引入 std::io 本身與 std::io::Write" },
        { text: "as 是型別轉換:把 io::Result 轉成 fmt::Result 使用" },
        { text: "{self, Write} 的 self 指當前模組,表示把 Write 加進本模組" },
        { text: "編譯錯誤:兩個 Result 同時引入必然衝突,as 也救不了" },
      ],
      answer: 0,
      explanation: `兩個工具:(1)as 別名——fmt::Result 與 io::Result 撞名,第二個取名 IoResult 就相安無事(這正是「函式引到父模組」慣例想避免的問題的另一個解法);(2)巢狀 use 的 self——use std::io::{self, Write} 等於 use std::io; 加 use std::io::Write; 兩行,self 代表「路徑本身」。
use 的 as 純粹是命名(與轉型運算子 as 撞關鍵字但無關);這裡的 self 也不是方法裡的 self。`,
      csharp: `對應 C# 的 using IoResult = System.IO.Result;(別名 using)——概念相同。巢狀 {} 語法則是 Rust 特有的整理術,大型專案的 use 區塊靠它保持整潔;C# 每個 using 一行,靠 IDE 摺疊眼不見為淨。`,
    },
    {
      id: "1-14-09",
      question: "pub(crate) 的可見性。以下敘述正確的是?",
      questionCode: "pub(crate) fn internal_helper() {}\npub fn public_api() {}",
      options: [
        { text: "internal_helper 在整個 crate 內任何模組可用,但不進入對外公開的 API;public_api 則對外部 crate 也開放" },
        { text: "pub(crate) 與 pub 完全等價,括號只是註解" },
        { text: "pub(crate) 表示只有 crate 根模組(main.rs/lib.rs)能呼叫" },
        { text: "pub(crate) 的函式只能被同一個檔案裡的程式碼使用" },
      ],
      answer: 0,
      explanation: `可見性光譜:私有(預設,本模組+子孫)< pub(crate)(整個 crate)< pub(全世界)。pub(crate) 的定位是「內部共用工具」:跨模組要用、但不想寫進公開 API 的東西——函式庫尤其重要,pub 出去的東西就是對使用者的承諾,不能隨便改。
另有更細的 pub(super)、pub(in path) 可指定範圍。「整個 crate 可用」不等於「只有根模組可用」,也與檔案邊界無關——Rust 的可見性單位永遠是模組。`,
      csharp: `pub(crate) ≈ C# 的 internal(assembly 內可見)——這是兩個語言對照最工整的一組。差別:C# 頂層型別「預設」internal,Rust 預設更嚴(模組私有),internal 等級要主動聲明;方向不同,哲學一致——公開介面越小越好。`,
    },
    {
      id: "1-14-10",
      question: "C# 對照總結題:Rust 的模組系統與 C# 的 namespace,最本質的差異是?",
      options: [
        { text: "mod 是「實體結構 + 隱私邊界」:模組樹必須顯式宣告、與檔案對應可預測,且每層都是封裝單位;namespace 只是鬆散的命名前綴,封裝靠 assembly 層級的 internal" },
        { text: "只是語法差異:mod 用 ::,namespace 用點號,其餘概念相同" },
        { text: "namespace 功能比 mod 強大,Rust 是為了編譯速度做的簡化" },
        { text: "mod 只能一個檔案一個,namespace 才能跨檔案組織程式碼" },
      ],
      answer: 0,
      explanation: `本課總結,mod 一肩挑三職:(1)命名空間(路徑);(2)隱私邊界(pub 以模組為單位,層層把關);(3)編譯結構(mod 宣告決定哪些檔案參與編譯、放在哪)。C# 的 namespace 只做第一件事——任何檔案任意宣告、不設防、與編譯單位無關,封裝粒度只有 assembly 一刀(internal)。
mod 當然能跨檔案(mod xxx; 拆檔那題);功能是多了不是少了。`,
      csharp: `遷移速查:namespace ≈ mod(但帶隱私)、using ≈ use、internal ≈ pub(crate)、專案/assembly ≈ crate、NuGet 套件 ≈ crates.io 的 crate、.csproj ≈ Cargo.toml。最需要適應的一件事:新增檔案後要記得補 mod 宣告——沒宣告的檔案不存在於編譯器眼中。`,
    },
  ],
};
