# 進階類建置進度

> 這份文件是**交棒用**的。一個沒有任何對話記憶的新 session 讀完這份，應該能直接接手往下做。
> 每完成一個段落就回來更新「進度總表」與「交棒紀錄」。

---

## 1. 這個專案在做什麼

給 C# 開發者的 Rust 互動式選擇題網站，純靜態（GitHub Pages，根目錄 `docs/`）。
基礎類 16 課 / 240 題已上線。**現在要建置進階類 12 課（lesson2-1 ~ lesson2-12），每課 20 題，共 240 題。**

- 題庫檔位置：`docs/data/advanced/lesson2-N.js`（目錄目前是空的）
- 課程大綱權威：`COURSE_PLAN.md:222-334`
- **出題施工圖：`ADVANCED_OUTLINE.md`（12 課 × 20 題骨架，550 行）** ← 寫題前必讀
- 出題規範：`AUTHORING.md` ← 寫題前必讀

---

## 2. 進度總表

### 基礎建設

| Task | 內容 | 狀態 |
|---|---|---|
| T1 | `validate-data.js` 加 `--lesson <id>`，能驗未上架課程 | ✅ 完成 |
| T2 | `DESUGAR_TOKENS` 補 `Future`/`poll`、`Send`/`Sync`、`Sized`；`AUTHORING.md` §7 用法 + §9 條目 51-56 | ✅ 完成 |
| T3 | `ADVANCED_OUTLINE.md` 12 課 × 20 題骨架 | ✅ 完成 |

### 課前導讀 primer（2026-09-18 使用者追加）

| Task | 內容 | 狀態 |
|---|---|---|
| P1 | `quiz.js` 渲染 `primer` + `app.css` 樣式 + `validate-data.js` 檢查 + `AUTHORING.md` 新增規範小節 | ✅ 完成（AUTHORING §1.1） |
| P2 | 補寫 `lesson2-1` 的 `primer` | ✅ 完成 |

`primer` 格式：`{ intro, examples: [{ code, note }], csharp }`。導讀 2–4 句、範例 1–2 段（每段 3–8 行）、C# 對照 1–2 句。
課程目的沿用既有的 `goal` 欄位。只做進階類，基礎類不補。

### 12 課寫題

| 課 | 標題 | 批次 | 狀態 | 題數 | 上架 |
|---|---|---|---|---|---|
| 2-1 | 閉包(Closures) | pilot | ✅ 已驗證（含 primer） | 20/20 | ✅ |
| 2-2 | 迭代器(Iterators) | A | ✅ 已驗證（含 primer） | 20/20 | ✅ |
| 2-10 | 模式匹配進階 | A | ✅ 已驗證（含 primer） | 20/20 | ✅ |
| 2-3 | 智慧指標與內部可變性 | B | ✅ 已驗證（含 primer） | 20/20 | ✅ |
| 2-4 | 生命週期進階 | B | ✅ 已驗證（含 primer） | 20/20 | ✅ |
| 2-5 | Trait 進階與 Trait 物件 | B | ✅ 已驗證（含 primer） | 20/20 | ✅ |
| 2-6 | 錯誤處理進階 | C | ✅ 已驗證（含 primer） | 20/20 | ✅ |
| 2-9 | 型別轉換與轉換 Trait | C | ✅ 已驗證（含 primer） | 20/20 | ✅ |
| 2-11 | 巨集入門(Macros) | C | ✅ 已驗證（含 primer） | 20/20 | ✅ |
| 2-7 | 並行程式設計 | D | ✅ 已驗證（含 primer） | 20/20 | ✅ |
| 2-8 | 非同步 async/await | D | ✅ 已驗證（含 primer） | 20/20 | ✅ |
| 2-12 | Cargo 生態與實戰慣用法 | D | ⬜ 未開始 | 0/20 | ❌ |

**狀態圖例**：⬜ 未開始 · 🔄 進行中 · ✅ 已驗證 · ⚠️ 有問題待處理

### 收尾

| Task | 內容 | 狀態 |
|---|---|---|
| T16 | `docs/data/index.js` 12 課 `available` 改 `true` | ⬜ 未開始 |
| T17 | 全域驗證 + 跨課重複題偵測 + `COURSE_PLAN.md` 狀態更新 | ⬜ 未開始 |

---

## 3. 執行順序與依賴

```
T1 → T2 → T3 → pilot(2-1) → 使用者驗收風格 → 批次 A → B → C → D
```

- **批次 A**：2-2、2-10（2-1 已在 pilot 完成）
- **批次 B**：2-3、2-4、2-5
- **批次 C**：2-6、2-9、2-11
- **批次 D**：2-7、2-8、2-12

