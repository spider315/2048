# Document Tools — Full Parameter Reference

## list_documents

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | Search query |
| `projectId` | string | Filter by project ID |
| `creatorId` | string | Filter by creator ID |
| `initiativeId` | string | Filter by initiative ID |
| `createdAt` | string | ISO-8601 date/duration |
| `updatedAt` | string | ISO-8601 date/duration |
| `orderBy` | string | `createdAt` or `updatedAt` (default) |
| `limit` | number | Max 250, default 50 |
| `cursor` | string | Pagination cursor |
| `includeArchived` | boolean | Default `false` |

## get_document

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | yes | Document ID or slug |

## create_document

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | yes | Document title |
| `content` | string | no | Markdown content |
| `project` | string | no | Project name, ID, or slug |
| `issue` | string | no | Issue ID or identifier (e.g., `LIN-123`) |
| `color` | string | no | Hex color |
| `icon` | string | no | Icon emoji |

## update_document

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | yes | Document ID or slug |
| `title` | string | no | New title |
| `content` | string | no | New Markdown content |
| `project` | string | no | Project name, ID, or slug |
| `color` | string | no | Hex color |
| `icon` | string | no | Icon emoji |

## search_documentation

Search Linear's product help docs (not workspace documents).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | yes | Search query |
| `page` | number | no | Page number (default 0) |
