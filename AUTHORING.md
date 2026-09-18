# 出題規範(Question Authoring Spec)

本檔是 `docs/data/**/lesson*.js` 的唯一格式依據。**新增或修改任何題目前先讀這份文件**,
產出的題目必須完全符合以下規則。§1~§7 是題目資料的規範,§8 是呈現層的界線
(改 `docs/css/app.css` 或加樣式前要看)。

---

## 1. 檔案骨架

```js
/* 出題慣例見專案根目錄 AUTHORING.md */
window.RUST_LESSONS = window.RUST_LESSONS || {};
window.RUST_LESSONS["lesson1-4"] = {
  id: "lesson1-4",
  title: "所有權(Ownership)",
  goal: "一句話說明本課要建立的心智模型。",
  questions: [ /* ... */ ],
};
```

- 檔名、`id`、`docs/data/index.js` 的三處 id 必須一致。
- 課程建置完成後,要把 `index.js` 中該課的 `available` 改成 `true`。

### 1.1 `primer`:課前導讀(選填)

給**第一次接觸這個主題**的讀者一個快速定向:這是什麼、Rust 為什麼需要它、最基本的
長相。它是暖身,**不是一堂課**——真正的觀念與陷阱都留給題目。渲染在課程標題與第一題
之間(標籤 `Primer`);沒有 `primer` 的課程(目前的基礎類)畫面完全不變。

```js
window.RUST_LESSONS["lesson2-1"] = {
  id: "lesson2-1",
  title: "閉包(Closures)",
  goal: "……",
  primer: {
    intro: "閉包是可以捕獲周遭變數的匿名函式。Rust 沒有 GC,所以編譯器必須知道閉包是借用還是拿走了那些變數,這決定了它能被呼叫幾次、能活多久。",
    examples: [
      {
        code: "fn main() {\n    let base = 10;\n    let add = |x: i32| x + base;\n    println!(\"{}\", add(5));\n}",
        note: "add 借用了 base,呼叫時把傳入的 x 加上 base。",
      },
    ],
    csharp: "寫法跟 C# 的 lambda 很像,差別在 C# 一律把被捕獲的變數提升到堆積上的物件,Rust 則由編譯器決定借用或搬移。",
  },
  questions: [ /* ... */ ],
};
```

| 欄位 | 必填 | 長度 | 說明 |
|---|---|---|---|
| `intro` | ✅ | 2~4 句 | 這個概念是什麼、Rust 為什麼需要它 |
| `examples` | ✅ | 1~2 個,每個程式碼 3~8 行 | `{ code, note, lang? }`;`code` 是多行字串(`\n` 換行),`note` 一句話;`lang` 預設 `rust` |
| `csharp` | ⭕ | 1~2 句 | C# 對照,畫面上沿用題目的 `C# comparison` 區塊 |

內容規則:

- 文字一律**繁體中文**,其餘慣例同 §6。
- 範例必須是**正確、夠完整**的 Rust(能照抄進 `fn main` 跑起來;最好本身就含 `fn main`)。
- 範例只示範**最基本的正常用法**(happy path),不放陷阱、不放編譯錯誤——陷阱是題目的事。
- **不得洩漏任何一題的答案**:寫完後逐題對照,導讀讀完不能直接答對某一題。
- 不放 emoji、不用「選項 A/B/C」字母指涉(`scripts/validate-data.js` 會擋)。
- 不需要 `walkthrough`:導讀的範例以 `note` 一句話帶過即可。

`scripts/validate-data.js` 對 `primer` 的檢查:是物件、`intro` 非空字串、`examples` 為
1~2 個 `{ code, note, lang? }` 且 `code`/`note` 非空、`csharp` 有填就非空、沒有未知欄位、
文字不含 emoji 或選項字母指涉。句數與行數限制**腳本不檢查**,要自己把關。

## 2. 題目物件欄位

| 欄位 | 必填 | 說明 |
|---|---|---|
| `id` | ✅ | `"1-4-07"` 格式,課號 + 兩位數流水號,全站唯一(是洗牌種子,不可事後更動) |
| `question` | ✅ | 題幹文字 |
| `questionCode` | ⭕ | 題幹附的程式碼(純字串,用 `\n` 換行) |
| `questionLang` | ⭕ | 題幹程式碼語言,預設 `rust`;C# 對照題填 `"csharp"` |
| `options` | ✅ | 4 個選項,`{ text }` 或 `{ code, lang }`,同一題不混用 |
| `answer` | ✅ | **一律為 `0`**(正確答案永遠寫在第一個選項) |
| `explanation` | ✅ | 文字詳解 |
| `walkthrough` | ✅(見 §4) | 逐行說明,物件或物件陣列 |
| `csharp` | ✅ | C# 開發者對照說明 |

