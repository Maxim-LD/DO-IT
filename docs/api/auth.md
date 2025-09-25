# Auth API

## POST /auth/register
Registers a new user.

### Request
```json
{
  "email": "test@example.com",
  "password": "securePass123"
}
```

### Response
```json
{
  "id": 1,
  "email": "test@example.com",
  "token": "jwt_token_here"
}
```

---

## POST /auth/login
Logs in a user and returns a JWT.

### Request
```json
{
  "email": "test@example.com",
  "password": "securePass123"
}
```

### Response
```json
{
  "token": "jwt_token_here"
}
```
