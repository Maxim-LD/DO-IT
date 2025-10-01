import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import router from './router'
import compression from 'compression'
import { errorHandler, notFoundHandler } from './middlewares/error_handler'
import { globalRatelimit } from './middlewares/rate_limiter'

const app = express()

// Trust proxy
app.set('trust proxy', 1);

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser())

app.use(compression());
app.use(morgan('dev'))

app.use(globalRatelimit)

app.use('/api/v1', router)

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app