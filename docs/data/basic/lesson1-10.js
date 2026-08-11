/* 出題慣例:answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌。
 * 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容。 */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-10"] = {
  id: "lesson1-10",
  title: "錯誤處理:panic 與 Result",
  goal: "建立「錯誤是值」的心智模型:分清不可恢復(panic)與可恢復(Result),掌握 ? 運算子的錯誤傳播。",
  questions: [
    {
      id: "1-10-01",
      question: "Rust 把錯誤分成兩類,正確的劃分是?",
      options: [
        { text: "不可恢復的錯誤用 panic!(程式缺陷,直接中止);可恢復的錯誤用 Result<T, E>(預期中的失敗,交給呼叫端處理)" },
        { text: "編譯期錯誤用 panic!,執行期錯誤用 Result" },
        { text: "panic! 用於函式庫,Result 用於應用程式" },
        { text: "小錯誤用 panic!,嚴重錯誤用 Result" },
      ],
      answer: 0,
      explanation: `劃分標準是「能不能合理地繼續」:檔案不存在、網路斷線、輸入格式錯——這些是「預期中會發生」的失敗,用 Result 讓呼叫端決定重試、預設值還是回報;陣列越界、違反不變量——這些是「程式寫錯了」,狀態已不可信,panic 直接中止最誠實。
panic 和 Result 都是執行期機制(編譯期錯誤根本產生不了程式);函式庫/應用程式、嚴重程度都不是劃分標準——同一個「檔案不存在」在哪裡都該是 Result。`,
      csharp: `C# 用同一套 exception 機制蓋掉全部:FileNotFoundException(預期失敗)和 IndexOutOfRangeException(程式缺陷)長得一樣,全都能被 catch。Rust 把兩者從機制上分開:Result 有型別簽名可循,panic 預設不被攔截——「哪些失敗是 API 契約的一部分」一目瞭然。`,
    },
    {
      id: "1-10-02",
      question: "關於 panic 的行為,正確的敘述是?",
      questionCode: "fn main() {\n    let v = vec![1, 2, 3];\n    println!(\"before\");\n    let x = v[99];\n    println!(\"after {}\", x);\n}",
      options: [
        { text: "印出 before 後 panic 中止:預設會展開(unwind)堆疊、清理資源,after 那行不會執行" },
        { text: "印出 before 和 after 0:越界回傳預設值" },
        { text: "什麼都不印:編譯器直接拒絕編譯越界索引" },
        { text: "印出 before 後拋出可被 try/catch 捕捉的例外,附近沒有 catch 所以印出 after" },
      ],
      answer: 0,
      explanation: `執行到 v[99] 時觸發 panic:印出錯誤訊息(index out of bounds)與提示(RUST_BACKTRACE=1 看回溯),預設行為是「展開」——沿呼叫堆疊逐層執行 drop 清理資源,然後中止行程。before 已印出,after 永遠到不了。
Vec 是動態長度,編譯器不會提前攔(固定長度陣列的常數索引才會)。Rust 沒有 try/catch;panic 的設計立場就是「不該被常規流程攔截」(邊界處有 catch_unwind,但那是框架級工具,不是錯誤處理手段)。`,
      csharp: `C# 丟 IndexOutOfRangeException,任何一層 catch 都能接住繼續跑——方便,但也讓「程式已進入錯誤狀態」的事實容易被 catch(Exception) 吞掉。Rust 的 panic 幾乎不給接:狀態壞了就結束,別帶病延命。`,
    },
    {
      id: "1-10-03",
      question: "Result 的定義與基本處理。以下程式碼的結果是?(檔案 hello.txt 不存在)",
      questionCode: "use std::fs::File;\n\nfn main() {\n    let result = File::open(\"hello.txt\");\n    match result {\n        Ok(file) => println!(\"opened: {:?}\", file),\n        Err(e) => println!(\"failed: {}\", e),\n    }\n    println!(\"still running\");\n}",
      options: [
        { text: "印出 failed: ...(錯誤訊息)和 still running:錯誤被當成值處理,程式繼續執行" },
        { text: "panic 中止:File::open 失敗一律 panic" },
        { text: "編譯錯誤:match 不能用在 Result 上" },
        { text: "印出 opened: None" },
      ],
      answer: 0,
      explanation: `Result<T, E> 就是個普通的 enum:Ok(T) 裝成功值、Err(E) 裝錯誤值。File::open 回傳 Result<File, io::Error>——失敗「不會 panic」,只是回傳 Err 變體,match 接住印出訊息,程式若無其事地往下走。
這就是「錯誤是值」:錯誤跟整數、字串一樣是普通資料,用普通的 match 處理,沒有特殊的控制流跳躍。Result 和 Option 一樣是 enum,match 是它的原生處理方式。`,
      csharp: `C# 的 File.Open 失敗直接 throw,控制流瞬間跳到不知哪層的 catch;想「錯誤當值」得自己包 try/catch 轉結果物件。Rust 反過來:值是預設,想中止才需要主動 panic。函式簽名 -> Result<File, io::Error> 同時也是份誠實的文件:這件事會失敗,失敗長這樣。`,
    },
    {
      id: "1-10-04",
      question: "Result 的 unwrap 與 expect。以下程式碼的結果是?(檔案不存在)",
      questionCode: "use std::fs::File;\n\nfn main() {\n    let f = File::open(\"config.toml\")\n        .expect(\"config.toml 應該與執行檔放在同一目錄\");\n}",
      options: [
        { text: "panic 中止,錯誤訊息包含「config.toml 應該與執行檔放在同一目錄」與底層的 io 錯誤" },
        { text: "expect 回傳 Option,f 得到 None" },
        { text: "編譯錯誤:expect 只能用在 Option 上" },
        { text: "靜默失敗,f 是未初始化狀態" },
      ],
      answer: 0,
      explanation: `expect 與 unwrap 同義(Ok 給值、Err 就 panic),差別是 panic 訊息帶上你寫的說明——好的 expect 訊息寫「為什麼我認為這不會失敗」,出事時直接告訴你哪個假設破了。
Option 和 Result 都有 unwrap/expect 這組方法。unwrap/expect 的正當使用場景:範例程式、測試、原型,以及「失敗即代表環境壞到不值得繼續」的啟動階段(如讀取必要設定檔);其餘場合優先用 ?、match 或 unwrap_or 家族。`,
      csharp: `類似讀設定失敗就讓程式在啟動時直接 throw 的做法——fail fast。Rust 的差異在於這個「賭注」是顯式的方法呼叫:程式裡每個可能 panic 的點都寫著 unwrap/expect,grep 一下就能盤點全部風險點;C# 的 throw 藏在每一層方法內部,盤點不了。`,
    },
    {
      id: "1-10-05",
      question: "? 運算子(本課核心)。以下函式中 ? 的作用,正確的描述是?",
      questionCode: "use std::fs::File;\nuse std::io::{self, Read};\n\nfn read_username() -> Result<String, io::Error> {\n    let mut s = String::new();\n    File::open(\"username.txt\")?.read_to_string(&mut s)?;\n    Ok(s)\n}",
      options: [
        { text: "遇到 Ok 就取出裡面的值繼續執行;遇到 Err 就立刻 return 該錯誤給呼叫端——把「逐層檢查並上拋」壓縮成一個字元" },
        { text: "遇到 Err 就 panic,等同 unwrap 的縮寫" },
        { text: "忽略錯誤:失敗時回傳空字串繼續執行" },
        { text: "把 Result 轉成 Option,錯誤變成 None" },
      ],
      answer: 0,
      explanation: `x? 展開等價於:match x { Ok(v) => v, Err(e) => return Err(e.into()) }——成功就地解包、失敗提早返回。兩個 ? 串起來:開檔失敗返回、讀取失敗也返回,主邏輯保持一直線,沒有巢狀 match 的金字塔。
它與 unwrap 是兩個世界:unwrap 把錯誤變成 panic(自己扛),? 把錯誤交給呼叫端(往上傳)。細節:? 還會呼叫 From::from 自動轉換錯誤型別(進階課展開),也能用在 Option 上(None 提早返回)。`,
      csharp: `C# 沒有對應物——例外自動往上傳,不需要語法。但這正是差異所在:C# 的方法簽名看不出會丟什麼、哪行會丟;Rust 每個可能失敗的呼叫點都有一個 ? 作記號,錯誤流向在程式碼上肉眼可見,而成本只是一個字元。`,
    },
    {
      id: "1-10-06",
      question: "? 不是到處能用。以下程式碼的結果是?",
      questionCode: "use std::fs::File;\n\nfn main() {\n    let f = File::open(\"hello.txt\")?;\n    println!(\"opened\");\n}",
      options: [
        { text: "編譯錯誤:? 只能用在回傳 Result(或 Option)的函式裡,這個 main 回傳 ()" },
        { text: "正常編譯:main 是特殊函式,? 自動改為 panic" },
        { text: "執行期 panic:檔案不存在" },
        { text: "印出 opened:? 在 main 裡等同 unwrap_or_default" },
      ],
      answer: 0,
      explanation: `? 失敗時要「return Err(...)」——函式回傳型別必須裝得下這個 Err。回傳 () 的 main 裝不下,編譯錯誤(the ? operator can only be used in a function that returns Result or Option)。
修法:把簽名改成 fn main() -> Result<(), Box<dyn std::error::Error>>,尾端補 Ok(())——main 回傳 Err 時程式以非零狀態碼結束並印出錯誤。Box<dyn Error> 先當「什麼錯誤都能裝的盒子」記下來,原理在進階課。`,
      csharp: `C# 的 Main 讓例外直接飛出去就有同樣效果(非零 exit code + 堆疊訊息),不需要改簽名。Rust 要求 main 的簽名明確承認「我會失敗」——連程式入口的錯誤路徑都是型別系統的一部分。`,
    },
    {
      id: "1-10-07",
      question: "parse 回傳 Result。以下程式碼的輸出是?",
      questionCode: "fn main() {\n    let a = \"42\".parse::<i32>().unwrap_or(-1);\n    let b = \"abc\".parse::<i32>().unwrap_or(-1);\n    println!(\"{} {}\", a, b);\n}",
      options: [
        { text: "42 -1" },
        { text: "42 0:解析失敗給型別預設值" },
        { text: "panic:abc 無法解析" },
        { text: "編譯錯誤:parse 需要 match 處理,不能接 unwrap_or" },
      ],
      answer: 0,
      explanation: `parse::<i32>() 回傳 Result<i32, ParseIntError>:"42" 給 Ok(42),"abc" 給 Err(...)。unwrap_or(-1) 對 Result 同樣適用:Ok 取值、Err 用備用值——所以是 42 與 -1,全程無 panic。
::<i32> 是 turbofish 語法,明確告訴 parse 目標型別(也可寫 let a: i32 = "42".parse().unwrap_or(-1) 靠推斷)。Option 課學的 unwrap_or 家族在 Result 上原班人馬再登場——兩個型別的方法設計是刻意對稱的。`,
      csharp: `C# 對照:int.Parse("abc") 丟 FormatException;安全版 int.TryParse(s, out var n) ? n : -1。Rust 的 parse 只有一個:回傳 Result,要炸(unwrap)還是要備用值(unwrap_or)由呼叫端一個方法決定——Parse/TryParse 雙軌 API 在 Rust 收斂成單軌。`,
    },
    {
      id: "1-10-08",
      question: "? 的展開。以下用 ? 的那行,與哪段 match 在行為上等價?",
      questionCode: "fn parse_num(text: &str) -> Result<i32, std::num::ParseIntError> {\n    let n = text.parse::<i32>()?;\n    Ok(n * 2)\n}",
      options: [
        { code: "let n = match text.parse::<i32>() {\n    Ok(v) => v,\n    Err(e) => return Err(e),\n};" },
        { code: "let n = match text.parse::<i32>() {\n    Ok(v) => v,\n    Err(_) => panic!(\"parse failed\"),\n};" },
        { code: "let n = match text.parse::<i32>() {\n    Ok(v) => v,\n    Err(_) => 0,\n};" },
        { code: "let n = match text.parse::<i32>() {\n    Ok(v) => Ok(v),\n    Err(e) => Err(e),\n};" },
      ],
      answer: 0,
      explanation: `? 的本質:成功分支「解包出裸值」讓執行繼續,失敗分支「return 整個函式」把錯誤交上去——關鍵字是那個 return,它結束的是外層函式,不只是 match。
panic 版把可恢復錯誤變成中止(語意完全不同);給 0 的版本把錯誤吞掉(呼叫端再也不知道失敗過);兩邊都原樣包回 Ok/Err 的版本沒有解包,n 的型別還是 Result,後面 n * 2 無法編譯。嚴格說 ? 還多做一步 From 錯誤轉換,這裡錯誤型別相同所以完全等價。`,
      csharp: `這個「成功往下走、失敗提早 return」的形狀,C# 工程師其實天天寫——TryXxx 模式:if (!int.TryParse(text, out var n)) return ...;。Rust 把這個模式壓縮成一個字元,而且編譯器保證你不會忘記寫那個 if。`,
    },
    {
      id: "1-10-09",
      question: "設計 API 時,panic 還是 Result?正確的原則是?",
      options: [
        { text: "函式庫的可預期失敗一律回傳 Result 讓呼叫端決策;panic 保留給「呼叫端違反契約」(傳入非法參數)與不可能發生的內部狀態" },
        { text: "函式庫應該多用 panic,強迫使用者寫出正確的程式" },
        { text: "一律用 Result,任何情況都不該 panic,包括陣列越界" },
        { text: "先 panic 再讓呼叫端 catch_unwind 接住,和 C# 的例外一樣用" },
      ],
      answer: 0,
      explanation: `準則:「這個失敗是不是 API 契約的一部分?」檔案打不開、解析失敗——是,給 Result;傳入的索引越界、在錯誤狀態下呼叫——這是呼叫端的 bug,panic 合理(標準函式庫的 v[i] 就是這麼做的,並同時提供 get 讓你選)。
「絕不 panic」做不到也不該做:對 bug 回傳 Result 只是把爛攤子往後傳;「用 catch_unwind 當 try/catch」違反設計意圖(它是給 FFI 邊界、執行緒池用的,panic = abort 的編譯設定下它根本接不到)。`,
      csharp: `對照 .NET 的準則:「不要用例外做流程控制」「Boneheaded exceptions(bug)不該被 catch」——理念其實相同,但 C# 只有一種 throw,規範靠自律。Rust 用兩種機制把準則變成結構:Result 就是流程、panic 就是 bug,想違反都難。`,
    },
    {
      id: "1-10-10",
      question: "C# 對照總結題:Rust 的 Result 與 C# 的 exception,最根本的哲學差異是?",
      options: [
        { text: "Rust 把失敗寫進回傳型別:會不會失敗、怎麼失敗都在簽名上,編譯器強迫處理;C# 的 throw 不出現在方法簽名,呼叫端可以毫無感覺地忽略" },
        { text: "Result 比較快,exception 比較慢,除此之外沒有差異" },
        { text: "Rust 也有 try/catch,Result 只是額外的選擇" },
        { text: "C# 的 exception 資訊比較豐富,Result 只能回傳錯誤代碼" },
      ],
      answer: 0,
      explanation: `根本差異在「可見性與強制力」:fn read() -> Result<String, io::Error> 這行簽名同時說了「會失敗」和「失敗長什麼樣」,拿到 Result 不處理,編譯器警告伺候、值也用不了;C# 的 string Read() 簽名對失敗隻字不提,文件沒寫就只能猜。
效能(無堆疊展開)是真實但次要的紅利;Rust 沒有 try/catch;Result 的 E 是完整型別,裝多少資訊隨你設計(自訂錯誤型別在進階課)——「只能錯誤代碼」的說法不成立。`,
      csharp: `Java 的 checked exception 是史上最接近的嘗試(失敗寫進簽名),但 catch 樣板太重被寫成 catch(Exception){} 而告終;C# 乾脆全面 unchecked。Rust 用 ? 解掉樣板問題後,「簽名誠實 + 處理強制」的理想第一次變得好用——這是 Result 模式在 Rust 成功、在別處失敗的關鍵。`,
    },
  ],
};
