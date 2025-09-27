import { Router } from "express";
import { authRouter } from './auth.router'

const router = Router()

router.get('/health', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Health is wealth'
    })
})

router.use('/auth', authRouter)

export default router