**真實依賴只有兩條**：

1. **2-12 必須最後做** —— 大綱明列「進階綜合題：閉包 + 迭代器 + Result + 並行的整合情境」，要等 2-1 / 2-2 / 2-6 / 2-7 都在。
2. **2-8 建議排在 2-7 之後** —— async 的心智模型建立在並行之上。

其餘 9 課檔案互不重疊，可完全平行。

**每課驗證通過後**（2026-09-18 使用者指示改為逐課上架）：主視窗把該課 `available` 改 `true` → 更新本文件 → commit → **push**（使用者 2026-09-18 指示每課都要 push）。

導讀插入點：`T0 → P1 → P2 → 批次 A …`（P1/P2 必須在批次 A 之前）。

---

## 4. 寫題 agent 必須遵守的約束

這幾條每次派 agent 都要寫進 prompt，漏掉會出事：

1. **只准寫自己那一支 `docs/data/advanced/lesson2-N.js`**，不准碰其他檔案。
2. **不准改 `docs/data/index.js` 的 `available`** —— 那是單一檔案，多個 agent 併發寫必定互相覆蓋。全部寫完後由主視窗統一開啟。
3. **20 題**，`answer` **一律為 0**（正確答案永遠寫第一個選項，顯示順序由 `quiz.js` 以題目 id 為種子洗牌）。
4. **id 格式 `2-N-01` ~ `2-N-20`**，全站唯一，事後不可更動（是洗牌種子）。
5. **詳解禁止用「選項 A/B/C/D」字母指涉** —— 選項會洗牌，字母對不上。要直接描述選項內容。
6. **`label` 一律英文，內文一律繁中**。用詞對照見 `AUTHORING.md` §4。
7. **區塊標記只用這六個純文字符號**：`X`（整個區塊是錯的）、`√`（正確寫法）、`⛔`（`note` 裡標出錯的那一行）、`⊕`（正面案例逐行說明）、`△`（去糖區塊）、`◇`（C# 對照程式碼）。**不准用 emoji。**
8. **`√` 區塊必須是完整可執行的程式**（含 `fn main` 或測試模組），讀者要能整段複製去跑。
9. **有 `X` 區塊就必須有 `√` 區塊**，驗證腳本會擋。
10. **有程式碼的題目每一行都要有 `note`**，空白行除外。
11. 干擾選項必須是「真的有人會選」的誤解，不是湊數；詳解要點名至少一個干擾選項錯在哪。
12. **必須附課前導讀 `primer`**，格式與篇幅依 `AUTHORING.md` 的 primer 小節（P1 完成後才存在）。

---

## 5. 驗證指令

```bash
# 寫題 agent 自驗（課程還沒上架時唯一能用的方式）
node scripts/validate-data.js --lesson lesson2-1

# 多課一起驗
node scripts/validate-data.js --lesson lesson2-1,lesson2-2

# 全量（只驗 available: true 的課，CI 用的就是這個）
node scripts/validate-data.js

# 語法檢查
node --check docs/data/advanced/lesson2-1.js
```

**清點符號時務必加 `LC_ALL=C`** —— 一般 UTF-8 locale 下 grep 的交替比對會漏掉四位元組字元，這個坑實際害人誤報過一次。

```bash
LC_ALL=C grep -oh $'[\xF0][\x9F][\x80-\xBF][\x80-\xBF]' docs/data/advanced/*.js | sort | uniq -c
```

---

## 6. 已知風險（來自骨架設計階段的發現）

| # | 風險 | 處置 |
|---|---|---|
| 1 | `Deref` 在 2-3（方法呼叫穿透智慧指標）與 2-9（`&String`→`&str` 參數轉換）都會出現，最容易被兩個 agent 無意寫成同一題 | 寫 2-9 時要對照 2-3 已完成的內容 |
| 2 | 2-5 的 `'static` 被限定在「trait object 預設生命週期 bound」這個窄角度，容易擴寫成完整生命週期教學而跟 2-4 撞題 | 寫 2-5 時要克制 |
| 3 | 2-11 巨集、2-12 Cargo 的反面案例只有 7/20，是 12 課最低。主題偏工具/生態，天生湊不出編譯失敗情境 | 改用設計選擇題的干擾選項模擬真實誤用 |
| 4 | `DESUGAR_TOKENS` 是關鍵字比對、不是真的解析錯誤訊息來源。曾試加 `Drop` 導致 `lesson1-4 / 1-4-09` 假陽性（那題 `⛔` note 有「含有需要 Drop 的資源」這句人話） | 不要再加常見英文詞當 token。誤判時用 `desugarChecked: true` 豁免並附註解說明理由 |
| 5 | 骨架的 `△` 標記（14 題）只是預判 | 以 `--lesson` 實測結果為準 |

