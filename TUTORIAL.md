# Linear + Claude Code 實戰教學：從零開發 2048 遊戲

> 本教學透過從零開發一個 2048 遊戲，完整展示 Linear 專案管理工具的 15 項核心功能，搭配 Claude Code 進行 AI 輔助開發。

---

## 前言

### 我們要做什麼？
用純 HTML/CSS/JavaScript 開發一個完整的 2048 益智遊戲，同時學習如何使用 Linear 管理整個開發流程。

### 會學到什麼？
- Linear 的專案管理完整工作流程
- 15 項 Linear MCP API 功能的實際用法
- Claude Code 如何與 Linear 雙向整合
- 從需求規劃到部署的完整開發流程

### 前置條件
- 一個 Linear workspace
- Claude Code CLI（已安裝 Linear MCP plugin）
- GitHub repo（可選，用於 @claude GitHub Action）

---

## Chapter 1：設定 Linear 專案

### 1.1 建立自訂 Labels（`create_issue_label`）

Labels 幫助分類 issues。除了內建的 Feature/Bug/Improvement，我們建立兩個自訂 label：

```
create_issue_label:
  name: "Frontend"
  color: "#4ECDC4"
  description: "UI/視覺相關"
  teamId: "<your-team-id>"

create_issue_label:
  name: "Game Logic"
  color: "#FF6B6B"
  description: "遊戲核心邏輯"
  teamId: "<your-team-id>"
```

**效果：** Issues 可以同時有 Feature + Frontend 標籤，精確分類。

### 1.2 建立專案（`save_project`）

```
save_project:
  name: "2048 Game"
  summary: "使用 vanilla HTML/CSS/JS 開發完整 2048 益智遊戲"
  icon: ":video_game:"
  color: "#F59E0B"
  lead: "me"
  priority: 2          # High
  addTeams: ["Skgo"]
  startDate: "2026-03-19"
  targetDate: "2026-04-16"
  description: |
    # 2048 Game
    使用純 HTML/CSS/JavaScript 從零開發 2048 益智遊戲...
```

**重點參數：**
- `icon` / `color`：視覺識別
- `lead`：專案負責人（`"me"` 代表自己）
- `priority`：0=None, 1=Urgent, 2=High, 3=Medium, 4=Low
- `addTeams`：關聯的團隊

### 1.3 建立專案文件（`create_document`）

```
create_document:
  title: "2048 Game — 技術規格書"
  project: "2048 Game"
  content: |
    # 技術規格書
    ## 架構決策
    ...
```

Linear 文件可以連結到專案，作為技術設計或 PRD 的集中存放處。

### 1.4 建立 Milestones（`save_milestone`）

Milestones 將專案拆分為階段性目標：

```
save_milestone:
  project: "2048 Game"
  name: "Foundation & Grid"
  description: "專案架構、HTML/CSS Grid、基礎 tile 渲染"
  targetDate: "2026-03-26"
```

我們建立了 4 個里程碑：

| # | Milestone | 目標日期 |
|---|-----------|---------|
| M1 | Foundation & Grid | 2026-03-26 |
| M2 | Core Game Mechanics | 2026-04-02 |
| M3 | Polish & UX | 2026-04-09 |
| M4 | Final QA & Release | 2026-04-16 |

---

## Chapter 2：用 Issues 規劃開發

### 2.1 建立 Issues（`save_issue`）

每個 issue 代表一個工作單元：

```
save_issue:
  title: "建立專案架構 (index.html, style.css, game.js)"
  team: "Skgo"
  project: "2048 Game"
  milestone: "Foundation & Grid"
  priority: 1            # Urgent
  labels: ["Feature", "Frontend"]
  estimate: 1            # Story points
  assignee: "me"
  state: "Todo"
  description: |
    ## 目標
    建立 2048 遊戲的基礎專案架構...
```

**重點參數：**
- `priority`：1=Urgent, 2=High, 3=Normal, 4=Low
- `estimate`：Story points（團隊自訂意義）
- `milestone`：歸屬的里程碑
- `labels`：可多選

### 2.2 Issue 依賴關係（`blockedBy` / `blocks`）

```
save_issue:
  title: "連接資料渲染到 DOM + New Game 按鈕"
  blockedBy: ["SKG-16", "SKG-17"]  # 被 #2 和 #3 擋住
```

依賴關係幫助團隊理解開發順序。本專案的依賴圖：

```
#1 → #2 + #3（平行）→ #4 → #5 → #6 → #7 + #8 + #9
→ #10 + #11（平行）→ #12 → #13 → #14 → #15 → #16
```

### 2.3 Issue 關聯（`relatedTo`）

```
save_issue:
  id: "SKG-24"
  relatedTo: ["SKG-23"]   # 遊戲結束 ↔ 勝利條件，相關但非依賴
```

`relatedTo` 表示兩個 issue 相關但不互相阻擋。

### 2.4 Sub-issues（`parentId`）

```
save_issue:
  title: "定義 tile 顏色常數"
  parentId: "SKG-16"       # 是 "建立 CSS Grid 棋盤" 的子任務
  priority: 4
```

Sub-issues 將大任務拆分為更小的可執行單元。

### 2.5 Comments（`save_comment`）

```
save_comment:
  issueId: "SKG-15"
  body: |
    ## 架構決策筆記
    ### 為什麼只用 3 個檔案？
    選擇最簡結構，原因：
    1. 教學導向 — 降低入門門檻
    2. 零建構工具 — 雙擊 HTML 就能跑
    ...
```

Comments 適合記錄決策理由、實作筆記、code review 討論。

---

## Chapter 3：開發工作流程

### 3.1 狀態流轉（`save_issue` + `state`）

每個 issue 的生命週期：

