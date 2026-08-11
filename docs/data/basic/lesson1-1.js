/* 出題慣例:answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌。
 * 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容。 */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-1"] = {
  id: "lesson1-1",
  title: "Rust 全貌與開發環境",
  goal: "知道 Rust 是什麼、程式怎麼編譯執行,建立最外層的地圖:工具鏈、專案骨架、Cargo 指令。",
  questions: [
    {
      id: "1-1-01",
      question: "要建立一個名為 hello 的新 Rust 執行檔專案,正確的指令是?",
      options: [
        { code: "cargo new hello", lang: "bash" },
        { code: "rustc new hello", lang: "bash" },
        { code: "cargo create hello --type bin", lang: "bash" },
        { code: "rustup new hello", lang: "bash" },
      ],
      answer: 0,
      explanation: `cargo 是 Rust 的建置工具兼套件管理器,cargo new hello 會建立完整專案骨架(Cargo.toml + src/main.rs + git 初始化)。
rustc 是底層編譯器,只負責編譯單一檔案,沒有 new 子命令;rustup 是安裝/管理工具鏈用的(裝 Rust 版本、切換 stable/nightly),也不負責建專案。cargo 沒有 create 子命令。`,
      csharp: `對應 C# 的 dotnet new console -n hello。cargo 同時扮演 dotnet CLI + NuGet 的角色:建專案、編譯、跑測試、管理套件全部一手包。`,
    },
    {
      id: "1-1-02",
      question: "在專案目錄下,「編譯並直接執行」程式的指令是?",
      options: [
        { code: "cargo run", lang: "bash" },
        { code: "cargo build\n./main", lang: "bash" },
        { code: "rustc Cargo.toml", lang: "bash" },
        { code: "cargo exec", lang: "bash" },
      ],
      answer: 0,
      explanation: `cargo run 會先編譯(若有變更)再執行,是開發時最常用的指令。
cargo build 只編譯不執行,而且產出的執行檔在 target/debug/ 底下,不是專案根目錄的 ./main。rustc 吃的是 .rs 原始碼檔,不是 Cargo.toml。cargo exec 不存在。`,
      csharp: `等同 dotnet run。cargo build 則等同 dotnet build,產出物路徑概念上類似 bin/Debug/。`,
    },
    {
      id: "1-1-03",
      question: "Rust 專案的「設定檔」(專案名稱、版本、相依套件)是哪一個檔案?",
      options: [
        { text: "Cargo.toml — 手寫的專案設定檔" },
        { text: "Cargo.lock — 手寫的專案設定檔" },
        { text: "src/main.rs — 設定寫在程式碼開頭的屬性裡" },
        { text: "rust.config.json — 專案根目錄的 JSON 設定" },
      ],
      answer: 0,
      explanation: `Cargo.toml 是你手寫維護的設定檔(TOML 格式):[package] 區段放名稱/版本,[dependencies] 區段放相依套件。
Cargo.lock 也真實存在,但它是 cargo 自動產生的「鎖定版本清單」,記錄實際解析出的精確版本,不該手動編輯——這兩個檔案的分工是常見考點。`,
      csharp: `Cargo.toml ≈ .csproj(+ NuGet 的 PackageReference);Cargo.lock ≈ packages.lock.json。差別是 Rust 生態從第一天就強制這套規範,所有專案結構長得一模一樣。`,
    },
    {
      id: "1-1-04",
      question: "Rust 程式的進入點,正確的寫法是?",
      options: [
        { code: "fn main() {\n    println!(\"Hello, world!\");\n}" },
        { code: "public static void Main() {\n    println!(\"Hello, world!\");\n}" },
        { code: "pub fn Main() -> void {\n    println!(\"Hello, world!\");\n}" },
        { code: "func main() {\n    println(\"Hello, world!\")\n}" },
      ],
      answer: 0,
      explanation: `Rust 的進入點是小寫的 fn main(),不需要 public/static 修飾,也不用宣告在任何類別裡。
public static void Main 是 C# 寫法;pub fn Main() -> void 有兩個問題:Rust 慣例函式名用 snake_case 小寫,且沒有 void 型別(無回傳值就不寫 -> 或寫 -> ());func main 則是 Go 的寫法(func 關鍵字、無分號、println 沒有驚嘆號)。`,
      csharp: `C# 的 Main 必須放在類別裡且通常是 static;Rust 的 main 是頂層的自由函式——Rust 沒有「一切皆類別」的包袱,函式可以直接定義在模組層級。`,
    },
    {
      id: "1-1-05",
      question: "println! 結尾的驚嘆號 ! 代表什麼?",
      options: [
        { text: "這是一個巨集(macro),在編譯期展開成實際程式碼" },
        { text: "表示這個函式可能會失敗(類似可為 null 的標記)" },
        { text: "強制執行,忽略警告" },
        { text: "只是命名慣例,和一般函式沒有差別" },
      ],
      answer: 0,
      explanation: `! 表示 println! 是巨集而非函式。巨集在「編譯期」展開,因此能做到函式辦不到的事:接受可變數量的參數、在編譯期檢查格式字串與參數型別是否對得上。
例如 println!("{}") 少給參數會直接編譯失敗,而不是等到執行期才爆。現階段只要記住「看到 ! 就是巨集」,巨集的原理放在進階課程。`,
      csharp: `C# 的 Console.WriteLine($"{x}") 使用字串插值,格式檢查同樣在編譯期;但 C# 的舊式 string.Format("{0}", x) 參數對不上要到執行期才丟 FormatException——Rust 的巨集把這類檢查全部提前到編譯期。`,
    },
    {
      id: "1-1-06",
      question: "想「快速檢查程式能不能編譯」但不需要產生執行檔,最合適的指令是?",
      options: [
        { code: "cargo check", lang: "bash" },
        { code: "cargo build --release", lang: "bash" },
        { code: "cargo run", lang: "bash" },
        { code: "cargo test", lang: "bash" },
      ],
      answer: 0,
      explanation: `cargo check 只做型別檢查與借用檢查,跳過產生機器碼的階段,速度比 build 快很多——寫 Rust 時會非常頻繁地「改一點、check 一下」,因為 Rust 的編譯器檢查就是最好的老師。
cargo build --release 反而是最慢的(開最佳化);run 會編譯+執行;test 是跑測試。`,
      csharp: `C# 沒有完全對應的指令(dotnet build 一定產出 DLL)。體感上 cargo check 像 IDE 裡即時的紅蚯蚓檢查,只是用命令列主動觸發。`,
    },
    {
      id: "1-1-07",
      question: "以下哪段程式碼可以正確編譯並印出「x = 5, y = 10」?",
      options: [
        { code: "let x = 5;\nlet y = 10;\nprintln!(\"x = {}, y = {}\", x, y);" },
        { code: "let x = 5;\nlet y = 10;\nprintln!(\"x = %d, y = %d\", x, y);" },
        { code: "let x = 5;\nlet y = 10;\nprintln!($\"x = {x}, y = {y}\");" },
        { code: "let x = 5;\nlet y = 10;\nprintln!(\"x = \" + x + \", y = \" + y);" },
      ],
      answer: 0,
      explanation: `println! 用 {} 作為佔位符,依序填入後面的參數。另外 Rust 2021 起也支援直接在 {} 內放變數名:println!("x = {x}, y = {y}"),但沒有 $ 前綴。
%d 是 C 語言的 printf 格式;$"..." 是 C# 的字串插值語法($ 前綴在 Rust 不存在);用 + 串接的寫法行不通,因為 Rust 的 &str 不能用 + 直接接數字,而且 println! 的第一個參數必須是字面值格式字串。`,
      csharp: `C# 的 $"x = {x}" 與 Rust 的 "x = {x}" 神似,只差一個 $。但 Rust 的 {} 佔位符會呼叫該型別的 Display 實作,自訂型別要印出必須實作 Display 或改用 {:?}(之後的課會教)。`,
    },
    {
      id: "1-1-08",
      question: "要在專案中加入外部套件 rand(版本 0.8),Cargo.toml 的正確寫法是?",
      options: [
        { code: "[dependencies]\nrand = \"0.8\"", lang: "ini" },
        { code: "[packages]\nimport rand@0.8", lang: "ini" },
        { code: "<PackageReference Include=\"rand\" Version=\"0.8\" />", lang: "xml" },
        { code: "[dependencies]\nrand: ^0.8", lang: "ini" },
      ],
      answer: 0,
      explanation: `TOML 格式:區段名是 [dependencies],每行「套件名 = "版本"」。寫 "0.8" 時 cargo 預設採用語意化版本的相容範圍(等同 ^0.8,會接受 0.8.x)。
也可以用指令 cargo add rand 自動寫入。[packages] 搭配 import 的語法不存在;<PackageReference> 是 C# csproj 的 XML;rand: ^0.8 用了冒號,TOML 的鍵值對必須用等號。`,
      csharp: `等同 csproj 裡的 <PackageReference>,或 dotnet add package。套件來源是 crates.io(≈ nuget.org),cargo build 時自動下載編譯。`,
    },
    {
      id: "1-1-09",
      question: "cargo build 與 cargo build --release 的差別,正確的敘述是?",
      options: [
        { text: "--release 開啟最佳化、編譯較慢、執行快,產出在 target/release/;不加則編譯快、含除錯資訊,產出在 target/debug/" },
        { text: "--release 會自動發佈到 crates.io 供其他人下載" },
        { text: "兩者產出的執行檔完全相同,--release 只是幫執行檔簽章" },
        { text: "不加 --release 的版本無法執行,只能用來檢查語法" },
      ],
      answer: 0,
      explanation: `這對應兩種編譯設定檔(profile):dev(預設)重視編譯速度、保留除錯資訊、會做整數溢位檢查;release 開啟最佳化(執行速度可差數倍到數十倍)。
日常開發用 debug 版,量測效能或交付一定要用 --release——初學者常犯的錯是用 debug 版跑效能測試,然後懷疑 Rust 很慢。發佈到 crates.io 是另一個指令 cargo publish。`,
      csharp: `等同 dotnet build -c Debug / -c Release 的差異。值得一提:Rust 的 debug 版會檢查整數溢位並 panic,release 版則是環繞(wrapping)——這個行為差異之後的課會再考。`,
    },
    {
      id: "1-1-10",
      question: "一個 crate 是 Rust 的編譯單位。關於 binary crate 與 library crate,正確的是?",
      options: [
        { text: "src/main.rs 是 binary crate 的根(有 main 函式、編譯成執行檔);src/lib.rs 是 library crate 的根(給別人引用,沒有 main)" },
        { text: "binary crate 用 Rust 寫,library crate 必須用 C 寫" },
        { text: "一個專案只能擇一,有了 main.rs 就不能有 lib.rs" },
        { text: "lib.rs 是舊版寫法,新版 Rust 已廢棄 library crate" },
      ],
      answer: 0,
      explanation: `crate 是 Rust 的編譯與發佈單位。cargo 依檔案位置自動判斷:src/main.rs → binary crate(執行檔),src/lib.rs → library crate(函式庫)。
一個 package 可以同時擁有兩者(常見做法:邏輯寫在 lib.rs,main.rs 只是薄薄一層呼叫入口,這樣邏輯可以被測試與重用),所以「有了 main.rs 就不能有 lib.rs」是錯的。`,
      csharp: `binary crate ≈ 主控台應用程式專案(OutputType=Exe),library crate ≈ 類別庫(OutputType=Library,產出 DLL)。C# 一個專案只能是其中一種,Rust 的一個 package 則可同時包含兩者。`,
    },
  ],
};
