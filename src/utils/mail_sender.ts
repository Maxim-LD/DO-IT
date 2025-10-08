import nodemailer from 'nodemailer'
import { config } from '../config'
import { logger } from './logger'

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.smtp.email,
                pass: config.smtp.password
            }
        })

        const mailOptions = {
            from: `'AGENDOS' <${config.smtp.email}>`,
            to,
            subject,
            html
        }

        const info = await transporter.sendMail(mailOptions)
        logger.info("Email sent:", { response: info.response })

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(` Email send failed: ${error.message}`)
        }
        throw error
    }
}