```
Backlog → Todo → In Progress → In Review → Done
                                         ↘ Duplicate
                                         ↘ Canceled
```

實際操作：

```
# 1. 開始工作
save_issue:
  id: "SKG-15"
  state: "In Progress"

# 2. 寫程式碼...

# 3. 加入實作筆記
save_comment:
  issueId: "SKG-15"
  body: "## 實作筆記\n..."

# 4. 完成
save_issue:
  id: "SKG-15"
  state: "Done"
```

### 3.2 實際開發範例

**Issue #6：tile 滑動與合併**（最核心的 issue）

核心演算法 `slideRow(row)`：
```javascript
function slideRow(row) {
  let arr = row.filter(v => v !== 0);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
      i++;  // 防止重複合併（Bug #14 修復）
    }
  }
  arr = arr.filter(v => v !== 0);
  while (arr.length < SIZE) arr.push(0);
  return arr;
}
```

四個方向透過 row/column 轉換共用同一個函數。

### 3.3 Bug 工作流程（Issue #14）

```
# 1. 建立 Bug issue
save_issue:
  title: "[Bug] Tile 在單次移動中重複合併"
  labels: ["Bug", "Game Logic"]
  priority: 1
  relatedTo: ["SKG-21"]    # 關聯到合併機制 issue
  description: |
    ## Bug 描述
    [2,2,4,0] 向左 → [8,0,0,0]
    預期: [4,4,0,0]

# 2. 修復 + 加 comment
save_comment:
  issueId: "SKG-29"
  body: |
    ## Bug 修復
    加入 `i++` 跳過已合併的 tile...

# 3. 關閉
save_issue:
  id: "SKG-29"
  state: "Done"
```

---

## Chapter 4：進階功能

### 4.1 Cycles / Sprints（`list_cycles`）

```
list_cycles:
  teamId: "<team-id>"
```

查詢團隊的 Sprint 週期，可用於追蹤每個 Sprint 的完成率。

### 4.2 Duplicate 處理（`duplicateOf`）

```
save_issue:
  title: "[Duplicate] 實作 tile 移動合併"
  state: "Duplicate"
  duplicateOf: "SKG-21"
```

當發現重複的 issue 時，用 `duplicateOf` 標記並設狀態為 Duplicate，保持 backlog 乾淨。

### 4.3 更新文件（`update_document`）

```
update_document:
  id: "d51f9742cfb3"    # document slug
  content: |
    # 更新後的技術規格書
    ## 新增：核心演算法說明
    ...
```

開發完成後更新技術規格書，加入實際的演算法說明和動畫參數。

### 4.4 附件（`create_attachment`）

```
create_attachment:
  issueId: "SKG-18"
  title: "遊戲截圖"
  url: "https://example.com/screenshot.png"
```

可將截圖、設計稿、外部連結附加到 issue。

---

## Chapter 5：Claude Code 整合

### 5.1 Linear MCP Plugin 設定

在 `.claude/settings.json` 中啟用：

```json
{
  "enabledPlugins": {
    "linear@claude-plugins-official": true
  }
}
```

啟用後，Claude Code 可直接呼叫所有 Linear API。

### 5.2 GitHub Action 設定

`.github/workflows/claude.yml` 讓 Claude 自動處理標記了 `claude` label 的 Linear issues：

1. 在 Linear 建立 issue，加上 `claude` label
2. Linear 自動同步到 GitHub Issues
3. GitHub Action 觸發 Claude Code
4. Claude 讀取 issue、寫程式、提交 PR
5. PR merge 後更新 Linear issue 狀態

### 5.3 雙向綁定流程

```
Linear Issue → GitHub Issue → @claude → PR → Merge → Linear Done
```

這個流程讓你可以完全在 Linear 中管理開發，而實際的程式碼工作由 Claude Code 在 GitHub 端執行。

---

## 結語

### Linear 功能總覽

本教學共展示了 15 項 Linear MCP 功能：

| # | 功能 | API | 展示時機 |
|---|------|-----|---------|
| 1 | 建立專案 | `save_project` | Chapter 1 |
| 2 | 專案文件 | `create_document` | Chapter 1 |
| 3 | Milestones | `save_milestone` | Chapter 1 |
| 4 | Issues | `save_issue` | Chapter 2 |
| 5 | 依賴關係 | `blockedBy/blocks` | Chapter 2 |
| 6 | Issue 關聯 | `relatedTo` | Chapter 2 |
| 7 | Sub-issues | `parentId` | Chapter 2 |
| 8 | Comments | `save_comment` | Chapter 2, 3 |
| 9 | 自訂 Labels | `create_issue_label` | Chapter 1 |
| 10 | 狀態流轉 | `save_issue (state)` | Chapter 3 |
| 11 | Bug 工作流程 | Bug label + flow | Chapter 3 |
| 12 | Duplicate 處理 | `duplicateOf` | Chapter 4 |
| 13 | Cycles/Sprints | `list_cycles` | Chapter 4 |
| 14 | 更新文件 | `update_document` | Chapter 4 |
| 15 | 附件 | `create_attachment` | Chapter 4 |

### 實戰建議

1. **先規劃再開發** — 花時間建立好 milestones 和 issues，開發時會更有方向
2. **善用依賴關係** — `blockedBy` 幫助團隊理解開發順序，避免 merge conflict
3. **Bug 用獨立 issue** — 不要在 feature issue 裡混合 bug 修復，保持追蹤清晰
4. **Comment 記錄決策** — 不只是程式碼，決策理由同樣重要
5. **善用 Labels 組合** — Feature + Frontend / Bug + Game Logic，多維度分類
6. **保持狀態更新** — In Progress / Done 的即時更新讓團隊有 visibility

---

*本教學使用 Claude Code + Linear MCP 完成。所有 Linear 操作均透過 Claude Code CLI 執行。*
