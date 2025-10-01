import bcrypt from "bcrypt"
import { secretConfig } from "../config"

export const hashPassword = async(secret: string):  Promise<string> => {
    const salt = await bcrypt.genSalt(secretConfig.saltRounds)
    return bcrypt.hash(secret, salt)
}

export const comparePassword = async (password: string, hashed_secret: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hashed_secret)
    return isMatch
}