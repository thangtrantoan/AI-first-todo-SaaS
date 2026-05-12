# Dev Log — TodoSaaS MVP

## 2026-05-12 — Code Review: Sẵn sàng làm việc với Claude Code chưa?

### TL;DR
Code nền tảng tốt, kiến trúc rõ ràng, CLAUDE.md đủ để Claude Code hiểu context. Có 1 bug cần fix trước khi build, và 3 điểm cần bổ sung để AI workflow mượt hơn.

---

### Điểm tốt

**Backend**
- Async SQLAlchemy đúng chuẩn — `AsyncSession` xuyên suốt, không trộn sync
- Service layer tách rõ khỏi router — Claude Code dễ tìm đúng chỗ để thêm logic
- JWT + passlib/bcrypt — không có lỗ hổng auth cơ bản
- `railway.toml` chạy `alembic upgrade head` trước khi start — đúng thứ tự

**Frontend**
- Zustand store tách theo domain (auth / todo / theme) — dễ extend
- Axios interceptor tự gắn token và handle 401 logout — không cần viết lại mỗi lần
- Dark mode dùng `class` strategy + persist rehydrate đúng cách
- `TodoItem` handle loading state riêng cho từng action (toggle / delete / save) — UX tốt

**AI Workflow**
- `CLAUDE.md` có đủ: stack, routes, architecture decisions, workflow từng bước
- MCP config cho GitHub + Figma + Linear
- File structure phân tầng rõ: `models → schemas → services → routers`

---

### Bug cần fix

**`Button` thiếu prop `size`** — TypeScript error

`TodoItem.tsx` dùng `<Button size="sm">` nhưng interface `Button` không khai báo `size`. TypeScript sẽ báo lỗi khi build.

```tsx
// web/src/components/ui/Button.tsx — thêm vào interface Props
size?: "sm" | "md";

// và thêm vào component:
const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };
// replace px-4 py-2 text-sm trong className thành sizes[size ?? "md"]
```

---

### Cần bổ sung để AI workflow tốt hơn

**1. `api/.env.example` thiếu hướng dẫn generate SECRET_KEY**

Claude Code khi setup môi trường mới sẽ không biết dùng lệnh gì. Thêm comment:
```
# Generate: python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=
```

**2. `CLAUDE.md` chưa đề cập file `.env` root**

Hiện có 3 file `.env` khác nhau:
- `.env` (root) — MCP tokens (GITHUB_TOKEN, FIGMA_API_KEY, LINEAR_API_KEY)
- `api/.env` — backend config (DATABASE_URL, SECRET_KEY...)
- `web/.env` — frontend config (VITE_API_URL)

Nên ghi rõ vào CLAUDE.md để Claude Code không nhầm lẫn khi được hỏi "env var này ở đâu".

**3. Không có `docker-compose.yml` cho local dev**

Mỗi lần Claude Code cần test backend, phải có PostgreSQL sẵn. Thiếu compose file thì hay bị fail âm thầm. Nên thêm để Claude Code có thể `docker compose up -d` trước khi chạy migration.

---

### Không cần làm (practice scope)

- Tests — không cần cho MVP practice
- Pagination todos — scope Phase 1 chưa yêu cầu
- Refresh token — JWT 7 ngày là đủ cho practice
- Rate limiting — Railway có thể config sau

---

### Checklist trước khi code tiếp

- [ ] Fix `Button` size prop
- [ ] Thêm ghi chú generate SECRET_KEY vào `api/.env.example`
- [ ] Cập nhật `CLAUDE.md` — mô tả 3 file `.env` khác nhau
- [ ] (Optional) Thêm `docker-compose.yml` cho PostgreSQL local


hỏi ngược lại nếu cần không đoán
edit thay vì follow up
loại bỏ từ thừa - chuyển sang EN

flow work with Claude code? - How to get tasks from Linear (setting get task and understand context project and current task)? - How to code styles, input, output, testing? - How to commit and create PR? addition review PR before merge?

1. ChatGPT
- brainstorm
- architecture
- planning

2. Claude Code
- implementation
- refactor
- edit codebase

3. New chat frequently
