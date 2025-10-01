# User Repository

Handles DB queries for user entity.

## Responsibilities
- Create user in DB
- Fetch user by email
- Validate unique email
- Fetch user by ID
- Fetch all users

## Methods
- `createUser(user: CreateUserDTO)`
- `findByEmail(email: string)`
- `findById(id: number)`
- `findAll()`
