import bcrypt from "bcrypt"
import { secretConfig } from "../config"

export const hashPassword = async(secret: string):  Promise<string> => {
    const salt = await bcrypt.genSalt(secretConfig.saltRounds)
    return bcrypt.hash(secret, salt)
}

export const comparePassword = async (password: string, secret: string) => {
    
}