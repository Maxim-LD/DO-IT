# Testing

We use **Jest** for unit testing.

## Running Tests
```bash
npm run test
```

## Example Test: AuthService
```ts
describe("AuthService", () => {
  it("should hash passwords before saving", async () => {
    const dto = { email: "test@example.com", password: "123456" };
    const user = await AuthService.registerUser(dto);
    expect(user.password).not.toBe("123456");
  });
});
```

## Mock Setup
- Reusable mocks for DB
- Mock repositories in service tests