# User API

## GET /users/:id
Retrieve user details.

### Response
```json
{
  "id": 1,
  "email": "test@example.com",
  "created_at": "2025-09-25T10:00:00Z"
}
```

---

## GET /users
Fetch all users.

### Response
```json
[
  { "id": 1, "email": "user1@example.com" },
  { "id": 2, "email": "user2@example.com" }
]
```
