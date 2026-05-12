# Claude Code MCP — Model Context Protocol

## MCP là gì?

MCP (Model Context Protocol) là cơ chế cho phép Claude Code kết nối với các công cụ bên ngoài (GitHub, Linear, Figma, database...) thông qua một giao thức chuẩn.

Thay vì Claude chỉ biết những gì bạn paste vào chat, MCP cho phép Claude **chủ động đọc dữ liệu từ external systems** — issue tracker, design tool, git hosting — trong lúc làm việc.

---

## Cấu hình MCP trong project này

File `.claude/settings.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "${FIGMA_API_KEY}"
      }
    },
    "linear": {
      "command": "npx",
      "args": ["-y", "@mseep/linear-mcp"],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
      }
    }
  }
}
```

**Cách hoạt động:**
- Mỗi `mcpServer` là một process riêng, chạy song song với Claude Code
- Claude giao tiếp với các process này qua stdio theo chuẩn MCP
- Biến env như `${GITHUB_TOKEN}` được resolve từ shell environment hiện tại

---

## 3 MCP servers trong project

### 1. GitHub MCP (`@modelcontextprotocol/server-github`)

**Dùng để làm gì:**
- Đọc diff của PR hiện tại
- Tạo, đọc, comment issue
- Fetch file từ repo
- Review PR context trước khi tạo mới

**Workflow tích hợp — `/pr` command:**
```
git diff main...HEAD → Claude review diff
→ Draft PR title + body
→ gh pr create (hoặc GitHub MCP tạo PR trực tiếp)
```

**Cần:** `GITHUB_TOKEN` có scope `repo`

---

### 2. Figma MCP (`figma-developer-mcp`)

**Dùng để làm gì:**
- Inspect frame/component trong Figma file
- Đọc spacing, màu sắc, font, layout
- Match design sang Tailwind classes chính xác hơn

**Workflow tích hợp:**
```
/task với Figma link → Claude fetch frame → Inspect design tokens
→ /implement với exact spacing/colors từ design
```

**Cần:** `FIGMA_API_KEY` từ Figma account → Settings → Personal Access Tokens

---

### 3. Linear MCP (`@mseep/linear-mcp`)

**Dùng để làm gì:**
- Fetch issue details theo ID (VD: `THA-5`)
- Đọc acceptance criteria, description, labels
- Update issue status sau khi implement

**Workflow tích hợp — `/task THA-5`:**
```
Claude fetch THA-5 từ Linear
→ Đọc description + acceptance criteria
→ Tạo implementation plan dựa trên actual requirements
```

**Cần:** `LINEAR_API_KEY` từ Linear → Settings → API → Personal API Keys

---

## Cách setup MCP

### Bước 1 — Lấy API keys

```bash
# GitHub
# → github.com → Settings → Developer settings → Personal access tokens → Fine-grained
# Scope cần: Contents (read), Pull requests (read/write), Issues (read/write)

# Figma  
# → figma.com → Account Settings → Security → Personal access tokens

# Linear
# → linear.app → Settings → API → Personal API Keys
```

### Bước 2 — Lưu vào `.env` (root, không commit)

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
FIGMA_API_KEY=figd_xxxxxxxxxxxxxxxxxxxx
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxxxxxxxxx
```

### Bước 3 — Load trước khi chạy Claude Code

```bash
source .env
claude
```

Hoặc thêm vào shell profile để tự động load:
```bash
# ~/.bashrc hoặc ~/.zshrc
export GITHUB_TOKEN=ghp_xxx
export FIGMA_API_KEY=figd_xxx
export LINEAR_API_KEY=lin_xxx
```

### Bước 4 — Verify MCP đang chạy

Khi Claude Code khởi động, nếu MCP servers connect thành công, Claude có thể dùng các tool tương ứng ngay trong chat.

Thử: hỏi Claude "fetch issue THA-1 từ Linear" — nếu Linear MCP hoạt động, Claude sẽ trả về content của issue đó.

---

## Tích hợp MCP vào workflow

CLAUDE.md của project định nghĩa rõ khi nào dùng MCP nào:

```markdown
### Linear MCP
When task ID is provided:
- Fetch issue từ Linear
- Read acceptance criteria carefully
- Follow implementation plan workflow

### Figma MCP  
If Figma link exists:
- Inspect target frame
- Match spacing/layout/components closely
- Reuse existing design system

### GitHub MCP
Before PR:
- Review diff
- Check for edge cases
- Generate clean PR summary
```

---

## Lưu ý bảo mật

- **Không bao giờ commit `.env`** — thêm vào `.gitignore`
- Tạo `.env.example` với placeholder values để document các keys cần thiết
- Dùng Fine-grained GitHub tokens thay vì Classic tokens — giới hạn scope tối thiểu
- Rotate keys định kỳ hoặc khi có người rời team

```bash
# .gitignore
.env
*.env
!.env.example
```

---

## MCP cho project mới

Khi reuse setup này cho project khác:

1. **Copy nguyên** phần `mcpServers` trong `settings.json`
2. **Thêm/bỏ** server tùy project cần (không dùng Figma → xóa khỏi config)
3. **Tạo `.env`** mới với keys của project/account đó
4. **Update CLAUDE.md** phần MCP workflow nếu có thay đổi cách sử dụng

### Các MCP servers phổ biến khác

| Server | Package | Dùng cho |
|---|---|---|
| PostgreSQL | `@modelcontextprotocol/server-postgres` | Query DB trực tiếp |
| Filesystem | `@modelcontextprotocol/server-filesystem` | Đọc file ngoài working dir |
| Slack | `@modelcontextprotocol/server-slack` | Đọc/gửi message |
| Notion | `@modelcontextprotocol/server-notion` | Đọc docs/database |
| Brave Search | `@modelcontextprotocol/server-brave-search` | Web search trong chat |
