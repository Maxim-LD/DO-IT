import { config } from "../config";
import { renderTemplate } from "../templates/renderTemplates";
import { IUser } from "../types/user";
import { sendEmail } from "../utils/mail_sender";
import { AuthService } from "./AuthService";

export class EmailService {
    constructor() {}
    
    authService = new AuthService()

    async sendVerificationEmail(user: IUser) {
        const token = await this.authService.generateEmailToken(user.id, user.email)
        const verificationLink = `${config.baseUrl}/auth/verify-email?token=${token}`;
        
        const html = renderTemplate('signup', {
            name: user.fullname,
            verification_link: verificationLink,
            year: new Date().getFullYear().toString()
        })
        
        await sendEmail(
            user.email,
            'Verify Your Email',
            html
        )
    }
}