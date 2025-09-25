# Data Transfer Objects (DTOs)

## CreateAuthDTO
```ts
interface CreateAuthDTO {
  email: string;
  password: string;
}
```

## LoginDTO
```ts
interface LoginDTO {
  email: string;
  password: string;
}
```

## CreateTodoDTO
```ts
interface CreateTodoDTO {
  user_id: number;
  title: string;
  description?: string;
  status?: "pending" | "completed";
}
```