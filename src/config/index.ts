import dotenv from 'dotenv'

dotenv.config()

interface Config {
    port: number,
    nodeEnv: string,
    saltRounds: number,
    rateLimit: {
        windowMS: number
        maxRequests: number
    }
    database: {
        host: string;
        port: number;
        user: string;
        password: string | undefined;
        database: string;
    }
}

const requiredEnvVars = [
    'PORT',
    'NODE_ENV',
    'DB_PORT',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'RATE_LIMIT_WINDOW_MS',
    'RATE_LIMIT_MAX_REQUESTS',
    'SALT_ROUNDS'
];

// Check for required environment variables
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

export const config: Config = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    saltRounds: parseInt(process.env.SALT_ROUNDS || ''),
    rateLimit: {
        windowMS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100') // limit each IP to 100 requests per windowMs
    },
    database: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT || '3307'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'local_todo_db',
    }
}