# Team & User Tools — Full Parameter Reference

## list_teams

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | Search query |
| `createdAt` | string | ISO-8601 date/duration |
| `updatedAt` | string | ISO-8601 date/duration |
| `orderBy` | string | `createdAt` or `updatedAt` (default) |
| `limit` | number | Max 250, default 50 |
| `cursor` | string | Pagination cursor |
| `includeArchived` | boolean | Default `false` |

## get_team

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | yes | Team UUID, key (e.g., `ENG`), or name |

## list_users

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | Filter by name or email |
| `team` | string | Team name or ID |
| `orderBy` | string | `createdAt` or `updatedAt` (default) |
| `limit` | number | Max 250, default 50 |
| `cursor` | string | Pagination cursor |

## get_user

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | yes | User ID, name, email, or `"me"` |
