# Linear + Claude Code 開發教學文件

> 本文記錄如何結合 Linear 專案管理工具與 Claude Code AI 助理，打造高效的現代軟體開發工作流程。

---

## 目錄

1. [前言](#1-前言)
2. [設定 Linear 專案](#2-設定-linear-專案)
3. [用 Issues 規劃開發](#3-用-issues-規劃開發)
4. [開發工作流程](#4-開發工作流程)
5. [進階功能](#5-進階功能)
6. [Claude Code 整合](#6-claude-code-整合)
7. [結語](#7-結語)

---

## 1. 前言

### 什麼是 Linear？

[Linear](https://linear.app) 是一款專為軟體開發團隊設計的專案管理工具，以速度和簡潔著稱。它提供 Issues、Projects、Cycles、Milestones 等功能，並擁有強大的 API 生態系。

### 什麼是 Claude Code？

Claude Code 是 Anthropic 推出的 AI 程式設計助理，可透過 GitHub Actions 整合至開發流程，讓開發者直接在 Issue 或 PR 中使用 `@claude` 呼叫 AI 完成程式碼任務。

### 為什麼要整合兩者？

| 工具 | 功能 |
|------|------|
| **Linear** | 任務追蹤、進度管理、協作溝通 |
| **Claude Code** | AI 輔助程式設計、自動化程式碼審查 |
| **兩者整合** | 在 Linear Issue 中規劃需求，透過 GitHub 讓 Claude 自動實作 |

---

## 2. 設定 Linear 專案

### 2.1 建立 Labels（標籤）

Labels 幫助你快速分類和篩選 Issues。

**透過 Claude Code 建立 Label：**

```
@claude 使用 Linear MCP 幫我建立以下 labels：
- Bug（紅色 #FF0000）
- Feature（綠色 #00FF00）
- Documentation（藍色 #0000FF）
```

**API 參數範例：**

```json
{
  "tool": "create_issue_label",
  "params": {
    "name": "Bug",
    "color": "#FF0000",
    "description": "程式錯誤或非預期行為"
  }
}
```

**列出所有 Labels：**

```json
{
  "tool": "list_issue_labels",
  "params": {
    "team": "Engineering",
    "limit": 50
  }
}
```

> **提示：** 可以建立 Label 群組（`isGroup: true`）來組織相關標籤，例如「優先級」群組下包含 P0、P1、P2。

---

### 2.2 建立 Project（專案）

Project 是用來組織一組相關 Issues 的容器，通常對應一個功能、版本或目標。

**建立專案：**

```json
{
  "tool": "save_project",
  "params": {
    "name": "2048 遊戲重構",
    "description": "重構 2048 遊戲的核心邏輯，提升效能和可維護性",
    "summary": "遊戲核心重構計畫",
    "priority": 2,
    "startDate": "2026-03-01",
    "targetDate": "2026-04-30",
    "addTeams": ["Engineering"],
    "color": "#7B68EE",
    "icon": ":game_die:"
  }
}
```

**優先級對照表：**

| 數值 | 優先級 |
|------|--------|
| 0 | None（無） |
| 1 | Urgent（緊急） |
| 2 | High（高） |
| 3 | Medium（中） |
| 4 | Low（低） |

**查詢專案資訊：**

```json
{
  "tool": "get_project",
  "params": {
    "query": "2048 遊戲重構",
    "includeMembers": true,
    "includeMilestones": true
  }
}
```

---

### 2.3 建立 Document（文件）

Linear 內建文件系統，適合存放技術規格、會議記錄或設計文件。

**建立文件：**

```json
{
  "tool": "create_document",
  "params": {
    "title": "技術架構設計文件",
    "content": "# 架構概述\n\n## 前端架構\n\n使用原生 JavaScript...\n\n## 資料結構\n\n遊戲盤面使用二維陣列..."
  }
}
```

**更新文件：**

```json
{
  "tool": "update_document",
  "params": {
    "id": "doc_id_here",
    "title": "技術架構設計文件 v2",
    "content": "# 架構概述（更新版）\n\n..."
  }
}
```

**搜尋 Linear 官方文件：**

```json
{
  "tool": "search_documentation",
  "params": {
    "query": "how to use cycles"
  }
}
```

---

### 2.4 建立 Milestones（里程碑）

里程碑用來標記專案的重要節點，例如 Alpha 版本發布、Beta 測試開始等。

**建立里程碑：**

```json
{
  "tool": "save_milestone",
  "params": {
    "project": "2048 遊戲重構",
    "name": "Alpha 版本",
    "description": "完成核心遊戲邏輯，可基本遊玩",
    "targetDate": "2026-03-31"
  }
}
```

**列出里程碑：**

```json
{
  "tool": "list_milestones",
  "params": {
    "project": "2048 遊戲重構"
  }
}
```

> **最佳實踐：** 每個里程碑應有明確的完成標準（Definition of Done），並與對應的 Issues 連結。

---

## 3. 用 Issues 規劃開發

### 3.1 建立 Issues 並設定 Priorities（優先級）

**建立一個功能需求 Issue：**

```json
{
  "tool": "save_issue",
  "params": {
    "title": "實作遊戲移動動畫",
    "team": "Engineering",
    "description": "## 需求描述\n\n當方塊移動時，需要有流暢的滑動動畫效果。\n\n## 驗收條件\n\n- [ ] 上下左右移動皆有動畫\n- [ ] 動畫時長約 150ms\n- [ ] 合併動畫有額外效果",
    "priority": 2,
    "labels": ["Feature"],
    "project": "2048 遊戲重構",
    "milestone": "Alpha 版本"
  }
}
```

**依優先級篩選 Issues：**

```json
{
  "tool": "list_issues",
  "params": {
    "team": "Engineering",
    "priority": 1,
    "state": "Todo"
  }
}
```

---

### 3.2 設定 Estimates（估算）

Estimates 幫助團隊評估工作量，通常以故事點數（Story Points）或小時表示。

**設定估算：**

```json
{
  "tool": "save_issue",
  "params": {
    "id": "ENG-42",
    "estimate": 3
  }
}
```

**查看估算統計：**

```json
{
  "tool": "list_issues",
  "params": {
    "project": "2048 遊戲重構",
    "state": "In Progress"
  }
}
```

---

### 3.3 設定 Issue 依賴關係

Issues 之間可以設定相依性，確保開發順序正確。

**設定阻擋關係（blocks/blockedBy）：**

```json
{
  "tool": "save_issue",
  "params": {
    "id": "ENG-45",
    "blocks": ["ENG-46", "ENG-47"],
    "blockedBy": ["ENG-40"]
  }
}
```

**設定相關 Issues：**

```json
{
  "tool": "save_issue",
  "params": {
    "id": "ENG-45",
    "relatedTo": ["ENG-38", "ENG-39"]
  }
}
```

> **注意：** `blocks`、`blockedBy`、`relatedTo` 都是 **append-only**（只增不減）。若需移除關係，需透過 Linear UI 操作。

---

### 3.4 建立 Sub-issues（子任務）

複雜的功能可以拆分成多個子任務，方便追蹤進度。

**建立父 Issue：**

```json
{
  "tool": "save_issue",
  "params": {
    "title": "重構遊戲核心引擎",
    "team": "Engineering",
    "priority": 2
  }
}
```

**建立子 Issue（設定 parentId）：**

```json
{
  "tool": "save_issue",
  "params": {
    "title": "重構方塊移動邏輯",
    "team": "Engineering",
    "parentId": "ENG-50"
  }
}
```

**查詢所有子任務：**

```json
{
  "tool": "list_issues",
  "params": {
    "parentId": "ENG-50"
  }
}
```

---

### 3.5 使用 Comments（評論）進行協作

**新增評論：**

```json
{
  "tool": "save_comment",
  "params": {
    "issueId": "ENG-42",
    "body": "## 實作進度更新\n\n已完成基本動畫框架，正在處理合併特效。\n\n預計明天完成初版。"
  }
}
```

**回覆特定評論（threaded reply）：**

```json
{
  "tool": "save_comment",
  "params": {
    "issueId": "ENG-42",
    "body": "感謝更新！記得加上 CSS transition 的 ease-in-out 效果。",
    "parentId": "comment_id_here"
  }
}
```

**更新評論：**

```json
{
  "tool": "save_comment",
  "params": {
    "id": "comment_id_here",
    "body": "（已更新）實作完成，請 review。"
  }
}
```

**刪除評論：**

```json
{
  "tool": "delete_comment",
  "params": {
    "id": "comment_id_here"
  }
}
```

---

## 4. 開發工作流程

### 4.1 Issue 狀態流轉

Linear 中的 Issue 狀態通常如下流轉：

```
Backlog → Todo → In Progress → In Review → Done
```

**查詢可用狀態：**

```json
{
  "tool": "list_issue_statuses",
  "params": {
    "team": "Engineering"
  }
}
```

**更新 Issue 狀態：**

```json
{
  "tool": "save_issue",
  "params": {
    "id": "ENG-42",
    "state": "In Progress",
    "assignee": "me"
  }
}
```

**典型工作流程：**

1. **Backlog** → 新需求收集，尚未排入計畫
2. **Todo** → 已確認優先級，納入本期開發
3. **In Progress** → 開發者正在處理
4. **In Review** → 提交 PR，等待 Code Review
5. **Done** → 完成並合併

---

### 4.2 使用 @claude 讓 AI 寫程式

這是 Linear + Claude Code 整合的核心功能。在 GitHub Issue 或 PR 中使用 `@claude` 標籤，即可觸發 AI 自動完成程式碼任務。

**使用範例：**

在 GitHub Issue 描述或評論中寫：

```
@claude 請幫我實作以下功能：
1. 在 game.js 中加入移動動畫函數 animateMove()
2. 動畫時長設為 150ms，使用 CSS transition
3. 加入單元測試
```

**Claude Code 的典型回應流程：**

1. 分析 Issue 需求
2. 讀取相關程式碼檔案
3. 實作程式碼變更
4. 建立 Pull Request
5. 在 Issue 評論中回報進度

**實際效果範例（本 2048 專案）：**

```
@claude 請修改 style.css，讓遊戲畫面在手機上能正確顯示，
並加入 RWD 響應式設計，支援螢幕寬度 320px 以上的裝置。
```

Claude Code 會自動：
- 讀取 `style.css` 的現有樣式
- 加入 `@media` 查詢
- 調整字體大小和間距
- 建立 PR 供開發者審查

---

### 4.3 搭配 Linear 狀態管理開發流程

**完整的 AI 輔助開發流程：**

```
1. 在 Linear 建立 Issue（記錄需求）
   ↓
2. 將 Issue 關聯至 GitHub（設定 Link）
   ↓
3. 在 GitHub Issue 用 @claude 觸發 AI 實作
   ↓
4. Claude Code 建立 PR 並通知
   ↓
5. 在 Linear 更新 Issue 狀態為 "In Review"
   ↓
6. Code Review 通過後，更新狀態為 "Done"
```

---

## 5. 進階功能

### 5.1 Cycles（衝刺/Sprint）

Cycles 是 Linear 的 Sprint 功能，幫助團隊以固定週期（通常 1-2 週）迭代開發。

**列出目前的 Cycle：**

```json
{
  "tool": "list_cycles",
  "params": {
    "teamId": "team_uuid_here",
    "type": "current"
  }
}
```

**查看前一個 Cycle：**

```json
{
  "tool": "list_cycles",
  "params": {
    "teamId": "team_uuid_here",
    "type": "previous"
  }
}
```

**查詢 Cycle 中的所有 Issues：**

```json
{
  "tool": "list_issues",
  "params": {
    "team": "Engineering",
    "cycle": "Sprint 5"
  }
}
```

**將 Issue 加入 Cycle：**

```json
{
  "tool": "save_issue",
  "params": {
    "id": "ENG-42",
    "cycle": "Sprint 5"
  }
}
```

**Cycle 使用最佳實踐：**

- 每個 Cycle 開始時召開 Sprint Planning
- Cycle 結束時回顧完成率和速度（Velocity）
- 未完成的 Issues 移至下一個 Cycle 或放回 Backlog

---

### 5.2 Attachments（附件）

Attachments 讓你可以上傳截圖、設計稿、日誌等檔案至 Issue。

**上傳截圖到 Issue：**

首先 base64 編碼檔案：
```bash
base64 -w0 screenshot.png
```

然後上傳：

```json
{
  "tool": "create_attachment",
  "params": {
    "issue": "ENG-42",
    "base64Content": "iVBORw0KGgoAAAANSUhEUgAA...",
    "filename": "bug-screenshot.png",
    "contentType": "image/png",
    "title": "Bug 重現截圖",
    "subtitle": "在 iOS Safari 上的顯示問題"
  }
}
```

**下載附件：**

```json
{
  "tool": "get_attachment",
  "params": {
    "id": "attachment_id_here"
  }
}
```

**刪除附件：**

```json
{
  "tool": "delete_attachment",
  "params": {
    "id": "attachment_id_here"
  }
}
```

**查看 Issue 中的圖片：**

```json
{
  "tool": "get_issue",
  "params": {
    "id": "ENG-42"
  }
}
```

然後從 `description` 字段中提取圖片：

```json
{
  "tool": "extract_images",
  "params": {
    "markdown": "<issue description content>"
  }
}
```

**支援的 MIME 類型：**

| 類型 | MIME |
|------|------|
| PNG 圖片 | `image/png` |
| JPEG 圖片 | `image/jpeg` |
| GIF 動圖 | `image/gif` |
| SVG 向量圖 | `image/svg+xml` |
| PDF 文件 | `application/pdf` |
| 純文字 | `text/plain` |
| CSV 資料 | `text/csv` |
| ZIP 壓縮檔 | `application/zip` |

---

### 5.3 Duplicate 處理

當出現重複的 Issue 時，可以標記其中一個為 Duplicate，並指向原始 Issue。

**標記為重複：**

```json
{
  "tool": "save_issue",
  "params": {
    "id": "ENG-55",
    "duplicateOf": "ENG-42"
  }
}
```

**取消重複標記：**

```json
{
  "tool": "save_issue",
  "params": {
    "id": "ENG-55",
    "duplicateOf": null
  }
}
```

**處理 Duplicate 的最佳實踐：**

1. 搜尋現有 Issues 再建立新的
2. 將重複 Issue 中有用的資訊（評論、附件）遷移到原始 Issue
3. 標記為 Duplicate 後關閉重複的 Issue
4. 在原始 Issue 中補充重複 Issue 提供的額外上下文

---

## 6. Claude Code 整合

### 6.1 什麼是 Claude Code GitHub Action？

Claude Code GitHub Action 是一個官方提供的 GitHub Action，讓 Claude AI 可以直接回應 GitHub Issue 和 PR 的評論。當使用者在評論中提及 `@claude`，Action 就會自動觸發。

### 6.2 GitHub Action 設定

**建立 `.github/workflows/claude.yml`：**

```yaml
name: Claude Code

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request_review:
    types: [submitted]

jobs:
  claude:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'issues' && contains(github.event.issue.body, '@claude')) ||
      (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude'))
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
      id-token: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude Code
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### 6.3 設定必要的 Secrets

在 GitHub Repository Settings > Secrets and variables > Actions 中加入：

| Secret 名稱 | 說明 |
|-------------|------|
| `ANTHROPIC_API_KEY` | 從 [Anthropic Console](https://console.anthropic.com) 取得的 API 金鑰 |

### 6.4 設定 MCP（Model Context Protocol）

如需 Claude Code 也能操作 Linear，在 Action 設定中加入 MCP 伺服器：

```yaml
      - name: Run Claude Code
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          mcp_config: |
            {
              "mcpServers": {
                "linear-server": {
                  "command": "npx",
                  "args": ["-y", "@linear/mcp-server"],
                  "env": {
                    "LINEAR_API_KEY": "${{ secrets.LINEAR_API_KEY }}"
                  }
                }
              }
            }
```

並在 Secrets 中加入：

| Secret 名稱 | 說明 |
|-------------|------|
| `LINEAR_API_KEY` | 從 Linear Settings > API > Personal API keys 取得 |

### 6.5 使用 @claude 的最佳實踐

**明確描述任務：**

```markdown
@claude 請在 `src/game.js` 的第 150 行後面加入以下功能：

1. 新增 `checkWin()` 函數，當出現 2048 方塊時回傳 true
2. 在 `move()` 函數結束時呼叫 `checkWin()`
3. 如果獲勝，顯示 "恭喜獲勝！" 的訊息
4. 加入對應的單元測試
```

**附上相關上下文：**

```markdown
@claude 我在手機版 Safari 上發現以下 bug：
- 問題：方塊文字在小螢幕上顯示不完整
- 復現步驟：在 375px 寬度的裝置上打開遊戲
- 預期：所有方塊數字完整顯示
- 實際：4 位數以上的數字被截斷

請修復 `style.css` 中的相關樣式。
```

**指定輸出格式：**

```markdown
@claude 請審查 `game.js` 中的 `merge()` 函數，並：
1. 指出任何潛在的效能問題
2. 確認邊界條件處理是否正確
3. 以 Markdown 格式整理你的發現

不需要修改程式碼，只需提供審查意見。
```

### 6.6 整合 Linear 和 GitHub 工作流程

**在 Linear Issue 中加入 GitHub 連結：**

```json
{
  "tool": "save_issue",
  "params": {
    "id": "ENG-42",
    "links": [
      {
        "url": "https://github.com/yourorg/yourrepo/issues/18",
        "title": "GitHub Issue #18"
      }
    ]
  }
}
```

**自動化工作流程範例：**

```
Linear Issue 建立
    ↓
開發者在 GitHub 建立對應 Issue
    ↓
在 GitHub Issue 中用 @claude 委派任務
    ↓
Claude Code 在新分支實作功能
    ↓
建立 PR 並自動通知
    ↓
Code Review 通過 → PR 合併
    ↓
在 Linear 更新 Issue 狀態為 Done
    ↓
更新 Milestone 進度
```

---

## 7. 結語

### 完整功能清單

本教學涵蓋了以下 15 項 Linear 核心功能：

| # | 功能 | 章節 |
|---|------|------|
| 1 | **Labels**（標籤） | 2.1 |
| 2 | **Projects**（專案） | 2.2 |
| 3 | **Documents**（文件） | 2.3 |
| 4 | **Milestones**（里程碑） | 2.4 |
| 5 | **Issues**（任務） | 3.1 |
| 6 | **Priorities**（優先級） | 3.1 |
| 7 | **Estimates**（估算） | 3.2 |
| 8 | **Dependencies**（依賴關係） | 3.3 |
| 9 | **Sub-issues**（子任務） | 3.4 |
| 10 | **Comments**（評論） | 3.5 |
| 11 | **Issue Statuses**（狀態流轉） | 4.1 |
| 12 | **Cycles**（衝刺） | 5.1 |
| 13 | **Attachments**（附件） | 5.2 |
| 14 | **Duplicate 處理** | 5.3 |
| 15 | **Claude Code 整合** | 6 |

### 關鍵 API 工具總覽

以下是本教學中使用的所有 Linear MCP 工具：

```
Issues:    save_issue, get_issue, list_issues
Comments:  save_comment, list_comments, delete_comment
Labels:    create_issue_label, list_issue_labels
Statuses:  list_issue_statuses, get_issue_status
Projects:  save_project, get_project, list_projects
Milestones: save_milestone, get_milestone, list_milestones
Cycles:    list_cycles
Documents: create_document, update_document, list_documents, get_document
Teams:     list_teams, get_team
Users:     list_users, get_user
Attachments: create_attachment, get_attachment, delete_attachment, extract_images
```

### 推薦學習路徑

1. **新手** → 從第 2 章開始，設定你的第一個 Linear 專案
2. **進階** → 深入第 3 章，建立完整的 Issue 管理體系
3. **團隊** → 實施第 5 章的 Cycles，建立穩健的 Sprint 流程
4. **AI 整合** → 第 6 章，讓 Claude Code 成為你的 AI 開發夥伴

### 其他資源

- [Linear 官方文件](https://linear.app/docs)
- [Linear API 參考](https://developers.linear.app/docs/graphql/working-with-the-graphql-api)
- [Claude Code GitHub Action](https://github.com/anthropics/claude-code-action)
- [Anthropic Claude Code 文件](https://docs.anthropic.com/claude/docs/claude-code)

---

> 本文件由 Claude Code AI 助理協助撰寫，結合實際開發經驗整理而成。
> 如有問題或建議，歡迎在 GitHub Issue 中提出，或直接使用 `@claude` 要求 AI 協助更新本文件。
