# Security Rules

## Authentication

- Never trust frontend user_id
- Always derive user from JWT
- Protected routes require auth dependency

## Passwords

- Never log passwords
- Hash using passlib bcrypt
- Reset tokens expire in 30 minutes

## OTP

- Store OTP as HMAC-SHA256 hash (keyed with SECRET_KEY), never plaintext
- Never log plaintext OTP codes — not even in debug/print statements
- Rate limit forgot-password endpoint (max 3 req/min per IP)

## API

- Validate all request bodies
- Do not expose internal DB IDs unnecessarily
- Rate limit auth endpoints

## Frontend

- Never store sensitive data outside auth token
- Do not expose secrets in Vite env