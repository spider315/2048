# Attachment & Image Tools — Full Parameter Reference

## create_attachment

Upload a base64-encoded file to a Linear issue.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `issue` | string | yes | Issue ID or identifier (e.g., `LIN-123`) |
| `base64Content` | string | yes | Base64-encoded file content |
| `filename` | string | yes | Filename (e.g., `screenshot.png`) |
| `contentType` | string | yes | MIME type (e.g., `image/png`, `application/pdf`) |
| `title` | string | no | Attachment title |
| `subtitle` | string | no | Attachment subtitle |

Common MIME types: `image/png`, `image/jpeg`, `image/gif`, `image/svg+xml`, `application/pdf`, `text/plain`, `text/csv`, `application/zip`

## get_attachment

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | yes | Attachment ID |

## delete_attachment

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | yes | Attachment ID |

## extract_images

Extract and view images embedded in markdown content (issue descriptions, comments, documents).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `markdown` | string | yes | Markdown content containing image references |

**Usage:** Pass the markdown body from `get_issue`, `list_comments`, or `get_document` to view embedded screenshots, diagrams, or other images.
