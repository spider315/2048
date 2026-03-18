---
name: linear
description: "Complete Linear workspace management using the linear-server MCP. Use this skill whenever the user wants to work with Linear in any capacity — issues, projects, documents, teams, users, comments, labels, milestones, cycles, attachments, or images. Trigger for any mention of Linear, tickets, sprints, backlogs, triage, roadmaps, or project tracking. Even if the user doesn't explicitly say 'Linear', use this skill when context suggests they're managing tasks, bugs, features, or project workflows that involve Linear. This covers all 30 linear-server MCP tools."
---

# Linear Workspace Management

Complete reference for all `linear-server` MCP operations. All tools are invoked as `mcp__linear-server__<tool_name>`.

For full parameter details on any tool, read the corresponding reference file in `references/`.

---

## Quick Reference — All 30 Tools

| Domain | Tool | Description |
|--------|------|-------------|
| **Issues** | `list_issues` | Query issues with filters (team, assignee, state, priority, label, project, cycle) |
| | `get_issue` | Get full issue details by ID (e.g., `LIN-123`) |
| | `save_issue` | Create (needs `title` + `team`) or update (needs `id`) an issue |
| **Comments** | `list_comments` | List comments on an issue |
| | `save_comment` | Create (needs `issueId` + `body`) or update (needs `id` + `body`) a comment |
| | `delete_comment` | Delete a comment by ID |
| **Labels** | `list_issue_labels` | List issue labels (workspace or team) |
| | `create_issue_label` | Create a new issue label (needs `name`) |
| | `list_project_labels` | List project-level labels |
| **Statuses** | `list_issue_statuses` | List available statuses for a team |
| | `get_issue_status` | Get status details |
| **Projects** | `list_projects` | Query projects with filters |
| | `get_project` | Get project details by name/ID/slug |
| | `save_project` | Create (needs `name` + team via `addTeams`/`setTeams`) or update a project |
| **Milestones** | `list_milestones` | List milestones in a project |
| | `get_milestone` | Get milestone details |
| | `save_milestone` | Create or update a milestone in a project |
| **Cycles** | `list_cycles` | List cycles for a team (current/previous/next) |
| **Documents** | `list_documents` | Query workspace documents |
| | `get_document` | Get document by ID or slug |
| | `create_document` | Create a document (needs `title`) |
| | `update_document` | Update a document (needs `id`) |
| | `search_documentation` | Search Linear's product help docs |
| **Teams** | `list_teams` | List workspace teams |
| | `get_team` | Get team details by UUID/key/name |
| **Users** | `list_users` | List workspace users |
| | `get_user` | Get user details (use `"me"` for current user) |
| **Attachments** | `create_attachment` | Upload file to an issue (base64-encoded) |
| | `get_attachment` | Download attachment by ID |
| | `delete_attachment` | Delete attachment by ID |
| **Images** | `extract_images` | Extract and view images from markdown content |

---

## Common Workflows

### Create an Issue

1. If no team specified → `list_teams` to find available teams
2. `save_issue` with `title` and `team` (required), plus optional `assignee`, `priority`, `labels`, `description`, `project`, `state`

```
Priority: 0=None, 1=Urgent, 2=High, 3=Normal, 4=Low
Assignee: user ID, name, email, or "me"
```

### Query My Issues

```
list_issues with assignee: "me"
```

Filter further with `state`, `priority`, `label`, `project`, `team`, `createdAt`, `updatedAt`.

### Triage / Bulk Update

1. `list_issues` with relevant filters
2. For each issue → `save_issue` with `id` and fields to update
3. Process sequentially to avoid rate limits

### Sprint / Cycle Review

1. `list_teams` → get team ID
2. `list_cycles` with `teamId` and `type: "current"`
3. `list_issues` with `cycle` filter

### Project Setup

1. `save_project` with `name` and `addTeams: ["team-name"]`
2. `save_milestone` with `project` and `name` for key milestones
3. Create issues with `project` parameter to link them

### View Images in Issues

1. `get_issue` → get the `description` (markdown)
2. `extract_images` with that markdown → view embedded screenshots/diagrams

### Upload File to Issue

1. Base64-encode the file: `base64 -w0 file.png`
2. `create_attachment` with `issue`, `base64Content`, `filename`, `contentType`

### Add Comment / Reply

- New comment: `save_comment` with `issueId` and `body`
- Reply: add `parentId` (parent comment ID)
- Update: `save_comment` with `id` and `body`

---

## Key Concepts

**Markdown in descriptions/comments** — When passing `description` or `body` content to Linear tools (`save_issue`, `save_comment`, `create_document`, `update_document`), you MUST use actual newlines in the parameter value. NEVER use literal `\n` escape sequences — they will render as visible `\n` text in Linear instead of line breaks. Simply write the markdown content with real line breaks in the parameter block.

Correct:
```
description: |
  ## 目標

  建立 2048 遊戲的基礎專案架構。

  ## 需求

  - 建立 `index.html`
  - 建立 `style.css`
```

Wrong (will show literal \n):
```
description: "## 目標\n建立 2048 遊戲的基礎專案架構。\n\n## 需求\n- 建立 `index.html`\n- 建立 `style.css`"
```

**Identifiers** — Most tools accept flexible identifiers:
- Issues: ID or identifier like `LIN-123`
- Teams: UUID, key (e.g., `ENG`), or display name
- Projects: name, ID, or slug
- Users: ID, name, email, or `"me"`

**Pagination** — List tools support `limit` (default 50, max 250) and `cursor` for next page.

**Date filters** — `createdAt` and `updatedAt` accept ISO-8601 dates or durations:
- `-P1D` = last 1 day
- `-P7D` = last 7 days
- `-P1M` = last 1 month

**Append-only relations** — On `save_issue`, the fields `blocks`, `blockedBy`, `relatedTo`, and `links` only add relations; they never remove existing ones.

**`setTeams` vs `addTeams`** — On `save_project`:
- `setTeams` replaces all teams (cannot combine with add/remove)
- `addTeams`/`removeTeams` for incremental changes

---

## Detailed Parameter Reference

When you need the full parameter list for a tool, read the corresponding reference file:

- **`references/issues.md`** — `list_issues`, `get_issue`, `save_issue`, `list_comments`, `save_comment`, `delete_comment`, `list_issue_labels`, `create_issue_label`, `list_issue_statuses`, `get_issue_status`
- **`references/projects.md`** — `list_projects`, `get_project`, `save_project`, `list_milestones`, `get_milestone`, `save_milestone`, `list_project_labels`, `list_cycles`
- **`references/docs.md`** — `list_documents`, `get_document`, `create_document`, `update_document`, `search_documentation`
- **`references/team.md`** — `list_teams`, `get_team`, `list_users`, `get_user`
- **`references/attachments.md`** — `create_attachment`, `get_attachment`, `delete_attachment`, `extract_images`