### 為什麼 `answer` 一律是 0
顯示順序由 `quiz.js` 以「題目 id」為種子做確定性洗牌,作答紀錄存的是原始索引。
因此**詳解禁止用「選項 A / B / C」字母指涉**,一律直接描述選項內容
(例:「含 String 的那組」、「回傳 &s 的那個寫法」)。

### 干擾選項
其餘 3 個選項必須是「真的有人會選」的誤解,而不是明顯的湊數答案;
詳解要順帶點名至少一個干擾選項錯在哪。

## 3. 每課題數

- 基準:每課 **10 題**。
- 難度較高、需要反覆練習的章節擴充到 **20 題**(目前 lesson1-4 所有權、lesson1-5 借用、
  lesson1-11 泛型、lesson1-12 Trait、lesson1-13 生命週期)。
- 新課程一律以 20 題為目標。

難度由淺到深排列,最後 1~2 題做本課總結或 C# 對照收尾。

## 4. `walkthrough`:逐行說明(本規範核心)

**只要題目跟程式碼有關,就必須有 `walkthrough`**——不管是正面案例還是反面案例,
**每一行程式碼都要寫上註解**。

### 區塊標籤(`label`)慣例

> **符號異動**:區塊標記已全面改成純文字,不再使用 emoji。對照如下——
> `❌`→**`X`**、`✅`→**`√`**(U+221A 根號符號,不是打勾的 `✓`,也不是英文字母 `v`)、
> `🔍`→**`⊕`**(U+2295)、`🔧`→**`△`**(U+25B3)、`🔷`→**`◇`**(U+25C7)。
> 只有 `⛔` 從頭到尾沒變過。讀到舊題目或舊文章裡的 emoji,照這張表換算。
> **改動這些符號前,先看 §7「動符號的鐵則」。**

| 開頭 | 用途 |
|---|---|
| `⊕` | 正面案例:題目程式碼可正常編譯執行,逐行說明它做了什麼 |
| `X` | 反面案例:**整個區塊**是錯的——編譯失敗或行為錯誤的程式碼 |
| `⛔` | 標在反面案例 `note` 裡「出錯的那一行」——這一行是錯誤的起因 |
| `√` | 正確寫法:完整、可直接編譯執行的修正版 |
| `△` | 去糖後:編譯器眼中的樣子(見下節,錯誤訊息提到讀者沒寫過的東西時必附) |
| `◇` | C# 對照程式碼(搭配 `lang: "csharp"`) |

語意分層:**`X` 標整個區塊是錯的,`⛔` 標區塊裡「這一行是起因」,`√` 標正確寫法**——
三者搭配使用,不是互相替代,不要混用或省略其中一個。

**驗證腳本會強制:出現 `X` 開頭的區塊時,同一題必須另有 `√` 開頭的區塊。**

### `label` 一律英文,內文一律繁中

`walkthrough[].label`(區塊標題)**一律用英文**,語氣是**編譯器 / 測試報告語氣**——
像 `cargo build`、`cargo test` 印出來的東西,不是教學口吻。其餘所有欄位——`note`、
`explanation`、`question`、`csharp`、`options[].text`——**維持繁體中文**,這條規則
沒有例外。

用詞對照(出題時照這張表選字,不要自己造詞):

| 中文概念 | 英文用詞 |
|---|---|
| 題目程式碼 | `Question code` |
| 逐行說明 | `— walkthrough`(em dash) |
| 正確寫法 | `Correct version` |
| 錯誤寫法 | `Wrong version` |
| 去糖後 | `Desugared` |
| C# 對照 | `C# equivalent` |

技術識別字(`if let`、`?`、`match`、型別名、方法名⋯)原樣保留,不要翻譯。例:

```js
label: "X Question code (won't compile)"
label: "√ Correct version (complete, runnable)"
label: "⊕ Question code — walkthrough (runs successfully)"
```

`label` 省略時,`quiz.js` 會顯示英文預設值 `Walkthrough`(見 §8),**不是**
「⊕ 逐行說明」——只有單一正面案例區塊、不需要特別標題時才省略。

### `△` 去糖區塊:錯誤訊息提到讀者沒寫過的東西時

這是本課程最容易漏掉、讀者最有感的一種說明。**讀者學到的是語法糖,但編譯器罵的是
去糖後的世界**——他寫 `s1 + &s2`,編譯器說 `borrow of moved value`;他寫 `?`,編譯器說
`the trait bound ...: From<...> is not satisfied`;他寫 `{}`,編譯器說
`doesn't implement std::fmt::Display`。錯誤訊息裡的每一個陌生字,都是糖底下露出來的實體。

**規則:當 `X` 區塊的錯誤訊息(或詳解)出現讀者在這段程式碼裡沒有親手寫過的識別字
——`Add`、`Index`、`From`、`Into`、`IntoIterator`、`Deref`、`Display`、`Ord`、`PartialOrd`、
`Fn` / `FnMut` / `FnOnce` 這一類——該題必須附一個 `△` 區塊,把糖攤開。**
驗證腳本會掃出漏掉的題目(見 §7)。

