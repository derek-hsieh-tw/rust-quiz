/* 出題慣例:answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌。
 * 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容。 */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-15"] = {
  id: "lesson1-15",
  title: "測試、文件與基礎總整理",
  goal: "會寫單元測試與文件註解,並用四道綜合題驗收基礎階段:所有權、借用、enum、Result 的整合運用。",
  questions: [
    {
      id: "1-15-01",
      question: "在同一個檔案裡為 add 函式寫單元測試,正確的寫法是?",
      questionCode: "pub fn add(a: i32, b: i32) -> i32 {\n    a + b\n}",
      options: [
        { code: "#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn it_works() {\n        assert_eq!(add(2, 2), 4);\n    }\n}" },
        { code: "[TestClass]\nmod tests {\n    [TestMethod]\n    fn it_works() {\n        Assert.AreEqual(add(2, 2), 4);\n    }\n}" },
        { code: "mod tests {\n    fn test_it_works() {\n        assert_eq!(add(2, 2), 4);\n    }\n}" },
        { code: "#[test]\nfn main() {\n    assert_eq!(add(2, 2), 4);\n}" },
      ],
      answer: 0,
      explanation: `標準三件套:#[cfg(test)] 標在測試模組上(只在 cargo test 時編譯)、use super::* 把被測項目從父模組引進來(tests 是子模組,lesson1-14 的路徑規則)、#[test] 標在每個測試函式上讓測試框架收錄。cargo test 一鍵執行。
[TestClass]/Assert.AreEqual 是 C#/MSTest 語法;只靠 test_ 開頭命名不會被執行(Rust 認屬性不認名字,函式還會被回報為 dead code);main 是程式進入點,不能兼任測試。`,
      csharp: `C# 測試住在獨立的測試專案 + xUnit/NUnit 套件;Rust 內建測試框架,單元測試慣例「與被測程式碼同檔案」(#[cfg(test)] 保證不進正式建置)——測試貼著實作,還能測私有函式(子模組看得到父模組私有項目)。`,
    },
    {
      id: "1-15-02",
      question: "assert_eq! 失敗時的行為。以下測試執行 cargo test 的結果是?",
      questionCode: "#[cfg(test)]\nmod tests {\n    #[test]\n    fn good() {\n        assert_eq!(1 + 1, 2);\n    }\n\n    #[test]\n    fn bad() {\n        assert_eq!(2 + 2, 5);\n    }\n}",
      options: [
        { text: "good 通過、bad 失敗:assert_eq! 失敗會 panic 並印出 left/right 兩值,但只影響該測試,其他測試照常執行" },
        { text: "第一個測試失敗後整個測試程序中止,good 的結果看不到" },
        { text: "兩個都通過:assert_eq! 只印警告不判失敗" },
        { text: "編譯錯誤:編譯器發現 2 + 2 不等於 5" },
      ],
      answer: 0,
      explanation: `測試框架的判定規則:測試函式沒 panic = 通過,panic = 失敗。assert_eq! 失敗時 panic 並印出 left = 4, right = 5 幫你對帳。每個測試跑在獨立執行緒,一個炸了不拖累別人(預設還是並行執行),最後總結 1 passed; 1 failed。
編譯器不會幫你算 assert 的對錯(那是執行期的事);assert 家族失敗從來不是「警告」,就是 panic。`,
      csharp: `與 xUnit 的 Assert.Equal 行為幾乎一致(失敗印 expected/actual、測試相互隔離)。差別在機制:C# 靠測試框架捕捉例外;Rust 直接沿用語言的 panic,assert! 家族在正式程式碼裡也能用(防衛性檢查),不是測試專屬。`,
    },
    {
      id: "1-15-03",
      question: "測試「應該 panic」的行為。#[should_panic] 的正確理解是?",
      questionCode: "pub fn set_age(age: u32) {\n    if age > 150 {\n        panic!(\"年齡不可能超過 150,收到 {}\", age);\n    }\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    #[should_panic(expected = \"年齡不可能超過 150\")]\n    fn rejects_impossible_age() {\n        set_age(200);\n    }\n}",
      options: [
        { text: "這個測試「panic 才算通過」:驗證防衛邏輯真的會擋下非法輸入;expected 進一步要求 panic 訊息包含指定文字,避免誤判成別處的 panic" },
        { text: "should_panic 表示這個測試還沒寫完,先跳過不執行" },
        { text: "測試通過的條件不變(不 panic 才通過),屬性只是文件註記" },
        { text: "expected 參數指定測試的預期回傳值" },
      ],
      answer: 0,
      explanation: `#[should_panic] 反轉判定:panic = 通過、安然返回 = 失敗——專測「錯誤路徑真的會炸」。不帶 expected 有個陷阱:測試中「任何」panic 都算過(可能是別的 bug 先炸了),加上 expected = "..." 要求 panic 訊息包含該子字串,把驗證釘在你設計的那個 panic 上。
跳過測試另有屬性(#[ignore]);它是行為改變不是註記;panic 的世界沒有「回傳值」可言。`,
      csharp: `對應 xUnit 的 Assert.Throws<ArgumentException>(() => SetAge(200))——C# 用型別鎖定預期的例外,Rust 的 panic 沒有型別體系,改用訊息子字串鎖定。可恢復錯誤(Result)的測試則不用這招:直接 assert 回傳值是 Err 即可。`,
    },
    {
      id: "1-15-04",
      question: "文件註解與一般註解。/// 與 // 的差別,正確的是?",
      questionCode: "/// 將兩數相加。\n///\n/// # Examples\n///\n/// ```\n/// let result = my_crate::add(2, 3);\n/// assert_eq!(result, 5);\n/// ```\npub fn add(a: i32, b: i32) -> i32 {\n    a + b\n}",
      options: [
        { text: "/// 是文件註解:支援 Markdown、cargo doc 生成 HTML 文件,而且 ``` 圍起來的範例會被 cargo test 當測試執行" },
        { text: "/// 和 // 完全相同,多一條斜線只是視覺強調" },
        { text: "/// 的內容會在執行期印到主控台,類似 log" },
        { text: "/// 是編譯器指令,# Examples 會改變函式的編譯行為" },
      ],
      answer: 0,
      explanation: `/// 附著在下一個項目上成為它的文件:cargo doc --open 生成與標準庫同款的 HTML。殺手級特性是最後半句——文件裡的程式碼範例是「doc test」,cargo test 會真的編譯執行它:範例過時(API 改了)測試就紅,文件永遠不會爛掉。
# Examples 只是 Markdown 標題慣例,不影響編譯;文件註解是給 rustdoc 的,不是執行期輸出;另有 //! 寫在模組/crate 開頭,記述「這整個模組是幹嘛的」。`,
      csharp: `C# 的 XML 文件註解(/// <summary>)對應前半;但 <example> 裡的程式碼沒人幫你編譯執行,過時了也沒人知道。「文件範例即測試」是 Rust 生態文件品質出名的結構性原因——crates.io 上的套件文件幾乎都能直接抄範例跑。`,
    },
    {
      id: "1-15-05",
      question: "cargo test 實際會執行哪些東西?",
      options: [
        { text: "三類全跑:#[test] 單元測試、tests/ 目錄的整合測試、文件註解裡的範例(doc tests)" },
        { text: "只跑 #[test] 標記的函式" },
        { text: "只跑 tests/ 目錄下的檔案" },
        { text: "跑所有測試,然後自動執行 main 確認程式能啟動" },
      ],
      answer: 0,
      explanation: `cargo test 的完整清單:(1)單元測試——散在 src/ 各檔案 #[cfg(test)] 模組裡的 #[test];(2)整合測試——專案根目錄 tests/ 資料夾,每個檔案是獨立 crate,只能呼叫函式庫的「公開」API,模擬真實使用者視角;(3)doc tests——上一題的文件範例。三類各有分工:白箱、黑箱、文件保鮮。
main 不會被執行(它不是測試)。輸出報告也會分三段呈現。`,
      csharp: `C# 的單元/整合測試靠專案結構與命名慣例區分,工具鏈(dotnet test)不強制;doc test 則沒有對應物。Rust 把三類測試的位置、可見性、執行方式都定成語言級慣例——換專案零適應成本。`,
    },
    {
      id: "1-15-06",
      question: "【綜合】enum + match + 借用。以下程式碼的輸出是?",
      questionCode: "#[derive(Debug)]\nenum Shape {\n    Circle(f64),\n    Rect(f64, f64),\n}\n\nfn area(s: &Shape) -> f64 {\n    match s {\n        Shape::Circle(r) => 3.14 * r * r,\n        Shape::Rect(w, h) => w * h,\n    }\n}\n\nfn main() {\n    let shapes = vec![Shape::Circle(1.0), Shape::Rect(2.0, 3.0)];\n    let mut total = 0.0;\n    for s in &shapes {\n        total += area(s);\n    }\n    println!(\"{:.2}\", total);\n}",
      options: [
        { text: "9.14" },
        { text: "編譯錯誤:area 收 &Shape,但 for 迴圈給的 s 是 Shape" },
        { text: "3.14" },
        { text: "編譯錯誤:match 缺少萬用分支 _" },
      ],
      answer: 0,
      explanation: `Circle(1.0) 面積 3.14、Rect(2.0, 3.0) 面積 6.0,合計 9.14({:.2} 控制兩位小數)。
借用鏈完全正確:for s in &shapes 迭代借用,s 就是 &Shape,原樣傳給 area——shapes 全程沒被 move,迴圈後還能用。match 對 &Shape 匹配時自動把 r、w、h 綁定為欄位的參考(match ergonomics),浮點運算對參考直接可用。Shape 只有兩個變體且都列出,窮盡性滿足,不需要 _。`,
      csharp: `等價 C#:abstract record Shape + switch 運算式 + foreach 累加——形狀幾乎一樣。差別藏在細節:C# 迭代的是物件參考(隨手可改);Rust 的 &shapes 是唯讀借用,迴圈裡想偷改 shapes 會被編譯器抓(lesson1-9 考過)。`,
    },
    {
      id: "1-15-07",
      question: "【綜合】Result + match + 所有權。以下程式碼的輸出是?",
      questionCode: "fn find_user(id: u32) -> Result<String, String> {\n    if id == 1 {\n        Ok(String::from(\"Derek\"))\n    } else {\n        Err(String::from(\"id not found\"))\n    }\n}\n\nfn main() {\n    let name = match find_user(2) {\n        Ok(n) => n,\n        Err(e) => {\n            println!(\"warn: {}\", e);\n            String::from(\"guest\")\n        }\n    };\n    println!(\"hello, {}\", name);\n}",
      options: [
        { text: "warn: id not found\nhello, guest" },
        { text: "hello, Derek" },
        { text: "程式 panic:Err 沒有被 unwrap 處理" },
        { text: "編譯錯誤:match 的兩個分支回傳型別不一致" },
      ],
      answer: 0,
      explanation: `find_user(2) 走 Err 路徑。match 當運算式用:Err 分支先印警告,區塊尾端的 String::from("guest") 是分支值——兩個分支都給出 String,型別一致,name 得到 "guest"。輸出兩行。
這題是基礎篇錯誤處理哲學的縮影:錯誤是值,用 match 接住、印個警告、給預設值,程式優雅降級繼續走——沒有 unwrap、沒有 panic、沒有 try/catch。所有權細節:n 和 e 都是從 Result 裡 move 出來的 String,拿到就是你的。`,
      csharp: `C# 要達到同樣效果得 try/catch 包住再賦預設值,或設計 TryFindUser(out ...)——錯誤路徑與正常路徑分家。Rust 的 match 把兩條路寫在同一個運算式裡,「這個值怎麼來的」一目瞭然。`,
    },
    {
      id: "1-15-08",
      question: "【綜合】方法 + 借用規則。以下程式碼的結果是?",
      questionCode: "struct Inventory {\n    items: Vec<String>,\n}\n\nimpl Inventory {\n    fn first(&self) -> Option<&String> {\n        self.items.get(0)\n    }\n\n    fn add(&mut self, item: String) {\n        self.items.push(item);\n    }\n}\n\nfn main() {\n    let mut inv = Inventory {\n        items: vec![String::from(\"sword\")],\n    };\n    let f = inv.first();\n    inv.add(String::from(\"shield\"));\n    println!(\"{:?}\", f);\n}",
      options: [
        { text: "編譯錯誤:f 保存著來自 first(&self) 的借用,add(&mut self) 需要可變借用,兩者衝突" },
        { text: "印出 Some(\"sword\"):讀第一項和加新項目互不干擾" },
        { text: "印出 Some(\"shield\")" },
        { text: "執行期 panic:f 指向的資料已因擴容失效" },
      ],
      answer: 0,
      explanation: `追蹤借用鏈:first(&self) 回傳 Option<&String>——省略規則第三條(lesson1-13),回傳參考綁定 &self,所以「f 活著 = inv 被不可變借用中」。下一行 add(&mut self) 要可變借用,而 f 在 println 還要用——讀寫衝突,編譯錯誤。
這正是 lesson1-9「持有元素參考時 push」的方法版:push 可能擴容搬家,f 會懸空,借用檢查器在編譯期擋下(所以「執行期失效」的選項永遠沒機會發生)。修法:先 println!("{:?}", inv.first()) 用完再 add,或 add 之後再取。`,
      csharp: `C# 版(List<string> + First() + Add())毫無阻力地編譯執行——大多數時候也真的沒事,直到某天在迭代中 Add 或多執行緒下共享,才以執行期例外或資料錯亂的形式討債。Rust 把債務在編譯期結清。`,
    },
    {
      id: "1-15-09",
      question: "【綜合】所有權 + 泛型 + trait bound。以下程式碼的結果是?",
      questionCode: "fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {\n    let mut largest = list[0];\n    for &item in list {\n        if item > largest {\n            largest = item;\n        }\n    }\n    largest\n}\n\nfn main() {\n    let numbers = vec![34, 50, 25, 100, 65];\n    let words = vec![String::from(\"hi\"), String::from(\"yo\")];\n    println!(\"{}\", largest(&numbers));\n    println!(\"{}\", largest(&words));\n}",
      options: [
        { text: "編譯錯誤:String 不滿足 Copy bound,largest(&words) 那次呼叫不合法;數字那次沒問題" },
        { text: "印出 100 和 yo:兩次呼叫都正常" },
        { text: "編譯錯誤:Vec 不能傳給 &[T] 參數" },
        { text: "印出 100 後,words 因為被 move 而執行期 panic" },
      ],
      answer: 0,
      explanation: `簽名要求 T: PartialOrd + Copy(能比較「且」能複製——函式體的 largest = list[0] 要把元素複製出來)。i32 兩者都滿足;String 能比較但不是 Copy(lesson1-4 的老朋友),largest(&words) 編譯錯誤,訊息會明說 String: Copy 不成立。
&numbers(&Vec<i32>)傳給 &[i32] 靠 deref coercion 自動轉(lesson1-6 &String→&str 的同族機制)。順帶:把簽名改成回傳 &T 就能去掉 Copy bound,String 版也能用——bound 的鬆緊跟著實作需求走。`,
      csharp: `C# 的 T Largest<T>(IList<T>) where T : IComparable<T> 對 string 直接可用——複製參考無需授權。Rust 的 bound 把「這個函式需要元素會什麼」寫到一根毛都不差:要比較(PartialOrd)、要複製(Copy),缺一個就編譯錯誤,而不是執行期才發現。`,
    },
    {
      id: "1-15-10",
      question: "基礎篇畢業題:以下對 Rust 核心心智模型的總結,正確的是?",
      options: [
        { text: "每個值有唯一擁有者,離開作用域即釋放;借用分共享唯讀與獨占可寫,編譯期檢查;「可能沒有」是 Option、「可能失敗」是 Result,都必須顯式處理——三套機制共同取代了 GC 與例外" },
        { text: "Rust 用背景執行緒做輕量 GC,所有權只是給編譯器的最佳化提示,違反了頂多變慢" },
        { text: "借用規則只在多執行緒程式中生效,單執行緒可以隨意同時讀寫" },
        { text: "unwrap 是處理 Option/Result 的標準方式,match 是給不熟悉函數式風格的人的替代語法" },
      ],
      answer: 0,
      explanation: `基礎篇的三根柱子:(1)所有權——唯一擁有者、move 語意、作用域結束即 drop(lesson1-4);(2)借用——多個唯讀「或」一個可寫、參考不活過資料(lesson1-5、1-13);(3)錯誤即值——Option/Result + match/? 強制處理(lesson1-8、1-10)。全部在編譯期執行,這就是無 GC、無例外、卻記憶體安全的完整拼圖。
Rust 沒有任何形式的 GC,所有權是硬規則不是提示;借用規則單執行緒同樣全額生效(1-5、1-9 一路都在單執行緒裡吃編譯錯誤);unwrap 是「明知可能炸」的快捷方式,match/? 才是正規軍。`,
      csharp: `畢業寄語:C# 的直覺裡「物件隨便傳、null 檢查靠自律、錯誤靠 try/catch」,Rust 把這三件事全部搬進型別系統。接下來的進階篇(閉包、迭代器、智慧指標、並行、async)會不斷回扣這三根柱子——基礎越熟,進階越像自然推論而不是新知識。`,
    },
  ],
};
