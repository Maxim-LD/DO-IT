import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateRegister } from "../middlewares/validator";
import { authRateLimit } from "../middlewares/rate_limiter";

const authController = new AuthController()

export const authRouter = Router()

authRouter.post('/signup', validateRegister, authRateLimit, authController.signUp)
authRouter.get('/verify-email', authRateLimit, authController.verifyUser)