寫法:左邊是讀者寫的那一行,接著是編譯器展開後的形狀,並且讓錯誤訊息裡的陌生字
在展開後的程式碼裡「看得到出處」。

```js
{
  label: "△ Desugared (what the compiler sees)",
  intro: "錯誤訊息提到了 From,但你的程式碼裡沒有這個字。因為 ? 不只是「出錯就回傳」:",
  lines: [
    { code: "let f = File::open(\"a.txt\")?;", note: "你寫的這一行。" },
    { code: "", note: "" },
    { code: "// 編譯器把它展開成:", note: "以下才是編譯器實際檢查的東西。" },
    { code: "let f = match File::open(\"a.txt\") {", note: "? 本質上是一個 match。" },
    { code: "    Ok(v) => v,", note: "成功:把值取出來繼續往下走。" },
    { code: "    Err(e) => return Err(From::from(e)),", note: "失敗:提早回傳——而且會先呼叫 From::from 做錯誤型別轉換。錯誤訊息裡的 From 就是從這裡來的。" },
    { code: "};", note: "展開結束。" },
  ],
}
```

- `△` 區塊**不必是完整可執行的程式**(它是示意,不受 `√` 的 `fn main` 規則約束)。
- 放在 `X` 區塊之後(該題若把 `√` 排在 `X` 前面,就擺在最末)——先看錯,再看糖底下是什麼。
- 去糖形式請查 §9 的對照表,不要自己臆測。

### 資料格式

```js
walkthrough: [
  {
    label: "X Question code (won't compile)",   // 選填,省略時預設顯示「Walkthrough」
    intro: "先看問題出在哪:",            // 選填,區塊前的一段文字
    lang: "rust",                        // 選填,預設 rust
    lines: [
      { code: "fn main() {",        note: "程式進入點。" },
      { code: "    let mut x = 5;", note: "建立可變變數 x,初始值為 5。" },
      { code: "    let r = &mut x;", note: "建立可變參考 r 指向 x(此時 r 獨占對 x 的存取權)。" },
      { code: "    *r += 1;",       note: "透過解參考運算子 * 修改 r 指向的記憶體,值從 5 變成 6。" },
      { code: "    println!(\"{}\", x);", note: "印出 x 的值。" },
      { code: "}",                  note: "x 離開作用域,自動釋放。" },
    ],
    outro: "選填,區塊後的補充。",
  },
]
```

- 完整程式碼由 `lines` 的 `code` **依序接起來**,渲染時自動編行號;
  因此不會有「改了程式碼忘了改行號」的問題。
- `note` 留空字串 = 該行不加註解(空行、單獨的 `}` 可以留空)。
- 單一區塊可直接寫成物件,不必包成陣列。

### 正面案例(程式碼可正常編譯執行)

一個區塊即可,省略 `label` 時預設顯示英文「Walkthrough」,也可以自訂(英文,見上方
用詞對照表):

```js
walkthrough: {
  lines: [ /* 每一行都有 note */ ],
}
```

### 反面案例(程式碼編譯失敗 / 行為錯誤)

**一定要兩個區塊**:

1. `label: "X Question code (won't compile)"` — 逐行註解原始碼,**在出錯那一行的
   note 直接點名錯誤**,例如「`⛔ 這裡編譯失敗:cannot borrow \`s\` as mutable more
   than once at a time`」。
2. `label: "√ Correct version"` — 完整、可直接編譯執行的修正版,**同樣每一行都要
   note**,並在改動的那幾行說明「改了什麼、為什麼」。

修正版必須是完整程式(含 `fn main() { ... }`),讀者可以整段複製去跑——
**驗證腳本會強制檢查這一點**。若同一題有多個錯誤寫法(例如四選一的三個干擾選項),
不要把它們拼貼成一個區塊,而是**每個錯誤寫法各自一個 `X` 區塊**,各自完整。

### 註解怎麼寫

- 一行一句,講**這行做了什麼、為什麼**,而不是把程式碼翻譯成中文。
  - X 「`let r = &mut x;`:讓 r 等於 mut x。」
  - √ 「建立可變參考 r 指向 x(此時 r 獨占了對 x 的存取權)。」
- 涉及所有權/借用的行,要說明**這一行之後值的狀態**(被 move 走了、借用開始/結束)。
- 錯誤行要附上編譯器實際的錯誤訊息關鍵字,方便讀者對照終端機輸出。

## 5. `csharp` 欄位

站在 C# 開發者的角度說明:同樣的情境在 C# 是什麼行為、為什麼 Rust 要不一樣。
不要只說「C# 有 GC」,要具體到會踩到什麼 bug 或少了什麼保證。

