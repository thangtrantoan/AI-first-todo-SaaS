Pull Request

Generate a clean PR summary and create the PR via GitHub CLI.

Steps
1. Run `git diff main...HEAD` to review all changes
2. Draft PR title and body
3. Run `gh pr create` with the drafted content

Include in Body
Summary

What was implemented.

Changes

Key backend/frontend/database updates.

Migration

Mention Alembic migration if applicable.

Environment Changes

New env vars or config updates.

Testing

Commands/tests executed.

Screenshots

Mention UI changes if applicable.

Risks

Potential follow-up work or known limitations.

Requirements
Keep PR concise and technical
Use bullet points where possible
Mention breaking changes clearly
PR title must follow: `feat:`, `fix:`, `refactor:`, etc.

gh pr create Command
```bash
gh pr create --title "<type>: <short description>" --body "$(cat <<'EOF'
## Summary
...

## Changes
...

## Migration
...

## Environment Changes
...

## Testing
...

## Risks / Follow-up
...
EOF
)"
```
