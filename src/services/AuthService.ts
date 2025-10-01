import db from "../config/db";
import { config, secretConfig } from "../config";
import { AuthRepository } from "../repository/AuthRepository";
import { UserRepository } from "../repository/UserRepository";
import { CreateAuthDTO } from "../types/auth";
import { CreateUserDTO, IUser } from "../types/user";
import { ConflictError, NotFoundError, UnauthorizedError } from "../utils/errors";
import { generateToken, verifyToken } from "../utils/token";
import { comparePassword } from "../utils/hash";
import { ILoginResponse } from "../types/api_response";
import { setCache } from "../utils/caching";
import { TokenService } from "./TokenService";

export class AuthService {
    private userRepository: UserRepository
    private authRepository: AuthRepository
    private emailSecret = secretConfig.emailSecret
    private secretKey = secretConfig.secretKey
    private refreshKey = secretConfig.refreshSecret

    constructor() {
        this.userRepository = new UserRepository()
        this.authRepository = new AuthRepository()
    }


    async registerUser(userInput: CreateUserDTO): Promise<IUser | null> {
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
        const payload = verifyToken(token, this.emailSecret)
        const userId = payload.user_id

        await this.userRepository.update(userId, { is_email_verified: true })

        const accessToken = generateToken({ user_id: userId }, this.secretKey, '2h')
        
        return accessToken
    }

    async loginUser(key: string, value: string, secret: string): Promise<ILoginResponse> {
        return db.transaction(async (trx) => {
            // 1. Check if user exist
            const user = await this.userRepository.findOne(key, value, trx)
            if (!user) throw new NotFoundError('User does not exist!')
            
            // 2. Check auth record for password match
            const auth = await this.authRepository.findOne('user_sn', user.sn, trx)
            if (!auth) throw new NotFoundError('No auth record for user!')

            // 3. Compare password
            const isMatch = await comparePassword(secret, auth.hashed_secret)
            if (!isMatch) throw new UnauthorizedError('Invalid credentials provided!')
            
            // 4. Generate auth tokens
            const { accessToken, refreshToken } = await TokenService.issueAuthTokens(user)
            
            return { user, accessToken, refreshToken }
        })
    }
}