## 6. 文字慣例

- 一律**繁體中文**,標點用全形,程式碼識別字保持原文。
  **例外:`walkthrough[].label` 一律英文**,規則與用詞對照表見 §4「`label` 一律
  英文,內文一律繁中」。
- 中文與英文/數字之間**不加空格**(維持既有檔案風格)。
- 詳解用模板字串(`` ` ``)撰寫多行;內含反引號時要跳脫(`` \` ``)。
- `questionCode`、`options[].code` 是**單行字串**,換行寫 `\n`,雙引號寫 `\"`。

## 7. 送出前檢查

```bash
node scripts/validate-data.js
```

這支腳本也是 CI 部署前的守門員(`.github/workflows`),失敗就不會部署。**這個不帶參數的
版本只驗 `docs/data/index.js` 裡 `available: true` 的課程**——新課程開發期間
`available` 還是 `false`,這條指令驗不到你正在寫的檔案。

### 新課程開發期間:用 `--lesson` 單獨驗證

```bash
node scripts/validate-data.js --lesson lesson2-1
node scripts/validate-data.js --lesson lesson2-1,lesson2-2   # 逗號分隔多課
```

`--lesson` 指定的課程**不論 `available` 是 `true` 或 `false` 都會驗**,且只驗指定的那幾課
(不會跑過全站,輸出比較短、比較快)。**建置進階類(`lesson2-1` ~ `lesson2-12`)等
`available: false` 的新課程時,這是標準驗證指令**——把 `index.js` 的 `available` 改成
`true` 之前,都應該用這個指令確認資料檔沒問題,而不是等上架後才被 CI 抓到。
題目 `id` 的全站唯一性檢查一樣有效:腳本會先把其他 `available: true` 課程的 id
灌進去,再驗你指定的課程,撞到既有 id 一樣會報錯。

`--lesson` 可以跟 `--no-strict` 並用:

```bash
node scripts/validate-data.js --lesson lesson2-1 --no-strict
```
它自動檢查的項目:

- 選項數為 4、`answer` 為 0、`explanation` 非空
- 選項是 `{ code }` 或 `{ text }` 擇一
- 題目 `id` 全站唯一
- 詳解沒有出現「選項 A/B/C/D」字母指涉
- 有程式碼的題目都有 `walkthrough`
- `walkthrough` 每行 `code` 不含換行,且非空白行都有 `note`
- 有 `X` 區塊時必定有 `√` 區塊
- `√` 區塊裡的 Rust 程式碼是完整可執行的(含 `fn main`,或是測試模組)
- 錯誤訊息提到讀者沒寫過的去糖識別字時,該題有沒有 `△` 區塊(見 §4)
- 課程有 `primer` 時格式正確(見 §1.1)

> ⚠️ **動符號的鐵則:改任何區塊標記符號,必須同步改 `scripts/validate-data.js`
> 的判斷式與錯誤訊息,否則整批題目會驗不過。** 目前寫死依賴這些符號的位置(函式見
> `scripts/validate-data.js`):`validateWalkthrough()` 裡
> `labels.some(l => l.startsWith("X"))` 與
> `labels.some(l => l.startsWith("√"))`(判斷反面案例是否配對正確寫法、
> 判斷哪個區塊要檢查 `fn main`);`validateDesugar()` 裡
> `labels.some(l => l.startsWith("△"))`(去糖區塊是否已補)與
> `.filter(n => n.includes("⛔"))`(從 `note` 撈錯誤訊息關鍵字當作去糖判斷依據)。
> 加符號、改符號都要回頭核對這四處,否則不是誤判通過,就是整批題目卡在 CI。

> `△` 這一項與其他規則一樣會擋下部署。人工複核過、確認錯誤訊息裡沒有隱藏去糖概念的題目
> (例如詳解只是拿 `Add<Output = T>` 當語法範例),在該題加一行 `desugarChecked: true` 豁免,
> 並用註解寫明理由。臨時要把它降級成警告可以跑 `node scripts/validate-data.js --no-strict`。

腳本檢查不到、要自己把關的:

- [ ] `id` 沒有被改動過(改動會重置使用者的作答紀錄)
- [ ] 模板字串裡的反引號有跳脫(否則是語法錯誤,`node --check` 會擋)
- [ ] 註解說的是「為什麼」而不是把程式碼翻譯成中文
- [ ] `√ 正確寫法` 的程式碼真的能編譯執行(必要時貼進 `practices/` 跑一次)
- [ ] 三個干擾選項都是「真的有人會選」的誤解
- [ ] 錯誤訊息裡每一個陌生識別字,讀者都能在 `△` 區塊裡找到它的出處

### 清點符號時的陷阱:grep 會漏掉四位元組 emoji

在一般 UTF-8 locale 下用交替比對(例如 `grep "🔍\|🔧"`)清點符號,**會漏掉四位元組的
emoji**,導致誤判「資料層沒有這個符號」——區塊標記還是 emoji 的那個年代,這個坑實際
害人誤報過一次。現行的六個標記(`X`、`√`、`⛔`、`⊕`、`△`、`◇`)都是 ASCII 或三位元組
字元,不受這個陷阱影響;但教學內文裡仍有四位元組字元(見下方 `🦀`),日後若再引入
emoji 也會重蹈覆轍。要精確清點,用 `LC_ALL=C` 搭配 byte pattern:

```bash
LC_ALL=C grep -oh $'[\xF0][\x9F][\x80-\xBF][\x80-\xBF]' docs/data/basic/*.js | sort | uniq -c
```

改動區塊標記符號、或要確認某個符號是否還殘留在題庫裡之前,先跑這條,不要單憑一般
`grep` 的結果下結論。

---

## 8. 呈現層(改樣式前必讀)

題目資料格式與這一節無關——**出題時照 §1~§7 寫就好,不用為版面做任何事**。
這一節是給「要動 `docs/css/app.css` 或想加樣式」的人看的。

### 文字亮度是刻意壓低的

題目答案區的文字對比刻意壓在 **5.4~6.6:1**(WCAG AA 的門檻是 4.5:1),
坐在螢幕前讀很清楚,退開幾步就融進背景。**這不是沒調好,不要「順手」調亮。**

| 位置 | 顏色 | 底色 | 對比 |
|---|---|---|---|
| 題幹、課程標題 | `#a8a8a8` | `#232323` | 6.6:1 |
| 選項文字 | `#a0a0a0` | `#232323` | 6.0:1 |
| 詳解、逐行補述、C# 對照、課前導讀(primer) | `#989898` | `#232323` | 5.5:1 |
| 逐行註解 | `#8697a0` | `#1e1e1e` | 5.5:1 |
| 程式碼基底字 | `#a0a0a0` | `#1e1e1e` | 6.4:1 |
| 錯誤訊息(`.answer-feedback.ng`、`.option.wrong .option-label`) | `--answer-red` `#d16969` | `#232323` | 4.5:1 |

不在此列、維持原亮度的是**訊號**:作答對錯的**綠色**、詳解與逐行說明的標籤顏色、
以及 highlight.js 的語法上色。

**綠色(`--vsc-green`)**:這一輪從 `#4ec9b0`(偏青綠)換成 **`#57A64A`**(Visual
Studio 的註解綠),對 `#232323` 約 5.2:1。**這是全站的綠**——`.option.correct`、
`.answer-feedback.ok` 的答對訊號,逐行說明的標籤(`.wt-label`),側邊欄的完成勾勾
(`.done-mark`),以及 **C# 對照區塊**(`.csharp-compare`:標題 `.cs-label`、左側那條
3px 的槓、以及 `rgba(87, 166, 74, 0.07)` 的淡底色)全都跟著換。C# 對照原本是藍色
(`--vsc-blue` `#569cd6`),已整組改綠;`--vsc-blue` 在 `app.css` 裡因此不再有引用點,
但變數仍留在 `vscode-theme.css` 供裝飾層使用,**不要順手刪掉**。
`docs/js/minimap.js` 裡還留著兩處 `#4ec9b0`(`hljs-built_in`、`hljs-type`),
那是縮圖在模擬 highlight.js 的**語法 token 色**(`built_in`/`type`),跟這裡「答對/
完成」的訊號綠是兩回事,**刻意不同步**,改動請不要「順手」牽過去。

