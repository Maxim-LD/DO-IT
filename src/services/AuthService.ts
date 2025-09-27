import db from "../config/db";
import { secretConfig } from "../config";
import { AuthRepository } from "../repository/AuthRepository";
import { UserRepository } from "../repository/UserRepository";
import { CreateAuthDTO } from "../types/auth";
import { CreateUserDTO, IUser } from "../types/user";
import { ConflictError } from "../utils/errors";
import { generateToken, verifyToken } from "../utils/token";

export class AuthService {
    private userRepository: UserRepository
    private authRepository: AuthRepository

    constructor() {
        this.userRepository = new UserRepository()
        this.authRepository = new AuthRepository()
    }

    async register(userInput: CreateUserDTO): Promise<IUser | null> {
        return await db.transaction(async (trx) => {  
            
            const userPayload: CreateUserDTO  = {
                email: userInput.email,
                username: userInput.username,
                fullname: userInput.fullname,
                status: userInput.status,
                occupation: userInput.occupation,
                phone: userInput.phone,
                date_of_birth: userInput.date_of_birth
            };
            
            // 1. Check if user exists
            const existingUser = await this.userRepository.findByEmail(userInput.email, trx)
            if (existingUser) throw new ConflictError('User email already exist!')
                
            const existingUsername = userInput.username
                ? await this.userRepository.findByUsername(userInput.username, trx)
                : null;
            if (existingUsername) throw new ConflictError("Username already exists!");

            const existingPhone = userInput.phone
                ? await this.userRepository.findByPhone(userInput.phone, trx)
                : null;
            if (existingPhone) throw new ConflictError('User phone number already exist!')
            
            // 2. Create user
            const newUser = await this.userRepository.createUser(userPayload, trx)
            if (!newUser) {
                throw new Error("User creation failed");
            }           

            // 3. Create auth record
            const authInput: CreateAuthDTO = {
                user_sn: newUser.sn,
                provider_name: 'email',
                provider_identity: userInput.email,
                secret: userInput.password
            }
            await this.authRepository.createAuthRecord(authInput)

            return newUser
        })    
    }
    
    async generateEmailToken(user_id: string, email: string): Promise<string> {
        const token = generateToken({ user_id, email }, secretConfig.emailSecret, '1h')
        return token
    }

    async verifyEmailToken(token: string): Promise<string | null> {
        const emailSecret = secretConfig.emailSecret
        const secretKey = secretConfig.secretKey

        const payload = verifyToken(token, emailSecret)
        const userId = payload.user_id

        await this.userRepository.update(userId, { is_email_verified: true })

        const accessToken = generateToken({ user_id: userId }, secretKey, '2h')
        
        return accessToken
    }
}