import db from "../config/db";
import { AuthRepository } from "../repository/AuthRepository";
import { UserRepository } from "../repository/UserRepository";
import { CreateAuthDTO } from "../types/auth";
import { CreateUserDTO, IUser } from "../types/user";
import { ConflictError } from "../utils/errors";

export class AuthService {
    private userRepository: UserRepository
    private authRepository: AuthRepository

    constructor() {
        this.userRepository = new UserRepository()
        this.authRepository = new AuthRepository()
    }

    async register(userInput: CreateUserDTO): Promise<IUser | null> {
        return await db.transaction(async (trx) => {
            const { email, password, username, fullname, status, occupation, phone, date_of_birth } = userInput
            
            // 1. Check if user exists
            const existingUser = await this.userRepository.findByEmail(email, trx)
            if (existingUser) throw new ConflictError('User already exist!')
               
            // 2. Create user
            const newUser = await this.userRepository.createUser(userInput, trx)
            if (!newUser) {
                throw new Error("User creation failed");
            }

            // 3. Create auth record
            const authInput: CreateAuthDTO = {
                user_sn: newUser.sn,
                identifier: 'email',
                secret: password
            }
            await this.authRepository.createAuthRecord(authInput, trx)

            return newUser
        })    
    }
    
    async login() {
        
    }
}