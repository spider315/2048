# Project Tools — Full Parameter Reference

## list_projects

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | Search project name |
| `team` | string | Team name or ID |
| `state` | string | State type, name, or ID |
| `label` | string | Label name or ID |
| `member` | string | User ID, name, email, or `"me"` |
| `initiative` | string | Initiative name or ID |
| `createdAt` | string | ISO-8601 date/duration |
| `updatedAt` | string | ISO-8601 date/duration |
| `orderBy` | string | `createdAt` or `updatedAt` (default) |
| `limit` | number | Max 250, default 50 |
| `cursor` | string | Pagination cursor |
| `includeArchived` | boolean | Default `false` |
| `includeMembers` | boolean | Include project members |
| `includeMilestones` | boolean | Include milestones |

## get_project

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | yes | Project name, ID, or slug |
| `includeMembers` | boolean | no | Include project members |
| `includeMilestones` | boolean | no | Include milestones |
| `includeResources` | boolean | no | Include resources (documents, links, attachments) |

## save_project

Create (omit `id`) or update (provide `id`). Creating requires `name` and at least one team.

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Project ID to update |
| `name` | string | Project name (required when creating) |
| `description` | string | Markdown content |
| `summary` | string | Short summary (max 255 chars) |
| `state` | string | Project state |
| `priority` | integer | `0`=None, `1`=Urgent, `2`=High, `3`=Medium, `4`=Low |
| `lead` | string/null | User ID, name, email, `"me"`, or `null` to remove |
| `labels` | string[] | Label names or IDs |
| `startDate` | string | ISO date |
| `targetDate` | string | ISO date |
| `color` | string | Hex color |
| `icon` | string | Emoji (e.g., `:eagle:`) |
| `addTeams` | string[] | Team names/IDs to add |
| `removeTeams` | string[] | Team names/IDs to remove |
| `setTeams` | string[] | Replace all teams |
| `addInitiatives` | string[] | Initiative names/IDs to add |
| `removeInitiatives` | string[] | Initiative names/IDs to remove |
| `setInitiatives` | string[] | Replace all initiatives |

## list_milestones

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project` | string | yes | Project name, ID, or slug |

## get_milestone

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project` | string | yes | Project name, ID, or slug |
| `query` | string | yes | Milestone name or ID |

## save_milestone

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project` | string | yes | Project name, ID, or slug |
| `name` | string | create only | Milestone name |
| `id` | string | update only | Milestone name or ID |
| `description` | string | no | Milestone description |
| `targetDate` | string/null | no | ISO date, `null` to remove |

## list_project_labels

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Filter by name |
| `orderBy` | string | `createdAt` or `updatedAt` (default) |
| `limit` | number | Max 250, default 50 |
| `cursor` | string | Pagination cursor |

## list_cycles

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `teamId` | string | yes | Team ID |
| `type` | string | no | `current`, `previous`, or `next` |