**紅色訊號已經被壓暗過,不再是例外**——舊值 `--vsc-red`(`#f48771`)對 `#232323` 有
7.6:1,太亮;現在錯誤訊息與 `.option.wrong` 的標籤改用新變數 `--answer-red`
(`#d16969`),壓到 4.5:1,剛好卡在 WCAG AA 門檻上,和上面表格其他列一樣是「刻意壓
低」,只是壓得比 5.4~6.6:1 更低,因為它同時還要維持「訊號」的可辨識度。

**答錯選項的波浪底線色 `#f14c4c`**(`.option.wrong .line-content` 的
`text-decoration-color`)**是裝飾線,不是內文文字色**,不受這裡 4.5~6.6:1 的內文
對比規範約束——畫的是底線,選項的字色與標籤色仍然是 `--answer-red`。

只有「沒有 token 顏色」的基底字被降下來(`.hljs` 等,在 `app.css` 以覆寫處理,
`docs/vendor/` 的第三方檔不動)。

新增顏色時,請照同樣的標準:**內文 4.5~6.6:1,超過 7:1 就太亮了。**

### 作答對錯:文字變色/波浪底線,不是整格色塊

- **答對**:`.option.correct` 沒有綠框、沒有綠底,是整段文字(含程式碼型選項)轉成
  `var(--vsc-green)`,連 highlight.js 的語法上色都蓋掉——答案本身就是訊號,不需要
  再看 token 顏色。
