# Claude Code Setup — Nền Tảng Production-Grade

## Mục tiêu

Tài liệu này mô tả cách thiết lập Claude Code để làm việc như một AI developer thực thụ trong một project thực — có workflow, có constraints, có guardrails — thay vì chỉ là một chatbot viết code.

---

## Cấu trúc thư mục cần thiết

```
project-root/
├── CLAUDE.md                    # Project instructions cho Claude
├── .claude/
│   ├── settings.json            # Hooks + MCP servers
│   └── commands/                # Slash commands (workflow)
│       ├── task.md
│       ├── implement.md
│       ├── review.md
│       ├── test.md
│       └── pr.md
├── docs/
│   ├── business-rules.md        # Source of truth: nghiệp vụ
│   └── security.md              # Source of truth: bảo mật
└── .env                         # MCP API keys (không commit)
```

---

## Bước 1 — Viết CLAUDE.md

`CLAUDE.md` là file quan trọng nhất. Claude Code tự động đọc file này mỗi khi khởi động session. Nó đóng vai trò như **onboarding document cho AI**.

**Cần bao gồm:**

```markdown
## Project Overview
Stack, deploy target, kiến trúc tổng quan

## Workflow Rules
- Before / During / After coding
- Khi nào hỏi, khi nào tự làm

## Backend Rules
- Framework conventions (async, thin routers, services layer)
- Error handling pattern
- Database rules (migration bắt buộc)

## Frontend Rules  
- State management approach
- API layer pattern
- Styling constraints

## Folder Responsibilities
Mỗi folder làm gì — tránh Claude để code sai chỗ

## Git Rules
Commit format, PR format

## Avoid
Danh sách tường minh những gì KHÔNG được làm
```

**Nguyên tắc:** Mọi quy tắc bạn muốn enforce phải được viết ra. Claude không tự suy luận từ silence.

---

## Bước 2 — Tạo Slash Commands

Slash commands (`.claude/commands/*.md`) là các "prompt template" được kích hoạt bằng `/command-name` trong chat.

### Cấu trúc một command file

```markdown
# Tên command

Mô tả ngắn mục đích.

## Phần instructions
- Điều kiện đầu vào
- Constraints phải follow
- Files phải đọc trước

## Output Format
## Section 1
...
## Section 2  
...
```

### Commands tối thiểu cho một project

| File | Trigger | Nội dung chính |
|---|---|---|
| `task.md` | Bắt đầu làm task | Analyze → Identify risks → Plan (không code ngay) |
| `implement.md` | Sau khi plan approve | Code theo constraints, lint, typecheck |
| `review.md` | Sau khi implement | Checklist 7 nhóm + docs freshness check |
| `test.md` | Validation | Run lint/typecheck/tests, report results |
| `pr.md` | Tạo PR | Draft title + body + `gh pr create` |

**Tư duy thiết kế:** Mỗi command enforce một phase cụ thể. Claude không nhảy từ `/task` sang code ngay — phải qua plan approval.

---

## Bước 3 — Tạo Docs Foundation

Hai file docs này là **source of truth** mà mọi command đều tham chiếu:

### `docs/business-rules.md`
```markdown
# Business Rules

## [Feature Area]
- Rule 1: ai được làm gì
- Rule 2: điều kiện gì thì hợp lệ
- Rule 3: edge case nào là expected behavior
```

### `docs/security.md`
```markdown
# Security Rules

## Authentication
- Luôn derive user từ JWT, không tin frontend
- Protected routes require auth dependency

## Passwords
- Hash bằng bcrypt, không log plaintext
- Reset token expire sau X phút

## API
- Validate tất cả request bodies
- Rate limit auth endpoints
```

**Tại sao cần 2 file riêng?** Business rules thay đổi thường xuyên (product decisions). Security rules thay đổi ít hơn nhưng critical hơn. Tách ra để review dễ hơn.

---

## Bước 4 — Cấu hình Hooks

File `.claude/settings.json` — cấu hình automation behaviors.

### PostToolUse Hook (bắt buộc)

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|NotebookEdit",
        "hooks": [{
          "type": "command",
          "command": "echo '{\"hookSpecificOutput\": {\"additionalContext\": \"Self-check: security issues? pattern-consistent? edge cases? Run /review when done.\"}}'",
          "statusMessage": "Self-review nudge..."
        }]
      }
    ]
  }
}
```

**Tác dụng:** Mỗi lần Claude edit/write file → tự động inject reminder vào context để Claude tự kiểm tra trước khi tiếp tục.

### Các loại hooks khác có thể dùng

| Hook | Khi nào fire | Use case |
|---|---|---|
| `PreToolUse` | Trước khi tool chạy | Chặn xóa file quan trọng, validate input |
| `PostToolUse` | Sau khi tool chạy | Self-review nudge, run formatter |
| `Stop` | Claude chuẩn bị dừng | Nhắc commit, cleanup |
| `Notification` | Khi có notification | Log, alert |

---

## Bước 5 — Environment Variables

### `.env` (root, không commit)
```bash
# MCP API Keys
GITHUB_TOKEN=ghp_xxx
FIGMA_API_KEY=figd_xxx
LINEAR_API_KEY=lin_xxx
```

Load trước khi chạy Claude Code:
```bash
source .env && claude
```

---

## Checklist Setup Hoàn Chỉnh

```
[ ] CLAUDE.md có đủ: overview, workflow, stack rules, folder map, avoid list
[ ] .claude/commands/ có: task, implement, review, test, pr
[ ] docs/business-rules.md tồn tại và có content thực
[ ] docs/security.md tồn tại và có content thực
[ ] .claude/settings.json có PostToolUse hook
[ ] .env có MCP keys (nếu dùng MCP)
[ ] .env có trong .gitignore
```

---

## Lưu ý khi reuse cho project mới

1. **Copy nguyên** `.claude/commands/` — các commands là generic, không phụ thuộc project cụ thể
2. **Rewrite** `CLAUDE.md` — phần stack, folder, conventions là project-specific
3. **Khởi tạo trống** `docs/business-rules.md` và `docs/security.md` — điền dần theo feature
4. **Giữ nguyên** hook trong `settings.json` — hoạt động với mọi project
5. **Không commit** `.env` — chỉ commit `.env.example`
