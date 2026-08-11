/* 出題慣例:answer 一律為 0(正確答案寫在第一個選項),顯示順序由 quiz.js 依題目 id 洗牌。
 * 詳解禁止用「選項 A/B/C」字母指涉,必須直接描述選項內容。 */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-13"] = {
  id: "lesson1-13",
  title: "生命週期入門",
  goal: "看懂 'a 在說什麼:生命週期標註描述參考之間的存活關係,讓編譯器能證明「參考絕不活過資料」。",
  questions: [
    {
      id: "1-13-01",
      question: "生命週期(lifetime)這個機制,在解決什麼問題?",
      options: [
        { text: "在編譯期證明「每個參考的存活範圍都不超過它指向的資料」——沒有 GC 的前提下杜絕懸空參考" },
        { text: "控制物件何時被垃圾回收器回收" },
        { text: "延長變數的壽命,讓資料活得比作用域久" },
        { text: "管理執行緒的啟動與結束時間" },
      ],
      answer: 0,
      explanation: `lesson1-5 看過懸空參考被編譯器擋下——那個「擋」的機制就是生命週期分析:每個參考都有一段有效範圍,編譯器檢查它永遠不超過資料本身的範圍。大多數情況編譯器自己推得出來;推不出來的少數場合,才需要你寫 'a 標註「說明關係」。
Rust 沒有 GC;標註也不會「延長」任何東西的壽命(本課最重要的迷思,後面有專題);跟執行緒排程更是無關。`,
      csharp: `C# 為什麼沒這個概念:GC 保證「參考還在,物件就不回收」——安全靠執行期追蹤。Rust 把同一份安全改成編譯期證明,代價是偶爾要寫 'a 幫編譯器把關係說清楚,換來的是零執行期成本。`,
    },
    {
      id: "1-13-02",
      question: "以下函式的結果是?",
      questionCode: "fn longest(x: &str, y: &str) -> &str {\n    if x.len() > y.len() {\n        x\n    } else {\n        y\n    }\n}",
      options: [
        { text: "編譯錯誤:missing lifetime specifier——編譯器不知道回傳的參考與 x、y 哪個關聯" },
        { text: "正常編譯:回傳型別和參數都是 &str,完全吻合" },
        { text: "編譯錯誤:函式不能回傳參考" },
        { text: "正常編譯,但呼叫時可能得到懸空參考" },
      ],
      answer: 0,
      explanation: `編譯器看這個簽名的困境:回傳的 &str 有時是 x、有時是 y(執行期才知道),那呼叫端拿到的參考該被限制活多久?沒有標註就無法檢查,直接要求你補(missing lifetime specifier),並附上建議寫法。
函式回傳參考本身完全合法(lesson1-4 的 gives_ownership 回傳「值」,&self 方法天天回傳參考);「可能懸空」永遠不會發生——Rust 的立場是編譯不過,而不是編譯過但危險。`,
      csharp: `C# 的 string Longest(string x, string y) 毫無波瀾——回傳的參考讓物件自動延命。Rust 要在編譯期就回答「這個參考依賴誰」,答不出來就不放行;這題的錯誤訊息是每個 Rust 學習者的成年禮。`,
    },
    {
      id: "1-13-03",
      question: "補上生命週期標註後,這個簽名的正確解讀是?",
      questionCode: "fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() {\n        x\n    } else {\n        y\n    }\n}",
      options: [
        { text: "「回傳的參考,有效範圍不超過 x 與 y 兩者中較短的那個」——描述輸入與輸出的存活關係,供編譯器在呼叫端檢查" },
        { text: "「x 和 y 必須是同一個變數的參考」" },
        { text: "「強制 x、y、回傳值三者都活到程式結束」" },
        { text: "「回傳值會被複製一份,脫離與 x、y 的關係」" },
      ],
      answer: 0,
      explanation: `'a 是「泛型生命週期參數」,宣告方式和泛型 T 一樣放在角括號。這個簽名說:存在某段範圍 'a,x、y 至少活這麼久,回傳值也只保證活這麼久——實際呼叫時,'a 被推定為「x 與 y 存活範圍的交集(較短者)」,呼叫端把回傳值用超過這個範圍就是編譯錯誤(下一題示範)。
x、y 可以是完全不同來源的參考;沒有任何東西被強制延命或複製——標註是「描述與檢查」,不是「改變行為」。`,
      csharp: `可以借 C# 泛型類比:'a 之於「存活範圍」如同 T 之於「型別」——都是呼叫端決定實際值、簽名只描述關係的參數。C# 沒有對應物,因為「存活範圍」在 GC 世界不是需要靜態描述的東西。`,
    },
    {
      id: "1-13-04",
      question: "呼叫端的檢查。以下程式碼的結果是?",
      questionCode: "fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}\n\nfn main() {\n    let string1 = String::from(\"long string is long\");\n    let result;\n    {\n        let string2 = String::from(\"xyz\");\n        result = longest(string1.as_str(), string2.as_str());\n    }\n    println!(\"{}\", result);\n}",
      options: [
        { text: "編譯錯誤:string2 does not live long enough——result 可能指向 string2,但 string2 在內層作用域結束就被 drop" },
        { text: "印出 long string is long:實際上較長的是 string1,它活得夠久,沒問題" },
        { text: "執行期 panic:存取已釋放的 string2" },
        { text: "印出空字串" },
      ],
      answer: 0,
      explanation: `簽名說「回傳值只活到 x、y 中較短者」——較短者是 string2(內層作用域結束即 drop),而 result 在作用域外還要用,違反契約,編譯錯誤。
「實際上回傳的是 string1 所以沒事」是最誘人的錯誤答案:編譯器做的是「最壞情況」的靜態分析,不會執行你的程式看實際走哪條分支——只要「可能」指向 string2,就按 string2 的壽命算。這保守性正是安全的來源:換個輸入走另一條分支,保證依然成立。`,
      csharp: `C# 版本無論走哪個分支都安全(被引用的物件延命)。Rust 用「編譯期最壞情況分析」取代「執行期逐物件追蹤」——偶爾會擋下實際上安全的程式(像這題的特定輸入),這是零成本安全的代價;好消息是調整寫法(println 移進內層)就能過。`,
    },
    {
      id: "1-13-05",
      question: "為什麼平常寫的函式都不用標 'a?以下函式不寫生命週期卻能編譯,原因是?",
      questionCode: "fn first_word(s: &str) -> &str {\n    s.split_whitespace().next().unwrap_or(\"\")\n}",
      options: [
        { text: "生命週期省略規則(elision):只有一個參考參數時,回傳參考自動綁定它——編譯器按規則補好了,不用手寫" },
        { text: "回傳 &str 的函式天生不需要生命週期" },
        { text: "編譯器執行了函式內容,確認回傳值來自 s" },
        { text: "字串型別是特例,其他型別的參考才要標" },
      ],
      answer: 0,
      explanation: `編譯器內建三條「省略規則」,能唯一確定關係就免標:(1)每個參考參數各得一個獨立的生命週期;(2)恰好一個輸入生命週期時,回傳參考綁定它;(3)方法有 &self 時,回傳參考綁定 self。這裡命中第二條——編譯器自動補成 fn first_word<'a>(s: &'a str) -> &'a str。
longest 有兩個參考參數,三條規則都套不上才要手寫。省略是「按固定規則填空」,不是分析函式內容(簽名是唯一依據);規則對所有型別的參考一視同仁。`,
      csharp: `類比 C# 的型別推斷:var 能用是因為規則能唯一確定型別,確定不了就得明寫。生命週期同理——「大多數場合不用寫,寫的時候必有原因」。實務上手寫 'a 的頻率遠低於初學者想像,別被教材的密度嚇到。`,
    },
    {
      id: "1-13-06",
      question: "'static 的含義。以下敘述正確的是?",
      questionCode: "let s: &'static str = \"I have a static lifetime.\";",
      options: [
        { text: "'static 表示「可以活到整個程式結束」——字串字面值存在執行檔的唯讀資料段,所以天生是 &'static str" },
        { text: "'static 表示這個變數是全域靜態變數,所有函式共享" },
        { text: "'static 會把資料複製到一塊永不釋放的特殊記憶體" },
        { text: "'static 是 s 這個變數不能被 shadowing 的意思" },
      ],
      answer: 0,
      explanation: `'static 是「最長的生命週期」:資料保證撐到程式結束。字面值編譯進執行檔(lesson1-6 見過),自然滿足。這是描述既有事實,不是搬移或複製任何資料。
變數 s 本身仍是普通區域變數(可以 shadowing、可以離開作用域),'static 修飾的是「它指向的資料」的壽命。進階備註:錯誤訊息建議「加 'static」時通常是誤導,真正該修的多半是所有權結構——先懷疑設計再考慮 'static。`,
      csharp: `類似 C# 的 const string 或 interned 字串常量的「永遠有效」感。C# 的 static 關鍵字(靜態成員)與 Rust 的 'static(壽命描述)是不同概念,只是撞名——Rust 另有 static 關鍵字宣告全域變數,那個才對應 C# 的 static field。`,
    },
    {
      id: "1-13-07",
      question: "迷思破除題:第 4 題的編譯錯誤(string2 does not live long enough),正確的修法是?",
      options: [
        { text: "調整程式結構:把 println 移進內層作用域(在 string2 還活著時用完 result),或讓 string2 宣告在外層活得夠久" },
        { text: "把簽名改成 fn longest<'a, 'b>(x: &'a str, y: &'b str) -> &'a str,用更多生命週期參數就能通過" },
        { text: "在 result 的型別加上 'static:let result: &'static str;" },
        { text: "把 'a 換成更長的名字如 'long,提示編譯器延長壽命" },
      ],
      answer: 0,
      explanation: `本課最重要的觀念:標註「描述」關係,不「改變」壽命。錯誤的根源是程式結構(result 想活過 string2),任何標註魔法都改不了這個事實——改結構才是正解。
把回傳綁定單一參數 'a 的版本會在「函式體」報錯(else 分支回傳的 y 不符合簽名);給 result 標 'static 只是把矛盾換個位置(string2 給不出 'static 的參考);生命週期的名字('a、'long)純粹是識別符,長短毫無意義。遇到生命週期錯誤的正確反射:先想「這個參考到底該活多久、資料是否真的撐得到」,而不是堆標註。`,
      csharp: `C# 工程師的對應教訓:這類錯誤相當於 Rust 編譯器提前抓到「快取了一個之後會失效的參考」的設計問題。在 C# 這種問題以另一種形式存在(快取已 Dispose 的物件、閉包捕獲循環變數),只是沒人在編譯期攔你。`,
    },
    {
      id: "1-13-08",
      question: "struct 持有參考。以下程式碼的結果是?",
      questionCode: "struct Excerpt {\n    part: &str,\n}\n\nfn main() {\n    let novel = String::from(\"Call me Ishmael. Some years ago...\");\n    let first = novel.split('.').next().unwrap();\n    let e = Excerpt { part: first };\n    println!(\"{}\", e.part);\n}",
      options: [
        { text: "編譯錯誤:missing lifetime specifier——struct 欄位存參考必須宣告生命週期參數:struct Excerpt<'a> { part: &'a str }" },
        { text: "正常印出 Call me Ishmael" },
        { text: "編譯錯誤:struct 欄位不能是參考,只能存擁有的 String" },
        { text: "執行期 panic:novel 已被釋放" },
      ],
      answer: 0,
      explanation: `struct 欄位要存參考,必須在定義上宣告:struct Excerpt<'a> { part: &'a str }——意思是「Excerpt 的實例不能活過它引用的資料」,編譯器據此檢查每個使用處(和泛型 struct 宣告 <T> 同一個模式)。補上 <'a> 後這段程式合法,novel 活得比 e 久。
struct 存參考完全允許(解析器、視圖類型的常見設計),只是要標註;不過入門階段的實用建議:優先讓 struct「擁有」資料(String 而非 &str),需要零複製的效能時再引入參考欄位。`,
      csharp: `C# 的 class 欄位存參考天經地義,誰也不追問「物件會不會活過欄位指向的資料」——GC 讓問題不存在。C# 7.2 的 ref struct(如 Span<T> 只能在 stack、不能存進 class 欄位)其實就是一套寫死的隱形生命週期規則;Rust 把這套規則做成了可表達的通用語法。`,
    },
    {
      id: "1-13-09",
      question: "方法中的省略規則。以下方法的回傳參考,編譯器預設綁定誰?",
      questionCode: "struct Excerpt<'a> {\n    part: &'a str,\n}\n\nimpl<'a> Excerpt<'a> {\n    fn announce(&self, greeting: &str) -> &str {\n        println!(\"{}\", greeting);\n        self.part\n    }\n}",
      options: [
        { text: "綁定 &self:第三條省略規則——方法有 &self 時,回傳參考自動繫結 self 的生命週期" },
        { text: "綁定 greeting:最後一個參數優先" },
        { text: "綁定 'static:方法回傳的參考預設全程有效" },
        { text: "無法編譯:兩個參考參數必須手動標註" },
      ],
      answer: 0,
      explanation: `第三條省略規則專為方法設計:簽名裡有 &self,回傳參考就自動綁定 self——這符合絕大多數方法的實情(回傳的東西來自自己的欄位),所以方法幾乎從不手寫生命週期。本題回傳 self.part 正中規則,不用標註。
若真要回傳 greeting 的衍生參考,預設綁定就錯了,那時才需要手動標註推翻預設。兩個參考參數在「函式」上無法省略,但「方法」多了 &self 規則,依然免寫。`,
      csharp: `這條規則的直覺在 C# 也熟悉:方法回傳的東西通常來自 this 的狀態。差別是 Rust 把這個「通常」正式編進編譯器規則,並在例外時強迫你明說——API 的參考來源永遠有據可查。`,
    },
    {
      id: "1-13-10",
      question: "C# 對照總結題:為什麼 C# 不需要生命週期,而 Rust 需要?",
      options: [
        { text: "C# 用 GC 在執行期追蹤參考、保證物件不被提前回收;Rust 沒有 GC,改在編譯期用生命週期證明同一件事——兩者是同一份安全的不同實現時機" },
        { text: "因為 C# 比較新,設計比較好,不需要這種累贅" },
        { text: "C# 其實也有生命週期,只是語法藏起來了,每個 var 都在暗中標註" },
        { text: "因為 Rust 不支援類別繼承,只好用生命週期彌補" },
      ],
      answer: 0,
      explanation: `總結本課:懸空參考的解法有兩種——執行期(GC:有人引用就不回收,代價是 GC 暫停、記憶體開銷、不確定的釋放時機)與編譯期(生命週期:寫程式時就證明安全,代價是學習曲線與偶爾的標註)。Rust 選了後者,才能同時做到記憶體安全、零 GC、可預測的效能。
一般的 C# 程式碼沒有隱藏的生命週期分析(不過 ref struct/Span 的逃逸規則確實是縮水版的同類機制);與繼承毫無關係。`,
      csharp: `帶著走的判讀技巧:看到 'a 不要慌,問三個問題——這個參考從哪來?要活多久?資料撐得到嗎?九成的生命週期錯誤在回答完就知道怎麼改結構了。剩下一成需要進階知識(lesson2-4),入門階段遇到可以先用「擁有代替借用」(clone/String)繞過,不丟人。`,
    },
  ],
};
