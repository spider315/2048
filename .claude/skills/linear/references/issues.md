# Issue Tools — Full Parameter Reference

## list_issues

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | Search title or description |
| `team` | string | Team name or ID |
| `assignee` | string/null | User ID, name, email, or `"me"`. Use `"null"` for unassigned |
| `state` | string | State type, name, or ID |
| `project` | string | Project name, ID, or slug |
| `label` | string | Label name or ID |
| `priority` | number | `0`=None, `1`=Urgent, `2`=High, `3`=Normal, `4`=Low |
| `cycle` | string | Cycle name, number, or ID |
| `delegate` | string | Agent name or ID |
| `parentId` | string | Parent issue ID (e.g., `LIN-123`) |
| `createdAt` | string | ISO-8601 date/duration (e.g., `-P1D`) |
| `updatedAt` | string | ISO-8601 date/duration |
| `orderBy` | string | `createdAt` or `updatedAt` (default) |
| `limit` | number | Max 250, default 50 |
| `cursor` | string | Pagination cursor |
| `includeArchived` | boolean | Default `true` |

## get_issue

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | yes | Issue ID or identifier (e.g., `LIN-123`) |
| `includeRelations` | boolean | no | Include blocking/related/duplicate relations |
| `includeCustomerNeeds` | boolean | no | Include associated customer needs |

## save_issue

Create (omit `id`) or update (provide `id`). Creating requires `title` and `team`.

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Issue ID to update |
| `title` | string | Issue title (required when creating) |
| `team` | string | Team name or ID (required when creating) |
| `description` | string | Markdown content |
| `assignee` | string/null | User ID, name, email, `"me"`, or `null` to remove |
| `state` | string | State type, name, or ID |
| `priority` | number | `0`=None, `1`=Urgent, `2`=High, `3`=Normal, `4`=Low |
| `project` | string | Project name, ID, or slug |
| `labels` | string[] | Label names or IDs |
| `estimate` | number | Estimate value |
| `dueDate` | string | ISO date |
| `cycle` | string | Cycle name, number, or ID |
| `milestone` | string | Milestone name or ID |
| `parentId` | string/null | Parent issue ID, `null` to remove |
| `delegate` | string/null | Agent name or ID, `null` to remove |
| `blocks` | string[] | Issues this blocks (append-only) |
| `blockedBy` | string[] | Issues blocking this (append-only) |
| `relatedTo` | string[] | Related issues (append-only) |
| `duplicateOf` | string/null | Duplicate of issue, `null` to remove |
| `links` | object[] | `[{url, title}]` link attachments (append-only) |

## list_comments

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `issueId` | string | yes | Issue ID or identifier |
| `orderBy` | string | no | `createdAt` or `updatedAt` (default) |
| `limit` | number | no | Max 250, default 50 |
| `cursor` | string | no | Pagination cursor |

## save_comment

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `body` | string | yes | Markdown content |
| `issueId` | string | create only | Issue ID (required when creating) |
| `id` | string | update only | Comment ID to update |
| `parentId` | string | no | Parent comment ID for threaded replies (create only) |

## delete_comment

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | yes | Comment ID |

## list_issue_labels

| Parameter | Type | Description |
|-----------|------|-------------|
| `team` | string | Team name or ID |
| `name` | string | Filter by label name |
| `orderBy` | string | `createdAt` or `updatedAt` (default) |
| `limit` | number | Max 250, default 50 |
| `cursor` | string | Pagination cursor |

## create_issue_label

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | yes | Label name |
| `color` | string | no | Hex color code |
| `description` | string | no | Label description |
| `teamId` | string | no | Team UUID (omit for workspace-wide) |
| `parent` | string | no | Parent label group name |
| `isGroup` | boolean | no | Whether this is a label group |

## list_issue_statuses

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `team` | string | yes | Team name or ID |

## get_issue_status

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | yes | Status ID |
| `name` | string | yes | Status name |
| `team` | string | yes | Team name or ID |
