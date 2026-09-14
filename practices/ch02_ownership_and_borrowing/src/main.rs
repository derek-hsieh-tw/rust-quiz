fn main() {
    println!("Hello, world!");

    let mut calc = Calculator::new();

    calc.add_entry("1 + 1 = 2");
    calc.add_entry("5 * 3 = 15");

    println!("--- 歷史紀錄 ---");
    calc.show_history();

    println!("--- 取出最後一筆 ---");
    let last = calc.pop_last_entry();
    println!("取出的紀錄: {}", last);

    println!("--- 取出後的歷史紀錄 ---");
    calc.show_history();
}


struct Calculator {
    history: Vec<String>,
}

impl Calculator {
    fn new() -> Self {
        Calculator { history: Vec::new() }
    }

    // 1. 補全這個方法：把 msg 加進 history
    fn add_entry(&mut self, msg: &str) {
        // 提示：&str 轉成 String 可以用 msg.to_string()
        // 提示：Vec 新增元素用 self.history.push(...)
        self.history.push(msg.to_string());
    }

    // 2. 補全這個方法：印出所有歷史紀錄
    fn show_history(&self) {
        for entry in &self.history {
            println!("{}", entry);
        }
    }

    // 3. 補全這個方法：取出並回傳最後一筆紀錄
    fn pop_last_entry(&mut self) -> String {
        // 提示：Vec 的 pop() 會取出最後一個元素 (Option<String>)
        // 這裡可以使用 self.history.pop().unwrap_or("No history".to_string())
        self.history.pop().unwrap_or("No history".to_string())
    }
}











// // ==================================================
// //   Rust 所有權與借用「防呆避坑」黃金法則 (Cheatsheet)
// // ==================================================

// // 一、Struct 定義：一律使用「擁有權本體」
// // --------------------------------------------------
// // 核心邏輯：讓 Struct 成為資料的擁有者，完全不用寫生命週期 ('a)
// struct Calculator {
//     brand: String,      // ⭕ 優先用 String，不用 &str
//     history: Vec<i32>,  // ⭕ 優先用 Vec，不用 &[i32]
// }

// // 二、Function 參數：一律使用「借用 (& 或 &mut)」
// // --------------------------------------------------
// // 核心邏輯：函式只是拿資料來用，用完就還，不搶走所有權
// fn calculate(op: &str, a: i32, b: i32) {
//     // ⭕ 傳入 &str，呼叫端傳入的變數在函式結束後依然可以使用
// }

// fn update_name(name: &mut String) {
//     // ⭕ 需要修改內容時，明確傳入 &mut
//     name.push_str(" Pro");
// }

// // 三、Function 回傳值：一律回傳「全新產生的本體」
// // --------------------------------------------------
// // 核心邏輯：函式內部產生的新資料，必須把所有權直接交給外面，絕不回傳區域變數的參考 (&)
// fn build_result_message(a: i32, b: i32) -> String {
//     let result = format!("Result: {}", a + b);
//     result // ⭕ 回傳本體 String，轉移所有權（禁止寫 &result，會引發懸空參考）
// }

// // 四、常見 Heap 所有權型別 (無 Copy trait，賦值即發生 Move)
// // --------------------------------------------------
// // 1. String               - 動態字串
// // 2. Vec<T>               - 動態陣列 (相當於 C# List<T>)
// // 3. Box<T>               - 堆疊指標 (強制把資料放到 Heap)
// // 4. HashMap<K, V>        - 雜湊字典 (相當於 C# Dictionary<TKey, TValue>)
// // 5. HashSet<T>           - 雜湊集合 (相當於 C# HashSet<T>)
// // 6. PathBuf              - 動態檔案路徑

// // 五、Stack vs Heap 快速觀念對照 (與 C# 經驗對接)
// // --------------------------------------------------
// // * Stack 輕量值 (Primitive / Copy)：
// //   i32, f64, bool, char, [i32; 4], (i32, f64)
// //   -> 直接複製值，不會產生 Move 轉移問題。
// //
// // * Heap 所有權重物 (Dynamic / Move)：
// //   String, Vec<T>, Box<T>, HashMap<K, V>
// //   -> 賦值或傳參時會轉移所有權 (Move)，需使用 & 借用。

// // 六、C# 轉 Rust 的心法總結
// // --------------------------------------------------
// // 1. 先求能跑，再求極致：
// //    初學時不要執著於「零成本抽象（Zero-cost abstractions）」或完全不 allocate 記憶體。
// //    必要時直接呼叫 `.clone()` 或 `.to_string()` 複製一份，程式碼通了最重要。
// //
// // 2. 編譯器通過 = 效能已經極佳：
// //    Rust 沒有 GC（垃圾回收器）的 Runtime 開銷，只要這套法則讓你順利編譯通過，
// //    它的執行期效能與記憶體管理就已經超越絕大多數託管語言（如 C# / Java）。
