import { asyncHandler } from "../middlewares/error_handler";
import { AuthService } from "../services/AuthService";
import { EmailService } from "../services/EmailService";
import { IApiResponse } from "../types/api_response";
import { BadRequestError, UnauthorizedError, ValidationError } from "../utils/errors";

export class AuthController {
    private authService: AuthService
    private emailService: EmailService

    constructor() {
        this.authService = new AuthService()
        this.emailService = new EmailService()
    }

    signUp = asyncHandler(async (req, res): Promise<void> => {
        const { email, password, confirm_password, username, fullname, status, occupation, phone, date_of_birth } = req.body
        
        if (password !== confirm_password) throw new BadRequestError('Passwords does not match!')

        const user = await this.authService.register({
            email, password,
            username, fullname,
            status, occupation,
            phone, date_of_birth
        })

        if (!user) throw new Error()
                
        // Send verification email
        await this.emailService.sendVerificationEmail(user)

        const response: IApiResponse = {
            success: true,
            message: 'User signed up successfully',
            data: user
        }

        res.status(201).json(response)

    })

    login = asyncHandler(async (req, res) => {
        
    })

    verifyUser = asyncHandler(async (req, res) => {
        const { token } = req.query
        if (!token) throw new ValidationError('Token is required!')
        
        const tokenValue = Array.isArray(token) ? token[0] : token;
        if (typeof tokenValue !== 'string') throw new BadRequestError('Invalid token format')

        const accessToken = await this.authService.verifyEmailToken(tokenValue)
        if (!accessToken) throw new UnauthorizedError('Verification Failed')
        
        res.status(200).json({
            success: true,
            accessToken
        })
        
        // res.cookie('access_token', accessToken, {
        //     httpOnly: true,
        //     secure: true,
        //     //sameSite: 'Strict'
        // });

        // res.redirect(`${config.frontendUrl}/dashboard`);
    })
}

