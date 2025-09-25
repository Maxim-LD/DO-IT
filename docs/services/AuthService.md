# AuthService

Handles authentication & authorization.

## Responsibilities
- Register user
- Login user
- Validate JWT
- Hash passwords (bcrypt)

## Methods
- `registerUser(dto: CreateAuthDTO)`
- `loginUser(dto: LoginDTO)`
- `verifyToken(token: string)`
