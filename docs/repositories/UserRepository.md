# UserRepository

Handles DB queries for user entity.

## Responsibilities
- Create user in DB
- Fetch user by email
- Validate unique email
- Fetch user by ID
- Fetch all users

## Methods
- `createUser(user: CreateAuthDTO)`
- `findByEmail(email: string)`
- `findById(id: number)`
- `findAll()`
