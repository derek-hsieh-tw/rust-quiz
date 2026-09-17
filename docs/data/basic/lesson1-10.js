/* 出題慣例見專案根目錄 AUTHORING.md:
 *   - answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌
 *   - 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容
 *   - 有程式碼的題目一律附 walkthrough(逐行說明);反面案例必須同時附上 √ 正確寫法 */
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
      walkthrough: {
        label: "⊕ One snippet for each of the two error kinds",
        lines: [
          { code: "fn parse_port(text: &str) -> Result<u16, std::num::ParseIntError> {", note: "可恢復的失敗:輸入格式錯是「預期中會發生」的事,所以寫進回傳型別交給呼叫端決策。" },
          { code: "    text.parse::<u16>()", note: "parse 本身就回傳 Result,直接把它當回傳值。呼叫端可以選擇重試、給預設值或回報使用者。" },
          { code: "}", note: "函式結束。" },
          { code: "", note: "" },
          { code: "fn get(v: &Vec<i32>, i: usize) -> i32 {", note: "另一種情境:呼叫端保證索引合法。" },
          { code: "    assert!(i < v.len(), \"索引必須小於長度\");", note: "不可恢復的錯誤:違反契約代表呼叫端有 bug,程式狀態已不可信,直接 panic 最誠實——繼續跑只會讓錯誤擴散。" },
          { code: "    v[i]", note: "通過檢查後正常取值。" },
          { code: "}", note: "函式結束。" },
        ],
        outro: "劃分標準是「能不能合理地繼續」,而不是嚴重程度,也不是「函式庫 vs 應用程式」——同一個「檔案不存在」在哪裡都該是 Result。另外 panic 與 Result 都是執行期機制,和編譯期錯誤無關(編譯不過的程式根本產生不出來)。",
      },
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
      walkthrough: [
        {
          label: "⊕ Question code — walkthrough (panics at runtime)",
          lines: [
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let v = vec![1, 2, 3];", note: "長度 3 的 Vec,合法索引是 0~2。" },
            { code: "    println!(\"before\");", note: "正常執行,印出 before。" },
            { code: "    let x = v[99];", note: "⛔ 執行期 panic:index out of bounds: the len is 3 but the index is 99。接著印出提示「note: run with `RUST_BACKTRACE=1`」。預設行為是「展開(unwind)」——沿呼叫堆疊逐層執行 drop 清理資源,然後中止行程。注意 Vec 是動態長度,編譯器不會提前攔。" },
            { code: "    println!(\"after {}\", x);", note: "永遠不會執行。Rust 沒有 try/catch,panic 的設計立場就是「不該被常規流程攔截」。" },
            { code: "}", note: "main 結束(實際上已因 panic 提前中止)。" },
          ],
        },
        {
          label: "√ If the index might be out of bounds, don't use indexing syntax",
          lines: [
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let v = vec![1, 2, 3];", note: "同樣的 Vec。" },
            { code: "    println!(\"before\");", note: "印出 before。" },
            { code: "    match v.get(99) {", note: "改動處:get 回傳 Option<&i32>,把「可能不存在」變成要處理的值而不是中止。" },
            { code: "        Some(x) => println!(\"after {}\", x),", note: "索引合法時的處理。" },
            { code: "        None => println!(\"索引超出範圍,略過\"),", note: "越界時程式繼續執行——這裡會被印出。" },
            { code: "    }", note: "match 結束。" },
            { code: "}", note: "main 正常結束。" },
          ],
          outro: "標準函式庫刻意同時提供兩者:索引語法代表「我保證合法,不合法就是 bug」,get 代表「可能不存在,我會處理」。選哪個是設計決定。",
        },
      ],
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
      walkthrough: {
        label: "⊕ Question code — walkthrough (runs to completion)",
        lines: [
          { code: "use std::fs::File;", note: "引入檔案型別。" },
          { code: "", note: "" },
          { code: "fn main() {", note: "程式進入點。" },
          { code: "    let result = File::open(\"hello.txt\");", note: "回傳型別是 Result<File, io::Error>。檔案不存在時「不會 panic」,只是回傳 Err 變體——錯誤在這裡就是一個普通的值。" },
          { code: "    match result {", note: "Result 和 Option 一樣是普通的 enum,match 就是它的原生處理方式。" },
          { code: "        Ok(file) => println!(\"opened: {:?}\", file),", note: "成功時把 File 綁定出來使用。" },
          { code: "        Err(e) => println!(\"failed: {}\", e),", note: "失敗時把 io::Error 綁定出來,印出訊息(例如 No such file or directory)。這裡會被執行。" },
          { code: "    }", note: "match 結束。窮盡性檢查保證兩種情況都處理到了。" },
          { code: "    println!(\"still running\");", note: "程式若無其事地往下走,印出 still running——沒有任何控制流跳躍。" },
          { code: "}", note: "main 正常結束。" },
        ],
        outro: "這就是「錯誤是值」:錯誤跟整數、字串一樣是普通資料,用普通的 match 處理。函式簽名 -> Result<File, io::Error> 同時也是份誠實的文件:這件事會失敗,而且失敗長這樣。",
      },
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
      walkthrough: [
        {
          label: "⊕ Question code — walkthrough (panics when the file doesn't exist)",
          lines: [
            { code: "use std::fs::File;", note: "引入檔案型別。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let f = File::open(\"config.toml\")", note: "回傳 Result<File, io::Error>。" },
            { code: "        .expect(\"config.toml 應該與執行檔放在同一目錄\");", note: "expect 與 unwrap 同義(Ok 給值、Err 就 panic),差別是 panic 訊息會帶上你寫的說明。檔案不存在時會印出:config.toml 應該與執行檔放在同一目錄: Os { code: 2, kind: NotFound, ... } —— 你的說明與底層錯誤都在。" },
            { code: "}", note: "main 結束(實際上已因 panic 中止)。" },
          ],
          outro: "好的 expect 訊息寫的是「為什麼我認為這不會失敗」,出事時直接告訴你哪個假設破了。Option 與 Result 都有 unwrap/expect 這組方法。",
        },
        {
          label: "√ Use Result or a fallback value instead of aborting",
          lines: [
            { code: "use std::fs::File;", note: "引入檔案型別。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    match File::open(\"config.toml\") {", note: "改動處:明確處理兩種情況,而不是賭。" },
            { code: "        Ok(_f) => println!(\"設定檔已載入\"),", note: "成功時的流程。" },
            { code: "        Err(e) => println!(\"讀不到設定檔({}),改用預設值\", e),", note: "失敗時降級處理,程式繼續執行。" },
            { code: "    }", note: "match 結束。" },
            { code: "}", note: "main 正常結束。" },
          ],
          outro: "unwrap/expect 的正當使用場景:範例程式、測試、原型,以及「失敗即代表環境壞到不值得繼續」的啟動階段。其餘場合優先用 ?、match 或 unwrap_or 家族。",
        },
      ],
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
      walkthrough: {
        label: "⊕ Question code — walkthrough",
        lines: [
          { code: "use std::fs::File;", note: "引入檔案型別。" },
          { code: "use std::io::{self, Read};", note: "引入 io 模組本身與 Read trait(read_to_string 是 Read 的方法,不引入就叫不到)。" },
          { code: "", note: "" },
          { code: "fn read_username() -> Result<String, io::Error> {", note: "回傳型別是 Result——這是 ? 能用的前提:失敗時要有地方裝 Err。" },
          { code: "    let mut s = String::new();", note: "準備一個可變的字串當緩衝區。" },
          { code: "    File::open(\"username.txt\")?.read_to_string(&mut s)?;", note: "第一個 ?:開檔成功就「就地解包」出 File 繼續呼叫方法,失敗就立刻 return Err 給呼叫端。第二個 ?:讀取失敗同樣立刻返回。主邏輯因此保持一直線,沒有巢狀 match 的金字塔。" },
          { code: "    Ok(s)", note: "一路成功才會走到這裡,把結果包成 Ok 回傳。" },
          { code: "}", note: "函式結束。" },
        ],
        outro: "x? 展開等價於 match x { Ok(v) => v, Err(e) => return Err(e.into()) }。它與 unwrap 是兩個世界:unwrap 把錯誤變成 panic(自己扛),? 把錯誤交給呼叫端(往上傳)。附帶一提,? 還會呼叫 From::from 自動轉換錯誤型別,也能用在 Option 上(None 提早返回)。",
      },
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
      walkthrough: [
        {
          label: "X Question code (won't compile)",
          lines: [
            { code: "use std::fs::File;", note: "引入檔案型別。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "⛔ 問題根源:這個 main 的回傳型別是 ()。" },
            { code: "    let f = File::open(\"hello.txt\")?;", note: "⛔ 編譯失敗:the `?` operator can only be used in a function that returns `Result` or `Option`。? 失敗時要執行 return Err(...),但 () 裝不下這個 Err。" },
            { code: "    println!(\"opened\");", note: "因上一行失敗而無法執行。" },
            { code: "}", note: "main 結束。" },
          ],
        },
        {
          label: "√ Correct version (have main return Result too)",
          lines: [
            { code: "use std::fs::File;", note: "引入檔案型別。" },
            { code: "", note: "" },
            { code: "fn main() -> Result<(), Box<dyn std::error::Error>> {", note: "改動處:main 也可以回傳 Result。成功時的值是 ()(沒有有意義的回傳值),錯誤型別 Box<dyn Error> 先當成「什麼錯誤都能裝的盒子」記下來,原理在進階課。" },
            { code: "    let f = File::open(\"hello.txt\")?;", note: "現在 ? 有地方可以 return 了:失敗時整個 main 提早返回 Err。" },
            { code: "    println!(\"opened {:?}\", f);", note: "成功才會執行到這裡。" },
            { code: "    Ok(())", note: "改動處:尾端必須補上成功的回傳值。" },
            { code: "}", note: "main 回傳 Err 時,程式會以非零狀態碼結束並印出錯誤訊息。" },
          ],
          outro: "另一種修法是不要用 ?,改用 match 或 expect 在 main 裡就地處理掉錯誤。Rust 要求 main 的簽名明確承認「我會失敗」——連程式入口的錯誤路徑都是型別系統的一部分。",
        },
      ],
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
      walkthrough: {
        label: "⊕ Question code — walkthrough (runs successfully)",
        lines: [
          { code: "fn main() {", note: "程式進入點。" },
          { code: "    let a = \"42\".parse::<i32>().unwrap_or(-1);", note: "parse::<i32>() 回傳 Result<i32, ParseIntError>;::<i32> 是 turbofish 語法,明確指定目標型別。\"42\" 解析成功給 Ok(42),unwrap_or 取出 42。" },
          { code: "    let b = \"abc\".parse::<i32>().unwrap_or(-1);", note: "\"abc\" 解析失敗給 Err(ParseIntError),unwrap_or 改用備用值 -1——全程沒有 panic。" },
          { code: "    println!(\"{} {}\", a, b);", note: "印出 42 -1。" },
          { code: "}", note: "main 結束。" },
        ],
        outro: "也可以靠型別推斷省掉 turbofish:let a: i32 = \"42\".parse().unwrap_or(-1);。另外 Option 課學的 unwrap_or 家族在 Result 上原班人馬再登場——兩個型別的方法設計是刻意對稱的。",
      },
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
      walkthrough: [
        {
          label: "⊕ Question code (the ? operator)",
          lines: [
            { code: "fn parse_num(text: &str) -> Result<i32, std::num::ParseIntError> {", note: "回傳 Result,所以函式內可以用 ?。" },
            { code: "    let n = text.parse::<i32>()?;", note: "成功就把裸值 i32 解包給 n;失敗就整個函式 return Err。" },
            { code: "    Ok(n * 2)", note: "只有成功路徑會走到這裡,把結果包成 Ok。" },
            { code: "}", note: "函式結束。" },
          ],
        },
        {
          label: "√ The equivalent match version",
          lines: [
            { code: "let n = match text.parse::<i32>() {", note: "對 Result 做匹配,match 的值賦給 n。" },
            { code: "    Ok(v) => v,", note: "成功分支「解包出裸值」,讓後面的程式繼續用。" },
            { code: "    Err(e) => return Err(e),", note: "關鍵在這個 return:它結束的是「外層函式」,不只是 match——這正是 ? 的本質。" },
            { code: "};", note: "match 結束,n 的型別是 i32(不是 Result)。" },
          ],
          outro: "嚴格說 ? 還多做一步 From 錯誤轉換(Err(e.into())),這裡因為錯誤型別完全相同,兩者等價。",
        },
        {
          label: "X Why the other three versions aren't equivalent",
          lines: [
            { code: "    Err(_) => panic!(\"parse failed\"),", note: "語意完全不同:把可恢復的錯誤升級成程式中止,呼叫端連處理的機會都沒有——那是 unwrap 的行為。" },
            { code: "    Err(_) => 0,", note: "把錯誤「吞掉」:呼叫端再也不知道曾經失敗過,拿到的 0 和真的解析出 0 分不出來。" },
            { code: "    Ok(v) => Ok(v),", note: "根本沒有解包:n 的型別還是 Result<i32, _>,下一行的 n * 2 會編譯失敗。" },
          ],
        },
        {
          label: "△ Desugared (what the compiler sees)",
          intro: "上面的 match 版本少講了一步。? 完整展開長這樣——注意 From 這個字:你的程式碼裡從來沒出現過它,但錯誤訊息會。",
          lines: [
            { code: "let n = text.parse::<i32>()?;", note: "你寫的這一行。" },
            { code: "", note: "" },
            { code: "// 編譯器展開成:", note: "以下才是編譯器實際拿去檢查的東西。" },
            { code: "let n = match text.parse::<i32>() {", note: "? 的本體是一個 match。" },
            { code: "    Ok(v) => v,", note: "成功:解包出裸值,執行繼續往下。" },
            { code: "    Err(e) => return Err(From::from(e)),", note: "失敗:return 整個函式——而且錯誤先經過 From::from 轉換成「函式簽名宣告的那個錯誤型別」。本題兩邊型別相同,這一步等於什麼都沒做,所以前面說它們等價。" },
            { code: "};", note: "展開結束,n 的型別是 i32。" },
          ],
          outro: "這一步平常看不見,但它會在錯誤訊息裡現身:當函式回傳的錯誤型別與 ? 收到的不同、而且沒有對應的 From 實作時,編譯器會說 the trait bound `MyError: From<ParseIntError>` is not satisfied。看到那句話要能立刻想起:那個 From 是 ? 幫你呼叫的,不是你寫的。",
        },
      ],
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
      walkthrough: {
        label: "⊕ Same type, two ways of handling failure",
        lines: [
          { code: "pub struct Config {", note: "假設這是我們提供給別人使用的函式庫型別。" },
          { code: "    port: u16,", note: "一個欄位。" },
          { code: "}", note: "struct 定義結束。" },
          { code: "", note: "" },
          { code: "impl Config {", note: "行為區塊。" },
          { code: "    pub fn parse(text: &str) -> Result<Config, String> {", note: "可預期的失敗 → 回傳 Result:使用者給的文字格式錯誤是「API 契約的一部分」,呼叫端有權決定要重試、回報還是用預設值。" },
          { code: "        let port = text.parse::<u16>().map_err(|e| e.to_string())?;", note: "解析失敗就把錯誤往上傳,不自作主張中止程式。" },
          { code: "        Ok(Config { port })", note: "成功時回傳建構好的值。" },
          { code: "    }", note: "方法結束。" },
          { code: "", note: "" },
          { code: "    pub fn nth_digit(&self, i: usize) -> u32 {", note: "另一種情境:文件上明寫 i 必須小於 5。" },
          { code: "        assert!(i < 5, \"i 必須小於 5,呼叫端傳入了 {}\", i);", note: "違反契約 → panic:這代表呼叫端有 bug,回傳 Result 只是把爛攤子往後傳,治標不治本。標準函式庫的 v[i] 正是這麼做的。" },
          { code: "        self.port as u32 / 10u32.pow(i as u32) % 10", note: "通過檢查後正常計算。" },
          { code: "    }", note: "方法結束。" },
          { code: "}", note: "impl 結束。" },
        ],
        outro: "「絕不 panic」做不到也不該做;「用 catch_unwind 當 try/catch」則違反設計意圖——它是給 FFI 邊界與執行緒池用的,而且在 panic = abort 的編譯設定下根本接不到。理想的 API 常常兩者都提供:像 v[i] 與 v.get(i),讓呼叫端自己選。",
      },
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
      walkthrough: [
        {
          label: "◇ C#'s signature says nothing about failure",
          lang: "csharp",
          lines: [
            { code: "string Read(string path) { ... }", note: "簽名只說「回傳字串」。會不會失敗?失敗長什麼樣?看不出來,文件沒寫就只能猜。" },
            { code: "var text = Read(\"a.txt\");", note: "呼叫端可以毫無感覺地忽略失敗的可能;例外飛出來時,控制流瞬間跳到不知哪一層的 catch。" },
          ],
        },
        {
          label: "√ Rust puts failure in the return type",
          lines: [
            { code: "fn read(path: &str) -> Result<String, std::io::Error> {", note: "這行簽名同時說了兩件事:「會失敗」以及「失敗長什麼樣」。它是編譯器檢查得到的契約,不是文件註解。" },
            { code: "    std::fs::read_to_string(path)", note: "直接把底層的 Result 當回傳值。" },
            { code: "}", note: "函式結束。" },
            { code: "", note: "" },
            { code: "fn main() {", note: "程式進入點。" },
            { code: "    let text = read(\"a.txt\");", note: "拿到的是 Result<String, io::Error>,不是 String——想用裡面的字串就「必須」先面對錯誤,否則連編譯都過不了。" },
            { code: "    match text {", note: "處理兩種情況。" },
            { code: "        Ok(t) => println!(\"{} bytes\", t.len()),", note: "成功路徑。" },
            { code: "        Err(e) => println!(\"讀取失敗: {}\", e),", note: "失敗路徑,而且錯誤值裡帶著完整資訊(E 是完整型別,想裝多少資訊都可以自訂)。" },
            { code: "    }", note: "match 結束。" },
            { code: "}", note: "main 結束。" },
          ],
          outro: "根本差異在「可見性與強制力」。效能(無堆疊展開)是真實但次要的紅利;Rust 沒有 try/catch;而 Result 的錯誤型別能攜帶的資訊完全由你設計,「只能回傳錯誤代碼」的說法不成立。",
        },
      ],
      csharp: `Java 的 checked exception 是史上最接近的嘗試(失敗寫進簽名),但 catch 樣板太重被寫成 catch(Exception){} 而告終;C# 乾脆全面 unchecked。Rust 用 ? 解掉樣板問題後,「簽名誠實 + 處理強制」的理想第一次變得好用——這是 Result 模式在 Rust 成功、在別處失敗的關鍵。`,
    },
  ],
};