- **答錯**:`.option.wrong` 同樣沒有紅框、沒有紅底,改成 VS Code「error squiggle」
  風格的紅色波浪底線(`text-decoration: underline wavy`,
  `text-decoration-color: #f14c4c`)。
- **這兩條規則刻意掛在 `.option-text` / `.line-content`,不是 `.option-body` 或
  `.hljs`**。原因是 `codeBlock()` 產生的結構是
  `pre.code-block > code.hljs > .code-line > (.line-no + .line-content)`,行號
  `.line-no` 也在 `code.hljs` 裡面——掛在外層會讓行號跟著轉綠、跟著被畫上波浪線。
  而且 `text-decoration` 是由祖先畫出的,子元素寫 `text-decoration: none` 關不掉,
  一旦掛錯層,行號沒辦法退出來。**改這兩條規則時,選擇器要留在 `.line-content` /
  `.option-text`,不要「順手」改成看起來更直覺的 `.option-body` / `.hljs`。**

### 介面文字:`quiz.js` 一律英文,`app.js` 的系統訊息維持中文

`quiz.js` 寫死在渲染邏輯裡的介面文字已經全部英文化,語氣同樣是編譯器 / 測試報告
語氣。目前的完整清單:

`Passed!` / `Failed — the answer is` 加選項字母(如 `Failed — the answer is B`,
字母由 `LABELS[order.indexOf(q.answer)]` 決定)/ `Explanation` / `C# comparison` /
`Walkthrough`(`wt-label` 省略 `label` 時的預設值,見 §4)/ `Primer`(課前導讀標籤,見 §1.1)/ `Show explanations` /
`Hide explanations` / `Mark as done` / `Done — click to undo` / `Reset answers` /
`Lesson: n/m correct (k questions)`。

新增這類渲染邏輯裡的標籤文字時比照辦理,一律英文,不要摻中文。

**例外**:`docs/js/app.js` 的 `showNotice` 錯誤訊息(找不到課程、還沒建置、載入
失敗)**刻意維持中文**——這是給讀者看的系統提示,不是答案區介面文字,不要跟著
英文化。

### 答案區不放裝飾性 icon

`quiz.js` 渲染答案區時只印純文字標籤,不加裝飾用的 emoji:上一節列出的英文介面
文字都是純文字;`.note-line .note-content` 也不再有 `↳ ` 前綴,連帶拿掉的懸掛縮排
(`text-indent` / `padding-left`)一併刪除。新增這類渲染邏輯裡的標籤文字時比照辦理,
不要加 icon。

**例外、不在此限**:題目資料裡 `walkthrough` 的區塊標籤(`X`/`√`/`⊕`/`△`/`◇`,
見 §4)與反面案例 `note` 裡點名錯誤用的符號(如 `⛔`),是題目資料的**語意標記**,
`scripts/validate-data.js`(§7)會依它們判斷區塊種類並強制檢查(例如有 `X` 區塊
就必須有對應的 `√` 區塊)。**這些是題庫資料的一部分,不是本節說的「裝飾性 icon」,
絕對不能因為這條規則被順手清掉**——本節管的只是 `quiz.js` 寫死在渲染邏輯裡、
和題目內容無關的標籤文字。

另一個例外是 `🦀`(2 處,在 lesson1-2 與 lesson1-6 的教學內文裡)。那是在講 UTF-16
surrogate pair、`"🦀".Length == 2` 這件事,**emoji 本身就是題目要教的東西**,清掉題目
就不成立了。這也是答案區目前唯一還會出現的 emoji。

側邊欄的進度點 `●` 與完成勾勾 `✓`(`.done-mark`)不在答案區範圍,不受此規則約束,
維持原樣。

### 題目資料不承載樣式

- `question`、`options[].text`、`explanation`、`csharp`、`walkthrough` 的 `note`
  **一律會被 HTML 跳脫**。寫 `<b>`、`<span style>`、`&nbsp;` 只會原樣印出來。
- 要強調就用文字本身(引號、「」、程式碼識別字),不要靠顏色或粗體。
- 選項會洗牌,**顏色與位置都不能承載語意**——這也是 §2 禁止用「選項 A/B/C」指涉的原因。

### 裝飾層不要動

`docs/{js,css}/` 底下的 `vs-header`、`minimap`、`terminal`、`diagnostics`
是模擬 IDE 外觀的假元件,不讀題目資料、不參與作答邏輯:

