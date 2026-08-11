/* 出題慣例:answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌。
 * 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容。 */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-6"] = {
  id: "lesson1-6",
  title: "Slice 與 String/&str 概觀",
  goal: "分清 String 與 &str 的使用時機、掌握 slice 的「視圖」概念。只教怎麼用;UTF-8 底層細節放在補充教材。",
  questions: [
    {
      id: "1-6-01",
      question: "String 與 &str 最核心的區別,正確的敘述是?",
      options: [
        { text: "String 擁有 heap 上的資料、可增長修改;&str 是對一段字串資料的唯讀借用(視圖),不擁有資料" },
        { text: "String 是新版寫法,&str 是舊版寫法,功能相同" },
        { text: "String 存 ASCII,&str 才能存 Unicode" },
        { text: "&str 是 String 的可變參考,可以修改原字串" },
      ],
      answer: 0,
      explanation: `一句話:String 是「擁有者」,&str 是「視圖」。String 在 heap 配置緩衝區,可以 push_str 增長;&str 只是(指標 + 長度)指向某段既有的字串資料——可能指向 String 的內容、也可能指向編譯進執行檔的字面值。
這組關係之後會一再出現:Vec<T> 對 &[T] 也是同樣的「擁有者 vs 視圖」結構。&str 是唯讀的,可變的字串視圖是 &mut str(極少用)。`,
      csharp: `C# 的 string 一律是不可變的參考型別,沒有這個二分。最接近的類比:String ≈ StringBuilder(可增長、擁有緩衝區),&str ≈ ReadOnlySpan<char>(輕量視圖、不配置記憶體)——C# 後來加入 Span 家族,正是往 Rust 這個方向靠攏。`,
    },
    {
      id: "1-6-02",
      question: "字串字面值的型別是什麼?",
      questionCode: "let s = \"hello\";",
      options: [
        { text: "&'static str:指向編譯進執行檔的字串資料的參考,整個程式期間有效" },
        { text: "String:字面值會自動配置到 heap" },
        { text: "str:純粹的字串型別" },
        { text: "[char; 5]:字元陣列" },
      ],
      answer: 0,
      explanation: `字面值 "hello" 被直接編譯進執行檔的唯讀資料段,s 是指向它的參考,型別是 &'static str——'static 表示「活得跟整個程式一樣久」,現階段記住結論即可(生命週期在 lesson1-13)。
它不是 String(沒有 heap 配置,要 String 得寫 String::from("hello") 或 "hello".to_string());裸的 str 型別存在但大小不定,無法直接當變數型別用,平常只會以 &str 的形式出現。`,
      csharp: `C# 的 "hello" 就是 string(受 intern pool 管理的物件)。Rust 區分「編譯進執行檔的靜態資料」與「執行期配置的 String」,零配置的字面值是效能紅利之一。`,
    },
    {
      id: "1-6-03",
      question: "函式參數宣告為 &str,以下呼叫的結果是?",
      questionCode: "fn print_it(s: &str) {\n    println!(\"{}\", s);\n}\n\nfn main() {\n    let owned = String::from(\"hi\");\n    print_it(&owned);\n    print_it(\"literal\");\n}",
      options: [
        { text: "兩個呼叫都合法:&String 會自動轉成 &str,字面值本身就是 &str" },
        { text: "編譯錯誤:&owned 是 &String,不能傳給 &str 參數" },
        { text: "編譯錯誤:字面值必須先 to_string() 才能傳入" },
        { text: "只有 &owned 合法,字面值需要加 & 寫成 &\"literal\"" },
      ],
      answer: 0,
      explanation: `&String 傳給 &str 參數時,編譯器會自動做 deref coercion(解參考強制轉換):&String → &str,零成本。字面值本身型別就是 &str,直接吻合。
這正是「參數收 &str 不收 &String」慣例的理由:一個簽名同時服務 String 借用與字面值,通用性最大。反過來(&str 傳給 &String 參數)是不行的,所以收 &String 的函式反而挑剔。轉換的原理(Deref trait)在進階課程。`,
      csharp: `類似「方法參數宣告為介面/基底型別」的通用性原則(收 IEnumerable<T> 不收 List<T>)。差別是 C# 靠繼承階層,Rust 靠 Deref 強制轉換——發生在編譯期,沒有裝箱或虛擬呼叫成本。`,
    },
    {
      id: "1-6-04",
      question: "字串 slice 的取法。以下程式碼的輸出是?",
      questionCode: "fn main() {\n    let s = String::from(\"hello world\");\n    let hello = &s[0..5];\n    let world = &s[6..];\n    println!(\"{} {}\", hello, world);\n}",
      options: [
        { text: "hello world" },
        { text: "hell worl(range 不含尾端)" },
        { text: "編譯錯誤:String 不能用 range 切片" },
        { text: "hello ello world(索引重疊)" },
      ],
      answer: 0,
      explanation: `&s[0..5] 取位元組 0~4(range 半開,不含 5),得到 "hello";&s[6..] 省略尾端表示到底,得到 "world"。兩個 slice 的型別都是 &str——它們不複製資料,只是指向 s 內部的視圖。
注意 range 的數字是「位元組」索引不是字元索引,純 ASCII 時兩者一致;切在中文字中間會 panic(下面的題目會考)。`,
      csharp: `C# 對應 s.Substring(0, 5) 或 range 語法 s[0..5]——但 C# 的 Substring/range 會「配置新字串並複製」,Rust 的 slice 是零複製的視圖。代價是 Rust 的 slice 受借用規則管:s 被不可變借用期間不能改 s。`,
    },
    {
      id: "1-6-05",
      question: "用 + 串接字串,以下程式碼的結果是?",
      questionCode: "fn main() {\n    let s1 = String::from(\"Hello, \");\n    let s2 = String::from(\"world!\");\n    let s3 = s1 + &s2;\n    println!(\"{}\", s1);\n}",
      options: [
        { text: "編譯錯誤:s1 的所有權已被 + 拿走(borrow of moved value: s1)" },
        { text: "印出 Hello, " },
        { text: "印出 Hello, world!" },
        { text: "編譯錯誤:String 不能和 &String 相加" },
      ],
      answer: 0,
      explanation: `+ 的簽名是 fn add(self, other: &str) -> String:左運算元「按值」接收,s1 被 move 進去、緩衝區被重用來追加內容,回傳的 s3 接手所有權——所以之後用 s1 是編譯錯誤,用 s2 沒問題(只被借用)。
&s2 是 &String,靠 deref coercion 轉成 &str,所以「String 不能和 &String 相加」的說法不成立。這個 move 行為是 + 串接的最大陷阱,不確定時用 format! 最安全(下一題)。`,
      csharp: `C# 的 s1 + s2 產生全新字串,s1、s2 都完好(string 不可變)。Rust 的 + 為了效能重用左邊的緩衝區,代價就是拿走左邊的所有權——效能與明確性優先於便利性的典型設計。`,
    },
    {
      id: "1-6-06",
      question: "改用 format! 巨集,以下程式碼的結果是?",
      questionCode: "fn main() {\n    let s1 = String::from(\"tic\");\n    let s2 = String::from(\"tac\");\n    let s3 = format!(\"{}-{}\", s1, s2);\n    println!(\"{} {} {}\", s1, s2, s3);\n}",
      options: [
        { text: "印出 tic tac tic-tac:format! 只借用參數,不拿走所有權" },
        { text: "編譯錯誤:s1、s2 已被 format! 拿走" },
        { text: "印出 tic-tac tic-tac tic-tac" },
        { text: "編譯錯誤:format! 的結果必須立刻 println,不能存變數" },
      ],
      answer: 0,
      explanation: `format! 透過格式化機制「借用」參數,s1、s2 的所有權原封不動,產出全新的 String 給 s3——三個變數之後都能用。
串接多段字串時 format! 是首選:不 move 任何東西、可讀性最好;+ 串接則適合「確定不再需要左邊變數」的場景。`,
      csharp: `等同 C# 的 string.Format 或字串插值 $"{s1}-{s2}",行為也最接近:產新字串、參數不受影響。差別只在 Rust 的格式字串在編譯期檢查參數數量與型別。`,
    },
    {
      id: "1-6-07",
      question: "以下程式碼的結果是?",
      questionCode: "fn main() {\n    let s = String::from(\"hello\");\n    let c = s[0];\n    println!(\"{}\", c);\n}",
      options: [
        { text: "編譯錯誤:String 不支援整數索引" },
        { text: "印出 h" },
        { text: "印出 104(h 的 ASCII 碼)" },
        { text: "執行期 panic:索引越界" },
      ],
      answer: 0,
      explanation: `Rust 刻意不讓 String 用 s[0] 取「字元」。原因:String 內部是 UTF-8 位元組序列,一個字元佔 1~4 位元組,s[0] 若回傳位元組會違反直覺、若回傳字元則無法保證 O(1)——索引語法承諾常數時間,所以干脆禁止。
正確取法:s.chars().nth(0) 取字元、s.as_bytes()[0] 明確取位元組、&s[0..1] 取 slice(但切在字元中間會 panic)。位元組層面的細節在補充教材。`,
      csharp: `C# 的 s[0] 合法,回傳 char——因為 C# 內部是 UTF-16,固定 2 bytes 一個 code unit,可以 O(1) 索引。但這也是陷阱:emoji 等增補字元佔兩個 char,s[0] 可能拿到半個字。兩個語言用不同方式面對「字元沒有固定寬度」的現實:C# 給你方便但暗藏陷阱,Rust 直接不讓你踩。`,
    },
    {
      id: "1-6-08",
      question: "以下程式碼的輸出是?",
      questionCode: "fn main() {\n    let s = \"你好\";\n    println!(\"{} {}\", s.len(), s.chars().count());\n}",
      options: [
        { text: "6 2:len() 回傳位元組數,chars().count() 才是字元數" },
        { text: "2 2:兩者都是字元數" },
        { text: "2 6:len() 是字元數,chars().count() 是位元組數" },
        { text: "4 2:每個中文字佔 2 位元組" },
      ],
      answer: 0,
      explanation: `len() 回傳「位元組」長度:UTF-8 編碼下每個常用中文字佔 3 位元組,「你好」是 6。要數「字元」得用 s.chars().count(),走訪整個字串,得到 2。
這是處理非 ASCII 文字的第一個必修觀念:len、索引、切片都以位元組為單位。用 &s[0..1] 去切「你好」會 panic(1 不是字元邊界),&s[0..3] 才能取出「你」。`,
      csharp: `C# 的 "你好".Length 是 2——但那是「UTF-16 code unit」數,常用中文字剛好 1 個 unit,遇到 emoji 就變 2("🦀".Length == 2)。兩個語言的 Length/len 都不是真正的「字元數」,只是單位不同(UTF-16 unit vs UTF-8 byte);C# 要精確數字得用 StringInfo,Rust 用 chars().count()。`,
    },
    {
      id: "1-6-09",
      question: "slice 不只用在字串。以下程式碼的輸出是?",
      questionCode: "fn main() {\n    let a = [1, 2, 3, 4, 5];\n    let s = &a[1..3];\n    println!(\"{:?} len={}\", s, s.len());\n}",
      options: [
        { text: "[2, 3] len=2" },
        { text: "[1, 2, 3] len=3" },
        { text: "[2, 3, 4] len=3" },
        { text: "編譯錯誤:陣列不能切片" },
      ],
      answer: 0,
      explanation: `&a[1..3] 取索引 1、2(不含 3),得到 [2, 3],型別是 &[i32](i32 的 slice)。slice 記著(起點指標、長度),len() 是 2。
&[T] 與 &str 是同一家族:對「一段連續元素」的借用視圖。函式參數收 &[T] 而非 &Vec<T> 或陣列,就能同時接受陣列、Vec、其他 slice 的借用——與 &str 慣例如出一轍。`,
      csharp: `對應 C# 的 Span<T>/ReadOnlySpan<T>:a.AsSpan(1, 2),同樣零複製。C# 陣列的 a[1..3] range 語法則會複製出新陣列。Rust 的 slice 從語言第一天就是核心設計,借用規則保證它永不懸空。`,
    },
    {
      id: "1-6-10",
      question: "想在 String 尾端追加內容,以下哪段程式碼可以編譯?",
      questionCode: "let mut s = String::from(\"hello\");",
      options: [
        { code: "s.push_str(\" world\");\ns.push('!');" },
        { code: "s.push(\" world\");" },
        { code: "s.push_str('!');" },
        { code: "s = s + '!';" },
      ],
      answer: 0,
      explanation: `兩個追加方法各司其職:push_str 收 &str(追加字串片段),push 收 char(追加單一字元)——" world" 給 push_str、'!' 給 push,完全正確。
把雙引號字串傳給 push、把單引號字元傳給 push_str,都是型別不符的編譯錯誤;+ 的右運算元必須是 &str,加上 char 同樣不行。記法:雙引號 = &str、單引號 = char,方法簽名嚴格對號入座。`,
      csharp: `C# 的 StringBuilder.Append 靠多載一口氣吃 string、char、int⋯⋯方便但看呼叫端分不出行為。Rust 幾乎不用多載(語言不支援),寧可用不同方法名把行為寫清楚——初期覺得囉嗦,讀別人程式碼時就會感謝這個設計。`,
    },
  ],
};
