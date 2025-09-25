# Architecture

The system follows a **clean layered design**:

1. **Controllers** – Handle HTTP requests/responses, validate inputs, pass data to services.
2. **Services** – Contain business logic (auth, user, todo operations).
3. **Repositories** – Database access using Knex.js.
4. **Database** – MySQL schema with migrations and seeders.
5. **Utilities** – Error handling, JWT utils, logging.

## Request Flow
Client → Controller → Service → Repository → Database
                       ↓
                  Response DTO

## Error Handling
- All controllers use a shared `asyncHandler` to catch errors.
- Services throw typed errors (e.g., `AuthError`, `ValidationError`).
