# Interfaces

## IUser
```ts
interface IUser {
  id: number;
  email: string;
  created_at: Date;
}
```

## IAuth
```ts
interface IAuth {
  id: number;
  email: string;
  password: string;
}
```

## IProvider
```ts
interface IProvider {
  id: number;
  user_id: number;
  provider: string;
  provider_id: string;
}
```