---

## 7. Token 預算與段落機制

### 兩個要盯的額度

| 額度 | 誰看得到 | 門檻 |
|---|---|---|
| Session token（15,000,000） | 模型每回合都收到剩餘量 | **剩 2,250,000（用掉 85%）準備停**；**剩 1,500,000（90%）完全停手** |
| 5 小時滾動視窗 | **只有使用者在 CLI `/status` 看得到，模型查不到** | 使用者盯，逼近 85% 就通知模型收尾 |

### 硬訊號

**有 agent 因 rate limit 中止就是硬訊號** —— 立刻停下來做段落，不要重試。
（曾發生過一次：兩個 agent 同時啟動都撞上 session 限額，工作區沒留半成品。）

### 段落動作

1. 不再派新 agent，讓進行中的跑完
2. 把當下進度寫回 §2 進度總表與 §8 交棒紀錄
3. commit
4. 提示使用者 `/compact`（同一條路線繼續）或 `/clear`（全新 session 接手）

### 日常紀律

- **每完成一課就更新** §2 與 §8，不要累積到最後一次寫 —— 中途斷掉那一課的狀態就沒了
- 寫題 agent 的回報一律只要「修改摘要 + 驗證結果」，不准貼完整程式碼或長 log
- 主視窗不要自己讀題庫檔（單檔 ~900 行），要查狀態用 `grep` / `awk` 取統計數字

---

## 8. 交棒紀錄

### 2026-09-17 — 基礎建設完成，pilot 未開始

**完成**：T1、T2、T3。

- `scripts/validate-data.js`：新增 `--lesson <id>`（支援逗號分隔多課、`--lesson=x` 形式、可搭 `--no-strict`）。不帶參數時行為與改動前完全一致，CI 不受影響。題目 id 唯一性採「先灌後驗」：先把所有 `available: true` 課程的 id 灌進 `seenIds`（排除目標課本身），新課撞到既有 id 一樣抓得到。
- `DESUGAR_TOKENS` 由 8 條增為 11 條，新增 `Future`/`poll`、`Send`/`Sync`、`Sized`。
- `AUTHORING.md`：§7 補「新課程開發期間用 `--lesson`」小節；§9 去糖對照表新增條目 51-56（`?` 搭 `Box<dyn Error>`、自訂型別 `a + b` → `Add::add`、`dyn Trait` → 胖指標、`Rc::clone` → 只加計數、`macro_rules!` 重複展開、`async fn` → `impl Future`）。
- `ADVANCED_OUTLINE.md`：新檔 550 行。已驗證每課確實 20 題、總計 240。題型分布：反面案例 94（39%）、輸出預測 106（44%）、設計選擇 39（16%）。標記需要 `△` 的 14 題。

**已 commit**：`ed68d27 Set up the scaffolding for the advanced course`（4 檔）。未 push。

**下一步**：派 agent 寫 pilot `lesson2-1`（閉包，20 題），依據 `ADVANCED_OUTLINE.md` 第 11-32 行的骨架。完成後交使用者驗收風格，通過才開批次 A。

---

### 2026-09-17 — pilot lesson2-1 開工

模型設定：使用者已把預設 model 切到 Opus 5，pilot agent 不覆寫 model，直接繼承。
目的是先看品質上限，再決定量產批次要不要降到 sonnet。

Session 額度開工時剩餘：約 14,996,000 / 15,000,000。

---

### 2026-09-18 — pilot lesson2-1 完成（前一個 session 寫完後、記錄前斷線，本次補記）

**完成**：`docs/data/advanced/lesson2-1.js`，830 行，20 題。

驗證結果：
- `node --check` 通過
- `node scripts/validate-data.js --lesson lesson2-1` → ✓ lesson2-1（20 題）
- id `2-1-01` ~ `2-1-20` 齊全；`answer` 全為 0；emoji 0 個（`LC_ALL=C` 清點）
- 「選項 A/B/C」字樣只出現在檔頭規範註解，題目內文無

**尚未上架**（`index.js` 不動，等批次上架時一起開）。

**下一步**：使用者驗收 pilot 風格 → 決定量產模型（Opus 5 / Sonnet）→ 開批次 A（2-2、2-10 並行）。

---

### 2026-09-18 — primer 基礎建設 + 批次 A 完成

**完成並已 push**：P1（`fde8374`）、P2 + 2-1 上架（`12dd5d2`）、2-10（`0449b80`）、2-2（`567300c`）。

