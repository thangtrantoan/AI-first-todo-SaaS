Code Review

Review the current changes carefully.

Review Focus

### Correctness
- Bugs and missing logic
- Broken flows
- Race conditions

### Architecture
- Consistency with existing patterns
- Unnecessary abstraction
- Duplicate logic/components

### Security
- Auth validation
- Sensitive data handling
- API input validation

### Frontend
- Responsive behavior
- Dark mode compatibility
- Loading/error states

### Backend
- Async correctness
- DB transaction safety
- Schema validation

### Testing
- Missing edge cases
- Missing tests
- Broken existing tests

Output Format

## Issues Found
List problems with severity (blocking / warning / suggestion).

## Suggestions
Concrete improvements.

## Final Verdict
- Ready
- Needs fixes
- Blocking issue found

## Business Rules
- Validate implementation against docs/business-rules.md
- Check for incorrect business behavior
- Verify permissions and workflow constraints
- Ensure edge cases follow documented business rules
- Flag any rule in the code that is NOT documented → docs must be updated

## Security Rules
- Validate implementation against docs/security.md
- Check auth/authorization correctness
- Verify sensitive data handling
- Ensure APIs do not expose unauthorized data
- Check validation and token handling carefully
- Flag any security pattern in the code that is NOT documented → docs must be updated

## Docs Freshness
- Read docs/business-rules.md and docs/security.md
- Compare against actual implementation
- If docs are stale or missing rules: list them explicitly and require update before marking Ready

## Dev Log
- If task touched security, business rules, or non-trivial logic: verify logs-dev.md has a new entry
- Entry must cover: what changed, why, and any rule updates
- Missing log for complex/security/business changes → blocking