# Claude Code Review Flow — Cách Hoạt Động

## Tổng quan

Review flow trong project này được thiết kế để Claude Code hoạt động như một senior developer: không chỉ viết code, mà còn tự kiểm tra, validate và enforce business/security rules trước khi code được merge.

---

## Các thành phần cốt lõi

### 1. Slash Commands (`.claude/commands/`)

Đây là bộ "playbook" chạy theo từng phase của vòng đời một task:

| Command | Trigger | Mục đích |
|---|---|---|
| `/task` | Bắt đầu task mới | Phân tích yêu cầu, identify risks, tạo plan |
| `/implement` | Sau khi plan được approve | Viết code theo constraints đã định sẵn |
| `/review` | Sau khi implement xong | Review toàn bộ diff theo checklist |
| `/test` | Song song với review | Chạy lint, typecheck, tests |
| `/pr` | Khi chuẩn bị merge | Tạo PR với full context qua `gh` CLI |

**Nguyên tắc quan trọng:** Mỗi command không hoạt động độc lập — chúng share context thông qua `docs/business-rules.md` và `docs/security.md`.

---

### 2. Review Command — `/review`

File [.claude/commands/review.md](.claude/commands/review.md) định nghĩa checklist review gồm 7 nhóm:

```
Correctness → Architecture → Security → Frontend → Backend → Testing → Docs Freshness
```

**Điểm đặc biệt của flow này:**

#### Docs-driven Review
Review không chỉ check code mà còn check tính nhất quán với docs:
- So sánh implementation với `docs/business-rules.md`
- So sánh implementation với `docs/security.md`
- Nếu code có behavior không có trong docs → **bắt buộc update docs trước khi mark Ready**

#### 3-tier Output
```
## Issues Found     → severity: blocking / warning / suggestion
## Suggestions      → concrete improvements
## Final Verdict    → Ready | Needs fixes | Blocking issue found
```

Chỉ **Ready** mới đủ điều kiện tạo PR.

---

### 3. PostToolUse Hook — Auto Self-Review Nudge

Trong [.claude/settings.json](.claude/settings.json):

```json
"PostToolUse": [
  {
    "matcher": "Edit|Write|NotebookEdit",
    "hooks": [{
      "type": "command",
      "command": "echo '...Self-check before continuing: security? pattern-consistent? edge cases? Run /review when done.'"
    }]
  }
]
```

**Cách hoạt động:**
- Mỗi khi Claude Code dùng `Edit`, `Write`, hoặc `NotebookEdit` tool → hook tự động fire
- Hook inject một reminder vào context: *"tự kiểm tra security, consistency, edge cases trước khi tiếp tục"*
- Đây là **guardrail tự động** — Claude không thể quên review vì hook luôn nhắc nhở

---

### 4. Docs là Source of Truth

```
docs/business-rules.md   ← quy tắc nghiệp vụ (ai được làm gì, điều kiện gì)
docs/security.md         ← quy tắc bảo mật (hash như thế nào, token expire ra sao)
```

Cả `/task`, `/implement`, và `/review` đều phải đọc 2 file này.

**Vòng lặp cập nhật docs:**
```
Code thay đổi behavior → /review phát hiện rule chưa có trong docs
→ Update docs → Re-run /review → Ready
```

---

## Luồng hoàn chỉnh một task

```
1. /task THA-5              # Phân tích task từ Linear, tạo plan
2. Review plan → approve
3. /implement               # Viết code + append logs-dev.md nếu cần
4. /review                  # Review diff: correctness, security, docs freshness, log entry
5. Fix issues nếu có
6. /test                    # Chạy lint/typecheck/tests
7. /pr                      # Tạo PR với gh CLI
```

---

## Dev Log Convention (`logs-dev.md`)

Log entry được yêu cầu khi task thuộc một trong các loại:

| Loại task | Ví dụ | Yêu cầu log? |
|---|---|---|
| Non-trivial feature | Forgot password flow, OAuth | Bắt buộc |
| Security change | Thêm rate limit, đổi hashing | Bắt buộc |
| Business rule change | OTP expire từ 15 → 30 phút | Bắt buộc |
| Non-obvious decision | Dùng HMAC thay vì lưu OTP plaintext | Bắt buộc |
| Bug fix nhỏ | Fix typo, UI spacing | Không cần |
| Refactor nội bộ | Rename variable, extract helper | Không cần |

### Format entry

```markdown
## YYYY-MM-DD — <task ID>: <short title>

### What
Mô tả ngắn gọn: feature/change gì.

### Why
Quyết định quan trọng và lý do (bỏ qua nếu hiển nhiên).

### Security / Business Rule Changes
Liệt kê các rule đã thêm/cập nhật trong docs/.
Bỏ section này nếu không có thay đổi.

### Follow-up
Giới hạn đã biết hoặc việc cần làm tiếp. Bỏ nếu không có.
```

### `/review` enforce log

`/review` có thêm mục **Dev Log** — nếu task là complex/security/business mà thiếu entry trong `logs-dev.md` → **blocking**, không được mark Ready.

---

## Tại sao flow này hiệu quả

**Không phụ thuộc vào ký ức của Claude** — mọi rule đều được externalise vào file:
- Business rules → `docs/business-rules.md`
- Security rules → `docs/security.md`
- Workflow rules → `CLAUDE.md`
- Review checklist → `.claude/commands/review.md`

**Hook đảm bảo không bỏ sót** — thay vì dựa vào Claude tự nhớ review, hook tự động nhắc sau mỗi lần edit.

**Docs và code luôn đồng bộ** — `/review` enforce việc update docs, tránh tình trạng code đi trước docs.