- **新增課程完全不用碰它們**,也不會因為課程變多而需要調整。
- 縮圖(minimap)是唯一會讀畫面的:它用 `MutationObserver` 監看 `#content`,
  按實際元素的幾何位置重畫。**如果改了 `quiz.js` 的 DOM 結構或 class 名稱,
  要順手檢查 `minimap.js` 裡那份選擇器清單**,否則縮圖會少畫東西。

---

## 9. 附錄:語法糖 → 去糖形式對照表

寫 `△` 區塊時查這張表,不要自己臆測展開形式。「歸屬」欄是課程覆蓋狀態:
課號 = 已經有題目以它為主題;`規劃 xx` = 已寫進 `COURSE_PLAN.md` 該課大綱、尚未出題;
`待補` = 目前沒有任何一課認領。

### 一、錯誤處理與流程控制

| # | 語法糖 | 去糖後 | 歸屬 |
|---|---|---|---|
| 01 | `let f = File::open(p)?;` | `match File::open(p) { Ok(v) => v, Err(e) => return Err(From::from(e)) }` | 1-10 |
| 02 | `if let Some(x) = opt { .. }` | `match opt { Some(x) => { .. }, _ => () }` | 1-8 |
| 03 | `while let Some(x) = it.next() { .. }` | `loop { match it.next() { Some(x) => { .. }, None => break } }` | 1-8 |
| 04 | `let Some(x) = opt else { return; };` | `let x = match opt { Some(v) => v, None => return };` | 1-8 |
| 51 | `?` 搭配回傳型別 `Box<dyn Error>` | 同 01 展開成 `match`,但 `Err(e) => return Err(From::from(e))` 這一步是透過 `impl<E: Error + 'static> From<E> for Box<dyn Error>` 把具體錯誤型別轉成 trait object | 規劃 2-6 |

### 二、變數與 struct 宣告

| # | 語法糖 | 去糖後 | 歸屬 |
|---|---|---|---|
| 05 | `Point { x, y }` | `Point { x: x, y: y }` | 1-7 |
| 06 | `User { age: 30, ..old }` | `User { age: 30, name: old.name, .. }`(其餘欄位逐一 move/copy) | 1-7 |
| 07 | `let Point(x, y) = p;` | `let x = p.0; let y = p.1;` | 1-7 |
| 08 | `let [a, b, ..] = arr;` | 依索引取值並檢查長度 | 1-15 |

### 三、型別推導與 prelude

| # | 語法糖 | 去糖後 | 歸屬 |
|---|---|---|---|
| 09 | `Some(5)` | `std::option::Option::Some(5)` | 1-15 |
| 10 | `let mut v = Vec::new();` | `let mut v: Vec<i32> = Vec::new();`(由後續使用反推) | 1-2 |
| 11 | `rect.area()` | `Rectangle::area(&rect)` | 1-7 |

### 四、函式、泛型與 trait

| # | 語法糖 | 去糖後 | 歸屬 |
|---|---|---|---|
| 12 | `fn f(s: impl Display)` | `fn f<T: Display>(s: T)` | 1-12 |
| 13 | `fn f() -> impl Shape` | 回傳單一具體型別,對外只露出 trait | 1-12 |
| 14 | `\|x\| x + 1` | 自動生成的匿名 struct + `Fn`/`FnMut`/`FnOnce` 實作 | 規劃 2-1 |
| 15 | `.map(\|x\| x * 2)` | `.map(\|x: &i32\| x * 2)`(由上下文補型別) | 規劃 2-1 |
| 47 | `Fn(i32) -> bool` | `Fn<(i32,), Output = bool>` | 規劃 2-1 |

### 五、指標、記憶體與轉型

| # | 語法糖 | 去糖後 | 歸屬 |
|---|---|---|---|
| 16 | `my_string.len()` | `str::len(&*my_string)`(Deref 遞迴拆解) | 1-6 / 1-12 |
| 17 | `r.width = 10`(`r: &mut T`) | `(*r).width = 10` | 1-5 |
| 18 | `rect.area()`(`fn area(&self)`) | 自動補 `&` / `&mut`,即 auto-ref | 1-4 / 1-7 |
| 19 | `for x in vec { .. }` | `let mut it = IntoIterator::into_iter(vec); while let Some(x) = it.next() { .. }`——**注意 `into_iter` 按值取用,所以 `for x in vec` 會吃掉 vec** | 規劃 2-2 |
| 20 | `a.b.c.clone()` | 連續的欄位位移與方法呼叫 | 規劃 2-2 |
| 44 | `Box::new(5)` | 在 heap 配置空間並把值搬進去 | 規劃 2-3 |
| 45 | `&arr[1..4]` | `Index::index(&arr, Range { start: 1, end: 4 })` | 1-6 |
| 52 | `a + b`(自訂型別實作了 `Add`) | `Add::add(a, b)`(即 `std::ops::Add::add(self, rhs)`) | 規劃 2-5 |
| 53 | `&dyn Shape` / `Box<dyn Shape>` | 胖指標:一個資料指標 + 一個指向 vtable 的指標(具體型別的 `&T`/`Box<T>` 是瘦指標,只有資料指標) | 規劃 2-5 |
| 54 | `Rc::clone(&x)`(或 `x.clone()`) | 只把 `strong_count` 加一,不複製底層資料;計數歸零時才釋放 | 規劃 2-3 |