- 寫題 agent 共用的指示：必讀文件 → 本文件 §4 的 12 條約束 → 驗證清單 → 簡短回報。本機有 rustc 1.97.1，agent 會實際編譯所有 `√` / `X` 程式。
- 2-2 有 2 個 `△`（Q4 `for` → `IntoIterator`、Q13 `v[i]` → `Index::index`）；2-10 沒有 `△`。
- 每課上架流程：驗證 → `index.js` 改 `true` → 更新本文件 → commit → push。

**進行中**：2-3、2-4、2-5（批次 B，並行）。

**接下來**：C（2-6、2-9、2-11；2-9 要對照已完成的 2-3）→ D（2-7 → 2-8；2-12 最後）→ T17。

---

### 2026-09-18 — 批次 B 大半、C 開工時撞 session 限額

**已上架並 push**：2-3（`32a4370`）、2-4（`3276677`）、2-9（`f62b247`）。累計 6 課 / 120 題上線。

**撞限額（rate limit 429）**：2-5、2-6、2-11 三個 agent 同時中止。
- 2-5：檔案已寫完（1033 行、20 題、有 primer），`validate --lesson` 通過；中止時正在做 rustc 編譯確認。**未 commit**，要先補做 rustc 複驗才能上架。
- 2-6、2-11：沒有留下任何檔案，要從頭寫。

**下一步**：2-5 rustc 複驗 → 上架；重派 2-6、2-11 → 批次 D（2-7 → 2-8；2-12 最後）→ T17。

---

### 2026-09-18 — 批次 B、C 完成

**已上架並 push**：2-5（`1352071`，重派 agent 做 rustc 複驗，無需修改）、2-11（`e1c3826`）、2-6（`79daa9a`，thiserror/anyhow 用本機 cargo 快取 `--offline` 實測）。累計 **9 課 / 180 題**上線。

**進行中**：2-7（單獨跑，2-8 與 2-12 都依賴它）。

**接下來**：2-7 上架 → 2-8、2-12 並行 → T17 全域驗證 + 跨課重複題偵測 + `COURSE_PLAN.md` 更新。

---

### 2026-09-21 — 2-8 上架

**已上架並 push**：2-8（非同步 async/await）。累計 **11 課 / 220 題**上線。

- 845 行、20 題，`△` 落在 `2-8-11`（`async fn` → `impl Future`）與 `2-8-12`（`.await` → `Future::poll`），與骨架預判一致。
- agent 在 scratchpad 建 cargo 專案實測：19 支 `√`/正面程式編譯執行通過且輸出與預測逐字相符；6 個 `X` 編譯失敗案例 + 2 個「編得過但行為錯」案例（`2-8-02` 沒 `.await`、`2-8-17` 阻塞 runtime）確認。依實測修正 4 處錯誤訊息措辭（`2-8-11` 實際是 `expected i32, found future`、`2-8-12` 是 E0369、`2-8-13` 是 `moved due to this await`、`2-8-14` 是 E0505）。
- **環境坑**：本機 GNU toolchain 缺 `dlltool.exe`、MSVC toolchain 缺 Windows SDK，`tokio` 開 `features = ["full"]` 會在 `windows-sys` / `parking_lot_core` 連結失敗。改用 `features = ["rt", "rt-multi-thread", "macros", "time", "sync"]` 即可涵蓋本課全部 API。**之後要編 tokio 程式的人直接照這組 feature 寫。**
- 與 2-7 的區隔：第 9 題（`tokio::spawn` 捕獲非 `'static` 借用）改成「已經寫了 `async move` 卻仍然失敗」（move 進去的是參考本身），與 2-7 第 3 題「加 `move` 就好」明確區分，`√` 改用 `Arc`。第 19 題用 `tokio::sync::mpsc` 並對照 2-7 的 `std::sync::mpsc`。
- 驗證腳本原本對 `2-8-02` 誤報去糖需求（`⛔` note 裡抄了 rustc 警告的 `poll them`），處理方式是把該引文移到 `explanation`（腳本不掃 explanation），**沒有用 `desugarChecked` 豁免**。
- primer 範例 11 行，略超 `AUTHORING.md` 建議的 3~8 行，但 async 起手式需要 `#[tokio::main]` + 函式定義，且 2-4（9/14 行）、2-6（9 行）已有同樣情況，維持原樣。

**進行中**：2-12（Cargo 生態，最後一課）。

**接下來**：2-12 上架 → T17 全域驗證 + 跨課重複題偵測 + `COURSE_PLAN.md` 更新。

