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

app.use(notFoundHandler);

app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Welcome to Agendos Backend service'
    })
})

// Error handling
app.use(errorHandler);

export default app