### 六、巨集與格式化

| # | 語法糖 | 去糖後 | 歸屬 |
|---|---|---|---|
| 21 | `format!("{}x{}", w, h)` | 呼叫 `std::fmt::write` 並配置 `String` | 1-6 / 1-15 |
| 22 | `println!("{width}x{height}")` | `println!("{}x{}", width, height)` | 1-6 |
| 23 | `vec![1, 2, 3]` | `Vec::new()` 後連續 `push`(實際是 `Box<[T]>` 轉換) | 1-9 |
| 24 | `matches!(opt, Some(1..=5))` | `match opt { Some(1..=5) => true, _ => false }` | 規劃 2-11 |
| 38 | `todo!()` | `panic!("not yet implemented")`,型別是 never type `!` | 規劃 2-11 |
| 39 | `dbg!(x)` | 印出檔名、行號、算式與值,再原值回傳 | 1-7 |
| 55 | `macro_rules!` 裡的 `$($x:expr),*` | 對每個比對到的片段重複展開一次巨集本體,以逗號分隔(`vec![1, 2, 3]` 就是這樣展開成三次 `push`) | 規劃 2-11 |

### 七、範圍、列舉與迭代

| # | 語法糖 | 去糖後 | 歸屬 |
|---|---|---|---|
| 25 | `1..10` / `'a'..='z'` | `Range { start, end }` / `RangeInclusive` | 1-3 |
| 26 | `use Status::*;` | 把所有變體名字引入當前作用域 | 1-14 |
| 27 | `let (x, _) = (1, 2);` | 該位置有值但不綁定,不產生 drop 責任 | 1-2 / 1-8 |
| 46 | `let (a, .., z) = t;` | 只綁定頭尾,中間忽略 | 規劃 2-10 |

### 八、非同步與生命週期

| # | 語法糖 | 去糖後 | 歸屬 |
|---|---|---|---|
| 28 | `fetch().await` | 生成狀態機,在 `Poll::Pending` 時交出執行權 | 規劃 2-8 |
| 40 | `async move { .. }` | 把捕獲變數的所有權移進狀態機 | 規劃 2-8 |
| 56 | `async fn f() -> T { .. }` | `fn f() -> impl Future<Output = T> { async move { .. } }`——函式簽名本身就是一層糖,回傳的是「會被驅動的狀態機」,不是 `T` | 規劃 2-8 |
| 29 | `fn f(s: &str) -> &str` | `fn f<'a>(s: &'a str) -> &'a str`(省略三規則) | 1-13 |
| 30 | `#[derive(Debug)]` | 編譯期生成對應的 `impl` 區塊 | 1-7 / 1-12 |

### 九、模式比對進階

| # | 語法糖 | 去糖後 | 歸屬 |
|---|---|---|---|
| 31 | `Some(x @ 1..=5)` | 比對成立的同時把值綁給 `x` | 規劃 2-10 |
| 32 | `Some(x) if x > 10` | 分支後附加條件判斷 | 規劃 2-10 |
| 33 | `Some(ref x)` | 綁定為 `&T`,不轉移所有權 | 規劃 2-10 |
| 34 | `1 \| 2 \| 3 => ..` | 多個模式共用同一個分支 | 規劃 2-10 |

### 十、型別轉換與字面值

| # | 語法糖 | 去糖後 | 歸屬 |
|---|---|---|---|
| 35 | `"hello".into()` | `String::from("hello")`(由 `impl From<&str> for String` 推導) | 1-10 / 1-15 |
| 36 | `..Default::default()` | 呼叫 `Config::default()` 取得其餘欄位 | 1-12 / 1-15 |
| 37 | `(5,)` | 單元素 tuple `(i32,)`,不是括號運算式 | 1-2 |
| 41 | `r#"C:\path"#` | 字串內的 `\` 不做跳脫解釋 | 1-6 |
| 42 | `b"hello"` | `&[u8; 5]` | 1-15 |
| 43 | `1_000_000` | `1000000`(底線編譯期忽略) | 1-2 |

### 十一、模組與 Self

| # | 語法糖 | 去糖後 | 歸屬 |
|---|---|---|---|
| 48 | `use std::fmt::{Display, Debug};` | 展開成多行獨立 `use` | 1-14 / 1-15 |
| 49 | `fn new() -> Self` | `Self` = 當前 `impl` 的型別名 | 1-7 |
| 50 | `use super::m;` | 模組樹上的相對路徑 | 1-14 |
