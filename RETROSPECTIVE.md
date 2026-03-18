# 專案回顧：在 2048 開發中使用 Linear 的得與失

## 背景

本專案使用 Linear 管理一個 vanilla HTML/CSS/JS 的 2048 遊戲開發，建立了 17 個 issues、4 個 milestones、完整的依賴關係圖，並展示了 15 項 Linear 功能。以下是實際體驗後的誠實檢討。

---

## Linear 帶來的好處

### 1. 強制先想清楚再動手

建立 issues 時必須寫清楚目標、需求、驗收條件。例如 Issue #6（tile 滑動與合併）在 description 裡明確寫了：

> **重要：每個 tile 在單次移動中只能合併一次**

這讓寫 code 時不會遺漏關鍵規則，也讓後來的 Bug #14 能直接對照規格找出問題。

### 2. 依賴關係讓開發順序清晰

`blockedBy` 畫出了明確的開發路線圖：

```
#1 → #2 + #3（平行）→ #4 → #5 → #6 → #7 + #8 + #9
→ #10 + #11（平行）→ #12 → #13 → #14 → #15 → #16
```

不用在腦中記「我現在該做什麼」，看 Todo 裡沒被 block 的 issue 就好。哪些可以平行做、哪些必須等前置完成，一目了然。

### 3. Bug 可追溯

Issue #14（重複合併 Bug）透過 `relatedTo: SKG-21` 與原始的合併機制 issue 綁在一起。半年後回頭看，馬上知道這個 bug 是哪段邏輯出的問題，修復 comment 也記錄了根因分析。

### 4. 決策歷史留存

Issue #1 的 comment 記錄了「為什麼只用 3 個檔案」「為什麼不用框架」。這類架構決策不會出現在 code 裡，但對後續維護者極其重要。

### 5. 搭配 Claude Code 形成自動化迴路

`claude` label + GitHub Action 可以做到：

1. Linear 開 issue → 自動同步 GitHub Issue
2. Claude Code 讀取需求 → 自動寫 code → 提 PR
3. PR merge → 回 Linear 更新狀態為 Done

開發者只需要在 Linear 寫需求和 review PR，程式碼交給 AI。

---

## 實際遇到的問題

### 1. 管理成本大於開發成本

這個專案的 3 個核心檔案（HTML/CSS/JS）加起來不到 300 行程式碼，但我們花了大量時間在：

- 建立 17 個 issues 的 title、description、labels、priority、estimate
- 設定依賴關係（blockedBy、relatedTo）
- 更新狀態流轉（Todo → In Progress → Done）
- 撰寫 comments

**實際寫 code 的時間遠少於管理 Linear 的時間。**

### 2. 過度拆分反而降低效率

有些 issues 拆得太細，例如：

- Issue #2a（定義 tile 顏色常數）作為 #2 的 sub-issue，實際上就是在 CSS 裡多寫幾行 selector，不需要獨立追蹤
- Issue #5（鍵盤控制）只有 10 行程式碼，獨立成 issue 的管理成本 > 開發成本

### 3. 狀態更新是額外負擔

每個 issue 都要走 Todo → In Progress → Done 的流程，對一個人的小專案來說是純粹的 overhead。

### 4. Description 格式問題

使用 `\n` 字串傳遞 Markdown 時，Linear 會顯示為字面的 `\n` 而非換行。必須使用真正的換行字元。這類工具層的坑會消耗除錯時間。

---

## 什麼時候該用 Linear？

### 適合

| 情境 | 原因 |
|------|------|
| 多人團隊（3+ 人） | 需要 visibility、分工、避免撞車 |
| 長期專案（1+ 月） | 需要追蹤進度、記錄決策歷史 |
| 有 sprint/release 節奏 | Cycles 功能發揮價值 |
| 跨職能協作 | PM 寫需求、工程師看 issue 開發、QA 看驗收條件 |
| 需要 audit trail | 所有變更、討論、狀態轉換都有紀錄 |

### 不適合

| 情境 | 原因 |
|------|------|
| 一個人的小專案 | 管理成本 > 收益，用 TODO comment 就夠 |
| 快速 prototype | 需要速度，不需要流程 |
| 幾小時能完成的任務 | 建 issue 的時間可能比做完還久 |

---

## 如果重來，我會怎麼做？

### 對這個專案

只建立 **4 個 milestone-level 的 issues**（而非 17 個），每個 issue 包含該階段所有工作：

1. Foundation & Grid — HTML/CSS 架構 + 棋盤
2. Core Mechanics — 移動、合併、計分、勝負
3. Polish — 動畫、RWD、觸控
4. Release — Bug 修復、文件

### 對真實團隊專案

保持完整的 issue 拆分，但：

- 只對 **需要多人協作** 的 issue 設定依賴關係
- Estimate 和 Priority 在 sprint planning 時設定，不在建立時
- Comment 只記錄 **非顯而易見** 的決策，不重複 code 裡已有的資訊

---

## 結論

Linear 是一個優秀的專案管理工具，但工具的價值取決於使用情境。**流程應該服務於開發，而非開發服務於流程。** 本專案的主要價值在於教學展示——用一個簡單專案完整走過所有功能，讓讀者知道每項功能的實際用途，在真正需要時能快速上手。
