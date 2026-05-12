# Business Rules

## Todos

- Users can only access their own todos
- Completed todos are read-only
- Soft-deleted todos are hidden by default

## Auth

- JWT expires after 7 days
- Email must be unique
- Password reset OTP valid for 30 minutes
- OTP is 6-digit numeric code
- Never reveal whether an email is registered (always return 200 on forgot-password)
- OTP is single-use; issuing a new OTP invalidates the previous one implicitly (overwrite)