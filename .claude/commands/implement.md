Implementation

Implement the approved task plan.

Business & Security Constraints
- Follow docs/business-rules.md
- Follow docs/security.md
- Preserve documented workflow behavior
- Do not weaken auth or validation logic

Requirements
- Follow CLAUDE.md rules strictly
- Reuse existing components/utilities/hooks
- Preserve architecture consistency
- Avoid unnecessary abstraction
- Keep changes scoped to the task

Backend Rules
- Use AsyncSession
- Keep routers thin
- Business logic in services/
- Add Alembic migration if DB changes

Frontend Rules
- Use existing Tailwind patterns
- Use react-hook-form + zod
- Preserve dark mode compatibility

Before Finishing
- Run lint
- Run typecheck
- Run tests
- Review edge cases
- Remove dead code
- If auth/security/business logic changed → update docs/security.md and docs/business-rules.md

## Dev Log
Append an entry to `logs-dev.md` if ANY of the following apply:
- Task is non-trivial (multiple files, new feature, refactor)
- Security logic was added or changed (auth, OTP, token, hashing)
- Business rules were added or changed (permissions, validation, workflow)
- A non-obvious decision was made (why this approach, not alternatives)

Log entry format:
```
## YYYY-MM-DD — <task ID if any>: <short title>

### What
One paragraph: what was built/changed.

### Why
Key decisions and trade-offs (skip if obvious).

### Security / Business Rule Changes
List any rule added/updated in docs/security.md or docs/business-rules.md.
Omit section if none.

### Follow-up
Known limitations or next steps. Omit if none.
```

Output Format

## Changed Files
List modified files.

## Summary
What was implemented.

## Validation
Commands/tests executed.

## Dev Log Entry
Paste the log entry added to logs-dev.md (or "None — task was trivial").

## Commit Message
Generate conventional commit message (`feat:`, `fix:`, `refactor:`, etc.).
