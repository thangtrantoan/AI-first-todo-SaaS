Test & Validate

Run all quality checks before review or merge.

Steps

1. Backend — run in order, stop on first failure:
   ```bash
   cd api
   source .venv/bin/activate
   ruff check .
   ruff format --check .
   pyright .
   pytest -x -q
   ```

2. Frontend — run in order, stop on first failure:
   ```bash
   cd web
   npm run lint
   npm run typecheck
   ```

Rules
- Fix failures before proceeding — do NOT skip or comment out failing tests
- If a test is genuinely obsolete, explain why before deleting it
- Do not add `# noqa`, `// eslint-disable`, or `@ts-ignore` to silence errors
- If typecheck or lint is not configured, flag it as a gap — do not skip silently

Output Format

## Backend Results
Pass / Fail — list any errors with file + line.

## Frontend Results
Pass / Fail — list any errors with file + line.

## Verdict
- All green → proceed to /review
- Any red → fix first, then re-run /test
