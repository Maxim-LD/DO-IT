import { Router } from "express";

const router = Router()

router.get('/health', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Health is wealth'
    })
})

export default router