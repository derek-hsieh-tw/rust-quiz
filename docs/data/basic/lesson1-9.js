/* 出題慣例:answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌。
 * 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容。 */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-9"] = {
  id: "lesson1-9",
  title: "常用集合:Vec、HashMap",
  goal: "流暢使用兩大集合,並理解集合與所有權/借用規則的互動:索引 vs get、走訪中修改、entry 慣用法。",
  questions: [
    {
      id: "1-9-01",
      question: "建立並填充 Vec。以下程式碼的結果是?",
      questionCode: "fn main() {\n    let v = Vec::new();\n    v.push(1);\n    v.push(2);\n    println!(\"{:?}\", v);\n}",
      options: [
        { text: "編譯錯誤:v 未宣告為 mut,不能 push" },
        { text: "印出 [1, 2]" },
        { text: "編譯錯誤:Vec::new() 必須標註元素型別才能編譯" },
        { text: "執行期 panic:對空 Vec 操作" },
      ],
      answer: 0,
      explanation: `push 會修改 Vec,需要可變性:let mut v 才行——集合和一般變數遵守同一套 mut 規則,沒有例外。
「必須標註型別」的說法不對:這裡編譯器能從後面的 push(1) 推斷出 Vec<i32>(推斷會往後看用法);真正孤零零的 let v = Vec::new(); 沒有任何用法時才需要標註。另外有字面值時慣用 vec! 巨集:let v = vec![1, 2];,一行完成建立加填充。`,
      csharp: `C# 的 var list = new List<int>(); list.Add(1); 永遠合法——可變是預設。Rust 要求 mut 的紅利:函式收 &Vec<i32> 時,呼叫端「保證」它不會被改;收 &mut Vec<i32> 才可能被改,簽名即文件。`,
    },
    {
      id: "1-9-02",
      question: "索引與 get 的差別。以下程式碼的結果是?",
      questionCode: "fn main() {\n    let v = vec![1, 2, 3];\n    let a = v.get(10);\n    let b = &v[10];\n    println!(\"{:?} {}\", a, b);\n}",
      options: [
        { text: "get 那行安全地得到 None;&v[10] 那行執行期 panic:index out of bounds" },
        { text: "兩行都回傳 None" },
        { text: "兩行都 panic" },
        { text: "編譯錯誤:編譯器發現 10 超出範圍" },
      ],
      answer: 0,
      explanation: `同一件事的兩種失敗語意:v.get(10) 回傳 Option<&i32>,越界給 None,把「可能不存在」交給呼叫端處理;&v[10] 是索引運算,越界直接 panic。程式會在執行到 &v[10] 那行時中止(get 那行已安全執行完)。
選擇準則:索引值來自使用者輸入或計算結果(可能錯)→ 用 get;邏輯上保證合法(剛檢查過長度)→ 用索引,panic 就是抓 bug。編譯器只對「字面值常數索引固定長度陣列」能提前報錯,Vec 是動態長度,編譯期不會攔。`,
      csharp: `C# 對應:list[10] 丟 ArgumentOutOfRangeException ≈ panic;沒有內建的 TryGet,得自己檢查 Count 或用 ElementAtOrDefault(回傳 default 而非明確的「沒有」)。Rust 的 get 把「安全取值」做成一等公民,回傳型別誠實表達失敗可能。`,
    },
    {
      id: "1-9-03",
      question: "走訪並修改 Vec 的每個元素,正確的寫法是?",
      options: [
        { code: "let mut v = vec![100, 32, 57];\nfor x in &mut v {\n    *x += 50;\n}" },
        { code: "let mut v = vec![100, 32, 57];\nfor x in &v {\n    *x += 50;\n}" },
        { code: "let mut v = vec![100, 32, 57];\nfor x in v {\n    x += 50;\n}\nprintln!(\"{:?}\", v);" },
        { code: "let v = vec![100, 32, 57];\nfor mut x in &v {\n    x += 50;\n}" },
      ],
      answer: 0,
      explanation: `要修改元素得可變借用:for x in &mut v 讓 x 是 &mut i32,*x += 50 透過解參考改到 Vec 裡的本體。
用 &v(不可變借用)拿到的 x 是 &i32,*x += 50 是「不能對唯讀參考賦值」的編譯錯誤;for x in v(沒有 &)把整個 Vec move 進迴圈,之後 println 用 v 是 borrow of moved value;for mut x in &v 只是讓「參考變數本身」可重新指向,依然改不了指到的唯讀內容。`,
      csharp: `C# 的 foreach (var x in list) x += 50; 編譯錯誤(迭代變數唯讀),而且就算能改也只是改複本——要就地修改得用 for (int i = 0; ...) list[i] += 50;。Rust 的 &mut 迭代直接拿到元素的可變參考,不用索引繞路。`,
    },
    {
      id: "1-9-04",
      question: "持有元素參考時修改 Vec。以下程式碼的結果是?",
      questionCode: "fn main() {\n    let mut v = vec![1, 2, 3];\n    let first = &v[0];\n    v.push(4);\n    println!(\"{}\", first);\n}",
      options: [
        { text: "編譯錯誤:first 不可變借用還活著,push 需要可變借用,兩者衝突" },
        { text: "印出 1:讀第一個元素跟尾端 push 互不相干" },
        { text: "印出 4" },
        { text: "執行期 panic:參考失效" },
      ],
      answer: 0,
      explanation: `直覺上「讀頭、加尾」井水不犯河水,但 push 可能觸發擴容:配置更大的緩衝區、搬走全部元素、釋放舊緩衝區——first 指向的舊位置瞬間變成懸空指標。借用檢查器不管「這次會不會真的擴容」,規則一刀切:不可變借用存活期間不准可變借用。
這是 lesson1-5 借用規則在集合上最經典的應用,也是 C++ 迭代器失效(iterator invalidation)這類未定義行為在 Rust 變成編譯錯誤的原因。修法:先用完 first 再 push,或 push 後重新取参考。`,
      csharp: `C# 沒有這個問題的「表面」:int first = list[0] 是複製值,list 擴容搬家由 GC 世界安全處理。但換成 foreach 中 Add 就露餡——InvalidOperationException,同一類問題執行期才炸。Rust 把整類問題都收編到編譯期的借用規則下。`,
    },
    {
      id: "1-9-05",
      question: "HashMap 的基本操作。以下程式碼的輸出是?",
      questionCode: "use std::collections::HashMap;\n\nfn main() {\n    let mut scores = HashMap::new();\n    scores.insert(String::from(\"Blue\"), 10);\n    scores.insert(String::from(\"Blue\"), 25);\n    println!(\"{:?}\", scores.get(\"Blue\"));\n}",
      options: [
        { text: "Some(25):同 key 再 insert 會覆蓋舊值;get 回傳 Option<&V>" },
        { text: "Some(10):insert 不會覆蓋既有的 key" },
        { text: "25:get 直接回傳值" },
        { text: "執行期 panic:重複的 key" },
      ],
      answer: 0,
      explanation: `insert 對已存在的 key 直接覆蓋(回傳被擠掉的舊值 Some(10),這裡沒接)。get 回傳 Option<&V>——key 可能不存在,所以是 Option;不複製值,所以是參考:印出 Some(25)。
注意 HashMap 要 use std::collections::HashMap 引入(不像 Vec 在 prelude 自動可用)。想要「不存在才插入」的語意,用下一題的 entry。`,
      csharp: `C# 的 dict[key] = 25 同樣覆蓋,但 dict.Add(key, ...) 對重複 key 丟例外——兩種方法兩種語意;讀取時 dict["Blue"] 對缺席 key 丟 KeyNotFoundException,安全版是 TryGetValue。Rust 用 Option 統一收斂:get 永不丟例外,型別強迫你面對「可能沒有」。`,
    },
    {
      id: "1-9-06",
      question: "entry 慣用法:計數器。以下程式碼的輸出是?",
      questionCode: "use std::collections::HashMap;\n\nfn main() {\n    let text = \"a b a c a\";\n    let mut map = HashMap::new();\n    for word in text.split_whitespace() {\n        let count = map.entry(word).or_insert(0);\n        *count += 1;\n    }\n    println!(\"{:?}\", map.get(\"a\"));\n}",
      options: [
        { text: "Some(3)" },
        { text: "Some(1):or_insert 每次都重設為 0" },
        { text: "None:split_whitespace 不會產生 \"a\"" },
        { text: "編譯錯誤:count 是借用,不能 += " },
      ],
      answer: 0,
      explanation: `entry(key).or_insert(0) 的語意:key 不存在就先插入 0,然後「無論如何」回傳該 value 的可變參考(&mut i32)。*count += 1 就地遞增——"a" 出現三次,最後是 Some(3)。
這是 HashMap 最重要的慣用法:「查詢 + 不存在就初始化 + 修改」一步完成,不用先 contains_key 再 insert 再 get 跑三趟。or_insert 只在缺席時插入,不會重設既有值;count 是可變借用,+= 正是它的用途。`,
      csharp: `C# 傳統寫法:if (!dict.TryGetValue(word, out var c)) c = 0; dict[word] = c + 1;(兩次雜湊查找);.NET 有 CollectionsMarshal.GetValueRefOrAddDefault 可一次完成但知者甚少。Rust 的 entry API 把高效寫法做成了「最順手的寫法」。`,
    },
    {
      id: "1-9-07",
      question: "所有權進入 HashMap。以下程式碼的結果是?",
      questionCode: "use std::collections::HashMap;\n\nfn main() {\n    let field_name = String::from(\"color\");\n    let field_value = String::from(\"blue\");\n\n    let mut map = HashMap::new();\n    map.insert(field_name, field_value);\n\n    println!(\"{}\", field_name);\n}",
      options: [
        { text: "編譯錯誤:field_name 已被 move 進 map(borrow of moved value)" },
        { text: "印出 color:insert 只是複製了字串" },
        { text: "印出 color:map 存的是參考" },
        { text: "執行期 panic" },
      ],
      answer: 0,
      explanation: `insert 按值接收 key 和 value,兩個 String 的所有權都被 move 進 map——集合「擁有」它的內容,隨集合一起 drop。之後使用 field_name 就是編譯錯誤。
這是 lesson1-4「集合擁有元素」在 HashMap 的版本。要保留原變數:insert(field_name.clone(), ...) 付複製成本;i32 這類 Copy 型別則直接複製進去,原變數照用。存參考進 map(&str 當 key)可行但牽涉生命週期,入門階段先用擁有的 String。`,
      csharp: `C# 的 dict.Add(fieldName, fieldValue) 之後兩個變數照用——map 和變數共享同一物件的參考。到底「誰擁有這筆資料」在 C# 是個沒人問的問題(GC 兜底);Rust 每一步都有明確答案:現在是 map 擁有。`,
    },
    {
      id: "1-9-08",
      question: "Vec 能存不同型別的元素嗎?以下程式碼的結果是?",
      questionCode: "fn main() {\n    let v = vec![1, \"two\", 3.0];\n    println!(\"{:?}\", v);\n}",
      options: [
        { text: "編譯錯誤:Vec 的元素必須是同一型別" },
        { text: "印出 [1, \"two\", 3.0]:Vec 自動裝箱混合型別" },
        { text: "印出 [1, 2, 3]:字串與浮點被自動轉成整數" },
        { text: "執行期 panic:型別不一致" },
      ],
      answer: 0,
      explanation: `Vec<T> 只有一個元素型別參數,整數、&str、浮點混在一起,編譯器無法統一 T,直接編譯錯誤。
正解是用 enum 包裝:enum Cell { Int(i32), Text(String), Float(f64) },然後 Vec<Cell>——「不同form的資料」變成「同一個 enum 的不同變體」,取用時 match 解開,型別安全全程在線。這正是上一課 enum 帶資料能力的實戰應用;完全動態的場景(型別事先未知)才需要 trait 物件(進階課程)。`,
      csharp: `C# 的 List<object> 或 List<dynamic> 什麼都能塞——代價是取出時強轉、錯了執行期炸,還有裝箱成本。Rust 沒有「一切皆 object」的後門,逼你先想清楚「到底有哪幾種」,再用 enum 白紙黑字列出來。`,
    },
    {
      id: "1-9-09",
      question: "Vec::pop 的行為。以下程式碼的輸出是?",
      questionCode: "fn main() {\n    let mut v = vec![1, 2, 3];\n    let x = v.pop();\n    let y = v.pop();\n    println!(\"{:?} {:?} {:?}\", x, y, v);\n}",
      options: [
        { text: "Some(3) Some(2) [1]" },
        { text: "Some(1) Some(2) [3]" },
        { text: "3 2 [1]" },
        { text: "編譯錯誤:pop 的回傳值不能用 {:?} 印" },
      ],
      answer: 0,
      explanation: `pop 從「尾端」移除並回傳元素(Vec 是 stack 語意的成長方向):先取走 3、再取走 2,剩 [1]。回傳型別是 Option<T>——空 Vec 時給 None 而不是 panic,所以印出來帶著 Some 外衣。
從頭部取用 remove(0)(O(n) 搬移,頻繁操作改用 VecDeque)。Option 實作了 Debug,{:?} 印它完全沒問題。`,
      csharp: `C# 的 List 沒有 pop;Stack<T>.Pop() 對空堆疊丟 InvalidOperationException,安全版是 TryPop(out var x)。Rust 一個 pop 同時是兩者:回傳 Option 天生就是 TryPop,不需要兩套 API。`,
    },
    {
      id: "1-9-10",
      question: "C# 對照總結題:Rust 的 Vec/HashMap 與 C# 的 List/Dictionary,使用手感上最大的差異是?",
      options: [
        { text: "失敗與所有權的表達:Rust 用 Option 表達「可能不存在」(get/pop)、用借用規則管制「誰能同時讀寫」;C# 靠例外(KeyNotFound、InvalidOperation)在執行期把關" },
        { text: "功能完全相同,只是方法名不同(push/Add、get/TryGetValue)" },
        { text: "Rust 的集合是不可變的,每次修改都回傳新集合" },
        { text: "Rust 的集合沒有泛型,元素一律裝箱存放" },
      ],
      answer: 0,
      explanation: `兩條主線貫穿本課:(1)失敗是型別不是例外——get 回 Option、pop 回 Option,呼叫端被迫在編譯期面對「沒有」;(2)存取受借用規則管制——持有元素參考時不能 push、走訪時不能改結構,C++ 的迭代器失效與 C# 的「集合已修改」例外都被搬到編譯期。
Rust 集合當然是可變的(mut 之下),也是完整泛型(單態化,無裝箱)——「不可變集合」與「無泛型」的說法都不對。`,
      csharp: `速查對照:vec![] ≈ new List<T>{...}、push/pop ≈ Add/(Stack 的)Pop、v.get(i) ≈ 手寫邊界檢查、entry().or_insert() ≈ TryGetValue+賦值組合、iter_mut ≈ 無直接對應(foreach 不能改)。方法名可以查表,借用規則才是需要換腦的部分。`,
    },
  ],
};
