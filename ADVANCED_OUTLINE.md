# 進階類(lesson2-1 ~ lesson2-12)出題骨架

本文件是 12 個寫題 agent(各自負責一課)的共同施工圖,目的是擋掉「重複題、難度斷層、
覆蓋漏洞、C# 對照角度打架」這四類平行寫作的常見問題。**內容權威是
`COURSE_PLAN.md:222-334`,本文件不重新發明大綱,只是把大綱拆解成 20 題的骨架 + 跨課邊界。**

寫題時仍要完整讀 `AUTHORING.md`(欄位規範、§4 walkthrough 與區塊標記、§7 驗證規則、
§9 去糖對照表),本文件不取代它,只補「這一課該出哪 20 題」與「跟其他課的邊界在哪」。

## 使用說明

- 每課一張 20 列表格:`# | 考點 | 題型 | 干擾選項方向 | △ | C#對照角度`。
- **題型**三選一:`反面案例`(X 區塊)/`輸出預測`(能跑,問印出什麼)/`設計選擇`(兩種寫法都
  合法,問哪個是慣用法)。表格只標型別,不代表詳解只能有一種語氣——反面案例一樣要有完整
  `√ Correct version` 配對(AUTHORING §4)。
- **△** 一律指「該題的 `X` 區塊需要附 `△` 去糖區塊」。**只有 `反面案例` 題型才可能是
  `是`**——`輸出預測`/`設計選擇`沒有 `X` 區塊,不適用這條規則,一律 `否`。
- △ 判斷依 `scripts/validate-data.js` 的實際邏輯(比 AUTHORING §4 的文字描述更精確):
  只看 `X` 區塊裡標 `⛔` 那幾行 `note` 的文字,比對是否出現
  `Add`/`AddAssign`、`Index`/`IndexMut`、`From`/`Into`、`IntoIterator`/`into_iter`、
  `Deref`、`Display`、`Ord`/`PartialOrd`、`FnOnce`/`FnMut`(**不含裸字 `Fn`**)、
  `Future`/`poll`、`Send`/`Sync`、`Sized` 這些字,且這個字沒有出現在讀者這題親手寫過的
  程式碼裡。表格裡的 △ 是骨架階段的**預判**,實際寫題時錯誤訊息措辭一變就可能翻盤,
  **以 `node scripts/validate-data.js --lesson lessonX-Y` 的實際報錯為準**,骨架只是提醒
  「這題大機率會踩到,寫的時候留意」。
- 「干擾選項方向」只講另外 3 個選項要往哪種誤解設計,不是選項文案本身。
- 每課骨架末 1~2 題固定是 C# 對照總結題(§3 收尾規定),表格裡會標「總結」。

## 各課前置關係(寫題時預設讀者已經會什麼,不用重新解釋)

- **2-1 閉包**:前置只有基礎 16 課(1-3 函式、1-11 泛型、1-12 trait 基礎的 `impl Trait`
  參數)。是進階類的起點,不預設任何其他進階課。
- **2-2 迭代器**:預設 2-1 的 `Fn`/`FnMut`/`FnOnce` 與捕獲環境已學會,大量把閉包當
  `map`/`filter` 的參數用,**不重新解釋閉包語意本身**。
- **2-3 智慧指標**:預設 1-4 所有權、1-8 enum(遞迴型別範例常用 enum)已熟。不預設任何
  進階課(排在生命週期進階之前,`Rc<RefCell<T>>` 範例刻意不涉及需要顯式生命週期標註的
  struct)。
- **2-4 生命週期進階**:預設 1-13 生命週期入門(單一/雙生命週期參數、省略規則、`'static`
  基礎)已熟,本課是它的直接延伸,不重講入門規則。
- **2-5 Trait 進階**:預設 1-12 trait 基礎(定義/實作/預設方法/`impl Trait`/`where`/
  孤兒規則/常用 derive)、1-11 泛型、2-4 生命週期進階(需要引用 trait object 的預設
  `'static` bound)都已學。
- **2-6 錯誤處理進階**:預設 1-10 `panic`/`Result`/`?` 基礎已學,2-5 的 `Box<dyn Trait>`
  剛學完可以直接承接 `Box<dyn Error>`。
- **2-7 並行**:預設 2-1 的 `move` 閉包語法、2-3 的 `Rc`/`RefCell`(用來對比「為什麼多執行緒
  不能用它們」)都已學。
- **2-8 async/await**:預設 2-7(thread、`move` 閉包、`Send`/`Sync`)、2-4(`'static` bound)
  都已學,大量用「跟 thread 的差異」當敘事主軸。
- **2-9 型別轉換**:預設 1-6(`&str`/`String` 概觀)、1-10(`parse` 略提過)已學,2-6 剛學完
  `From`/`?` 的錯誤轉換用法,本課要刻意避開那個情境(見下方跨課去重)。
- **2-10 模式匹配進階**:預設 1-8(`match`/`if let`/`while let`/enum 基礎)已熟,不重講
  `match` 語法本身。
- **2-11 巨集入門**:對其他進階課依賴最少,只要基礎 16 課背景即可,排在後面是因為概念上
  屬於「工具」而非「語言核心機制」。
- **2-12 Cargo 生態**:預設本類前 11 課全部學過,**進階綜合題**明確會組合 2-1(閉包)、
  2-2(迭代器)、2-6(Result/自訂錯誤)、2-7(並行)的內容。排最後。

## 與基礎類的界線

抽查依據:`docs/data/basic/lesson1-13.js`(生命週期入門,21 題)、
`docs/data/basic/lesson1-12.js`(Trait 基礎,約 20 題)全文,以及 `docs/data/index.js`
列出的其餘 14 課標題與 `COURSE_PLAN.md` 對應章節。基礎類已經測過、進階類不再重測的項目:

- **Trait**:定義/實作語法、預設方法、`impl Trait` 參數(靜態分派的語法本身)、`where`
  子句語法、孤兒規則、常用 derive(`Debug`/`Clone`/`Copy`/`PartialEq`/`Default`)——這些是
  1-12 的题。2-5 直接跳到 `dyn Trait`/動態分派/object safety/關聯型別/運算子重載/
  supertrait/完全限定語法/newtype 繞孤兒規則的**進階應用**(newtype 本身 1-12 教過,2-5
  換一個新情境示範,不是重教語法)。
- **生命週期**:單一/兩個生命週期參數的函式標註、省略規則三條、`'static` 是什麼——1-13
  的題。2-4 直接跳到 struct 持有參考、`impl<'a>`、多生命週期關係、`T: 'a`、`'static`
  bound 對泛型的真正含義、常見錯誤訊息解讀。
- **enum / match / Option**:定義 enum、`match` 基本語法、`if let`/`while let`、`Option`
  的 `Some`/`None`——1-8 的題。2-10 直接跳到巢狀解構、guard、`@` 綁定、`|`、range 模式、
  `ref`/binding mode、irrefutable vs refutable。
