# Project Setup

## 1. Install dependencies
```bash
npm install
```

## 2. Configure environment
Create `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=todo_db
JWT_SECRET=your_secret
```

## 3. Run migrations
```bash
npx knex migrate:latest
```

## 4. Seed the database
```bash
npx knex seed:run
```

## 5. Start development server
```bash
npm run dev
```