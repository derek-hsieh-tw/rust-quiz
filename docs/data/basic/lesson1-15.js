/* 出題慣例見專案根目錄 AUTHORING.md:
 *   - answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌
 *   - 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容
 *   - 有程式碼的題目一律附 walkthrough(逐行說明);反面案例必須同時附上 ✅ 正確寫法 */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-15"] = {
  id: "lesson1-15",
  title: "標準函式庫巡覽(std 地圖)",
  goal: "建立標準函式庫的地圖:std 底下有哪些模組、各自對應 .NET 的哪個命名空間、什麼東西不用 use 就能用、std 的邊界在哪,以及怎麼自己查文件。",
  questions: [
    {
      id: "1-15-01",
      question: "為什麼有些型別不用 use 就能用?以下程式碼的結果是?",
      questionCode: "fn main() {\n    let mut names = Vec::new();\n    names.push(\"Derek\");\n\n    let mut ages = HashMap::new();\n    ages.insert(\"Derek\", 18);\n}",
      options: [
        { text: "編譯錯誤:找不到 HashMap——Vec 由 prelude 自動引入,HashMap 不在 prelude,必須自己寫 use std::collections::HashMap;" },
        { text: "正常編譯:std 底下的東西一律不用 use" },
        { text: "編譯錯誤:Vec 與 HashMap 都要 use 才能用" },
        { text: "編譯錯誤:HashMap::new() 要先指定型別參數,寫成 HashMap::<&str, i32>::new() 就好" },
      ],
      answer: 0,
      explanation: `每個 Rust 檔案的開頭,編譯器都會偷偷插入一行 use std::prelude::*;。這份「預載清單」很短,只放最常用的東西:Vec、String、Box、Option、Some、None、Result、Ok、Err、Clone、Copy、Debug、Iterator,以及 println! 這類巨集。
HashMap 不在清單上,所以要自己引入。至於「型別參數」那個說法:HashMap::new() 完全不需要標註型別,下一行的 insert("Derek", 18) 就足以讓編譯器推斷出 HashMap<&str, i32>——真正的錯誤是「這個名字根本不存在」,而不是「型別不明」。
判斷原則很單純:編譯器說 cannot find ... in this scope,就是少了一行 use。`,
      walkthrough: [
        {
          label: "❌ 題目程式碼(無法編譯)",
          lines: [
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let mut names = Vec::new();", note: "Vec 的完整路徑其實是 std::vec::Vec,但它在 prelude 裡,所以直接寫 Vec 就好。" },
            { code: "    names.push(\"Derek\");", note: "推入一個 &str,編譯器由此推斷出 names 的型別是 Vec<&str>。" },
            { code: "", note: "" },
            { code: "    let mut ages = HashMap::new();", note: "⛔ 編譯失敗:cannot find type `HashMap` in this scope,底下還會補一句 use of undeclared type `HashMap`。HashMap 的完整路徑是 std::collections::HashMap,它不在 prelude 裡,這個名字在此處還不存在。" },
            { code: "    ages.insert(\"Derek\", 18);", note: "上一行已經失敗,這行不會被檢查。" },
            { code: "}", note: "main 結束。" },
          ],
        },
        {
          label: "✅ 正確寫法",
          lines: [
            { code: "use std::collections::HashMap;", note: "改動處:補上這一行,把 HashMap 這個名字帶進當前作用域。Vec 不用補,prelude 已經引入了。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let mut names = Vec::new();", note: "prelude 的成員,維持原樣。" },
            { code: "    names.push(\"Derek\");", note: "型別推斷為 Vec<&str>。" },
            { code: "", note: "" },
            { code: "    let mut ages = HashMap::new();", note: "現在 HashMap 這個短名稱有定義了,可以直接用。" },
            { code: "    ages.insert(\"Derek\", 18);", note: "插入鍵值對,編譯器由此推斷出 HashMap<&str, i32>——型別參數從來就不需要手寫。" },
            { code: "", note: "" },
            { code: "    println!(\"{:?} {:?}\", names, ages);", note: "印出兩個容器,確認程式真的跑得起來。" },
            { code: "}", note: "main 結束,兩個容器離開作用域自動釋放。" },
          ],
        },
      ],
      csharp: `C# 沒有 prelude,但有兩個近親:一是編譯器預設參考的組件,二是 C# 10 的 global using(以及 ImplicitUsings 開關,會自動 global using System、System.Collections.Generic 等)。差別在於 Rust 的 prelude 刻意維持極小——只放「幾乎每支程式都會用到」的東西,因此 C# 開發者習慣隨手可用的 Dictionary,到了 Rust 必須明確寫出 use std::collections::HashMap;。`,
    },
    {
      id: "1-15-02",
      question: "這段程式碼一行 use 都沒有,卻寫得出 std::fmt::Display。下列敘述正確的是?",
      questionCode: "struct Point {\n    x: i32,\n    y: i32,\n}\n\nimpl std::fmt::Display for Point {\n    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {\n        write!(f, \"({}, {})\", self.x, self.y)\n    }\n}\n\nfn main() {\n    println!(\"{}\", Point { x: 1, y: 2 });\n}",
      options: [
        { text: "完整路徑隨時可用,use 只是「幫路徑取個短名字」的便利措施,兩種寫法編譯出來完全相同" },
        { text: "必須補上 use std::fmt::Display; 否則編譯失敗" },
        { text: "std 底下的東西可以省略 use,其他 crate 的型別則一定要 use" },
        { text: "這是 impl 區塊的特例,一般函式內不能直接寫完整路徑" },
      ],
      answer: 0,
      explanation: `這正是 lesson1-7 撞見 impl std::fmt::Display 時最容易卡住的地方:那一串冒號不是什麼特殊語法,就是「路徑」——std 是 crate 名,fmt 是它底下的模組,Display 是模組裡的 trait。
use 做的唯一一件事,是把路徑末端的名字綁到當前作用域,讓你之後能寫短的。完整路徑本來就永遠可用,對 std 如此,對 crates.io 拿來的 crate 也一樣(serde_json::to_string(&x) 不 use 也能呼叫),更不是 impl 區塊的特例。
實務上的取捨:只用一兩次就寫完整路徑,用很多次才 use。這段如果要改寫得清爽,慣例是 use std::fmt;,然後寫 fmt::Display、fmt::Formatter、fmt::Result——留一層模組名當語境。`,
      walkthrough: [
        {
          label: "🔍 逐行說明(可正常編譯執行)",
          lines: [
            { code: "struct Point {", note: "定義一個自訂型別。" },
            { code: "    x: i32,", note: "欄位。" },
            { code: "    y: i32,", note: "欄位。" },
            { code: "}", note: "struct 定義結束。" },
            { code: "", note: "" },
            { code: "impl std::fmt::Display for Point {", note: "路徑拆解:std(crate)→ fmt(模組)→ Display(trait)。沒有 use,所以把完整路徑一路寫出來。" },
            { code: "    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {", note: "Formatter 與 Result 同樣住在 std::fmt。注意這個 Result 是 fmt 專用的別名(等同 Result<(), fmt::Error>),與 prelude 那個 Result<T, E> 不是同一個東西。" },
            { code: "        write!(f, \"({}, {})\", self.x, self.y)", note: "把內容寫進格式化器。write! 是 prelude 帶進來的巨集,不用 use。結尾沒有分號,所以它的值就是這個方法的回傳值。" },
            { code: "    }", note: "方法結束。" },
            { code: "}", note: "impl 結束。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    println!(\"{}\", Point { x: 1, y: 2 });", note: "{} 佔位符會呼叫上面實作的 Display,印出 (1, 2)。" },
            { code: "}", note: "main 結束。" },
          ],
          outro: "把 impl 那三行改寫成 use std::fmt; 加 impl fmt::Display for Point,產出的執行檔一模一樣——use 不影響語意,只影響你要打多少字。",
        },
      ],
      csharp: `對照 C#:using System.Text; 之後寫 StringBuilder,不 using 就寫 System.Text.StringBuilder——C# 同樣允許完整限定名,兩邊的心智模型在這裡是一致的,只是分隔符 Rust 用 ::、C# 用點號。一個關鍵差異是:C# 的 using 是「開啟整個命名空間」,Rust 的 use 預設是「引入一個名字」,要開整包得明寫 use std::fmt::*;(慣例上很少這樣寫)。`,
    },
    {
      id: "1-15-03",
      question: "Display、Formatter 與 println! 分別住在 std 的哪裡?",
      questionCode: "use std::fmt;\n\nstruct Temp(f64);\n\nimpl fmt::Display for Temp {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        write!(f, \"{:.1} C\", self.0)\n    }\n}\n\nfn main() {\n    println!(\"{}\", Temp(23.456));\n}",
      options: [
        { text: "Display、Debug、Formatter 與 write! 都在 std::fmt;println! 是 std 的巨集,由 prelude 自動可用,底層走的正是 fmt 這套機制" },
        { text: "Display 在 std::fmt,println! 在 std::io——因為最後是寫到主控台" },
        { text: "全部都在 std::io,格式化只是 io 的一個子功能" },
        { text: "Display 在 std::string(它產生字串),Formatter 在 std::fmt" },
      ],
      answer: 0,
      explanation: `std::fmt 是「格式化」這件事的總部:兩個核心 trait(Display 給使用者看、Debug 給開發者看)、Formatter(承接輸出的緩衝區)、fmt::Result(格式化專用的回傳型別),以及 write! / format! 這組巨集的規格,全都在這裡。
容易搞混的是 println!:它確實最後把字送到標準輸出(那是 std::io 的事),但「把 Temp(23.456) 變成 23.5 C」這段完全由 fmt 負責。可以這樣記——fmt 決定「長什麼樣子」,io 決定「送到哪裡去」。同一套 fmt 機制,format! 就完全不碰 io,直接產生 String。
至於「Display 在 std::string」的說法:String 這個型別確實住在 std::string,但它是格式化的「結果」,不是格式化的「規格」。`,
      walkthrough: [
        {
          label: "🔍 逐行說明(可正常編譯執行)",
          lines: [
            { code: "use std::fmt;", note: "只引入模組本身,不引入裡面的個別名字。這是 std::fmt 的慣用寫法:留一層 fmt:: 當語境,讀的人一眼知道 Result 是哪個 Result。" },
            { code: "", note: "" },
            { code: "struct Temp(f64);", note: "tuple struct,用 self.0 存取唯一的欄位。" },
            { code: "", note: "" },
            { code: "impl fmt::Display for Temp {", note: "因為上面 use 了模組,這裡可以寫短的 fmt::Display。" },
            { code: "    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {", note: "Formatter 是 std 提供的輸出緩衝器,承接你寫進去的內容;fmt::Result 是格式化專用的別名,不是 prelude 的那個 Result<T, E>。" },
            { code: "        write!(f, \"{:.1} C\", self.0)", note: "{:.1} 是精度規格,四捨五入到小數點後一位,所以 23.456 會印成 23.5。write! 把結果寫進 f,而不是印到螢幕。" },
            { code: "    }", note: "方法結束。" },
            { code: "}", note: "impl 結束。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    println!(\"{}\", Temp(23.456));", note: "println! 先透過 fmt 這套機制把值轉成文字,再交給 std::io 的標準輸出。格式化與輸出是分開的兩件事。" },
            { code: "}", note: "main 結束。" },
          ],
        },
      ],
      csharp: `.NET 這邊對應的是 ToString()(對上 Display)與 IFormattable / ToString(format, provider)(對上 fmt 的格式規格),而 Console.WriteLine 則對上 println!。差別是 C# 的 ToString() 每個物件都有預設實作(從 object 繼承,印出型別名),Rust 的 Display 沒有預設——不實作就不能用 {},編譯器直接擋。這也是為什麼 lesson1-7 那題的 #[derive(Debug)] 只給你 {:?},{} 仍然編譯失敗。`,
    },
    {
      id: "1-15-04",
      question: "需要一個「先進先出」的佇列(C# 的 Queue<T>),std::collections 裡對應的是?",
      options: [
        { text: "VecDeque<T>:雙端佇列,push_back 進、pop_front 出,兩端都是 O(1)" },
        { text: "Vec<T>,用 push 進、remove(0) 取出最前面" },
        { text: "LinkedList<T>,標準庫就是為佇列準備的" },
        { text: "BinaryHeap<T>,它會維持元素進來的先後順序" },
      ],
      answer: 0,
      explanation: `std::collections 收的是「要自己 use 的高階容器」,常用的有六個:HashMap、HashSet、BTreeMap、BTreeSet、VecDeque、BinaryHeap。對照 .NET 幾乎是一對一——
Dictionary<K,V> → HashMap;HashSet<T> → HashSet;SortedDictionary<K,V> → BTreeMap(有序,可以範圍查詢);SortedSet<T> → BTreeSet;Queue<T> → VecDeque;PriorityQueue<T> → BinaryHeap(注意 Rust 的是最大堆);Stack<T> → 直接用 Vec 的 push / pop;List<T> → Vec(住在 std::vec,在 prelude 裡)。
三個干擾寫法各有問題:Vec 的 remove(0) 要把後面全部往前搬,是 O(n),資料一多就痛;LinkedList 在 Rust 幾乎沒人用(指標跳躍對快取極不友善,官方文件自己都建議先考慮 VecDeque);BinaryHeap 是優先佇列,pop 出來的是「最大的」而不是「最早進來的」。`,
      walkthrough: [
        {
          label: "🔍 VecDeque 的典型用法(可正常編譯執行)",
          lines: [
            { code: "use std::collections::VecDeque;", note: "collections 底下的東西一律要自己引入,prelude 不含它們。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let mut queue = VecDeque::new();", note: "建立空佇列,型別由後面的 push 推斷。" },
            { code: "    queue.push_back(\"first\");", note: "從尾端進隊,對應 C# 的 Enqueue。" },
            { code: "    queue.push_back(\"second\");", note: "再進一個,此時內容是 [first, second]。" },
            { code: "    queue.push_front(\"urgent\");", note: "VecDeque 比 Queue<T> 多這一手:也能從頭端插隊,內容變成 [urgent, first, second]。" },
            { code: "", note: "" },
            { code: "    while let Some(item) = queue.pop_front() {", note: "從頭端出隊,對應 C# 的 Dequeue。pop_front 回傳 Option,空了就是 None,迴圈自然結束——不需要先檢查數量。" },
            { code: "        println!(\"{}\", item);", note: "依序印出 urgent、first、second。" },
            { code: "    }", note: "迴圈結束,佇列已清空。" },
            { code: "}", note: "main 結束,佇列離開作用域自動釋放。" },
          ],
          outro: "pop_front 回傳 Option 而不是丟例外,是 Rust 集合 API 的通則:Vec 的 pop、HashMap 的 get 也都是 Option。空集合不是錯誤,是一種正常狀態。",
        },
      ],
      csharp: `C# 的 Queue<T>.Dequeue() 在空佇列上丟 InvalidOperationException,所以你得記得先問 Count,或改用 TryDequeue(out var x)。Rust 直接讓 pop_front() 回傳 Option<T>,「可能沒有」這件事寫在型別裡,編譯器強迫你處理——TryDequeue 那套模式在 Rust 是預設,不是選配。`,
    },
    {
      id: "1-15-05",
      question: "巢狀 use 的展開。以下這段等於幾行獨立的 use?",
      questionCode: "use std::{\n    collections::HashMap,\n    fs::File,\n    io::{Read, Write},\n};",
      options: [
        { text: "四行:std::collections::HashMap、std::fs::File、std::io::Read、std::io::Write" },
        { text: "三行:大括號裡每一個逗號分隔的項目算一行,io 那組算一項" },
        { text: "一行:等於把整個 std 引進來" },
        { text: "語法錯誤:大括號只能出現在路徑的最後一層,不能巢狀" },
      ],
      answer: 0,
      explanation: `大括號是「共同前綴的縮寫」,而且可以一層包一層。展開規則很機械:把外層前綴依序貼到每個項目前面,遇到內層大括號就再展開一次。所以 io::{Read, Write} 展開成 std::io::Read 與 std::io::Write 兩行,總共四行。
lesson1-14 已經看過單層的 use std::io::{self, Write};,這裡只是同一個語法多疊幾層。三個誤解值得點名:大括號裡的每一項不一定對應一行(內層還能再展開);這段完全沒有把「整個 std」引進來,只引入指名的四個名字(要引整包得寫 * 萬用字元);至於巢狀合法性——這是標準語法,rustfmt 甚至會主動幫你收攏成這種形狀。
實務建議:std、外部 crate、自己的 crate 分三段寫,同一段裡收成一組巢狀 use,是社群最常見的排版。`,
      walkthrough: [
        {
          label: "🔍 巢狀寫法怎麼拆",
          lines: [
            { code: "use std::{", note: "外層共同前綴是 std,底下每一項都會被貼上這個前綴。" },
            { code: "    collections::HashMap,", note: "貼上前綴後是 std::collections::HashMap。" },
            { code: "    fs::File,", note: "貼上前綴後是 std::fs::File。" },
            { code: "    io::{Read, Write},", note: "這一項自己又是一組大括號,共同前綴變成 std::io,底下兩個名字各展開一次。" },
            { code: "};", note: "巢狀 use 結束,整段總共引入四個名字。" },
          ],
        },
        {
          label: "🔍 完全等價的展開寫法",
          lines: [
            { code: "use std::collections::HashMap;", note: "第一個名字。" },
            { code: "use std::fs::File;", note: "第二個名字。" },
            { code: "use std::io::Read;", note: "第三個名字。Read 是 trait,引入它才能對 File 呼叫 read_to_string。" },
            { code: "use std::io::Write;", note: "第四個名字,Write 同樣是 trait。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點,證明兩種寫法可以直接互換。" },
            { code: "    let mut counts: HashMap<&str, i32> = HashMap::new();", note: "用上第一個名字。型別標註寫在這裡是因為下面只插入一筆,讓意圖更清楚。" },
            { code: "    counts.insert(\"lines\", 1);", note: "插入一筆資料。" },
            { code: "", note: "" },
            { code: "    let mut f = File::create(\"demo.txt\").expect(\"建立失敗\");", note: "用上第二個名字。create 會建立(或覆寫)檔案,回傳 Result。" },
            { code: "    f.write_all(b\"hello\").expect(\"寫入失敗\");", note: "write_all 來自 Write trait——沒有那行 use std::io::Write; 這個方法就叫不到。b\"hello\" 是位元組字串字面值。" },
            { code: "", note: "" },
            { code: "    let mut s = String::new();", note: "準備讀取用的緩衝區。" },
            { code: "    File::open(\"demo.txt\").expect(\"開啟失敗\").read_to_string(&mut s).expect(\"讀取失敗\");", note: "read_to_string 來自 Read trait,同樣要那行 use 才叫得到——四個引入的名字到這裡全部用上了。" },
            { code: "", note: "" },
            { code: "    println!(\"{:?} / {}\", counts, s);", note: "印出 {\"lines\": 1} / hello,確認程式真的跑得起來(會在工作目錄留下 demo.txt)。" },
            { code: "}", note: "main 結束,兩個檔案控制代碼都已在各自的運算式結束時關閉。" },
          ],
          outro: "兩種寫法產出的執行檔完全相同。選哪種純粹是排版偏好——引入的東西一多,巢狀版本明顯好讀。",
        },
      ],
      csharp: `C# 沒有對應的縮寫語法,using 一行就是一個命名空間,要引入五個就寫五行(C# 10 之後可以集中到 GlobalUsings.cs 用 global using,但仍然是一行一個)。另一個差異藏在 io::{Read, Write}:C# 的 using 只影響「找得到型別名」,Rust 的 use 對 trait 還多一層意義——trait 不在作用域內,它的方法就呼叫不到,這是下一題的主角。`,
    },
    {
      id: "1-15-06",
      question: "開檔要 use std::fs,讀內容卻要 use std::io::Read。為什麼分成兩個模組?",
      questionCode: "use std::fs::File;\nuse std::io::Read;\n\nfn main() {\n    let mut f = File::open(\"config.toml\").expect(\"開不起來\");\n    let mut s = String::new();\n    f.read_to_string(&mut s).expect(\"讀不到\");\n    println!(\"{}\", s);\n}",
      options: [
        { text: "fs 放「檔案系統的實體」(File、目錄、中繼資料),io 放「輸入輸出的行為」;Read/Write 是 trait,File 只是實作者之一,而 trait 的方法要在 trait 進入作用域後才叫得到" },
        { text: "歷史包袱而已,兩個模組的內容其實可以互換" },
        { text: "read_to_string 是 File 的固有方法,那行 use 只是為了消掉編譯警告" },
        { text: "io 專門負責主控台輸入輸出,fs 專門負責檔案,兩者互不相干" },
      ],
      answer: 0,
      explanation: `這個切法是 std 的設計核心:io 定義「能讀」「能寫」這兩種能力(Read / Write 兩個 trait),fs 提供「檔案系統」這個具體世界(File、read_to_string、create_dir_all、metadata)。File 實作了 Read 與 Write,但實作者不只它——TcpStream(來自 std::net)、Stdin、甚至 &[u8] 都實作 Read。因此一個吃 impl Read 的函式,可以同時處理檔案、網路連線與記憶體中的資料,完全不用改。
所以「io 只管主控台」是錯的:主控台只是 io 的其中一個實作。而「read_to_string 是 File 的固有方法」也不對——把 use std::io::Read; 那行刪掉就會看到 error[E0599]: no method named \`read_to_string\` found,編譯器還會提示 items from traits can only be used if the trait is in scope。這不是警告,是硬錯誤。
順帶一提:如果只是要把整個檔案讀成字串,std 有現成的一行版本 std::fs::read_to_string("config.toml"),連 Read 都不用引入。上面那種寫法是為了示範 trait 與型別的分工。`,
      walkthrough: [
        {
          label: "🔍 逐行說明(可正常編譯執行)",
          lines: [
            { code: "use std::fs::File;", note: "引入「檔案」這個型別。fs 管的是檔案系統裡的實體。" },
            { code: "use std::io::Read;", note: "引入「能讀」這個 trait。少了這行,下面的 read_to_string 就叫不到——這是最常見的 std 新手坑。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let mut f = File::open(\"config.toml\").expect(\"開不起來\");", note: "open 回傳 Result<File, io::Error>,expect 在失敗時直接 panic 並印出訊息。要 mut 是因為讀取會推進檔案內部的游標。" },
            { code: "    let mut s = String::new();", note: "準備一個空字串當接收緩衝區,內容會被塞進來所以要 mut。" },
            { code: "    f.read_to_string(&mut s).expect(\"讀不到\");", note: "這個方法來自 Read trait,不是 File 自己的。以可變借用把 s 交出去,讓它把檔案內容接上去。" },
            { code: "    println!(\"{}\", s);", note: "印出讀到的內容。" },
            { code: "}", note: "main 結束,f 離開作用域時檔案控制代碼自動關閉——不需要 close,也沒有忘記關的可能。" },
          ],
          outro: "檔案自動關閉這件事來自 Drop trait(lesson2-3 與補充教材會深入)。std 的資源管理一律靠這個機制,不靠使用者記得收尾。",
        },
      ],
      csharp: `.NET 把這兩件事都放在 System.IO:File、FileStream、StreamReader 全在同一個命名空間,而「能讀」則是 Stream 這個抽象基底類別。差別在繼承 vs trait——C# 要當 Stream 就得繼承 Stream,Rust 的 &[u8] 這種既有型別也能實作 Read,不用改動型別本身。另外 C# 需要 using (var f = File.Open(...)) 才保證關檔,Rust 的 f 離開作用域就關,沒有這個語法也沒有忘記寫的風險。`,
    },
    {
      id: "1-15-07",
      question: "命令列參數。以 cargo run -- alpha beta 執行以下程式,args 的內容是?",
      questionCode: "use std::env;\n\nfn main() {\n    let args: Vec<String> = env::args().collect();\n    println!(\"{:?}\", args);\n\n    match env::var(\"MY_TOKEN\") {\n        Ok(v) => println!(\"token = {}\", v),\n        Err(_) => println!(\"沒有設定 MY_TOKEN\"),\n    }\n}",
      options: [
        { text: "三個元素:第 0 個是執行檔路徑,alpha 與 beta 排在後面——真正的參數要從索引 1 開始取" },
        { text: "兩個元素:alpha、beta" },
        { text: "一個元素:整串命令列被當成一個字串" },
        { text: "空的:命令列參數要用 env::var 讀" },
      ],
      answer: 0,
      explanation: `std::env::args() 回傳的第一個項目是「這支程式被呼叫的名字」(通常是執行檔路徑),這是 C 語言 argv[0] 的傳統,Rust 照單全收。所以拿參數時常見的寫法是 env::args().skip(1),或 args.get(1)。
這是 C# 開發者最容易踩的一格:C# 的 Main(string[] args) 已經幫你把執行檔路徑拿掉了,索引 0 就是第一個真參數。直接把 C# 的習慣搬過來,會拿到一個看起來像路徑的「參數」。
另外兩個模組成員也值得記住:env::var("MY_TOKEN") 讀環境變數,回傳 Result 而不是 null(沒設定就是 Err);env::current_dir() 拿工作目錄。至於「參數要用 env::var 讀」的說法,是把兩件事混在一起了——var 讀的是環境變數,跟命令列參數不是同一回事。
真的要做 CLI,實務上不會手刻:用 clap crate(對應 C# 的 System.CommandLine),自動處理旗標、預設值與 --help。`,
      walkthrough: [
        {
          label: "🔍 逐行說明(可正常編譯執行)",
          lines: [
            { code: "use std::env;", note: "引入模組本身而不是個別函式——env::args() 這種讀法比單獨一個 args() 清楚得多。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。注意 Rust 的 main 不收參數,參數一律從 env 拿。" },
            { code: "    let args: Vec<String> = env::args().collect();", note: "args() 回傳的是迭代器,collect() 把它收集成 Vec。左邊的型別標註是必要的,collect 需要知道要收集成什麼容器。" },
            { code: "    println!(\"{:?}\", args);", note: "用 Debug 格式印出整個 Vec,結果類似 [\"target/debug/demo\", \"alpha\", \"beta\"]——第 0 個是執行檔路徑。" },
            { code: "", note: "" },
            { code: "    match env::var(\"MY_TOKEN\") {", note: "讀環境變數。回傳的是 Result 而不是可能為 null 的字串,所以必須明確處理兩種情況。" },
            { code: "        Ok(v) => println!(\"token = {}\", v),", note: "有設定:v 是變數的值。" },
            { code: "        Err(_) => println!(\"沒有設定 MY_TOKEN\"),", note: "沒設定,或內容不是合法 UTF-8,都走這裡。底線表示不在意錯誤細節。" },
            { code: "    }", note: "match 結束。" },
            { code: "}", note: "main 結束。" },
          ],
          outro: "cargo run 後面那個單獨的 -- 是給 cargo 看的分隔符:它之後的東西不給 cargo,原封不動傳給你的程式。",
        },
      ],
      csharp: `對照 System.Environment:GetCommandLineArgs() 才是含執行檔路徑的版本(等同 env::args()),而 Main(string[] args) 的 args 已經去掉第一項——這個落差是搬家時最容易漏的細節。Environment.GetEnvironmentVariable("MY_TOKEN") 找不到時回傳 null,Rust 回傳 Err;差別在於那個 null 可以一路傳下去直到某處炸開,Rust 逼你在拿到的當下就決定怎麼辦。`,
    },
    {
      id: "1-15-08",
      question: "要組出跨平台的檔案路徑 data/config/app.toml,正確的做法是?",
      options: [
        { code: "use std::path::PathBuf;\n\nlet mut p = PathBuf::from(\"data\");\np.push(\"config\");\np.push(\"app.toml\");" },
        { code: "let p = format!(\"{}/{}/{}\", \"data\", \"config\", \"app.toml\");" },
        { code: "let p = \"data\".to_string() + \"\\\\\" + \"config\" + \"\\\\\" + \"app.toml\";" },
        { code: "let p = std::path::Path::new(\"data\") + \"/config\" + \"/app.toml\";" },
      ],
      answer: 0,
      explanation: `std::path 提供一組型別:Path 是借用的路徑(對應 &str),PathBuf 是有所有權、可以增長的路徑(對應 String)。這組關係跟 lesson1-6 學的 &str 與 String 完全一樣,連方法名都呼應——push 之於 PathBuf,就像 push_str 之於 String。
用 PathBuf 的好處不只是分隔符:它還處理絕對路徑覆寫(push 一個絕對路徑會直接取代整條)、Windows 的磁碟機前綴,以及「作業系統的檔名不保證是合法 UTF-8」這件事(這也是為什麼 Path 不是 str 的別名)。
三個錯誤寫法各自的問題:硬寫反斜線的版本在 Linux 與 macOS 直接壞掉,而且反斜線在 Rust 字串裡還得跳脫,可讀性極差;用 + 串接 Path 的版本根本編不過——Path 沒有實作 Add,而且它是未定大小的型別,連放進變數都不行。
至於用 format! 以斜線串接:它在 Windows 大多數情況下確實能跑(Win32 API 接受正斜線),但你會失去 join 對絕對路徑、UNC 路徑與非 UTF-8 檔名的處理,而且拿到的是 String,傳給需要 &Path 的 API 時還得再轉一手——沒有任何理由不用 PathBuf。`,
      walkthrough: [
        {
          label: "✅ 正確寫法",
          lines: [
            { code: "use std::path::PathBuf;", note: "引入有所有權的路徑型別。Path(借用版)通常不用特地引入,它多半以 &Path 的形式出現在函式簽名裡。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let mut p = PathBuf::from(\"data\");", note: "從一個字串起頭。要 mut 是因為接下來會往裡面加東西。" },
            { code: "    p.push(\"config\");", note: "接上一層,PathBuf 自己決定該插入哪種分隔符——Windows 用反斜線,其他平台用斜線。" },
            { code: "    p.push(\"app.toml\");", note: "再接檔名,此時路徑完成。" },
            { code: "", note: "" },
            { code: "    println!(\"{}\", p.display());", note: "路徑不保證是合法 UTF-8,所以 PathBuf 沒有實作 Display;要印出來得呼叫 display(),它回傳一個可以安全顯示的包裝。" },
            { code: "    println!(\"{:?}\", p.extension());", note: "順帶示範:extension() 拿副檔名,回傳 Option——沒有副檔名不是錯誤,是 None。" },
            { code: "}", note: "main 結束。" },
          ],
          outro: "也有一行版本:let p = PathBuf::from(\"data\").join(\"config\").join(\"app.toml\");——join 回傳新的 PathBuf 適合串接,push 就地修改適合在迴圈裡累積。",
        },
        {
          label: "❌ 三個錯誤寫法錯在哪",
          lines: [
            { code: "let p = format!(\"{}/{}/{}\", \"data\", \"config\", \"app.toml\");", note: "編得過也大多跑得動,但拿到的是 String 而不是 PathBuf,失去 join 對絕對路徑、UNC 路徑與非 UTF-8 檔名的處理,傳給吃 &Path 的 API 還要再轉一手。" },
            { code: "let p = \"data\".to_string() + \"\\\\\" + \"config\" + \"\\\\\" + \"app.toml\";", note: "把 Windows 的反斜線寫死,在 Linux 與 macOS 上這整串會被當成「一個含有反斜線的檔名」,檔案永遠找不到。" },
            { code: "let p = std::path::Path::new(\"data\") + \"/config\" + \"/app.toml\";", note: "⛔ 編譯失敗:cannot add `&str` to `&Path`。Path 沒有實作 std::ops::Add,路徑不是字串,不能用 + 串起來。" },
          ],
        },
        {
          label: "🔧 去糖後(編譯器眼中的樣子)",
          intro: "錯誤訊息 cannot add `&str` to `&Path` 裡沒有出現 trait 的名字,但它講的就是 trait:",
          lines: [
            { code: "Path::new(\"data\") + \"/config\"", note: "你寫的運算式。" },
            { code: "", note: "" },
            { code: "// 編譯器展開成:", note: "+ 從來不是內建語法,而是一次方法呼叫。" },
            { code: "std::ops::Add::add(Path::new(\"data\"), \"/config\")", note: "於是問題變成:&Path 有沒有實作 Add<&str>?" },
            { code: "", note: "" },
            { code: "// 標準庫對 &Path 沒有這個實作,對 String 才有:", note: "同樣一個 + ,能不能用完全取決於有沒有對應的 impl。" },
            { code: "impl Add<&str> for String { type Output = String; /* … */ }", note: "所以 String + &str 合法;而 Path 刻意不提供,因為路徑串接要處理分隔符與絕對路徑覆寫,不是單純的字串相接——那正是 push / join 存在的理由。" },
          ],
          outro: "同一個模式在 lesson1-11 的泛型加法題出現過:運算子背後都是 trait,「這個型別能不能用 +」等於「有沒有對應的 impl Add」。",
        },
      ],
      csharp: `對應 System.IO.Path:Path.Combine("data", "config", "app.toml") 就是 PathBuf 的 join。心智模型幾乎一樣,但 Rust 多走一步——C# 的路徑就是 string,任何字串都能傳給檔案 API;Rust 用 Path / PathBuf 這組獨立型別把「這是路徑」寫進型別系統,順便處理了 string 表達不了的事實:作業系統的檔名不保證是 UTF-8(這也是 p.display() 存在的原因)。`,
    },
    {
      id: "1-15-09",
      question: "量測經過時間。Instant 與 SystemTime 的差別是?",
      questionCode: "use std::thread;\nuse std::time::{Duration, Instant};\n\nfn main() {\n    let start = Instant::now();\n    thread::sleep(Duration::from_millis(150));\n    let elapsed = start.elapsed();\n\n    println!(\"{:?}\", elapsed);\n    println!(\"{} ms\", elapsed.as_millis());\n}",
      options: [
        { text: "Instant 是單調時鐘,只能拿來量「經過多久」,不能轉成日曆時間;要日曆時間得用 SystemTime,而它可能因為對時而往回跳" },
        { text: "兩者功能相同,只是命名習慣不同" },
        { text: "Instant 是 UTC 時間,SystemTime 是本地時間" },
        { text: "Instant 的精度只到秒,SystemTime 到奈秒" },
      ],
      answer: 0,
      explanation: `std::time 只有三個主角:Duration(一段長度)、Instant(單調時鐘上的一個時間點)、SystemTime(系統日曆時鐘上的一個時間點)。
Instant 的「單調」是關鍵保證:它只會往前走,不受使用者改時間或 NTP 對時影響,所以量測耗時一定是正數。代價是它沒有意義可言——你無法把 Instant 轉成「2026 年 9 月 14 日」,它只能跟另一個 Instant 相減。SystemTime 反過來:能對應到真實日曆(以 UNIX_EPOCH 為基準),但可能被往回調,所以它的 duration_since 回傳的是 Result 而不是 Duration。兩者都是奈秒級精度,跟 UTC 或本地時間也都無關——那是格式化的事。
這裡要標出一條 std 的邊界:std 沒有日期時間的「格式化」與「時區」。沒有 ToString("yyyy-MM-dd"),沒有月份、沒有星期幾。要做這些事得用 chrono 或 time crate。std::time 的定位只是「量時間」,不是「處理日期」。`,
      walkthrough: [
        {
          label: "🔍 逐行說明(可正常編譯執行)",
          lines: [
            { code: "use std::thread;", note: "引入執行緒模組,這裡只用它的 sleep。" },
            { code: "use std::time::{Duration, Instant};", note: "巢狀 use,一行引入兩個型別。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let start = Instant::now();", note: "記下起點。這個值本身沒有日曆意義,只是單調時鐘上的一個刻度。" },
            { code: "    thread::sleep(Duration::from_millis(150));", note: "讓目前的執行緒停 150 毫秒。Duration 是「長度」不是「時間點」,所以用 from_millis 這種建構函式產生。" },
            { code: "    let elapsed = start.elapsed();", note: "等同 Instant::now() - start,回傳一個 Duration。因為 Instant 單調,這個值保證不會是負的。" },
            { code: "", note: "" },
            { code: "    println!(\"{:?}\", elapsed);", note: "Duration 的 Debug 輸出會自動選單位,印出類似 150.3ms。" },
            { code: "    println!(\"{} ms\", elapsed.as_millis());", note: "要拿數字就用 as_millis / as_secs / as_secs_f64,各自回傳整數或浮點數。" },
            { code: "}", note: "main 結束。" },
          ],
          outro: "要日曆時間就換成 SystemTime::now(),再用 duration_since(UNIX_EPOCH) 拿到自 1970 年起算的秒數。注意它回傳 Result——系統時鐘被往回調過的話會是 Err。",
        },
      ],
      csharp: `這一組幾乎是 .NET 的鏡像:Instant ↔ Stopwatch(同樣是單調的高解析度計時器)、SystemTime ↔ DateTime.UtcNow、Duration ↔ TimeSpan。Rust 把「不要用 DateTime.Now 量效能」這條 .NET 老生常談直接寫進型別系統——Instant 根本無法被格式化成日期,想犯這個錯都不行。真正的落差在另一頭:.NET 的 DateTime 自帶時區、曆法與格式化字串,Rust std 完全沒有,那是 chrono crate 的地盤。`,
    },
    {
      id: "1-15-10",
      question: "排序浮點數。以下程式碼的結果是?",
      questionCode: "fn main() {\n    let mut xs = vec![3.2, 1.5, 2.8];\n    xs.sort();\n    println!(\"{:?}\", xs);\n}",
      options: [
        { text: "編譯錯誤:the trait bound `{float}: Ord` is not satisfied——浮點數只實作 PartialOrd,因為 NaN 跟任何值都比不出大小,構不成全序" },
        { text: "正常印出 [1.5, 2.8, 3.2]" },
        { text: "執行期 panic:浮點數比較必須自己提供比較函式" },
        { text: "編譯錯誤:vec! 巨集不接受浮點數字面值" },
      ],
      answer: 0,
      explanation: `std::cmp 定義了四個比較 trait,分成兩層:PartialEq / PartialOrd 是「部分」的,Eq / Ord 是「完全」的。差別就在 NaN——0.0/0.0 產生的 NaN 既不等於自己,也不大於或小於任何數。有了這種值,f64 就無法構成全序,所以標準庫只給它 PartialOrd,不給 Ord。
錯誤訊息裡的 {float} 是編譯器對「型別還沒定案的浮點字面值」的稱呼——這裡最後會定為 f64,但在報錯的當下還沒定案。而 sort() 的簽名要求元素具備 Ord(排序演算法必須假設任兩個元素都能分出先後,否則結果無定義),於是 Vec<f64> 呼叫 sort() 直接編譯失敗。這不是執行期問題,編譯器在你跑之前就擋下來了。
解法有兩個:sort_by(|a, b| a.partial_cmp(b).unwrap())——語意是「我保證沒有 NaN,有的話就 panic」;或 sort_by(f64::total_cmp),它用 IEEE 754 的全序規則處理 NaN,不會 panic,是現在比較推薦的寫法。
順帶記住 std::cmp 的另外兩個常客:Ordering(Less / Equal / Greater 這個 enum,是所有比較函式的回傳型別)以及 cmp::min / cmp::max。至於 vec! 不接受浮點數的說法完全沒這回事,錯誤訊息也明確指向 Ord。`,
      walkthrough: [
        {
          label: "❌ 題目程式碼(無法編譯)",
          lines: [
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let mut xs = vec![3.2, 1.5, 2.8];", note: "建立 Vec<f64>。浮點數字面值預設就是 f64,這行完全合法。" },
            { code: "    xs.sort();", note: "⛔ 編譯失敗:the trait bound `{float}: Ord` is not satisfied。{float} 是編譯器對「還沒定案的浮點字面值」的寫法(最後會是 f64);sort 要求元素具備全序,而浮點數因為有 NaN 只能提供 PartialOrd。" },
            { code: "    println!(\"{:?}\", xs);", note: "上一行已經失敗,這行不會被檢查。" },
            { code: "}", note: "main 結束。" },
          ],
        },
        {
          label: "✅ 正確寫法",
          lines: [
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let mut xs = vec![3.2, 1.5, 2.8];", note: "同樣的 Vec<f64>,資料沒變。" },
            { code: "    xs.sort_by(|a, b| a.partial_cmp(b).unwrap());", note: "改動處:自己提供比較函式。partial_cmp 回傳 Option<Ordering>,遇到 NaN 會是 None;unwrap 等於宣告「資料裡不會有 NaN,有的話請直接 panic」。" },
            { code: "    println!(\"{:?}\", xs);", note: "印出 [1.5, 2.8, 3.2]。" },
            { code: "", note: "" },
            { code: "    let mut ys = vec![3.2, f64::NAN, 1.5];", note: "刻意混進一個 NaN,示範另一種解法。" },
            { code: "    ys.sort_by(f64::total_cmp);", note: "total_cmp 依 IEEE 754 的全序規則比較,NaN 會被排到尾端,完全不會 panic——資料來源不可控時選這個。" },
            { code: "    println!(\"{:?}\", ys);", note: "印出排好的結果,NaN 落在最後。" },
            { code: "}", note: "main 結束。" },
          ],
        },
        {
          label: "🔧 去糖後(編譯器眼中的樣子)",
          intro: "你只寫了 xs.sort(),錯誤訊息卻在講 Ord。那個字是從方法簽名來的:",
          lines: [
            { code: "xs.sort();", note: "你寫的這一行,看不到任何 trait。" },
            { code: "", note: "" },
            { code: "// 這個方法在標準庫裡的簽名是:", note: "sort 定義在 [T](切片)上,而且帶著一條約束。" },
            { code: "impl<T> [T] {", note: "所有切片共用的方法都在這裡,Vec 透過 Deref 借用成切片才叫得到 sort。" },
            { code: "    pub fn sort(&mut self) where T: Ord { /* … */ }", note: "關鍵是 where T: Ord——「元素必須具備全序」。編譯器檢查 T = f64 是否滿足這條約束,發現不滿足,於是報 the trait bound `{float}: Ord` is not satisfied。" },
            { code: "}", note: "簽名結束。" },
            { code: "", note: "" },
            { code: "// 而標準庫對浮點數只給到這裡:", note: "少了 Ord 這一層。" },
            { code: "impl PartialOrd for f64 { /* … */ }", note: "有:任兩個值「可能」比得出大小。" },
            { code: "// impl Ord for f64 —— 不存在", note: "沒有:NaN 讓 f64 構不成全序,所以標準庫拒絕提供這個實作。錯誤訊息裡的 Ord 就是指這個缺席的實作。" },
          ],
          outro: "這是 Rust 錯誤訊息的典型形狀:它報的是「方法簽名上的約束沒被滿足」,而那條約束你從來沒寫過。看到 the trait bound X: Y is not satisfied,第一件事是去查那個方法的簽名,約束一定寫在 where 子句或泛型參數上。",
        },
      ],
      csharp: `C# 的 List<double>.Sort() 編得過也跑得動,因為 double 實作了 IComparable<double>,而它對 NaN 的處理是 Comparer<double>.Default 定下的一條約定(NaN 排最前面)——多數人不知道這條規則存在,也不知道自己依賴了它。Rust 選擇不替你決定:PartialOrd 與 Ord 分成兩個 trait,把「這種型別有沒有全序」變成編譯期就得面對的問題。代價是多打幾個字,回報是排序結果不會依賴你沒讀過的文件。`,
    },
    {
      id: "1-15-11",
      question: "運算子重載。以下的 a + b 之所以能編譯,是因為?",
      questionCode: "use std::ops::Add;\n\n#[derive(Debug, Clone, Copy)]\nstruct Money {\n    cents: i64,\n}\n\nimpl Add for Money {\n    type Output = Money;\n\n    fn add(self, other: Money) -> Money {\n        Money { cents: self.cents + other.cents }\n    }\n}\n\nfn main() {\n    let a = Money { cents: 150 };\n    let b = Money { cents: 250 };\n    println!(\"{:?}\", a + b);\n}",
      options: [
        { text: "+ 不只是內建語法,它對應 std::ops::Add trait;為 Money 實作 Add,就等於為它定義了 +" },
        { text: "因為 Money 是 Copy,Copy 型別之間可以直接相加" },
        { text: "因為 derive(Debug) 順便生成了運算子實作" },
        { text: "Rust 對所有欄位都是數值的 struct 自動提供逐欄位相加" },
      ],
      answer: 0,
      explanation: `std::ops 把每個運算子對應到一個 trait:+ 是 Add、- 是 Sub、* 是 Mul、+= 是 AddAssign、[] 是 Index、* 解參考是 Deref。你寫 a + b,編譯器就去找 Add::add(a, b);找不到實作就報 cannot add。
所以運算子在 Rust 不是「內建型別的特權」,而是一組公開的 trait,誰都能實作。type Output = Money; 那行是關聯型別,說明「相加之後得到什麼」——它不一定要跟輸入同型別,例如 Duration + Instant 得到的是 Instant。
三個干擾說法都指向同一個誤解「編譯器會自動幫我做」:Copy 只管「賦值時要複製還是搬移」,跟運算子毫無關係;derive 只能生成它認得的那幾個 trait(Debug、Clone、Copy、PartialEq、Default 等),Add 不在名單上;至於「逐欄位自動相加」——Rust 從不替你臆測語意,兩個 Money 相加是不是就該把 cents 加起來,只有你知道。
這一題在 lesson2-9 會再展開(泛型約束裡的 T: Add<Output = T>),現在只要記住「運算子背後是 trait」這個地圖位置。`,
      walkthrough: [
        {
          label: "🔍 逐行說明(可正常編譯執行)",
          lines: [
            { code: "use std::ops::Add;", note: "引入 + 對應的 trait。不 use 也行,那就得寫 impl std::ops::Add for Money。" },
            { code: "", note: "" },
            { code: "#[derive(Debug, Clone, Copy)]", note: "Debug 讓 {:?} 印得出來;Copy 讓 Money 賦值時複製而非搬移,這樣 a + b 之後 a 還能用。" },
            { code: "struct Money {", note: "定義金額型別。" },
            { code: "    cents: i64,", note: "用整數的「分」存錢,避免浮點誤差——這是處理金額的通則。" },
            { code: "}", note: "struct 定義結束。" },
            { code: "", note: "" },
            { code: "impl Add for Money {", note: "為 Money 實作 Add。沒寫泛型參數時預設是 Add<Money>,也就是「Money 加 Money」。" },
            { code: "    type Output = Money;", note: "關聯型別:宣告相加的結果是什麼型別。這裡兩個 Money 相加還是 Money。" },
            { code: "", note: "" },
            { code: "    fn add(self, other: Money) -> Money {", note: "注意是 self 不是 &self——Add 按值取用,所以上面才需要 Copy,否則 a 會在相加時被搬走。" },
            { code: "        Money { cents: self.cents + other.cents }", note: "真正的加法邏輯由你決定。沒有分號,這個運算式就是回傳值。" },
            { code: "    }", note: "方法結束。" },
            { code: "}", note: "impl 結束,從這一刻起 Money 之間可以用 + 了。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let a = Money { cents: 150 };", note: "一元五角。" },
            { code: "    let b = Money { cents: 250 };", note: "兩元五角。" },
            { code: "    println!(\"{:?}\", a + b);", note: "編譯器把這行翻譯成 Add::add(a, b),印出 Money { cents: 400 }。" },
            { code: "}", note: "main 結束。" },
          ],
        },
      ],
      csharp: `C# 的運算子重載是 public static Money operator +(Money a, Money b),寫在類別裡。單看這個例子兩邊差不多,差別在泛型:C# 到 .NET 7 才有 static abstract 介面成員(以及 INumber<T>),在那之前你沒辦法寫一個「對任何可相加型別都成立」的泛型方法;Rust 因為運算子本來就是 trait,從第一天起就能寫 fn sum<T: Add<Output = T>>(a: T, b: T) -> T。`,
    },
    {
      id: "1-15-12",
      question: "型別轉換。程式只實作了 From,為什麼 .into() 也能用?",
      questionCode: "struct Celsius(f64);\nstruct Fahrenheit(f64);\n\nimpl From<Celsius> for Fahrenheit {\n    fn from(c: Celsius) -> Self {\n        Fahrenheit(c.0 * 9.0 / 5.0 + 32.0)\n    }\n}\n\nfn main() {\n    let f: Fahrenheit = Celsius(100.0).into();\n    let g = Fahrenheit::from(Celsius(0.0));\n    println!(\"{} {}\", f.0, g.0);\n}",
      options: [
        { text: "標準庫有一條泛型實作:只要 U 實作了 From<T>,T 就自動得到 Into<U>——所以慣例是只寫 From,兩個方向都會有" },
        { text: "into 只是 from 的另一個名字,編譯器把它當同一個方法處理" },
        { text: "因為 Celsius 是 Copy,Copy 型別可以自動轉換成任何型別" },
        { text: "必須另外寫 impl Into<Fahrenheit> for Celsius,這段其實編譯不過" },
      ],
      answer: 0,
      explanation: `std::convert 是「型別轉換」的總部,四個主角成對出現:From / Into(一定成功)與 TryFrom / TryInto(可能失敗,回傳 Result)。
關鍵在標準庫裡那條 impl<T, U> Into<U> for T where U: From<T>——這是一條涵蓋所有型別的泛型實作(俗稱 blanket impl)。它的效果是:你只要實作 From 一個方向,Into 就免費附贈。反過來只實作 Into 不會得到 From,所以慣例永遠是實作 From。
兩者的使用時機不同:Fahrenheit::from(x) 明說目標型別,讀起來清楚;x.into() 讓編譯器從上下文推斷目標,所以左邊的 let f: Fahrenheit 型別標註不能省。而寫 API 時最常見的用法是當參數約束:fn new(name: impl Into<String>) 讓呼叫端傳 &str 或 String 都行。
順帶一提,失敗版本的 TryFrom 對應 C# 的 TryParse 那一族;lesson1-10 用過的 ? 自動轉換錯誤型別,靠的也是 From。至於 Copy——它跟型別轉換完全沒有關係。`,
      walkthrough: [
        {
          label: "🔍 逐行說明(可正常編譯執行)",
          lines: [
            { code: "struct Celsius(f64);", note: "攝氏溫度,用 newtype 包一個 f64——這樣攝氏與華氏在型別上就分得開,不會互相傳錯。" },
            { code: "struct Fahrenheit(f64);", note: "華氏溫度,同樣的手法。" },
            { code: "", note: "" },
            { code: "impl From<Celsius> for Fahrenheit {", note: "讀法是「為 Fahrenheit 實作『從 Celsius 來』」——方向是從尖括號裡的型別,轉到 for 後面的型別。" },
            { code: "    fn from(c: Celsius) -> Self {", note: "按值收下來源(轉換會消耗掉它)。Self 就是 Fahrenheit。" },
            { code: "        Fahrenheit(c.0 * 9.0 / 5.0 + 32.0)", note: "換算公式。c.0 取出 tuple struct 的第一個欄位。" },
            { code: "    }", note: "方法結束。" },
            { code: "}", note: "impl 結束。此刻兩個方向的轉換都已具備。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let f: Fahrenheit = Celsius(100.0).into();", note: "用的是 Into,來自標準庫那條泛型實作。左邊的型別標註不能省——編譯器要靠它才知道你想轉成什麼。" },
            { code: "    let g = Fahrenheit::from(Celsius(0.0));", note: "用 From 的寫法,目標型別寫在呼叫處,所以這裡不需要型別標註。" },
            { code: "    println!(\"{} {}\", f.0, g.0);", note: "印出 212 與 32,兩條路殊途同歸。" },
            { code: "}", note: "main 結束。" },
          ],
        },
      ],
      csharp: `C# 對應的是 implicit / explicit operator(以及轉換建構子):public static explicit operator Fahrenheit(Celsius c)。差別有兩層——一是 C# 的轉換運算子必須寫在其中一個型別的定義裡,Rust 的 From 是 trait,受孤兒規則約束但仍比較靈活;二是 C# 沒有「實作一個方向自動得到另一個方向」這種機制,implicit 與 explicit 得各寫各的。失敗版本則對應 int.TryParse 那一族,Rust 用 TryFrom 回傳 Result 而不是 bool 加 out 參數。`,
    },
    {
      id: "1-15-13",
      question: "要把 struct 的某個欄位「整個取出來,原地換成空值」,std 提供的正確工具是?",
      options: [
        { code: "let old = std::mem::take(&mut self.buffer);" },
        { code: "let old = self.buffer;" },
        { code: "let old = self.buffer.clone();\nself.buffer.clear();" },
        { code: "let old = unsafe { std::ptr::read(&self.buffer) };" },
      ],
      answer: 0,
      explanation: `std::mem 放的是「記憶體層級的搬動」:take(把值拿走、原地放 Default::default())、replace(把值拿走、原地放你指定的東西)、swap(兩個值互換)、size_of / align_of(型別佔多少空間)、drop(提前釋放)。
這一題的情境在 Rust 很常見:你只有 &mut self,所以不能把欄位搬出來(那會讓 self 處於「有個洞」的狀態,借用檢查器不允許)。mem::take 的做法是「同時放一個合法的值回去」,於是 self 從頭到尾都是完整的,編譯器就放行——前提是欄位的型別實作了 Default,Vec、String、HashMap 都有。
三個干擾寫法:直接搬移會得到 cannot move out of \`self.buffer\` which is behind a mutable reference,這是每個 Rust 開發者都會撞一次的錯誤;clone 加 clear 能跑,但白白複製了一整份資料,資料量大時就是實實在在的浪費;至於 std::ptr::read——它確實能「繞過」借用檢查,但那是 unsafe 的原始指標操作,這裡會造成同一份資料被釋放兩次(double free)。std::ptr 是補充教材 Unsafe Rust 的地盤,日常寫 Rust 不該碰到它。`,
      walkthrough: [
        {
          label: "✅ 正確寫法",
          lines: [
            { code: "struct Logger {", note: "一個累積訊息的型別,用來示範情境。" },
            { code: "    buffer: Vec<String>,", note: "訊息暫存區。Vec 實作了 Default(空 Vec),所以可以用 mem::take。" },
            { code: "}", note: "struct 定義結束。" },
            { code: "", note: "" },
            { code: "impl Logger {", note: "開始定義方法。" },
            { code: "    fn flush(&mut self) -> Vec<String> {", note: "只有可變借用,沒有所有權——這正是不能直接把欄位搬出來的原因。" },
            { code: "        std::mem::take(&mut self.buffer)", note: "把 buffer 的內容整個拿走當回傳值,同時原地塞一個空 Vec 回去。self 在這行前後都是完整的,借用檢查器滿意;而且沒有任何複製,只是搬動了指標。" },
            { code: "    }", note: "方法結束。" },
            { code: "}", note: "impl 結束。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let mut log = Logger { buffer: vec![\"a\".to_string(), \"b\".to_string()] };", note: "建立實例,裡面先放兩則訊息。" },
            { code: "    let taken = log.flush();", note: "取走訊息。" },
            { code: "    println!(\"{:?} / 剩下 {:?}\", taken, log.buffer);", note: "印出 [\"a\", \"b\"] / 剩下 [],證明內容被搬走而 log 本身仍可用。" },
            { code: "}", note: "main 結束。" },
          ],
          outro: "想換成別的值而不是預設值,就用 std::mem::replace(&mut self.buffer, Vec::with_capacity(16));——take 只是 replace 搭配 Default 的便利版本。",
        },
        {
          label: "❌ 三個錯誤寫法錯在哪",
          lines: [
            { code: "let old = self.buffer;", note: "⛔ 編譯失敗:cannot move out of `self.buffer` which is behind a mutable reference。搬走欄位會讓 self 殘缺,借用檢查器不接受。" },
            { code: "let old = self.buffer.clone();", note: "編得過,但把整個 Vec 連同裡面每個 String 都複製了一份——資料一多就是純粹的浪費。" },
            { code: "self.buffer.clear();", note: "承上,還得多寫一行把原本的清空,兩個步驟之間如果提前回傳就會出現不一致。" },
            { code: "let old = unsafe { std::ptr::read(&self.buffer) };", note: "繞過借用檢查,但沒有把原處標記成無效——old 與 self.buffer 現在指向同一塊堆積記憶體,兩者離開作用域時會釋放兩次,是典型的 double free。" },
          ],
        },
      ],
      csharp: `C# 裡這個動作是 var old = buffer; buffer = new List<string>();——兩行,而且中間那一瞬間有兩個參考指向同一個 List,靠的是 GC 幫你善後。Rust 沒有 GC,所以「同時只能有一個所有者」必須每一行都成立,mem::take 就是為了讓這個交換在單一步驟內完成。至於 std::mem::size_of,對應的比較接近 Marshal.SizeOf 或 unsafe 的 sizeof——在 C# 那是特殊需求,在 Rust 是公開且安全的函式。`,
    },
    {
      id: "1-15-14",
      question: "多執行緒共享計數器。這裡為什麼一定要用 Arc,不能用 Rc?",
      questionCode: "use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn main() {\n    let counter = Arc::new(Mutex::new(0));\n    let mut handles = vec![];\n\n    for _ in 0..5 {\n        let c = Arc::clone(&counter);\n        handles.push(thread::spawn(move || {\n            let mut n = c.lock().unwrap();\n            *n += 1;\n        }));\n    }\n\n    for h in handles {\n        h.join().unwrap();\n    }\n\n    println!(\"{}\", *counter.lock().unwrap());\n}",
      options: [
        { text: "Rc 的參考計數不是原子操作,因此它沒有實作 Send,編譯器直接擋下跨執行緒使用;Arc 用原子計數換取跨執行緒安全" },
        { text: "Rc 也可以,只是速度比較慢" },
        { text: "只有 Arc 提供 clone 方法,Rc 沒有" },
        { text: "Mutex 規定必須搭配 Arc,這是 API 的限制" },
      ],
      answer: 0,
      explanation: `std::sync 是「跨執行緒」的工具箱,std::thread 是「開執行緒」的入口,兩者總是一起出現:thread::spawn 開執行緒、join 等它結束;sync 提供 Arc(原子參考計數)、Mutex(互斥鎖)、RwLock(讀寫鎖)、mpsc(通道)。
Rc 與 Arc 的內部邏輯幾乎一樣,差別只在計數用不用原子指令。Rc 用普通加減,速度快但兩個執行緒同時改會漏算,導致提前釋放或記憶體洩漏;Arc 用原子指令,慢一點但安全。Rust 把這個差異編碼成 Send 這個標記 trait:Rc 沒有實作 Send,而 thread::spawn 要求閉包是 Send,所以把 Rc 搬進 spawn 會直接編譯失敗,錯誤訊息是 \`Rc<...>\` cannot be sent between threads safely。
所以「Rc 也可以,只是慢」剛好說反了——編譯器根本不給你這個選項。至於 clone:Rc 當然有 clone;而 Mutex 也沒有規定要配 Arc,單執行緒下 Mutex 可以獨立使用,是「要把它分享給多個執行緒」才需要 Arc 包一層。
記住這組拆分:Arc 解決「誰擁有它」,Mutex 解決「誰能改它」,兩個問題分開處理,所以才寫成 Arc<Mutex<T>>。細節在 lesson2-7 展開。`,
      walkthrough: [
        {
          label: "🔍 逐行說明(可正常編譯執行)",
          lines: [
            { code: "use std::sync::{Arc, Mutex};", note: "一行引入兩個工具:共享所有權與互斥鎖。" },
            { code: "use std::thread;", note: "引入執行緒模組。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let counter = Arc::new(Mutex::new(0));", note: "由內而外讀:Mutex 保護一個 i32,Arc 讓這個 Mutex 能被多個執行緒共同持有。" },
            { code: "    let mut handles = vec![];", note: "存放執行緒把手,等一下要逐一 join。" },
            { code: "", note: "" },
            { code: "    for _ in 0..5 {", note: "開五個執行緒。底線表示不需要迴圈變數。" },
            { code: "        let c = Arc::clone(&counter);", note: "關鍵一行:clone 的是 Arc 而不是裡面的資料,只讓參考計數加一。慣例寫成 Arc::clone(&x) 而非 x.clone(),讓讀的人一眼看出這是廉價的計數遞增。" },
            { code: "        handles.push(thread::spawn(move || {", note: "move 把 c 的所有權搬進閉包——新執行緒可能活得比 main 久,所以不能只借用。" },
            { code: "            let mut n = c.lock().unwrap();", note: "上鎖。lock 回傳 Result(前一個持鎖者 panic 的話會是 Err),unwrap 表示不處理這種情況。拿到的 n 是守衛,離開作用域自動解鎖。" },
            { code: "            *n += 1;", note: "透過守衛解參考,修改被保護的值。" },
            { code: "        }));", note: "閉包結束,n 在此離開作用域,鎖自動釋放——不需要 unlock,也不可能忘記。" },
            { code: "    }", note: "迴圈結束,五個執行緒都已啟動。" },
            { code: "", note: "" },
            { code: "    for h in handles {", note: "逐一取回把手。" },
            { code: "        h.join().unwrap();", note: "等該執行緒結束。不 join 的話 main 可能先結束,計數就不完整。" },
            { code: "    }", note: "迴圈結束,五個執行緒都跑完了。" },
            { code: "", note: "" },
            { code: "    println!(\"{}\", *counter.lock().unwrap());", note: "再上一次鎖讀出結果,穩定印出 5。" },
            { code: "}", note: "main 結束,Arc 計數歸零,Mutex 與裡面的值一起釋放。" },
          ],
        },
      ],
      csharp: `C# 這段會寫成 lock (obj) { counter++; } 或 Interlocked.Increment(ref counter),而共享物件本身不需要特別包裝——參考型別天生就能跨執行緒傳遞,GC 也早就是執行緒安全的。代價是:C# 不會阻止你把一個非執行緒安全的物件(例如 List<T> 或 Dictionary<K,V>)丟進 Task.Run 裡同時讀寫,那是執行期才會炸、而且很難重現的 bug。Rust 把這件事變成編譯錯誤——Send 與 Sync 兩個標記 trait 就是在回答「這東西能不能跨執行緒」,編譯器替你檢查。`,
    },
    {
      id: "1-15-15",
      question: "執行外部程式並取回輸出。Command 的 output()、status()、spawn() 差在哪?",
      questionCode: "use std::process::Command;\n\nfn main() {\n    let output = Command::new(\"git\")\n        .args([\"rev-parse\", \"--short\", \"HEAD\"])\n        .output()\n        .expect(\"git 跑不起來\");\n\n    let hash = String::from_utf8_lossy(&output.stdout);\n    println!(\"HEAD = {}\", hash.trim());\n}",
      options: [
        { text: "output() 等它跑完並把 stdout/stderr 收回來;status() 等它跑完但只拿結束碼,輸出直接流到終端機;spawn() 不等,立刻回傳子行程的把手讓你自己決定何時等" },
        { text: "三個完全等價,只是回傳型別不同" },
        { text: "output() 與 status() 都不會等待,只有 spawn() 會阻塞" },
        { text: "output() 只拿 stdout,status() 只拿 stderr,spawn() 兩者都拿" },
      ],
      answer: 0,
      explanation: `std::process 管的是「行程」:Command 用 builder 風格組裝要執行的東西(new 指定程式、args 給參數、env 設環境變數、current_dir 指定工作目錄),然後用三個方法之一收尾——這三個方法的差別就是「等不等」與「收不收輸出」。
output() 回傳 Output,裡面有 status、stdout、stderr 三個欄位,後兩者是 Vec<u8> 而不是 String——因為外部程式吐出來的位元組不保證是合法 UTF-8。所以才需要 String::from_utf8_lossy(把不合法的位元組換成替代字元)或 String::from_utf8(回傳 Result)。
另外兩個成員也順便記住:std::process::exit(1) 以指定的結束碼直接結束程式(注意它不會執行任何 Drop),以及 Stdio::piped() / Stdio::null() 用來控制子行程的輸入輸出要接到哪裡。
干擾說法裡最值得點名的是「output 只拿 stdout」:它兩個都拿,而 status() 是兩個都不拿(直接繼承父行程的終端機)。`,
      walkthrough: [
        {
          label: "🔍 逐行說明(可正常編譯執行)",
          lines: [
            { code: "use std::process::Command;", note: "引入行程建構器。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let output = Command::new(\"git\")", note: "指定要執行的程式。這裡不經過 shell,所以不會有 shell 展開或注入的問題。" },
            { code: "        .args([\"rev-parse\", \"--short\", \"HEAD\"])", note: "一次給多個參數。每個參數是獨立的字串,不需要自己處理引號跳脫。" },
            { code: "        .output()", note: "執行並等它結束,同時把 stdout 與 stderr 收集回來。回傳 Result——git 不存在或沒有執行權限就是 Err。" },
            { code: "        .expect(\"git 跑不起來\");", note: "失敗就 panic。注意這裡判斷的是「能不能啟動」,git 本身回傳非零結束碼仍算成功啟動,要另外看 output.status。" },
            { code: "", note: "" },
            { code: "    let hash = String::from_utf8_lossy(&output.stdout);", note: "stdout 是 Vec<u8>,因為外部程式的輸出不保證是合法 UTF-8。lossy 版本把不合法的位元組換成替代字元,不會失敗。" },
            { code: "    println!(\"HEAD = {}\", hash.trim());", note: "git 的輸出結尾有換行,trim 掉再印。" },
            { code: "}", note: "main 結束。" },
          ],
          outro: "只在意成功與否就換成 .status(),輸出會直接流到你的終端機;要一邊跑一邊處理輸出就用 .spawn(),搭配 Stdio::piped() 自己讀那條管線。",
        },
      ],
      csharp: `對應 System.Diagnostics.Process:Command 對上 ProcessStartInfo,output() 對上 RedirectStandardOutput = true 加 WaitForExit() 再讀 StandardOutput,spawn() 對上 Process.Start() 之後不等。兩個實質差異:一是 C# 的 Arguments 是一整串字串,你得自己處理引號與跳脫(經典的注入來源),Rust 的 args 是陣列,每個參數獨立傳給作業系統;二是 C# 拿到的是 string(已經假設某種編碼),Rust 給你原始位元組,要不要冒著資料損壞的風險轉成字串由你決定。`,
    },
    {
      id: "1-15-16",
      question: "自訂錯誤型別時,std::error::Error 扮演什麼角色?",
      questionCode: "use std::error::Error;\nuse std::fmt;\n\n#[derive(Debug)]\nstruct ParseError {\n    line: usize,\n}\n\nimpl fmt::Display for ParseError {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        write!(f, \"第 {} 行格式錯誤\", self.line)\n    }\n}\n\nimpl Error for ParseError {}\n\nfn main() -> Result<(), Box<dyn Error>> {\n    Err(Box::new(ParseError { line: 42 }))\n}",
      options: [
        { text: "它是一個 trait(介面),不是型別;實作它(前提是先有 Debug 與 Display)之後,你的錯誤就能裝進 Box<dyn Error>,也能被 ? 自動轉換" },
        { text: "它是一個 struct,所有自訂錯誤都要從它繼承" },
        { text: "它是一個 enum,列舉了標準庫定義的所有錯誤種類" },
        { text: "Rust 沒有統一的錯誤介面,錯誤一律用 String 表示" },
      ],
      answer: 0,
      explanation: `std::error 這個模組小得驚人:核心就只有一個 Error trait。它的定義大意是「凡是錯誤,都得能給機器看(Debug)、能給人看(Display),並且可以選擇性地指出自己的來源(source)」——所以 Debug 與 Display 是它的前置需求(supertrait),少一個就編譯不過。
有了這個共同介面,才有 Box<dyn Error> 這種「任何錯誤都裝得下」的容器,也才有 ? 的自動轉換:當函式回傳 Box<dyn Error> 時,任何實作了 Error 的具體錯誤都能被 ? 直接往上拋。上面的 impl Error for ParseError {} 之所以是空的,是因為 trait 的方法都有預設實作——你只要宣告「我是一個 Error」就夠了。
「繼承一個 struct」與「一個列舉全部錯誤的 enum」都是把 C# 的 Exception 心智模型硬套過來;而「一律用 String」則是新手常見的權宜做法,問題是呼叫端只能看字串,無法針對不同錯誤分別處理。
實務上這一套通常不手寫:應用程式用 anyhow(等同強化版的 Box<dyn Error>),函式庫用 thiserror(自動生成 Display 與 Error 實作)。lesson2-6 會展開。`,
      walkthrough: [
        {
          label: "🔍 逐行說明(可正常編譯執行)",
          lines: [
            { code: "use std::error::Error;", note: "引入錯誤的共同介面。" },
            { code: "use std::fmt;", note: "引入格式化模組,因為待會要實作 Display。" },
            { code: "", note: "" },
            { code: "#[derive(Debug)]", note: "Error 的前置需求之一。少了它下面的 impl Error 會直接編譯失敗。" },
            { code: "struct ParseError {", note: "自訂錯誤型別。它就是普通的 struct,沒有任何特殊地位。" },
            { code: "    line: usize,", note: "帶上出錯的行號——這正是自訂錯誤型別優於字串的地方,呼叫端可以拿到結構化的資訊。" },
            { code: "}", note: "struct 定義結束。" },
            { code: "", note: "" },
            { code: "impl fmt::Display for ParseError {", note: "Error 的另一個前置需求:錯誤訊息要能給人看。" },
            { code: "    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {", note: "跟前面幾題完全一樣的 Display 實作形狀。" },
            { code: "        write!(f, \"第 {} 行格式錯誤\", self.line)", note: "把結構化的欄位組成人看得懂的句子。" },
            { code: "    }", note: "方法結束。" },
            { code: "}", note: "impl 結束。" },
            { code: "", note: "" },
            { code: "impl Error for ParseError {}", note: "大括號是空的:Error 的方法(包括 source)都有預設實作,這一行只是宣告「ParseError 屬於錯誤這一類」。" },
            { code: "", note: "" },
            { code: "fn main() -> Result<(), Box<dyn Error>> {", note: "main 可以回傳 Result。Box<dyn Error> 是「任何錯誤」的容器,dyn 表示具體型別到執行期才知道。" },
            { code: "    Err(Box::new(ParseError { line: 42 }))", note: "回傳錯誤。程式會以非零結束碼結束,並用 Debug 格式把錯誤印到 stderr。" },
            { code: "}", note: "main 結束。" },
          ],
        },
      ],
      csharp: `對照 System.Exception:C# 要自訂錯誤就 class MyError : Exception——是繼承,而且所有錯誤共用一棵繼承樹。Rust 用 trait,ParseError 本身是獨立的 struct,只是「碰巧也實作了 Error」。兩個更根本的差異:一是 C# 的例外會自動往上拋直到有人接,Rust 的錯誤是普通的回傳值,不寫 ? 就不會往上走,函式簽名上看得見;二是 C# 的 Exception 自帶 StackTrace,Rust 的 Error 沒有——要堆疊資訊得靠 anyhow 這類 crate。`,
    },
    {
      id: "1-15-17",
      question: "std::borrow::Cow 是為了解決什麼問題?",
      questionCode: "use std::borrow::Cow;\n\nfn sanitize(input: &str) -> Cow<str> {\n    if input.contains(' ') {\n        Cow::Owned(input.replace(' ', \"_\"))\n    } else {\n        Cow::Borrowed(input)\n    }\n}\n\nfn main() {\n    println!(\"{}\", sanitize(\"hello world\"));\n    println!(\"{}\", sanitize(\"hello\"));\n}",
      options: [
        { text: "「大多數情況不必改、少數情況才要改」時,避免無謂的配置:不用改就借用原本的資料,真的要改時才複製一份" },
        { text: "它是一個執行緒安全的容器,用來在多執行緒間共享字串" },
        { text: "它是 Clone 的別名,寫起來比較短" },
        { text: "它讓 &str 變得可以就地修改" },
      ],
      answer: 0,
      explanation: `Cow 是 clone on write 的縮寫,它是一個只有兩個變體的 enum:Borrowed(借來的)與 Owned(自己的)。名字裡的 borrow 也點出了它的模組位置——std::borrow,這是少數在 .NET 裡找不到對應物的模組,因為它建立在「借用」這個 Rust 獨有的概念上。
它解決的是一個很具體的兩難:sanitize 這種函式,大部分輸入根本不需要改。如果簽名寫成 fn sanitize(input: &str) -> String,那每次呼叫都得複製一份,即使什麼都沒改;如果寫成回傳 &str,那有需要改的時候就無路可走了。Cow 讓同一個回傳型別同時表達兩種可能,呼叫端則幾乎無感——它實作了 Deref<Target = str>,所以可以直接當字串用(上面兩行 println! 完全沒有特別處理)。
其餘三個說法各自錯在:執行緒共享是 Arc 的工作;Cow 不是 Clone 的別名,它是 enum 而 Clone 是 trait;而 &str 仍然不能就地修改,Cow 是在「要改」的時候產生一份新的 String,不是讓借用變成可寫。
什麼時候該用它:寫函式庫、處理大量字串、而且「需要修改」是少數情況。一般應用程式碼直接回傳 String 通常就夠了,不必過早優化。`,
      walkthrough: [
        {
          label: "🔍 逐行說明(可正常編譯執行)",
          lines: [
            { code: "use std::borrow::Cow;", note: "引入這個 enum。std::borrow 裡還有 Borrow 與 ToOwned 兩個 trait,是 Cow 背後的機制。" },
            { code: "", note: "" },
            { code: "fn sanitize(input: &str) -> Cow<str> {", note: "回傳型別同時涵蓋兩種可能:借來的 &str,或新產生的 String。呼叫端不需要事先知道是哪一種。" },
            { code: "    if input.contains(' ') {", note: "判斷到底需不需要改。" },
            { code: "        Cow::Owned(input.replace(' ', \"_\"))", note: "需要改:replace 產生一個新的 String,包成 Owned 變體。這是唯一發生配置的路徑。" },
            { code: "    } else {", note: "不需要改的情況。" },
            { code: "        Cow::Borrowed(input)", note: "直接把傳進來的參考包成 Borrowed 變體交出去,一個位元組都沒有複製。" },
            { code: "    }", note: "if 運算式結束,兩條分支的型別都是 Cow<str>,所以能當回傳值。" },
            { code: "}", note: "函式結束。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    println!(\"{}\", sanitize(\"hello world\"));", note: "有空白,走 Owned 那條路,印出 hello_world。" },
            { code: "    println!(\"{}\", sanitize(\"hello\"));", note: "沒有空白,走 Borrowed 那條路,印出 hello——完全沒有配置記憶體。呼叫端的寫法兩者一模一樣。" },
            { code: "}", note: "main 結束。" },
          ],
          outro: "需要真的拿到 String 時呼叫 .into_owned():是 Owned 就直接交出裡面的值,是 Borrowed 才複製一份。",
        },
      ],
      csharp: `C# 沒有對應物,因為 .NET 的 string 是不可變且由 GC 管理的——你要嘛回傳新的 string(照樣配置,只是成本被 GC 攤平了),要嘛用 ReadOnlySpan<char> / ReadOnlyMemory<char> 自己處理生命週期。Cow 之所以在 Rust 可行,正是因為借用檢查器能保證「借來的那份」在使用期間一直有效——這是 C# 的型別系統表達不了的保證,所以這個模組在對照表上只能寫「Rust 獨有」。`,
    },
    {
      id: "1-15-18",
      question: "要寫一支呼叫 REST API、把回應的 JSON 反序列化成 struct 的程式。只靠 std 能做到多少?",
      options: [
        { text: "std::net 只給你 TCP/UDP socket;HTTP、JSON、async runtime 標準庫通通沒有,得從 crates.io 拿(reqwest / serde_json / tokio)" },
        { text: "std::net::HttpClient 可以直接發請求,JSON 則要靠外部 crate" },
        { text: "std 有 JSON(std::json)但沒有 HTTP" },
        { text: "全部都有,只是預設關閉,要在 Cargo.toml 開啟對應的 feature" },
      ],
      answer: 0,
      explanation: `這是 .NET 開發者最大的心理落差,也是這一課最該記住的一件事:std 很小,而且是刻意的。
std::net 只有最底層的 TcpListener、TcpStream、UdpSocket、SocketAddr——就是作業系統 socket 的安全包裝,沒有 HTTP、沒有 TLS、沒有 URL 解析。同理,std 沒有 JSON、沒有日期格式化、沒有正規表示式、沒有 async 執行器(語言有 async/await 語法,但誰來跑那些 Future 不歸 std 管)、沒有隨機數。
原因是 Rust 給了標準庫一個很重的承諾:std 的 API 一旦穩定就永遠不會破壞相容性。既然無法淘汰,那就少放一點——會隨著時代演進的東西(HTTP、序列化、非同步)交給生態系,讓它們能自由發布 2.0。代價是開專案第一件事就是挑套件。
常用對照:HttpClient → reqwest;System.Text.Json → serde + serde_json;Task / async → tokio;ILogger → tracing 或 log;System.CommandLine → clap;Regex → regex;DateTime → chrono。唯一的例外是 LINQ——它對應的 Iterator 就在 std 裡,而且是標準庫最強大的部分之一(lesson2-2 的主題)。`,
      walkthrough: [
        {
          label: "🔍 實務上這件事怎麼做",
          lang: "ini",
          lines: [
            { code: "# Cargo.toml", note: "所有外部相依都宣告在這裡,對應 .NET 的 PackageReference。" },
            { code: "[dependencies]", note: "相依區段開始。" },
            { code: "reqwest = { version = \"0.12\", features = [\"json\", \"blocking\"] }", note: "HTTP 客戶端。features 是 Rust 的條件編譯開關——只開你要的功能,沒開的程式碼不會被編進去。" },
            { code: "serde = { version = \"1\", features = [\"derive\"] }", note: "序列化框架。derive 這個 feature 才會提供 #[derive(Serialize, Deserialize)]。" },
            { code: "serde_json = \"1\"", note: "serde 的 JSON 格式實作。序列化框架與格式是分開的兩個 crate,換成 YAML 只要換這一個。" },
            { code: "tokio = { version = \"1\", features = [\"full\"] }", note: "async 執行器。只有在用非阻塞 API 時才需要——上面 reqwest 開了 blocking,小工具可以先不碰 async。" },
          ],
          outro: "這四個套件在 Rust 生態系的地位,相當於 .NET 的 HttpClient 與 System.Text.Json——差別只在它們不隨編譯器一起出貨,版本由你決定。",
        },
      ],
      csharp: `.NET BCL 是「電池全含」:HttpClient、System.Text.Json、Task、Regex、DateTime、ILogger 全部隨執行階段出貨,開新專案不用挑套件。代價是 BCL 裡堆了大量無法移除的舊 API(WebClient、Newtonsoft 時代的遺留模式、各種 Obsolete 標記),而且要等 .NET 發版才能更新。Rust 選了另一邊:std 只放「作業系統抽象 + 語言核心型別」並承諾永不破壞,其餘交給 crates.io 自行演進。哪個好沒有定論,但搬家時務必先調整預期——在 Rust,挑套件是專案第一天的工作,不是例外情況。`,
    },
    {
      id: "1-15-19",
      question: "手上有一個 String,想知道它到底有哪些方法可用。最有效率的做法是?",
      options: [
        { text: "查 doc.rust-lang.org/std(或離線的 rustup doc --std);在專案裡則跑 cargo doc --open,它會把你的 crate 連同所有相依套件的文件一起產生" },
        { text: "只能去 GitHub 翻標準庫原始碼" },
        { text: "跑 rustc --help,編譯器會列出所有內建型別的方法" },
        { text: "跑 cargo search String,從套件登錄檔查詢" },
      ],
      answer: 0,
      explanation: `std 的文件品質是 Rust 的招牌,值得花十分鐘熟悉怎麼讀:
每個型別頁面上,Methods 區塊是它自己的方法,而 Trait Implementations 區塊列出它實作了哪些 trait——這一區往往才是你要找的東西。例如 String 的 push_str 在 Methods,但 len() 與 chars() 其實來自 Deref 到 str,to_uppercase 也在那裡;而 sort 之所以能用在 Vec 上,答案就寫在 Vec 的 Deref<Target = [T]> 那一行。看到「這個方法我怎麼找不到」,九成是它來自某個 trait,而那個 trait 沒有 use 進來。
另外三個好習慣:文件裡幾乎每個 API 都附可執行的範例,而且那些範例本身就是測試(所以永遠不會過時);右上角的 source 連結可以直接跳進標準庫原始碼;搜尋框支援按型別簽名搜尋,例如輸入 &str -> String 會列出所有這種形狀的函式。
cargo doc --open 的價值在於:它產生的文件包含你專案用到的每一個 crate,版本跟你鎖定的完全一致——不會發生「照網站文件寫卻對不上」的情況。至於 cargo search 是用來找套件的,rustc --help 則只列編譯器旗標。`,
      walkthrough: [
        {
          label: "🔍 三個查文件的指令",
          lang: "bash",
          lines: [
            { code: "rustup doc --std", note: "開啟離線版標準庫文件,版本與你安裝的工具鏈一致。沒有網路也能查,而且不會誤看到不同版本的頁面。" },
            { code: "cargo doc --open", note: "在專案目錄執行:產生「自己的 crate + 全部相依套件」的文件並開啟瀏覽器。這是查第三方 crate 最可靠的方式,版本絕對正確。" },
            { code: "cargo doc --no-deps --open", note: "只產生自己 crate 的文件,相依套件不處理。專案大的時候快很多,適合檢查自己寫的 /// 文件註解排版對不對。" },
          ],
          outro: "文件註解怎麼寫(/// 與 cargo doc 的關係、文件測試)是下一課 lesson1-16 的內容。",
        },
      ],
      csharp: `對應 learn.microsoft.com 的 API browser,或 IDE 裡的 F12 前往定義。兩個差異值得注意:一是 Rust 的文件與編譯器版本綁定,rustup doc 開出來的一定是你手上這版,不會有「這個多載要 .NET 8 才有」的落差;二是文件裡的範例都是會被 cargo test 執行的真測試(稱為 doc test),編不過就會讓 CI 失敗——所以貼上去就能跑,不像 MSDN 文件的片段有時已經過時。`,
    },
    {
      id: "1-15-20",
      question: "C# 對照總結題:std 與 .NET BCL 最本質的差異是?",
      options: [
        { text: ".NET BCL 是「電池全含」的大平台函式庫;std 刻意只保留「跨平台的作業系統抽象 + 語言核心型別」,並承諾永不破壞相容——代價是 HTTP、JSON、日期格式化、async runtime 這些都住在生態系裡" },
        { text: "std 比較小只是因為 Rust 還年輕,這些功能遲早會被補進標準庫" },
        { text: "兩者範圍其實相同,只是 std 的文件比較分散、不好找" },
        { text: "兩者範圍相同,差別只在命名慣例與分隔符號" },
      ],
      answer: 0,
      explanation: `把整課收成一張地圖,左邊是模組、右邊是 .NET 對照:
std::fmt → System.Text 的格式化與 ToString / IFormattable(Display、Debug、Formatter)
std::collections → System.Collections.Generic(HashMap、HashSet、BTreeMap、VecDeque、BinaryHeap)
std::io → System.IO 的 Stream 那一層(Read、Write 兩個 trait、stdin、stdout)
std::fs → System.IO.File / Directory / FileInfo(File、read_to_string、create_dir_all)
std::env → System.Environment(args、var、current_dir)
std::path → System.IO.Path(Path、PathBuf)
std::thread → System.Threading.Thread(spawn、join、sleep)
std::sync → System.Threading 的同步原語(Mutex、RwLock、Arc、mpsc)
std::time → Stopwatch / TimeSpan / DateTime 的「量測」部分(Instant、Duration、SystemTime)
std::mem → 近似 Unsafe / Buffer / Marshal.SizeOf(size_of、swap、replace、take、drop)
std::convert → implicit / explicit operator 與 TryParse(From、Into、TryFrom、TryInto)
std::cmp → IComparable / IEquatable(PartialEq、Eq、PartialOrd、Ord、Ordering)
std::ops → 運算子重載(Add、Mul、Index、Deref)
std::net → System.Net.Sockets(TcpListener、TcpStream、UdpSocket)
std::process → System.Diagnostics.Process(Command、ExitStatus)
std::error → System.Exception 的「介面」角色,但是 trait 不是繼承(Error)
std::ptr → unsafe 的原始指標,日常不會碰(補充教材的地盤)
std::borrow → Rust 獨有,沒有對照(Cow、Borrow、ToOwned)
兩張表放在一起,差異就很清楚了:BCL 是一個平台,std 是一層地基。這不是成熟度問題——標準庫小是刻意的設計決定,因為 std 承諾永不破壞相容,放進去的東西就再也拿不出來。至於「文件分散」剛好相反:std 的文件集中在一個網站,還能整包離線下載。`,
      csharp: `實務上的建議:別用「BCL 裡有什麼」當作找東西的索引,改用「這件事屬於哪一層」。作業系統能直接提供的(檔案、行程、執行緒、socket、時間量測)去 std 找;需要跟著時代演進的(HTTP、序列化、日期處理、非同步、日誌)去 crates.io 找,而且該領域通常有一個社群公認的首選——查 lib.rs 的分類或 blessed.rs 的推薦清單,比自己盲挑可靠。`,
    },
  ],
};