- **錯誤處理**:`panic!`、`Result<T,E>`、`?` 的基本展開(1-10,對應去糖表 #01)——2-6
  直接跳到自訂錯誤型別、`Box<dyn Error>`、`From` 讓 `?` 自動轉換、thiserror/anyhow 概念。
- **集合與迭代**:`Vec`/`HashMap` 基本操作、`for` 迴圈——1-9 的题。2-2 直接跳到
  `Iterator` trait、惰性求值、轉接器/消耗器鏈、`collect` turbofish、自訂 `Iterator`。
- **泛型**:`<T>` 語法、trait bound 基礎——1-11 的题。2-5 的「預設泛型參數」
  (`Add<Rhs=Self>`)是在這個基礎上的進階應用,不重教泛型語法本身。
- **模組/std/測試**:1-14/1-15/1-16 已經涵蓋模組系統、std 地圖(含 `thread`/`sync` 等
  模組**名稱**,但不含實際 API)、單元測試——2-7 的並行是 std 模組名稱首次被真正教到
  用法,2-12 的 Cargo 生態不重複模組系統或測試語法本身。

## 跨課去重清單

- **`Rc<RefCell<T>>`**:只在 **2-3** 出現(組合慣用法本身、`borrow_mut` panic、
  `Weak` 打破循環參考)。**2-7 一律用 `Arc<Mutex<T>>`**,不出現 `Rc<RefCell<T>>`,並在
  該課用一題明確對比「為什麼 `Rc` 不能跨執行緒」(`Send` 未實作)。
- **`move` 閉包**:三課各守一個角度,互不重疊——**2-1** 教語法本身(強制取得所有權、
  不加 `move` 也能用時二者等價);**2-7** 只在「`thread::spawn` 要求 `'static`,所以捕獲
  外部變數幾乎都要 `move`」這個情境出現,不重講 `move` 語法;**2-8** 只在
  「`async move` 把捕獲變數的所有權移進狀態機,狀態機可能被搬到任意時刻才驅動」這個新
  角度出現。
- **`Box<dyn Trait>`**:**2-3** 的 `Box<T>` 嚴格限定在「heap 配置單一值 + 遞迴型別
  (鏈結串列/樹)」,**不出現 `dyn`**。`Box<dyn Trait>`、trait object、object safety
  全部歸 **2-5**。
- **`From` / `?`**:**2-6** 專講「`?` 搭配 `From` 自動轉換錯誤型別」這條去糖鏈(對應去糖表
  #01、#51),範例一律是錯誤處理情境。**2-9** 的 `From`/`Into`/`TryFrom`/`TryInto` 聚焦
  **一般值轉換**(數值之間、字串轉自訂型別等),**不使用 `?` 運算子或錯誤轉換當範例**,
  避免跟 2-6 撞題。
- **生命週期標註**:完整規則(struct 持有參考、`impl<'a>`、多生命週期關係、`T: 'a`、
  `'static` 真正含義、錯誤訊息解讀)全部歸 **2-4**。**2-5** 只能在「`Box<dyn Trait>`
  預設帶隱含 `'static` bound,要用 `Box<dyn Trait + 'a>` 才能包含較短命的參考」這個**單一
  狹窄角度**碰生命週期,用詞上明確呼應 2-4 已教過的規則,**不重新展開規則本身**。這是本
  文件認為最容易被寫岔的一組邊界,2-5 的 agent 寫到這兩題時要格外克制。
- **迭代器與閉包的交界**:**2-1** 的範例保持「閉包獨立使用」(排序回呼、單獨呼叫),
  **不引入 `.map()`/`.filter()` 這類迭代器轉接器鏈**;閉包大量當轉接器參數用的情境全部
  留給 **2-2**,2-2 也**不重新解釋 `Fn`/`FnMut`/`FnOnce` 語意**,直接假設讀者已經懂。
- **額外一組(超出任務指定的 6 組,但抽查時發現容易混淆,一併記錄)**:`Deref`。**2-3**
  只在「透過智慧指標(`Box`/`Rc`)呼叫內部型別方法時的 auto-deref」這個角度出現(方法呼叫
  穿透指標);**2-9** 的 `Deref` coercion 講的是「`&String` 在函式呼叫的參數位置自動轉成
  `&str`」這個不同角度(引用型別之間的隱式轉換)。兩者概念相關但方向不同,兩課骨架都各自
  加註,寫題時仍建議 2-3 與 2-9 的 agent 互相確認彼此的範例沒有撞在同一種情境上。

---

## lesson2-1 閉包(Closures)

**課程目標**:看懂閉包捕獲環境的三種方式,以及 `Fn`/`FnMut`/`FnOnce` 的呼叫語意如何決定
一個閉包能不能被重複呼叫、能不能當參數或回傳值傳遞。

**難度曲線**:第 1~3 題是語法與捕獲方式的裸感知(輸出預測);第 4~18 題進入核心——借用
衝突、`move`、三種 `Fn` trait 的呼叫限制、閉包當參數/回傳值的型別選擇,反面案例集中在這段;
第 19 題用「為什麼 `thread::spawn` 需要 `move`」的所有權推理替 2-7 鋪路(不使用 thread API
本身);第 20 題 C# 對照收尾。

| # | 考點 | 題型 | 干擾選項方向 | △ | C#對照角度 |
|---|---|---|---|---|---|
| 1 | 閉包基本語法與型別自動推斷 | 輸出預測 | 誤以為閉包參數型別像具名函式一樣寫死、不能依呼叫端推斷 | 否 | lambda `x=>x+1` 語法對照 |
| 2 | 捕獲環境預設不可變借用 | 輸出預測 | 誤以為呼叫閉包會 consume 外部變數 | 否 | C# lambda 捕獲外部變數同樣是隱含引用 |
| 3 | 捕獲環境用可變借用修改外部變數 | 輸出預測 | 誤以為需要顯式寫 `&mut` 才能在閉包內修改捕獲變數 | 否 | C# lambda 修改外部局部變數同樣合法,且無借用檢查 |
| 4 | 反面:閉包持有借用時,呼叫前又建立衝突的另一個借用 | 反面案例 | 以為沒呼叫閉包借用就不算「開始」 | 否 | C# 完全不擋這種操作,凸顯 Rust 編譯期防護的價值 |
| 5 | 反面:加 `move` 後在閉包定義處之後再用原變數 | 反面案例 | 以為 `move` 只在跨執行緒才需要;以為呼叫閉包才會拿走所有權 | 否 | C# 沒有等價語法,捕獲永遠是隱含引用(值型別除外) |
| 6 | `move` 閉包在「不再使用原變數」情境下與不加 `move` 等價 | 設計選擇 | 以為加 `move` 一定有額外執行期成本 | 否 | C# 沒有這個選擇權,語言替你決定 |
| 7 | `Fn`:唯讀捕獲、可重複呼叫 | 輸出預測 | 誤把 `Fn` 理解成「不能有任何捕獲」 | 否 | `Func<T,R>` 可重複呼叫,語意相近 |
| 8 | 反面:`FnMut` 閉包忘記把閉包變數宣告 `mut` 就呼叫 | 反面案例 | 以為只要閉包內部用了 `mut` 關鍵字語法就自動可變 | 否 | `Action` 委派呼叫端不需要宣告 `mut`,對照 Rust 要求呼叫端自己是 `mut` |
| 9 | `FnMut` 連續呼叫觀察捕獲狀態累積 | 輸出預測 | 以為每次呼叫都是全新狀態(像純函式) | 否 | 對比 C# 累加器 lambda 需要 `ref`/欄位才能做到同樣效果 |
| 10 | 反面:`FnOnce` 閉包(捕獲變數被移出)被呼叫兩次 | 反面案例 | 以為 Copy 型別捕獲也有這個限制;以為不加 `move` 就不會被消耗 | 是(⛔ note 會點名 `FnOnce`) | C# 沒有「呼叫一次就耗盡」的概念,委派永遠可重複呼叫 |
| 11 | `Fn`/`FnMut`/`FnOnce` 的階層關係(實作 `Fn` 自動滿足另外兩者) | 輸出預測 | 以為三者互斥、要三選一實作 | 否 | `Func`/`Action` 沒有這種階層,只有簽名不同 |
| 12 | 具名函式(`fn`)也滿足 `Fn`/`FnMut`/`FnOnce`,可與閉包互換傳入同一參數 | 輸出預測 | 以為只有閉包能傳,`fn` 不行 | 否 | 對比方法群組轉型成委派 |
| 13 | 反面:函式簽名要求 `impl Fn()`,呼叫端卻傳一個會消耗捕獲變數、只滿足 `FnOnce` 的閉包 | 反面案例 | 一律用 `FnMut` 圖方便,或以為只要能呼叫一次就滿足任何 `Fn` 系 bound | 是(⛔ note 會點名 `FnOnce`) | C# 只有一種 `Action`/`Func`,沒有這種依呼叫次數分層的限制 |
| 14 | 閉包當回傳值:`impl Fn`(單一具體型別) | 輸出預測 | 以為 `impl Fn` 能像 `dyn` 一樣回傳不同種類的閉包 | 否 | C# 回傳 `Func<T,R>` 不受「單一具體型別」限制 |
| 15 | 反面:if/else 分支各回傳一種不同閉包卻用 `impl Fn` | 反面案例 | 以為兩個閉包簽名一樣,型別也一樣 | 否 | C# 同情境天經地義,因為都是 `Func<T,R>` 物件參考 |
| 16 | `Box<dyn Fn>`:heap 配置,可在集合/分支混裝不同閉包 | 輸出預測 | 以為呼叫 `Box<dyn Fn>` 需要額外標 `FnMut` 才行,或解參考語法特殊 | 否 | `List<Func<T,R>>` 混裝不同 lambda 是原生支援 |
| 17 | 反面:`sort_by_key` 的閉包回傳 `f64` 直接排序(`f64` 只實作 `PartialOrd`,沒有 `Ord`) | 反面案例 | 以為所有數字型別都能直接拿去排序,不會區分 `Ord`/`PartialOrd` | 是(⛔ note 會點名 `Ord`) | `List<T>.Sort(Comparison<T>)` 對 `double` 排序不會有這層限制 |
| 18 | 反面:誤以為所有閉包都能 `.clone()`,實際取決於捕獲變數是否滿足 `Clone` | 反面案例 | 以為閉包這個「型別」本身永遠可以複製 | 否 | 對比委派永遠可以複製(參考複製),行為不同 |
| 19 | 為什麼 `move` 閉包常出現在「需要活得比目前作用域久」的情境(不用 thread API,只講所有權推理,鋪陳 2-7) | 設計選擇 | 以為簽名要求 `'static` 代表閉包會活得比程式還久 | 否 | 對比委派天生可被物件安全持有,因為 GC 保證捕獲物件不消失 |
| 20(總結) | C# 對照:lambda/delegate/`Func<>`/`Action<>` vs 三種 `Fn` trait;C# 閉包捕獲變數的經典陷阱(舊版 foreach 迴圈變數共享)vs Rust 編譯期先排除問題 | 設計選擇 | 無(總結題不設誤導方向,聚焦正確心智模型) | 否 | 本題即總結 |

---

## lesson2-2 迭代器(Iterators)

**課程目標**:用惰性求值的轉接器/消耗器鏈取代手寫迴圈,並看懂「只實作 `next()` 就能免費
獲得整套方法」這個 trait 設計哲學。

**難度曲線**:第 1~8 題建立惰性求值與轉接器的直覺(輸出預測為主);第 9~16 題進入
`collect` 型別標註、消耗器與所有權互動的反面案例;第 17~18 題自訂 `Iterator` 實作;
第 19 題 zero-cost 抽象的概念收尾;第 20 題 C# 對照總結。

| # | 考點 | 題型 | 干擾選項方向 | △ | C#對照角度 |
|---|---|---|---|---|---|
| 1 | `Iterator` trait 核心:只需實作 `next()`,回傳 `Option` | 輸出預測 | 以為要實作 `Iterator` 必須同時提供 `map`/`filter` 等所有方法 | 否 | `IEnumerator`/`IEnumerable` 與 `MoveNext`/`Current` |
| 2 | 惰性求值:建立鏈但不消耗時什麼都不執行 | 輸出預測 | 以為 `.map()` 呼叫當下就會把整個集合算完 | 否 | LINQ 延遲執行(deferred execution)完全對應 |
| 3 | `iter()`/`into_iter()`/`iter_mut()` 三兄弟的所有權差異 | 輸出預測 | 以為三者只是命名不同,行為一樣 | 否 | `foreach` 對 C# 集合永遠是唯讀走訪,沒有這種三分法 |
| 4 | 反面:`for x in vec` 之後還想用 `vec`(被 `into_iter` 吃掉所有權) | 反面案例 | 以為 `for` 迴圈永遠只是借用集合 | 是(⛔ note 會點名 `into_iter`/`IntoIterator`) | `foreach` 絕不會讓 collection 失效 |
| 5 | `map()`/`filter()` 惰性轉接 | 輸出預測 | 以為 `map()` 會立刻回傳 `Vec`;以為 `filter` 閉包要回傳 `Option` | 否 | LINQ `Select`/`Where` |
| 6 | `enumerate()`/`zip()` | 輸出預測 | 以為 `enumerate` 回傳順序是 (索引,值);以為 `zip` 長度不同會 panic | 否 | 手動維護 index 變數;`Zip` 較少見於 LINQ |
| 7 | 反面:對只實作 `Iterator`、沒有實作 `DoubleEndedIterator` 的自訂型別呼叫 `rev()` | 反面案例 | 以為 `rev()` 對任何 iterator 都能用,不需要額外的能力保證 | 否 | LINQ `Reverse()` 沒有這種「型別要多實作一個介面」的限制 |
| 8 | `collect()` 型別標註:turbofish 或變數標註擇一 | 設計選擇 | 以為一定要 turbofish,變數標註不合法 | 否 | `ToList<T>()` 明確型別 |
| 9 | 反面:`collect()` 缺乏型別資訊,`type annotations needed` | 反面案例 | 以為 `collect` 永遠預設收集成 `Vec` | 否 | `ToList()` 不需要額外標註 |
| 10 | `collect()` 收進 `HashMap` 或 `Result<Vec<T>,E>`(短路收集) | 輸出預測 | 以為收集 `Result` 遇到第一個 `Err` 仍會把其餘 `Ok` 收集起來 | 否 | LINQ 沒有原生「短路收集 Result」概念 |
| 11 | 反面:`fold` 的累加閉包回傳型別跟初始值型別不一致 | 反面案例 | 以為 `fold` 初始值型別必須跟元素型別相同,不會注意累加閉包本身的回傳型別 | 否 | `Aggregate()` 對型別不符一樣是編譯期泛型推斷錯誤 |
| 12 | `any()`/`all()` 短路布林檢查 | 輸出預測 | 以為 `any`/`all` 會走訪整個序列而不提前停止 | 否 | `Any()`/`All()` 一樣短路 |
| 13 | 反面:把 `find()` 的回傳值(`Option<&T>`)誤當成索引直接拿去索引陣列 | 反面案例 | 把 `find()` 誤認成回傳索引(跟 `position()` 搞混) | 否 | `FirstOrDefault()` 回傳元素、跟回傳索引的 `FindIndex` 是兩個方法,C# 也會犯同樣的搞混 |
| 14 | 反面:消耗器用完 iterator 後再次使用 | 反面案例 | 以為 iterator 跟集合一樣可以重複走訪 | 否 | `IEnumerable` 視實作可能可重新列舉,`Iterator` 是一次性狀態機 |
| 15 | 反面:鏈式呼叫中途對已被 `.iter()` 借用的集合又想可變借用 | 反面案例 | 以為 `filter`/`map` 產生的新 iterator 不再借用原集合 | 否 | C# 沒有這層借用檢查,foreach 中修改集合是執行期例外才發現 |
| 16 | 為自訂型別實作 `Iterator`:只寫 `next()`,自動獲得全部轉接器 | 輸出預測 | 以為要自己手動實作 `map` 才能對自訂 `Iterator` 呼叫 `.map()` | 否 | 實作 `IEnumerator<T>` 後 LINQ 方法同樣全部免費取得 |
| 17 | 反面:自訂 `Iterator` 忘記處理 `next()` 回傳 `None` 的結束條件,造成無窮迴圈 | 反面案例 | 以為 `collect`/`for` 會自動偵測「重複回傳同值」當結束 | 否 | 手寫 `MoveNext` 忘記結束條件同樣會無窮迴圈,兩邊風險相同 |
| 18 | zero-cost 抽象:編譯後的鏈式呼叫與手寫 `for` 迴圈效能相同 | 設計選擇 | 以為函數式鏈式呼叫一定比手寫迴圈慢(誤以為有額外物件配置) | 否 | LINQ 委派呼叫有虛擬分派/裝箱成本,Rust 單態化後等同手寫迴圈 |
| 19 | 迭代器與集合操作混用時常見的所有權選擇(`iter()` vs `into_iter()` 該選哪個) | 設計選擇 | 以為「借用版本」永遠比較安全所以永遠該選 `iter()` | 否 | 對比 C# 沒有這種選擇成本,foreach 一律借用 |
| 20(總結) | C# 對照:LINQ 與 Rust 迭代器鏈同樣的延遲執行哲學,但 LINQ 每個運算子是委派呼叫(虛擬分派/裝箱成本),Rust 編譯期單態化後等同手寫迴圈 | 設計選擇 | 無 | 否 | 本題即總結 |

---

## lesson2-3 智慧指標與內部可變性

**課程目標**:理解 `Box`/`Rc`/`RefCell` 各自解決什麼問題,以及 `Rc<RefCell<T>>` 這個組合
慣用法背後「多重擁有 + 需要修改」的動機,和 `Weak<T>` 如何打破循環參考。

**難度曲線**:第 1~4 題 `Box<T>` 與 `Drop`(輸出預測);第 5~10 題 `Rc`/`RefCell` 各自的
行為與反面案例(執行期 panic 是本課第一次出現的新錯誤形態,要講清楚它跟編譯期借用檢查的
差異);第 11~15 題 `Rc<RefCell<T>>` 組合與 `Weak`;第 16~19 題 `Deref` 與決策題;
第 20 題 C# 對照總結。

| # | 考點 | 題型 | 干擾選項方向 | △ | C#對照角度 |
|---|---|---|---|---|---|
| 1 | `Box<T>`:heap 配置單一值,離開作用域自動釋放 | 輸出預測 | 以為 `Box<T>` 需要手動釋放記憶體 | 否 | C# 所有 class 物件本來就在 heap 上,不需要包裝 |
| 2 | 反面:遞迴 enum(`Cons(i32, List)`)沒有 `Box` 導致大小無限 | 反面案例 | 以為只要有 `Nil` 結尾變體,enum 就能自我遞迴 | 否 | C# class 是參考型別,遞迴定義天經地義 |
| 3 | `Box<T>` 打斷無限大小,`.method()` 呼叫自動穿透 `Box`(auto-deref) | 輸出預測 | 以為透過 `Box` 存取欄位/方法要手動 `(*box_val).field` | 否 | C# 參考型別存取欄位天生不用解參考語法 |
| 4 | `Drop`:值離開作用域自動呼叫,巢狀結構由內而外釋放 | 輸出預測 | 以為釋放順序是宣告順序而非反向 | 否 | C# `Dispose` 需手動呼叫或 `using`,GC 釋放時機不可預期 |
| 5 | `Rc<T>`:多重擁有者,`clone()` 只加計數不複製資料 | 輸出預測 | 以為 `Rc::clone()` 跟一般 `.clone()` 一樣是深拷貝 | 否 | 每個 class 物件本來就是「隱含 Rc」——GC 靠可達性分析 |
| 6 | 反面:對 `Rc<T>` 內容直接嘗試修改(`Rc` 本身不給可變存取) | 反面案例 | 以為 `Rc::clone()` 之後每個複本各自獨立可修改 | 否 | C# 物件參考複製後仍指向同一物件,天生可透過任一參考修改 |
| 7 | 反面:`strong_count` 大於 1 時仍假設 `Rc::get_mut()` 一定回傳 `Some` 並直接 `unwrap()` | 反面案例 | 以為 `Rc::clone()` 之後,任一個複本呼叫 `get_mut()` 都能拿到可變參考 | 否 | GC 沒有暴露「目前有幾個參考」的計數可查,C# 也沒有等價的「多重擁有時取可變存取要失敗」機制 |
| 8 | `RefCell<T>`:內部可變性,`borrow()`/`borrow_mut()` 回傳 `Ref`/`RefMut` | 輸出預測 | 以為 `RefCell` 讓你繞過所有借用規則(可同時多個可變借用) | 否 | C# 從來沒有「借用規則」,任何時候都能讀寫欄位 |
| 9 | 反面:同時持有 `borrow()` 與 `borrow_mut()` 造成執行期 panic | 反面案例 | 以為 `RefCell` 的借用衝突會在編譯期被擋下,跟一般借用規則一樣 | 否 | C# 沒有等價的執行期借用崩潰,這是本題重點差異 |
| 10 | `RefCell` 借用要在短作用域內用完就 drop,避免 panic | 設計選擇 | 以為要手動呼叫某個 unlock 方法才能結束借用 | 否 | 對比 `lock`/`using` 需手動釋放,`Ref`/`RefMut` 靠 `Drop` 自動釋放借用標記 |
| 11 | `Rc<RefCell<T>>`:多重擁有者「都能」修改同一份資料 | 輸出預測 | 以為 `Rc<RefCell<T>>` 跟單純 `RefCell<T>` 行為一樣,clone 只是多包一層 | 否 | 這段話本身就是 C# 每個物件的日常行為,Rust 要組合兩個型別才做到 |
| 12 | 反面:誤以為 `Rc`/`RefCell` 跟 `Box` 一樣天生可以送進另一個執行緒(只講型別限制的推理,不用 thread API,留給 2-7 完整證明) | 反面案例 | 以為 `Rc`/`RefCell` 跟 `Box` 一樣天生可以跨執行緒傳遞 | 否 | C# 物件天生可以被多執行緒共享讀寫(不保證安全),Rust 在編譯期先擋下 |
| 13 | `Weak<T>`:`Rc::downgrade` 取得不影響 `strong_count` 的弱參考,`upgrade()` 回傳 `Option<Rc<T>>` | 輸出預測 | 以為 `Weak` 跟 `Rc` 一樣可以直接解參考取值,不需要 `upgrade` | 否 | C# `WeakReference`,語意接近但 Rust 用 `Option` 強制檢查 |
| 14 | 反面:父子結構用 `Rc<RefCell<>>` 互相持有造成循環參考,`strong_count` 永遠不歸零 | 反面案例 | 以為 Rust 的所有權系統會自動偵測並阻止循環參考 | 否 | C# 的 GC 能偵測並回收循環參考——誠實點出這是 Rust 相對 GC 較弱的一角 |
| 15 | 用 `Weak<T>` 打斷循環參考(選對方向:通常父強子、子弱父) | 設計選擇 | 以為兩個方向都要用 `Weak` 才安全,或該用在較常被存取的那一端 | 否 | C# 從不需要思考哪個方向該用 `WeakReference`,GC 通用處理 |
| 16 | 反面:自訂 Wrapper 型別沒有實作 `Deref`,呼叫內部型別方法失敗 | 反面案例 | 以為只要 struct 只有一個欄位,方法呼叫就會自動代理到內部型別 | 否 | C# 沒有這個痛點,委託模式需手動寫轉發方法但没有「忘記實作」这种编译错误 |
| 17 | 選擇:什麼情境該用 `Box`、什麼情境該用 `Rc`、什麼情境該用 `RefCell` | 設計選擇 | 以為 `Rc` 可以取代 `Box`(多一份計數總是比較安全);以為 `RefCell` 可以取代 `Box` | 否 | 總結 C#「一切都是 Rc<RefCell<T>>」的 GC 世界觀,對照 Rust 顯式選擇的成本 |
| 18 | 綜合:小型樹狀結構(`Rc<RefCell<Node>>` 存 `children`)修改葉節點後從根節點觀察到變化 | 輸出預測 | 以為修改某個 `Rc` 複本指向的資料不會影響其他複本看到的內容 | 否 | C# 樹狀結構本來就是這種共享可變語意,完全不用特別設計 |
| 19 | 反面:對只實作 `Deref`(`Target` 不是 `str`)的自訂智慧指標,直接傳給要求 `&str` 的函式 | 反面案例 | 以為只要型別有實作 `Deref`(不管 `Target` 是什麼),就能自動變成任何需要的借用型別 | 是(⛔ note 會點名 `Deref`) | C# 沒有這種「解參考鏈是否能到達目標型別」的推斷機制 |
| 20(總結) | C# 對照:「C# 每個物件都像 Rc」(GC 自動追蹤存活),Rust 要顯式決定 `Box`(獨佔)/`Rc`(多重擁有)/`RefCell`(內部可變)三選一,並承擔對應的執行期或設計成本 | 設計選擇 | 無 | 否 | 本題即總結 |

---

## lesson2-4 生命週期進階

**課程目標**:把 1-13 學過的「函式級」生命週期規則,延伸到 struct 持有參考、方法、多生命
週期關係、與泛型合用、以及 `'static` bound 最容易誤解的地方。

**難度曲線**:第 1~4 題 struct 持有參考與方法(輸出預測);第 5~14 題進入多生命週期關係、
`T: 'a`、`'static` bound 誤解、常見錯誤訊息解讀的反面案例;第 15~19 題順序規則、子類型化、
高階生命週期 bound(HRTB)概念、綜合題;第 20 題 C# 對照總結。

| # | 考點 | 題型 | 干擾選項方向 | △ | C#對照角度 |
|---|---|---|---|---|---|
| 1 | struct 持有參考 `struct Parser<'a>{ input: &'a str }` 定義與建立實例 | 輸出預測 | 以為 struct 裡多個參考欄位要各自標不同名字的生命週期才合法 | 否 | C# class 欄位持有參考不需要說明存活期 |
| 2 | `impl<'a> Parser<'a>` 方法定義,`&self` 配合省略規則 | 輸出預測 | 以為 impl 區塊的 `<'a>` 跟 struct 定義的 `<'a>` 是兩個不同的生命週期要改名 | 否 | C# 方法不需要宣告「回傳的東西跟 this 活多久」 |
| 3 | 反面:struct 方法回傳「不屬於 self 也不屬於任何參數」的區域參考 | 反面案例 | 以為只要函式裡建立的值最後有 `return` 就沒問題 | 否 | GC 讓這題在 C# 完全不是問題 |
| 4 | 多個生命週期參數:struct 持有兩個不同來源的參考,各自標 `'a`、`'b` | 輸出預測 | 以為兩個參考欄位一定要標同一個生命週期才能定義 | 否 | 延續 2-1「不相干參數不用綁同一個」的直覺,換成 struct 場景 |
| 5 | 反面:`'a`、`'b` 混用時,回傳值想同時滿足兩者卻只標了較短的那個 | 反面案例 | 以為回傳型別想同時滿足兩個參考,標任一個生命週期名字就好 | 否 | C# 完全不用思考「回傳值該綁定哪個參考的存活期」 |
| 6 | `'a: 'b` 語法:`'a` 至少活得跟 `'b` 一樣久 | 輸出預測 | 把 `'a: 'b` 誤認成 trait bound(生命週期當成 trait) | 否 | C# 沒有等價語法,可類比為「外層物件活得比內層長」的隱含事實被顯式聲明 |
| 7 | `T: 'a` bound 的含義:T 裡任何參考都要活得比 `'a` 久,擁有型別自動滿足 | 輸出預測 | 以為 `T: 'a` 要求 T 本身是參考型別 | 否 | C# 泛型沒有等價概念,GC 讓這件事不需要靜態證明 |
| 8 | 反面:泛型函式持有 `&'a T` 且 T 可能含短命參考,卻沒標 `T: 'a` | 反面案例 | 以為函式簽名有 `<'a, T>` 兩個獨立參數,T 就自動被視為 `'a` 安全 | 否 | 同上,對比 C# 無此類檢查 |
| 9 | 反面(本課最大迷思):把常見誤解寫成程式碼——以為 `T: 'static` 要求 T 的實例必須活到程式結束 | 反面案例 | 誤解本身就是選項:「必須活到 main 結束才能用」 | 否 | C# `static` 關鍵字撞名但完全不同概念 |
| 10 | 反面(延續上題):`'static` bound 誤用在明明含短命參考的 T 上 | 反面案例 | 以為加了 `'static` bound 之後,原本活不久的參考就會被「延長」到符合 | 否 | 無等價陷阱 |
| 11 | struct 巢狀持有另一個帶生命週期的 struct | 輸出預測 | 以為外層 struct 不用再宣告 `<'a>`,只要內層自己有就好 | 否 | C# 物件持有另一個物件的參考,存活期完全靠 GC,不用逐層聲明 |
| 12 | 方法回傳的生命週期在 `&self`、其他參數之間手動推翻預設綁定 | 輸出預測 | 以為方法一定綁 self,不可能綁其他參數 | 否 | 延續 1-13 省略規則第三條,這裡練習手動推翻預設 |
| 13 | 常見錯誤訊息解讀:`returns a value referencing data owned by the current function` | 反面案例 | 以為這個錯誤代表「Rust 不支援函式回傳參考」這個大原則本身 | 否 | C# 沒有這個錯誤類別,回傳堆疊物件位址天生無感 |
| 14 | 常見錯誤訊息解讀:`cannot infer an appropriate lifetime`(多個候選,編譯器無法自動決定) | 反面案例 | 以為這個錯誤代表 syntax 寫錯,而不是關係本身有歧義 | 否 | 類比 C# 型別推斷失敗(`var` 的歧義) |
| 15 | 生命週期參數與泛型型別參數共同宣告的順序規則(複習 1-13,延伸到 struct+impl 組合) | 設計選擇 | 以為 struct 上的順序跟 impl 上的順序可以不同 | 否 | C# 泛型類別不存在這個排序問題 |
| 16 | 生命週期子類型化直覺:活得更久的參考可以用在需要活得較短的地方 | 輸出預測 | 以為生命週期之間完全沒有「誰可以替代誰」的關係 | 否 | 類比 C# 協變(covariance),機制完全不同但直覺類似 |
| 17 | 反面:把活得較短的參考硬塞進要求活得較久的位置(方向顛倒) | 反面案例 | 以為生命週期跟型別一樣,標註寫的名字對就好,不管長短 | 否 | 延續上題 C# 協變類比 |
| 18 | 高階生命週期 bound(HRTB)`for<'a>` 的直覺介紹(多數情況編譯器自動推導,不用手寫) | 輸出預測 | 以為所有接收參考參數的閉包都要手寫 `for<'a>` 語法 | 否 | C# 完全沒有等價概念 |
| 19 | 綜合:函式回傳的迭代器持有輸入切片的參考,標註生命週期讓呼叫端安全使用 | 輸出預測 | 以為回傳 `impl Iterator<Item=&str>` 不需要額外生命週期標註就能編譯 | 否 | C# `yield return` 的迭代器方法靠執行期例外而非編譯期保證 |
| 20(總結) | C# 對照:GC 讓 C# 物件圖從不需要「誰的存活期依賴誰」的靜態證明;Rust 把這件事做成可組合、可傳遞的型別系統一部分 | 設計選擇 | 無 | 否 | 本題即總結 |

---

## lesson2-5 Trait 進階與 Trait 物件

**課程目標**:分清楚靜態分派(泛型/`impl Trait`)與動態分派(`dyn Trait`)的差異,知道
`Box<dyn Trait>` 的限制(object safety),並學會運算子重載、supertrait、完全限定語法、
用 newtype 繞孤兒規則這些進階 trait 應用。

**難度曲線**:第 1~6 題靜態/動態分派與 object safety(反面案例集中出現);第 7~16 題
關聯型別、運算子重載、supertrait、完全限定語法的核心題;第 17~19 題 trait object 生命
週期 bound 與綜合題;第 20 題 C# 對照總結。

| # | 考點 | 題型 | 干擾選項方向 | △ | C#對照角度 |
|---|---|---|---|---|---|
| 1 | 靜態分派:泛型/`impl Trait` 編譯期單態化,每個具體型別各一份程式碼 | 輸出預測 | 以為泛型函式在執行期才決定要跑哪個型別的版本 | 否 | C# 泛型有一定程度特化,但跟 Rust 單態化的徹底程度不同 |
| 2 | 動態分派:`dyn Trait` 執行期透過 vtable 查表呼叫 | 輸出預測 | 以為 `dyn Trait` 呼叫方法完全沒有額外成本 | 否 | C# interface 呼叫「全部」是虛擬呼叫,沒有 Rust 這種可選分野 |
| 3 | `Box<dyn Trait>`:`Vec<Box<dyn Shape>>` 混裝不同具體型別 | 輸出預測 | 以為 `Vec` 裡只能放同一種具體型別 | 否 | C# `List<IShape>` 混裝不同 class 是原生自然寫法 |
| 4 | 反面:試圖用 `Vec<dyn Shape>`(沒有 `Box`)裝不同大小的具體型別 | 反面案例 | 以為 `dyn Shape` 本身就是可以直接存進容器的型別 | 是(⛔ note 會點名 `Sized`) | C# interface 本身就是參考型別,不會遇到「大小未知」問題 |
| 5 | object safety:trait 方法回傳 `Self` 或有泛型方法就不能做成 `dyn Trait` | 反面案例 | 以為只要方法都有 `&self` 接收者,不管簽名長什麼樣都能 `dyn` 化 | 否 | C# interface 沒有「不能被當介面參考使用」這種限制 |
| 6 | 反面:在 `dyn Trait` 型別上呼叫不物件安全的方法,編譯期在定義處就被拒絕 | 反面案例 | 以為只有「使用到」那個方法時才會出錯,定義 `dyn` 型別本身沒事 | 否 | Rust 在型別定義處就檢查,而非等呼叫才報錯 |
| 7 | 關聯型別(`type Item`)vs 泛型參數:一個型別對某 trait 只會有一種實作時適合關聯型別 | 設計選擇 | 以為關聯型別跟泛型參數只是語法糖,任何情境都能互換 | 否 | C# 泛型 interface(`IEnumerator<T>`)允許同型別多次以不同 T 實作,Rust 關聯型別刻意限制一種 |
| 8 | 反面:同一型別想對同一 trait 用不同關聯型別「實作兩次」 | 反面案例 | 以為關聯型別可以像泛型 trait 一樣對同一型別實作多次 | 否 | C# 允許一個 class 實作 `IComparable<int>` 與 `IComparable<string>` 兩次 |
| 9 | 運算子重載:實作 `std::ops::Add` 讓 `+` 可用 | 輸出預測 | 以為要實作一個叫 `operator+` 的特殊方法名(C# 式思維) | 否 | C# `static operator+(T a, T b)` 語法差異但概念相通 |
| 10 | 反面:自訂型別忘記實作 `Add` 卻直接用 `+` | 反面案例 | 以為只要兩個欄位都是數字型別,struct 本身就自動支援 `+` | 是(⛔ note 會點名 `Add`) | C# 同樣要明確加運算子多載,不加也不能用 `+`,這點兩邊一致 |
| 11 | 預設泛型參數:`Add<Rhs=Self>` 的 `Rhs` 預設等於 `Self`,可自訂讓異型別相加 | 輸出預測 | 以為 `Add` 的兩個運算元永遠必須是同一型別 | 否 | C# `operator+` 可自由多載不同參數型別,概念類似但機制不同 |
| 12 | supertrait:子 trait 要求實作者「同時」實作另一個 trait | 輸出預測 | 以為 supertrait 只是「建議」,不實作父 trait 子 trait 仍能正常運作 | 否 | C# interface 繼承(`interface IB:IA`)語法相似但 Rust 是約束不是繼承 |
| 13 | 反面:實作子 trait 卻沒實作它要求的 supertrait | 反面案例 | 以為訂了 supertrait bound 之後父 trait 方法會自動被繼承 | 否 | 延續上題 C# 介面繼承類比,強調差異 |
| 14 | 完全限定語法 `<Type as Trait>::method(&x)` 解決兩個 trait 同名方法的歧義 | 輸出預測 | 以為 Rust 會用「離呼叫最近的 impl」規則自動決定呼叫哪一個 | 否 | C# 顯式介面實作 `((IA)obj).Method()`,概念高度相似 |
| 15 | 反面:兩個 trait 都有同名方法且都被實作,直接 `x.method()` 產生歧義 | 反面案例 | 以為 Rust 會選「後被 impl 的那個」或按字母排序 | 否 | C# 用介面型別宣告的變數會自動選對方法,只有具體型別變數才撞名 |
| 16 | newtype pattern 繞過孤兒規則:為外部型別實作外部 trait 的具體案例(換一個運算子重載/其他 trait 情境,不重複 1-12 的 `Display` 案例) | 輸出預測 | 以為 newtype 只能用在 `Display` 這種單一情境 | 否 | C# 沒有孤兒規則限制,但擴充方法不能讓型別「成為」某介面的實作 |
| 17 | trait object 的預設生命週期 bound:`Box<dyn Trait>` 預設隱含 `'static`,要顯式標 `Box<dyn Trait + 'a>` 才能包含較短命的參考(呼應 2-4,不重講規則本身) | 輸出預測 | 以為 `Box<dyn Trait>` 永遠只能包 `'static` 資料 | 否 | C# 沒有等價限制,interface 參考想包多短命的物件都行,全靠 GC |
| 18 | 反面:把持有非 `'static` 參考的具體型別裝進 `Box<dyn Trait>`(沒標 `+'a`) | 反面案例 | 以為具體型別本身能編譯,包進 `Box<dyn Trait>` 就不會有額外生命週期限制 | 否 | 同上,對比 C# 毫無此限制 |
| 19 | 綜合:結合 2-2 的 `Iterator::Item`,鞏固「一個型別多種行為用泛型 trait、單一固定行為用關聯型別」的判斷 | 設計選擇 | 以為 `Iterator` 用關聯型別純粹是歷史包袱,設計成泛型 trait 也完全等價 | 否 | `IEnumerator<T>` 用泛型 interface 實現同樣效果,兩種設計哲學的取捨總結 |
| 20(總結) | C# 對照:interface 方法呼叫在 C# 全部是虛擬呼叫;Rust 把靜態/動態分派做成顯式選項,多一層選擇也多一層效能與彈性的取捨空間 | 設計選擇 | 無 | 否 | 本題即總結 |

---

## lesson2-6 錯誤處理進階

**課程目標**:會定義自訂錯誤型別並用 `From` 讓 `?` 自動轉換,分清楚 library 該用具體錯誤、
application 該用萬用錯誤的設計慣例,並知道 thiserror/anyhow 分別解決什麼問題。

**難度曲線**:第 1~4 題自訂錯誤型別與 `Box<dyn Error>`(輸出預測與第一個反面案例);
第 5~8 題 `From` 讓 `?` 自動轉換的核心去糖鏈(本課 △ 最集中的區段);第 9~13 題錯誤設計
慣例與 thiserror/anyhow 概念(設計選擇為主);第 14~19 題 `main` 回傳 `Result`、錯誤鏈、
綜合題;第 20 題 C# 對照總結。

| # | 考點 | 題型 | 干擾選項方向 | △ | C#對照角度 |
|---|---|---|---|---|---|
| 1 | 自訂錯誤型別:derive `Debug` + 手動 `impl Display` | 輸出預測 | 以為錯誤型別只要 derive `Debug` 就能被 `{}` 印出來 | 否 | 對比自訂 Exception 子類別的 `Message` 屬性 |
| 2 | 反面:自訂錯誤型別只 `impl Display`、沒有 `derive`/`impl Debug` 就想滿足 `Error`(`Error: Debug + Display` 缺的是另一半) | 反面案例 | 以為 `Error` trait 要求實作一堆方法(像 C# Exception 要覆寫很多成員),忽略真正卡住的是 `Debug` | 否 | C# `Exception` 基底類別自帶 `StackTrace`/`InnerException`,Rust 的 `Error` 極簡但仍有 `Debug+Display` 這個門檻 |
| 3 | 反面:自訂錯誤型別沒有實作 `Display` 就無法滿足 `Error`(`Error: Debug + Display`) | 反面案例 | 以為 derive `Debug` 之後,`Display` 也會一起自動生成 | 是(⛔ note 會點名 `Display`) | C# `Exception.Message` 是內建的,不需要另外實作一個格式化介面 |
| 4 | `Box<dyn Error>` 統一收斂多種不同的具體錯誤型別當回傳型別 | 輸出預測 | 以為 `Box<dyn Error>` 只能裝標準庫定義好的錯誤 | 否 | C# 函式簽名從不宣告會丟哪種例外(vs Java checked exception) |
| 5 | `From` 實作讓 `?` 自動轉換錯誤型別 | 輸出預測 | 以為 `?` 可以把任何錯誤型別轉換成任何回傳型別,不需要事先 `impl From` | 否 | C# `catch(Exception e)` 搭配手動 `throw new WrapperException(e)`,Rust 靠 `?`+`From` 自動化 |
| 6 | 反面:對 `Result<_,SomeError>` 用 `?`,但函式回傳 `Result<_,MyError>` 又沒有 `impl From<SomeError> for MyError` | 反面案例 | 以為 `?` 型別不合時會自動用 `Debug` 格式硬轉;以為兩個錯誤型別都實作 `Error` 就能互轉 | 是(⛔ note 會點名 `From`) | C# 沒有等價的編譯期檢查,執行期才會發現漏接的例外 |
| 7 | 反面:自訂錯誤型別想同時對兩種底層錯誤(`io::Error` 與 `ParseIntError`)都支援 `?`,卻試圖用一個泛型 `impl<E> From<E> for MyError` 涵蓋所有來源 | 反面案例 | 以為可以寫一個泛型 `impl<E> From<E>` 涵蓋所有底層錯誤型別 | 是(⛔ note 會點名 `From`;本題也是 AUTHORING §4 `?` 去糖示範的落點) | C# 的 `catch` 可以疊多個 `catch(IOException)`/`catch(FormatException)` 各自處理,Rust 需要針對每個來源分別 `impl` |
| 8 | `Box<dyn Error>` 搭配 `?` 的自動轉換:任何實作 `Error` 的具體型別透過 blanket `impl From<E> for Box<dyn Error>` 自動裝箱 | 輸出預測 | 以為要幫每種可能的錯誤型別各自手動 `impl From<X> for Box<dyn Error>` | 否 | C# 所有例外天生都能被 `catch(Exception e)` 接住,Rust 靠 blanket impl 做到類似效果 |
| 9 | 錯誤設計慣例:library 該用具體、封閉的錯誤 enum(讓呼叫端能 `match` 處理不同情況) | 設計選擇 | 以為 library 也該貪圖方便直接回傳 `Box<dyn Error>` 省事 | 否 | 對比 .NET 函式庫慣例拋出具體的 Exception 子類別 |
| 10 | 錯誤設計慣例:application 該用萬用錯誤(`Box<dyn Error>`/`anyhow::Error`)省去逐層定義的成本 | 設計選擇 | 以為 application 層也該像 library 一樣為每個模組定義專屬錯誤 enum | 否 | C# 應用程式最上層通常 `catch(Exception)` 兜底 |
| 11 | thiserror 概念(不要求實際使用):derive 巨集自動生成 `Display`/`Error`/`From` 樣板 | 輸出預測 | 以為 thiserror 是執行期函式庫,引入後程式變慢 | 否 | C# 沒有對應套件,因為 Exception 的訊息/繼承機制是語言內建的 |
| 12 | anyhow 概念(不要求實際使用):`Result<T, anyhow::Error>` 搭配 `.context()` 附加除錯訊息 | 輸出預測 | 以為 `anyhow::Error` 跟 `Box<dyn Error>` 完全是同一個東西改個名字 | 否 | C# `Exception.InnerException` 鏈與 `.context()` 附加訊息鏈的用途類似 |
| 13 | 何時用 thiserror、何時用 anyhow(承接 9、10 的分野) | 設計選擇 | 以為兩個套件互斥選擇,一個專案只能挑一個 | 否 | 「函式庫回饋精確資訊 vs 應用層要方便」的分工在兩個生態圈都存在 |
| 14 | 反面:`main` 回傳 `Result<(), MyError>`,但 `MyError` 沒有實作 `Debug`(`main` 的 `Err` 型別被要求 `Debug`) | 反面案例 | 以為 `main` 的回傳型別只能是 `()` 或 `i32`,不知道 `Result` 版 `main` 對 `Err` 型別有隱含要求 | 否 | C# `Main` 回傳 `int` 當 exit code,未捕捉例外時印出完整 stack trace,兩邊都需要「能被印出來」的錯誤資訊 |
| 15 | source() 方法讓錯誤可以像 C# InnerException 一樣一路往下追根本原因 | 輸出預測 | 以為 Rust 沒有對應機制,追根究底得自己手動塞欄位 | 否 | C# `InnerException` 屬性,`source()` 是 Rust 的標準化對應 |
| 16 | 反面:多層函式呼叫鏈,某層漏加 `?` 導致回傳型別不符(巢狀 `Result<Result<T,E>,E>`) | 反面案例 | 以為 `?` 只是「錦上添花」的簡寫,不加也不影響型別是否正確 | 否 | C# 沒有型別層級的等價錯誤,提示 Rust 把疏忽提前到編譯期 |
| 17 | 反面:巢狀函式呼叫鏈中,中間層把下層 `Result<T,E>` 直接當 `T` 使用 | 反面案例 | 以為 `Result<T,E>` 沒被使用時只是警告,執行不會有問題 | 否 | C# 忽略例外的等價行為是沒寫 `try/catch`,執行期直接崩潰;Rust 在型別層先擋 |
| 18 | 綜合:比較「回傳具體 `Result<T, MyError>`」vs「回傳萬用 `Result<T, Box<dyn Error>>`」對呼叫端能否 `match` 細分處理的差異 | 設計選擇 | 以為兩種寫法對呼叫端完全沒有差別,只是型別名字不同 | 否 | C# 呼叫端 `catch(SpecificException)` 與 `catch(Exception)` 的權衡,原則相通 |
| 19 | 反面(綜合):對同一個底層錯誤型別(如 `io::Error`)不小心重複寫了兩次 `impl From<io::Error> for MyError` | 反面案例 | 以為多寫一次 `impl From` 只是無害的重複,編譯器會自動合併 | 否(reader 自己寫的程式碼裡已出現 `From` 字面,錯誤訊息雖點名 `From` 但不算「沒寫過」) | C# 多層 `catch` 各自處理不會有這種「重複定義」的編譯錯誤,Rust 靠型別系統把轉換收斂成一次 `impl` 也代表不能重複 |
| 20(總結) | C# 對照:exception 階層(繼承樹、執行期拋出、逐層 catch)vs Rust 錯誤型別組合(`Result` 顯式回傳、`?` 自動傳遞、`From` 做轉換膠水)——函式簽名是否誠實描述會失敗 | 設計選擇 | 無 | 否 | 本題即總結 |

---

## lesson2-7 並行程式設計(Concurrency)

**課程目標**:會用 `thread::spawn`/`join`、`mpsc::channel`、`Arc<Mutex<T>>` 寫多執行緒程式,
並看懂 `Send`/`Sync` 如何在編譯期防止資料競爭——這是本課的核心亮點。

**難度曲線**:第 1~4 題 `thread::spawn`/`join` 與 `move` 閉包(第一個反面案例是本課入門
最大的坑);第 5~7 題 `mpsc::channel`;第 8~13 題 `Mutex`/`Arc`/`Send`/`Sync`(亮點段落,
反面案例集中);第 14~18 題組合慣用法與死鎖;第 19~20 題設計哲學與 C# 對照總結。

| # | 考點 | 題型 | 干擾選項方向 | △ | C#對照角度 |
|---|---|---|---|---|---|
| 1 | `thread::spawn` 基本用法,回傳 `JoinHandle` | 輸出預測 | 以為 `thread::spawn` 是同步阻塞呼叫,會先等執行緒跑完才往下走 | 否 | `new Thread(...).Start()`/`Task.Run(...)` |
| 2 | `join()` 阻塞等待執行緒結束並取得回傳值 | 輸出預測 | 以為不呼叫 `join()`,主執行緒結束時子執行緒仍保證跑完 | 否 | `Thread.Join()`/`Task.Wait()` |
| 3 | 反面:`thread::spawn` 的閉包借用外部變數(沒有 `move`),因無法保證存活期而編譯失敗 | 反面案例 | 以為只要子執行緒理論上會在主執行緒結束前完成,借用參考就是安全的 | 否 | C# lambda 送進 `Task.Run` 永遠合法借用外部變數(委派保留引用,GC 延命),Rust 編譯期直接擋下 |
| 4 | `move` 解決上題:閉包取得所有權,不再依賴外部存活期 | 輸出預測 | 以為加 `move` 後,原變數在主執行緒還能繼續使用 | 否 | C# 沒有這個「原變數失效」的概念 |
| 5 | 反面:`mpsc::channel` 建立後直接對 `Receiver` 呼叫 `.clone()`(`Receiver` 沒有實作 `Clone`,mpsc 是 multi-producer *single*-consumer) | 反面案例 | 以為 `Receiver` 也可以像 `Sender` 一樣 clone 出多個 | 否 | `System.Threading.Channels` 的 `ChannelReader` 同樣不設計成多消費者各自獨立讀取同一份 |
| 6 | `send()`/`recv()`:沒有訊息時 `recv()` 阻塞,所有 `Sender` 都被 drop 後回傳 `Err` | 輸出預測 | 以為 `recv()` 沒訊息時回傳 `None` 而不是阻塞或 `Err` | 否 | `BlockingCollection<T>.Take()` 的阻塞語意 |
| 7 | 反面:對已經被 `move` 進 `thread::spawn` 的 `Sender`,在主執行緒又想繼續使用 | 反面案例 | 以為 channel 的 `Sender` 像 `Rc` 一樣共享,不會真的被 `move` 走 | 否 | C# channel 的 `Writer`/`Reader` 本身是參考,傳進 Task 永遠共享同一份 |
| 8 | 共享狀態:`Mutex<T>` 包住資料,`lock()` 回傳 `MutexGuard`,離開作用域自動解鎖 | 輸出預測 | 以為 `Mutex` 要手動呼叫 `unlock()` 才會釋放鎖 | 否 | `lock` 語句/`Monitor.Enter`+`Exit` 需手動搭配 `using`,Rust 靠 `Drop` 自動處理 |
| 9 | 反面:誤以為 `Arc<T>` 跟 `Rc<T>` 一樣,直接對 `Arc` 包住的資料嘗試可變存取(`Arc` 本身也不提供可變借用) | 反面案例 | 以為換成 `Arc` 之後「執行緒安全」就等於「可以直接修改」 | 否 | C# 參考計數式思維沒有這種區分,對照凸顯 `Arc` 仍需搭配 `Mutex` 才能修改 |
| 10 | 反面:把 `Rc<T>`(而非 `Arc<T>`)送進 `thread::spawn`,編譯器拒絕(`Rc` 不是 `Send`) | 反面案例 | 以為只要資料本身不可變,`Rc` 跨執行緒共享就沒問題(沒考慮到參考計數本身的競爭) | 是(⛔ note 會點名 `Send`) | C# 任何物件都能被多執行緒共享參考(不保證安全,但編譯器不擋),Rust 型別系統先擋下 |
| 11 | `Send` trait:型別的所有權可安全轉移到另一執行緒,由編譯器自動推導 | 輸出預測 | 以為 `Send` 要跟 `Sync` 一樣自己手動 `impl`,不是自動推導 | 否 | C# 沒有等價的靜態標記,能否安全跨執行緒全靠開發者自己判斷 |
| 12 | `Sync` trait:型別的參考可安全被多執行緒同時持有,與 `Send` 的差異 | 輸出預測 | 以為 `Send` 和 `Sync` 是同一件事的兩個名字 | 否 | 強調 Rust 把兩種不同的「安全」拆成兩個獨立、可各自推導的 trait |
| 13 | 反面:自訂型別內部用 `RefCell`,自動推導出的 `Sync` 被拒絕,嘗試跨執行緒共享在編譯期被擋下(本課亮點) | 反面案例 | 以為只要把型別包進 `Arc`,不管內部是 `RefCell` 還是 `Mutex` 都能安全跨執行緒 | 是(⛔ note 會點名 `Sync`) | C# 完全沒有這層編譯期防護,同樣的非執行緒安全存取模式要等執行期資料競爭 bug 才會發現 |
| 14 | `Arc<Mutex<T>>` 組合慣用法:多執行緒共享並修改同一份資料(呼應 2-3 的 `Rc<RefCell<T>>`,換成執行緒安全版本) | 輸出預測 | 以為 `Arc<Mutex<T>>` 跟 `Rc<RefCell<T>>` 可以在多執行緒程式裡互換使用 | 否 | C# `ConcurrentDictionary` 等執行緒安全集合把鎖包在內部 |
| 15 | 反面:死鎖情境——多個執行緒各自 `lock()` 兩個相同的 `Mutex` 但順序不同 | 反面案例 | 以為 Rust 的所有權/借用系統也能在編譯期防止死鎖(誠實點出這是 Rust 防護的邊界) | 否 | C# `lock` 順序死鎖是同一類問題,Rust 的編譯期保證在這裡幫不上忙 |
| 16 | 反面:同一執行緒內重複 `lock()` 同一個非重入 `Mutex`(自己鎖自己) | 反面案例 | 以為 Rust 的 `Mutex` 跟 C# `lock` 一樣預設可重入 | 否 | C# `Monitor` 是可重入的,`std::sync::Mutex` 不是——重要差異點 |
| 17 | 標準庫沒有內建執行緒安全集合,慣例是 `Arc<Mutex<HashMap<K,V>>>` | 設計選擇 | 以為 Rust 標準庫一定也有現成的執行緒安全 `HashMap`,只是命名不同 | 否 | `ConcurrentDictionary` 開箱即用,Rust 選擇「組合基礎元件」而非「提供專用容器」 |
| 18 | 綜合:多執行緒共享一個 `Receiver` 需要 `Arc<Mutex<Receiver>>` 包裝(worker pool 雛形) | 輸出預測 | 以為 `Receiver` 可以直接 clone 分給多個 worker 執行緒 | 否 | C# `Channel<T>` 的 `Reader` 原生支援多消費者同時讀取 |
| 19 | 綜合:「共享狀態(`Arc<Mutex<T>>`)」與「訊息傳遞(`mpsc::channel`)」兩種並行設計的取捨 | 設計選擇 | 以為 Rust 推薦只用 channel、完全不該用 `Mutex` | 否 | 對比 C# async/Task+ConcurrentCollection 混用習慣,兩種模型在 C# 也並存 |
| 20(總結) | C# 對照:`Thread`/`Task`、`lock`、`ConcurrentDictionary` 都是執行期防護;Rust 用 `Send`/`Sync` 在編譯期擋下資料競爭,但死鎖仍是兩邊共同的執行期風險 | 設計選擇 | 無 | 否 | 本題即總結 |

---

## lesson2-8 非同步程式設計(async/await)

**課程目標**:理解 `Future` 是惰性的(對照 C# `Task` 建立即執行的關鍵差異),知道為什麼需要
runtime、`join!`/`select!`/`spawn` 的並發語意,以及 async 與所有權/生命週期的互動。

**難度曲線**:第 1~5 題 `async`/`.await`/runtime 的第一層認知震撼(C# 開發者最容易誤解的
地方,反面案例提前出現);第 6~10 題並發原語與 `async move`;第 11~15 題 `Future`
去糖與所有權互動(本課 △ 集中段);第 16~19 題何時用 async/thread 與綜合;第 20 題總結。

| # | 考點 | 題型 | 干擾選項方向 | △ | C#對照角度 |
|---|---|---|---|---|---|
| 1 | `async fn` 呼叫後不會立刻執行,回傳實作 `Future` 的值(惰性) | 輸出預測 | 以為呼叫 `async fn` 跟一般函式一樣立刻執行到底 | 否 | C# `async` 方法呼叫時立刻同步執行到第一個 `await` 點——最大模型差異 |
| 2 | 反面:呼叫 `async fn` 後沒有 `.await` 也沒交給 runtime,誤以為副作用已發生 | 反面案例 | 以為 `Future` 跟 C# `Task` 一樣「建立了就等於已經開始執行」 | 否 | 本課第一個關鍵陷阱,承上題延伸 |
| 3 | `.await` 做了什麼:把控制權交還 runtime,直到 `Future` 就緒才繼續 | 輸出預測 | 以為 `.await` 只是單純「等」,不涉及交出控制權 | 否 | C# `await` 語法幾乎一樣,但底層排程機制不同 |
| 4 | 為什麼需要 runtime(tokio):Rust 只定義 `Future` trait,不內建執行器,`#[tokio::main]` 把 `main` 包成 runtime 啟動 | 輸出預測 | 以為只要程式裡用了 `async fn` 就自動有 runtime 在跑 | 否 | C# 內建執行緒池與 `SynchronizationContext` 當預設 runtime |
| 5 | 反面:在沒有 runtime 的普通 `fn main` 裡直接呼叫 `.await` | 反面案例 | 以為 `.await` 可以在任何函式裡呼叫,只要有引入 tokio crate 就好 | 否 | C# 沒有等價限制,`await` 只要求方法標 `async` |
| 6 | `join!`:並發執行多個 `Future` 並等全部完成,取得 tuple 結果 | 輸出預測 | 以為 `join!` 是依序執行完一個才開始下一個 | 否 | `Task.WhenAll` |
| 7 | `select!`:多個 `Future` 賽跑,先完成的先用,其餘被丟棄 | 輸出預測 | 以為 `select!` 會等所有分支都完成才繼續 | 否 | `Task.WhenAny`,但 `select!` 丟棄其他分支的語意更強 |
| 8 | `tokio::spawn`:把 `Future` 丟給 runtime 獨立排程執行 | 輸出預測 | 以為跟 `thread::spawn` 一樣建立作業系統執行緒(其實是協作式排程) | 否 | `Task.Run`,但背後是協作式排程,單執行緒也能跑很多個 task |
| 9 | 反面:`tokio::spawn` 的 async 區塊捕獲非 `'static` 的借用參考 | 反面案例 | 以為 async task 跟一般函式呼叫一樣,只要在呼叫的作用域內資料還活著就沒事 | 否 | 對比 2-7 `thread::spawn` 要求 `'static` 的同款陷阱,換成 async 情境 |
| 10 | `async move`:把捕獲變數的所有權移進產生的狀態機(對比 2-1/2-7,強調「移進的是狀態機、可能被搬到任意時刻才驅動」的新角度) | 輸出預測 | 以為 `async move` 跟一般 `move` 閉包效果完全相同,沒有額外的「延後執行」含義 | 否 | C# 沒有等價語法,委派捕獲一律靠 GC |
| 11 | △專題:`async fn f() -> T` 去糖成 `fn f() -> impl Future<Output = T> { async move { .. } }`(函式簽名本身就是一層糖) | 反面案例 | 以為 `async fn` 的回傳型別就是 T 本身,呼叫端能直接把回傳值當 T 用 | 是(⛔ note 會點名 `Future`) | C# 的 `async Task<T>` 方法簽名裡 `Task<T>` 是看得見的,不像 Rust 藏在 `async` 關鍵字背後 |
| 12 | 反面:忘記 `.await` 直接把 `async fn` 呼叫結果當作 T 使用(例如直接做算術) | 反面案例 | 以為 `async fn` 簽名寫著 `-> i32`,結果就真的是 `i32` | 是(⛔ note 會點名 `Future`) | 同上,呼應第 1 題的認知震撼 |
| 13 | 反面:把同一個 `Future` 變數 `.await` 兩次(`Future` 不是 `Copy`,第一次 `.await` 已經把它消耗掉) | 反面案例 | 以為 `Future` 跟一般唯讀值一樣,`.await` 只是「讀取結果」不會消耗自己 | 否(錯誤訊息是 `use of moved value`,未點名 `Future`/`poll` 字面) | C# `Task` 可以被 `await` 多次(結果會被快取重複回傳),這是兩邊行為明顯不同的一點 |
| 14 | async 與生命週期互動:`async fn` 的參數若是參考,產生的 `Future` 天生綁定那個參考的生命週期 | 輸出預測 | 以為 async fn 產生的 `Future` 跟一般函式回傳值一樣不綁定參數存活期 | 否 | C# `Task` 沒有這種綁定,GC 保證捕獲物件不消失 |
| 15 | 反面:`&self` 的 async 方法產生的 `Future` 若被存起來活得比 `self` 久 | 反面案例 | 以為 async 方法回傳的 `Future` 跟一般方法回傳值一樣不會綁定 self 的存活期 | 否 | C# 沒有這個限制 |
| 16 | 何時用 async、何時用 thread:I/O bound 適合 async(輕量、可同時上萬個 task),CPU bound 適合 thread(真正平行) | 設計選擇 | 以為 async 永遠比 thread 快,應該全面取代 thread | 否 | C# `Task` 同樣區分 I/O-bound(`await`)與 CPU-bound(`Task.Run`)的取捨,原則相通 |
| 17 | 反面:在 async task 裡做長時間 CPU 密集運算,阻塞了 runtime 執行緒,拖累其他 task | 反面案例 | 以為 async runtime 跟作業系統排程器一樣,長時間運算不會影響其他 task | 否 | C# 在 `async` 方法裡做同步阻塞運算同樣會餓死執行緒池,兩邊風險相同 |
| 18 | `join!` 與 `spawn` 的差異:`join!` 在同一 task 內並發、不能脫離目前的 `.await` 鏈;`spawn` 產生獨立 task | 設計選擇 | 以為兩者完全等價,只是語法不同 | 否 | 對比 `await Task.WhenAll(a,b)` 與各自 `Task.Run` 後再 `WhenAll` 的差異 |
| 19 | 綜合:async 情境下的生產者/消費者(概念對應 2-7 的 `mpsc`,換成 `tokio::sync::mpsc`,只點出 API 名稱對應不展開新語法) | 輸出預測 | 以為 async 版的 channel 跟同步版完全同一套 API,直接互換能用 | 否 | C# `Channel<T>` 同時支援同步與 async 讀寫,對照兩邊各自要換 API |
| 20(總結) | C# 對照:語法幾乎相同(`async`/`await` 關鍵字對照),但模型不同——C# `Task` 建立即執行、內建執行緒池排程;Rust `Future` 惰性、需要外部 runtime 驅動,這是本課最大的認知陷阱 | 設計選擇 | 無 | 否 | 本題即總結 |

---

## lesson2-9 型別轉換與常用轉換 Trait

**課程目標**:分清楚 `as`/`From`/`Into`/`TryFrom`/`TryInto`/`AsRef`/`Borrow`/`Deref`
coercion/`FromStr` 各自解決的轉換問題,知道什麼情境該選哪一種。

**難度曲線**:第 1~2 題 `as` 轉型與截斷風險;第 3~8 題 `From`/`Into`/`TryFrom`/`TryInto`
(一般值轉換,不涉及 `?`);第 9~14 題 `AsRef`/`Borrow`/`Deref` coercion;第 15~18 題
`ToString`/`FromStr`/`parse`;第 19~20 題綜合與 C# 對照總結。

| # | 考點 | 題型 | 干擾選項方向 | △ | C#對照角度 |
|---|---|---|---|---|---|
| 1 | `as` 轉型:數值型別之間顯式轉換 | 輸出預測 | 以為 `as` 轉型跟其他運算一樣需要先檢查範圍才能編譯 | 否 | C# `(byte)i` 顯式轉型 |
| 2 | 反面:`as` 轉型的截斷風險(`300 as u8` 靜默溢位,不是想像中的值) | 反面案例 | 以為超出範圍會直接 panic 或報錯,而不是靜默截斷 | 否 | C# `unchecked (byte)(300)` 同樣靜默截斷,`checked` 上下文才丟例外——兩邊都有這個坑 |
| 3 | `From`/`Into` 基本:`impl From<A> for B` 後,A 自動獲得 `.into()` 到 B 的能力 | 輸出預測 | 以為 `From`/`Into` 是要分別各自實作的兩套獨立能力 | 否 | C# `implicit operator B(A a)` |
| 4 | `From`/`Into` 的選擇:定義時寫 `From`,使用端偏好 `into()`(依上下文推斷,泛型函式常寫 `Into<T>` bound) | 設計選擇 | 以為兩者是要分別各自實作的兩套獨立 trait,沒有自動互轉關係 | 否 | 無直接等價概念 |
| 5 | 反面:`.into()` 在型別無法從上下文推斷時報錯 | 反面案例 | 以為 `into()` 永遠能根據「唯一存在的 `impl From`」自動決定目標型別 | 否 | C# 沒有等價的型別推斷失敗情境 |
| 6 | `TryFrom`/`TryInto`:可能失敗的轉換,回傳 `Result` | 輸出預測 | 以為 `TryFrom` 失敗時會回傳一個「夾住邊界」的飽和值 | 否 | C# checked 轉型丟 `OverflowException`,或 `Convert.ToInt32` |
| 7 | 反面:用 `TryFrom` 轉換卻忽略 `Result` 直接 `unwrap()`,遇到溢位值 panic | 反面案例 | 以為 `TryFrom` 失敗時語言會自動處理,不需要自己判斷 `Result` | 否 | C# `Convert.ToInt32` 溢位同樣丟例外,若沒 try/catch 一樣崩潰 |
| 8 | `as` vs `TryFrom` 的選擇:前者適合已知安全或可接受截斷,後者適合要偵測溢位 | 設計選擇 | 以為 `as` 已被淘汰,正式 Rust 不該再用 | 否 | 對比 C# unchecked/checked 兩種轉型的取捨 |
| 9 | 反面:函式簽名寫死 `fn f(s: &str)`,呼叫端傳入只實作 `AsRef<str>` 但本身不是 `&str`/`&String` 的自訂型別、又沒呼叫 `.as_ref()` | 反面案例 | 以為只要型別「能借成 `&str`」,不需要顯式呼叫 `.as_ref()` 就會自動轉換 | 否 | C# 沒有直接等價機制,通常靠多載或統一成 `string` 解決 |
| 10 | 反面:函式簽名寫死 `fn f(s: &String)`,呼叫時傳 `&str` 字面值失敗 | 反面案例 | 以為 `&str` 可以自動轉成 `&String`(方向搞反,`Deref` coercion 只能往外剝) | 否 | C# `string` 在 BCL 裡幾乎只有一種表示法,不會遇到這種互不相容 |
| 11 | 改用 `fn f(s: impl AsRef<str>)` 解決上題,同時接受 `&str`/`&String`/`String` | 輸出預測 | 以為 `impl AsRef<str>` 會強制呼叫端傳入的一定是 `&str` | 否 | C# 方法多載 `string`/`ReadOnlySpan<char>` 涵蓋不同呼叫端型別的思路類似 |
| 12 | `Borrow<T>` 與 `AsRef<T>` 的差異(`Borrow` 用於 `HashMap` 查詢鍵值相容,要求 `Hash`/`Eq` 一致) | 設計選擇 | 以為兩者是同一件事的不同名字,可以隨意互換 | 否 | 無直接等價概念 |
| 13 | `Deref` coercion:`&String` 在函式呼叫的參數位置自動轉成 `&str`(因為 `String: Deref<Target=str>`) | 輸出預測 | 以為要顯式呼叫某個轉換方法才能把 `&String` 傳給要 `&str` 的函式 | 否 | C# 沒有等價的隱式解參考鏈,對象存取欄位/方法本來就統一 |
| 14 | 反面:對只實作 `Deref`(`Target` 不是 `str`)的自訂型別,直接傳給要求 `&str` 的函式(coercion 鏈到不了 `str`) | 反面案例 | 以為只要型別有實作 `Deref`(不管 `Target` 是什麼),就能自動變成任何需要的借用型別 | 否(此題留給 2-3 的姊妹題示範 △,本題只做輸出面呼應,避免重複展開同一個 △) | C# 沒有這種「解參考鏈是否能到達目標型別」的推斷機制 |
| 15 | 反面:型別已經 `impl Display`,又手動幫它 `impl ToString`(跟標準庫的 blanket impl 衝突) | 反面案例 | 以為要為每個型別各自手動 `impl ToString`,不知道有 `Display` 就已經透過 blanket impl 自動獲得 | 否(錯誤訊息是 `conflicting implementations of trait`,不含 DESUGAR 清單裡的字) | C# 每個 `object` 都內建可覆寫的 `ToString()`,Rust 要先有 `Display` 才「換得」,而且不能重複給 |
| 16 | `FromStr` 與 `parse::<T>()`:字串轉數字/自訂型別,失敗回傳 `Result` | 輸出預測 | 以為 `parse()` 永遠預設解析成 `i32`,不需要任何型別提示 | 否 | `int.Parse`/`int.TryParse` |
| 17 | 反面:`parse()` 目標型別因上下文不明確(沒標註也沒 turbofish)導致 `cannot infer type` | 反面案例 | 以為 `parse()` 有一個「預設」目標型別 | 否 | C# `int.Parse` 方法名本身就決定目標型別,Rust「同一方法名服務所有型別」帶來推斷需求 |
| 18 | 為自訂型別實作 `FromStr`,讓 `parse::<MyType>()` 可用(綜合 `From`/`TryFrom`/`FromStr` 三者關係) | 輸出預測 | 以為 `FromStr` 跟 `From<&str>` 是同一件事,只是名字不同 | 否 | 對比自訂型別實作靜態 `Parse`/`TryParse` 的慣例,C# 沒有統一 interface |
| 19 | 綜合:同一個「數字字串轉自訂 `Money` 型別」需求,`as`/`From`/`TryFrom` 哪個最恰當 | 設計選擇 | 以為只要能編譯,三種方式效果與語意上沒有差別 | 否 | 無直接等價概念,總結轉換 trait 的分工 |
| 20(總結) | C# 對照:隱式/顯式轉換運算子與 `IConvertible` vs Rust 把「轉換」拆成 `From`/`Into`(不失敗)、`TryFrom`/`TryInto`(可能失敗)、`AsRef`/`Borrow`(借用視角)、`Deref` coercion(自動穿透)多個各司其職的 trait | 設計選擇 | 無 | 否 | 本題即總結 |

> 註:第 9 大綱項目 `AsMut` 與 `AsRef` 結構完全對稱(唯讀 vs 可變借用),本課不另外
> 為它單獨出題,已在此註明理由,避免被誤判成漏覆蓋。

---

## lesson2-10 模式匹配進階

**課程目標**:熟悉解構、guard、`@` 綁定、多模式、range、`ref`/binding mode 這些 1-8 沒教過
的 `match` 進階能力,並分清 irrefutable/refutable 模式能出現在哪裡。

**難度曲線**:第 1~3 題解構(輸出預測);第 4~10 題 guard/`@`/`|`/range/`ref`/binding
mode 核心題;第 11~15 題所有權在 match 中的行為與 irrefutable/refutable 反面案例;
第 16~19 題巢狀窮盡性與設計題;第 20 題 C# 對照總結。

| # | 考點 | 題型 | 干擾選項方向 | △ | C#對照角度 |
|---|---|---|---|---|---|
| 1 | struct 解構:`let Point{x,y}=p;` 或 `match` 裡帶固定值的欄位 | 輸出預測 | 以為 struct 解構一定要列出全部欄位,不能用 `..` 省略其餘 | 否 | C# 8+ property pattern `p is Point{X:var x,Y:0}` |
| 2 | enum 帶資料的巢狀解構(`Option<Result<T,E>>` 或自訂 enum 套 enum) | 輸出預測 | 以為巢狀解構要拆成多層 `match` 才能寫,不能一次寫在同一個模式裡 | 否 | C# `switch` expression 的巢狀 pattern |
| 3 | 反面:對固定長度陣列用長度不符的模式解構(如 `let [a,b,c] = arr;` 但 `arr` 是 `[i32;4]`) | 反面案例 | 以為陣列模式解構跟 slice 一樣有彈性,長度不用剛好對上 | 否 | C# tuple pattern `(a,b,_)=t` 長度由編譯器檢查,原則相通但陣列長度不符在 Rust 更早被抓到 |
| 4 | match guard:`match` 分支後接 `if` 條件 | 輸出預測 | 以為 guard 條件寫在分支裡會影響「窮盡性檢查」讓編譯器誤判已涵蓋所有情況 | 否 | C# `switch` 的 `when` 子句,語法幾乎一致 |
| 5 | 反面:誤以為有 guard 的分支被算進窮盡性檢查,漏寫兜底分支導致 `non-exhaustive patterns` | 反面案例 | 以為 guard 等於「這個模式已經處理過了」 | 否 | C# `switch` 的 `when` 分支同樣不影響窮盡性,原則相通 |
| 6 | 反面:想同時判斷範圍又要用到值,拆成 guard 條件卻忘了 `@` 綁定,條件裡用到不存在的變數 | 反面案例 | 以為只要模式寫對範圍,guard 條件裡就能直接取用被匹配的值,不需要顯式 `@` 綁定 | 否(錯誤訊息是 `cannot find value` 之類,不含 DESUGAR 清單的字) | C# 沒有直接對應,`and`/relational pattern 要拆成 guard 才能做到類似效果 |
| 7 | `\|` 多模式:同一分支合併多個模式共用邏輯 | 輸出預測 | 以為 `\|` 合併的多個模式不能各自綁定不同名字的變數 | 否 | C# `switch` 多個 `case` fallthrough 或 `or` pattern |
| 8 | 反面:對不支援 range 模式的自訂型別(既非整數/字元也沒有結構化匹配資格)寫 `x @ SomeStruct{..}..=other` 這類 range 模式 | 反面案例 | 以為 range 模式可以用在任何「看起來可以比大小」的型別上,不限標準庫已支援的少數型別 | 否 | C# 的 relational pattern 同樣只支援特定可比較型別,原則相通 |
| 9 | `ref` 模式:match 時用 `ref x` 取得借用而非 move | 輸出預測 | 以為 match 一個 `&T` 時要手動寫 `ref x` 才能拿到借用(其實 match ergonomics 已自動處理) | 否 | C# 沒有「借用模式」概念,pattern 永遠是讀值 |
| 10 | binding mode(match ergonomics):`match &Some(x)` 時 `x` 自動被推斷成借用,不需要手寫 `ref` | 輸出預測 | 以為新版 Rust 已經完全不需要 `ref`/`ref mut` 這兩個關鍵字了 | 否 | C# 沒有等價概念 |
| 11 | 反面:對 `Option<String>` 直接 `match Some(s) => ...` 消耗了原始 `Option`,之後外部變數已被 move | 反面案例 | 以為 `match` 只是「查看」值不會影響其所有權,跟 `if` 判斷一樣不消耗 | 否 | C# switch 對 class 物件只是讀取參考,沒有「消耗」概念 |
| 12 | 用 `match &opt` 或 `opt.as_ref()` 改寫上題,避免消耗原值 | 輸出預測 | 以為 `as_ref()` 跟 `as_str()` 一樣是把 `String` 轉字串切片 | 否 | 無直接等價概念 |
| 13 | irrefutable pattern:`let`/函式參數只能用「一定會匹配成功」的模式 | 輸出預測 | 以為 `let` 也能像 `match` 一樣「匹配失敗就跳過」 | 否 | C# `var (a,b)=t;` 解構同樣要求一定成功 |
| 14 | 反面:`let Some(x)=opt;` 這種可能失敗的 refutable 模式直接用在 `let`(不透過 `if let`/`while let`/`let else`) | 反面案例 | 以為 `let` 可以像 `if let` 一樣處理匹配失敗的情況 | 否 | C# `is` pattern 才對應「可能失敗」的情境,搭配 `if` |
| 15 | `let else` 語法把「失敗分支」收斂成一行,搭配較複雜的模式(複習 1-8 的 desugar,練習與 guard 合用) | 輸出預測 | 以為 `let else` 的 `else` 區塊可以讓程式繼續往下執行,不需要 `return`/`break`/`continue`/`panic!` 之一 | 否 | 無直接等價概念 |
| 16 | 反面:巢狀 enum 解構時漏掉某個變體組合,窮盡性檢查在複雜巢狀情境下抓出遺漏 | 反面案例 | 以為只要最外層 enum 變體都列到了,內層巢狀有沒有列全不影響窮盡性 | 否 | C# switch 對巢狀 pattern 沒有這種跨層級的窮盡性檢查 |
| 17 | struct 更新語法與解構合併使用(部分欄位具體匹配、部分用 `..` 忽略,複習 desugar #05/#06 附近概念但聚焦 match 情境) | 輸出預測 | 以為 `match` 裡的 `..` 也會像建構時的 `..old` 一樣「補上其餘欄位的值」而不是單純忽略 | 否 | 無直接等價概念 |
| 18 | 反面:對含 Copy 與非 Copy 欄位混合的 struct 用 `match` 解構,某個非 Copy 欄位被 move 出去導致 struct 剩餘部分不能整體再使用(部分 move) | 反面案例 | 以為沒用 `.clone()`,`match` 解構永遠只是「借用查看」不會造成部分 move | 否 | C# 沒有部分 move 這個概念,物件欄位讀取永遠只是複製參考 |
| 19 | 綜合:設計一個狀態機 enum 搭配 `match` 窮盡處理所有狀態轉移,鞏固「漏處理的狀態變成編譯錯誤」的設計哲學 | 設計選擇 | 以為用 `_=>` 兜底分支比較保險,不知道這樣會讓未來新增變體時漏處理不被編譯器抓到 | 否 | C# switch 對 enum 缺乏窮盡性檢查,新增一個 case 不會強制更新每個 switch |
| 20(總結) | C# 對照:C# 8+ pattern matching 語法上快速逼近 Rust,但對 enum/interface 缺乏窮盡性檢查,新增 variant 時不會強制逐一更新每個 switch | 設計選擇 | 無 | 否 | 本題即總結 |

---

## lesson2-11 巨集入門(Macros)

**課程目標**:知道巨集跟函式的本質差異、看懂 `macro_rules!` 的模式比對與重複語法,並認識
標準庫最常用的幾個巨集背後在做什麼。

**難度曲線**:第 1~4 題巨集 vs 函式與 `macro_rules!` 基本結構(輸出預測);第 5~10 題
片段指定子、重複模式、`format!`/`assert!` 的反面案例;第 11~17 題常見標準巨集與 derive
使用面;第 18~19 題衛生與綜合;第 20 題 C# 對照總結。

| # | 考點 | 題型 | 干擾選項方向 | △ | C#對照角度 |
|---|---|---|---|---|---|
| 1 | 巨集 vs 函式:`println!` 為什麼是巨集不是函式(可變數量參數+編譯期格式字串檢查) | 輸出預測 | 以為巨集純粹是「呼叫語法多個驚嘆號」的美觀差異,跟函式沒有本質不同 | 否 | C# 內插字串在編譯期也有一定檢查,但底層機制(Roslyn 分析器 vs 巨集展開)完全不同 |
| 2 | 巨集呼叫的三種括號 `!()`/`![]`/`!{}` 語意完全等價,只是慣例 | 輸出預測 | 以為括號種類會影響巨集的展開規則或功能 | 否 | 無直接等價概念 |
| 3 | `macro_rules!` 基本結構:巨集名、模式=>展開,比對的是「語法樹片段」而非執行期的值 | 輸出預測 | 以為 `macro_rules!` 跟 `match` 完全是同一套機制,只是換了個關鍵字 | 否 | C# 沒有直接對應,Source Generator 是編譯期生成程式碼但機制完全不同 |
| 4 | `$x:expr` 片段指定子:捕獲一個運算式片段當作巨集參數 | 輸出預測 | 以為 `$x:expr` 可以捕獲任意 token 序列,不限於合法的運算式 | 否 | 無直接等價概念 |
| 5 | 反面:巨集呼叫傳入不符合片段指定子種類的 token,巨集展開前就被拒絕 | 反面案例 | 以為巨集參數跟函式參數一樣,只要展開後語法合法就沒問題 | 否 | C# 沒有「比對階段」這個中間步驟 |
| 6 | 反面:呼叫自製的 `$(...),*` 重複模式巨集時,兩個片段之間漏加逗號分隔符 | 反面案例 | 以為重複模式的分隔符只是「建議」的排版慣例,漏了也能被巨集容忍 | 否 | 無直接等價概念 |
| 7 | `$(...),*` 與 `$(...),+` 的差異(零或多個 vs 一或多個) | 設計選擇 | 以為兩者完全等價,只是符號習慣不同 | 否 | 無直接等價概念 |
| 8 | `vec![1,2,3]` 的展開概念:等同 `Vec::new()` 後連續 `push`(複習去糖表 #23) | 輸出預測 | 以為 `vec!` 底層是一次性配置好陣列再轉換,而不是逐一 `push` | 否 | 無直接等價概念 |
| 9 | `format!`/`println!` 在編譯期解析 `{}` 對應到後面引數,型別/數量不符在編譯期就報錯 | 輸出預測 | 以為格式字串的檢查跟一般函式呼叫的型別檢查一樣是「執行期」才發現 | 否 | C# 較新版本的 `string.Format`/內插字串才有類似的編譯期檢查,舊版是執行期例外 |
| 10 | 反面:格式字串裡 `{}` 數量與引數數量不一致 | 反面案例 | 以為多餘的 `{}` 會印出空字串,或缺少的引數會用預設值填補 | 否 | C# `string.Format` 引數不足會丟 `FormatException`,兩邊都是要主動處理的錯誤,只是抓的時機不同 |
| 11 | `assert!`/`assert_eq!`/`assert_ne!`:條件不成立時 panic,`assert_eq!` 會印出左右兩邊實際的值 | 輸出預測 | 以為 `assert!` 系列只在 `#[test]` 函式裡才能用 | 否 | xUnit `Assert.Equal`/`Assert.True`,但 Rust 的 `assert!` 是語言內建巨集,不需要測試框架 |
| 12 | 反面:把 `matches!(x, Some(y) => foo())` 這種帶 `=>` 表達式的寫法當成合法語法(複習去糖表 #24,`matches!` 只接受模式,不接受完整 match 臂) | 反面案例 | 以為 `matches!` 可以像 `match` 一樣在分支裡執行任意程式碼,不只是回傳 `true`/`false` | 否 | 無直接等價概念 |
| 13 | `todo!()`/`unimplemented!()`/`panic!()`:型別是 never type `!`,可以出現在任何回傳型別的位置(複習去糖表 #38) | 輸出預測 | 以為 `todo!()` 的回傳型別是 `()`,所以只能用在回傳 `()` 的函式裡 | 否 | 無直接等價概念 |
| 14 | 反面:在有具體回傳型別的函式裡用一般的 `()` 當佔位符而非 `todo!()`,型別不符 | 反面案例 | 以為隨便回傳一個 `Default::default()` 或 `()` 當佔位符都跟 `todo!()` 一樣合法 | 否 | 無直接等價概念 |
| 15 | `dbg!(x)`:印出檔名/行號/運算式文字與值,並把值原封不動回傳,可內嵌在運算式鏈中間(複習去糖表 #39) | 輸出預測 | 以為 `dbg!(x)` 回傳的是 `()` 而不是 `x` 本身,所以不能內嵌在運算式中間 | 否 | 無直接等價概念 |
| 16 | 反面:忘記 `#[derive(Clone)]` 卻呼叫 `.clone()`(複習呼叫端語法,不展開實作原理,留給補充教材程序式巨集) | 反面案例 | 以為只要型別「看起來簡單」(全是數字欄位),不 derive 也能用 `.clone()` | 否 | 無直接等價概念 |
| 17 | 反面:對欄位型別本身沒實作 `Clone` 的巢狀 struct 嘗試 derive `Clone`(換一個比 1-12 更複雜的巢狀情境鞏固) | 反面案例 | 以為 derive 巨集會自動幫欄位也補上需要的實作,而不是要求欄位型別本身已經滿足 | 否 | 無直接等價概念 |
| 18 | 巨集衛生(hygiene)概念:巨集展開時引入的暫時變數不會跟呼叫端變數同名衝突(簡介,不深入實作機制) | 輸出預測 | 以為巨集就是單純的文字替換(像 C 的 `#define`),呼叫端變數命名可能被巨集內部變數意外覆蓋 | 否 | C# 沒有巨集,無等價比較但可類比「為什麼不能用文字替換取代真正的語言機制」 |
| 19 | 綜合:自製簡化版 `my_vec!` 巨集(結合重複模式與具體展開),對照標準庫 `vec!` 的行為 | 輸出預測 | 以為自製巨集展開後的程式碼會跟標準庫 `vec!` 完全一字不差 | 否 | 無直接等價概念 |
| 20(總結) | C# 對照:巨集在 C# 沒有直接對應,Source Generator 是概念上最接近的機制,但觸發方式(attribute 驅動、獨立組件)與 Rust 巨集(呼叫語法內嵌、原地展開)差異很大 | 設計選擇 | 無 | 否 | 本題即總結 |

---

## lesson2-12 Cargo 生態與實戰慣用法

**課程目標**:熟悉 feature flags/profile/workspace 這些專案層級設定、知道常用 crate 分別
定位在哪,並能把整個進階類學過的東西(閉包、迭代器、Result、並行)組合成一個實際情境。

**難度曲線**:第 1~4 題專案設定(feature/profile/workspace);第 5~10 題常用 crate 地圖與
serde/clippy/rustfmt;第 11~16 題 API 設計慣例與套件管理概念;第 17~19 題兩題「進階綜合
題」(§4 大綱明確要求)加一題 CLI 設計綜合;第 20 題 C# 對照總結,同時總結整個進階類。

| # | 考點 | 題型 | 干擾選項方向 | △ | C#對照角度 |
|---|---|---|---|---|---|
| 1 | 反面:沒有啟用某個 feature,卻呼叫被 `#[cfg(feature="x")]` 保護的函式(該程式碼在這次編譯裡根本不存在) | 反面案例 | 以為 feature 沒啟用只是「執行期報錯」,而不是編譯期就找不到對應項目 | 否 | NuGet 沒有等價的「編譯期功能開關」機制,通常靠執行期設定檔或較弱的 `#if` |
| 2 | profile(dev/release):dev 預設不最佳化+含 debug 資訊,`cargo build --release` 切換 | 輸出預測 | 以為 dev/release 只影響編譯速度,不影響最終執行效能 | 否 | Debug/Release 組態,概念相同但 Rust dev 完全不做最佳化,效能差距通常更顯著 |
| 3 | workspace 多 crate 專案:根 `Cargo.toml` 的 `[workspace]` members,共享 target 目錄與 lock 檔 | 輸出預測 | 以為 workspace 裡每個 crate 各自獨立編譯,不共享任何東西 | 否 | 一個 `.sln` 底下多個專案,概念相通 |
| 4 | 反面(概念示範,非編譯錯誤):workspace 裡的 crate 各自宣告不同版本的同一個依賴,`Cargo.lock` 如何解決 | 反面案例 | 以為 workspace 會自動幫每個 member 各自鎖定不同版本互不影響 | 否 | 無直接等價概念 |
| 5 | 常用 crate 地圖:serde/clap/rand/regex/chrono/reqwest/tokio 各自定位 | 設計選擇 | 以為 std 會逐漸把這些常用功能收進標準庫(對照 1-15 已教的「std 刻意不做」設計哲學) | 否 | NuGet 生態同類套件對照,鋪陳第 20 題總結 |
| 6 | 反面:引入 serde 卻忘記啟用 `features = ["derive"]`,`#[derive(Serialize,Deserialize)]` 找不到這兩個 derive 巨集 | 反面案例 | 以為只要 `Cargo.toml` 加了 `serde = "1"` 就自動包含 derive 巨集,不知道那是另外的 feature | 否 | `System.Text.Json` 的 attribute 驅動序列化不需要額外開關,這是 Rust crate 生態特有的「细分 feature」設計 |
| 7 | `serde_json`:`to_string`/`from_str` 搭配上題的 derive 做 JSON 序列化/反序列化 | 輸出預測 | 以為 `serde_json` 可以序列化任何型別,不需要先 derive `Serialize` | 否 | `JsonSerializer.Serialize`/`Deserialize` |
| 8 | 反面:JSON 欄位名稱與 struct 欄位命名風格不一致,反序列化失敗,需要 `#[serde(rename="...")]` | 反面案例 | 以為 serde 會自動做大小寫/命名風格轉換,不需要顯式標註 | 否 | `[JsonPropertyName]` 同樣需要顯式標註,原則相通 |
| 9 | clippy:靜態分析工具,抓出「能編譯但不慣用」的寫法 | 輸出預測 | 以為 clippy 只是格式化工具(跟 rustfmt 搞混) | 否 | Roslyn Analyzer/StyleCop 給出的程式碼建議,概念相通 |
| 10 | rustfmt:自動格式化程式碼,與 clippy 分工不同(格式 vs 慣用寫法建議) | 輸出預測 | 以為 rustfmt 也會像 clippy 一樣改寫程式邏輯,而不只是排版 | 否 | `dotnet format` |
| 11 | API 設計慣例:builder pattern 取代 C# 具名參數/物件初始化語法 | 設計選擇 | 以為 Rust 也有具名參數,可以省略 builder 直接呼叫建構函式帶具名引數 | 否 | C# `new Config{A=1,B=2}` 物件初始化語法,Rust 沒有對應語法 |
| 12 | API 設計慣例:`impl Into<String>` 參數讓函式同時接受 `&str`/`String`(複習 2-9,這裡是應用場景) | 輸出預測 | 以為 `impl Into<String>` 比直接寫死 `&str` 型別「效能更好」,而不是為了呼叫端彈性(其實會多一次轉換成本) | 否 | 無直接等價概念 |
| 13 | 反面(build 失敗而非 rustc 編譯錯誤):`Cargo.toml` 的版本宣告範圍跟手動改過的 `Cargo.lock` 衝突,`cargo build` 直接拒絕 | 反面案例 | 以為每次 `cargo build` 都會自動抓最新相容版本、`Cargo.lock` 只是參考用,可以隨意手動改 | 否 | `packages.lock.json`(較少人用)或前端生態的 `package-lock.json`,原則相通 |
| 14 | semver 與 `Cargo.toml` 版本宣告(`^1.2`/`~1.2`/`=1.2` 的差異) | 輸出預測 | 以為 `^1.2` 能自動升級到任何後續大版本(包含 2.0) | 否 | NuGet 版本範圍語法(較少強制使用),原則相通但 Rust 生態更嚴格遵守 semver |
| 15 | 反面(概念示範,非編譯錯誤):依賴發布不相容的 major 版本更新,`Cargo.toml` 寫死 `^1` 導致卡在舊版無法自動升級 | 反面案例 | 以為版本策略寫錯只會是「小麻煩」,不會真的讓專案卡住升級不了 | 否 | 無直接等價概念 |
| 16 | crates.io 與 docs.rs 的角色分工:crates.io 是套件註冊表,文件由 docs.rs 自動產生 | 輸出預測 | 以為要查某個 crate 的用法應該直接去 crates.io 頁面本身找 API 文件 | 否 | NuGet 官網(套件清單)與各套件各自的文件站分工,原則相通 |
| 17 | **進階綜合題**:結合閉包(2-1)+迭代器(2-2)+`Result`(1-10/2-6)——用 `collect::<Result<Vec<_>,_>>()` 把多筆資料解析與驗證串成一條「任一筆失敗就整體失敗」的鏈 | 輸出預測 | 以為 `collect` 遇到第一個 `Err` 之後,仍會把其餘的 `Ok` 值一起收集進最終的 `Vec` | 否 | LINQ 搭配 try/catch 通常要拆成命令式迴圈才能達到同樣的短路效果 |
| 18 | **進階綜合題**:結合並行(2-7)——`Arc<Mutex<Vec<T>>>` 搭配多執行緒 worker,收集 serde 反序列化後的資料並彙總 | 輸出預測 | 以為多執行緒各自反序列化後可以直接各自 `push` 進同一個 `Vec` 而不需要 `Mutex` 保護 | 否 | `ConcurrentDictionary`/`ConcurrentBag` 內建鎖,Rust 要自己組合 `Arc<Mutex<T>>` |
| 19 | 反面(綜合):小型 CLI 工具裡每個 `Result` 都直接 `.unwrap()`,一出錯就是不好看的 panic 而非乾淨的錯誤訊息(對照改成 `main` 回傳 `Result<(),Box<dyn Error>>` 的寫法,複習 2-6) | 反面案例 | 以為 `.unwrap()` 在「應該只是示範」的小工具裡沒差,反正能跑就好 | 否 | 對比一個 C# Console App 到處不 `try/catch` 直接讓例外炸到主控台,兩邊都是能跑但不專業的寫法 |
| 20(總結) | C# 對照(同時總結整個進階類):NuGet 生態系對應(serde↔System.Text.Json、clap↔System.CommandLine、tokio↔內建執行緒池/TPL)——C# 開發者最終會發現 Rust 在「安全」與「效能」上要求顯式付出的成本,換來的是一整類 C# 執行期才會發現的錯誤,在 Rust 編譯期就被擋下 | 設計選擇 | 無 | 否 | 本題即總結 |

---

## 骨架設計時發現的問題(供實際出題階段留意)

1. **2-9 的 `AsMut`**:與 `AsRef` 結構完全對稱,本課骨架沒有為它單獨開一列,已在 2-9
   章節末加註理由,不是漏覆蓋。
2. **`move` 閉包被拆成三課各一個角度**(2-1 語法本身、2-7 thread 情境、2-8 async
   狀態機情境):單看每一課,「`move`」相關題目只有 2~3 題,比表面上「一個語法點」看起來
   單薄,是刻意為之,寫題 agent 不要為了「湊題感覺不夠」而把其他課的角度搬過來重複。
3. **`Deref` 在 2-3 與 2-9 都會出現**,方向不同(2-3 是智慧指標方法呼叫穿透、2-9 是
   `&String→&str` 的參數位置強制轉換),兩課骨架已各自加註且刻意錯開哪一題掛 △,但這是本次
   設計裡最容易被兩個不同 agent 無意間寫成同一種情境的一組,建議實際出題時互相對照。
4. **2-5 的 `'static`**:被限定在「`Box<dyn Trait>` 預設生命週期 bound」這一個狹窄角度,
   容易被 agent 不小心擴寫成完整的生命週期教學而跟 2-4 撞題,寫題時要格外克制,只呼應 2-4
   已教過的規則、不重新展開。
5. **2-11(巨集)與 2-12(Cargo 生態)這兩課主題偏「工具/生態介紹」而非「語言機制」**,天生
   較難湊出以反面案例為主力、20 題有自然難度曲線的骨架——實際產出的反面案例比例
   (2-11 約 4/20、2-12 約 3/20)明顯低於其他課,與 AUTHORING §2「主力是反面案例」的整體
   要求有落差。實際出題階段建議這兩課多利用「設計選擇」題型的干擾選項模擬真實誤用情境來
   補強,不必勉強湊出生硬的編譯錯誤情境。
