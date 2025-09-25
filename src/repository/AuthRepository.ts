import { Knex } from "knex";
import { CreateAuthDTO, IAuth } from "../types/auth";
import { IProvider } from "../types/provider";
import { hashPassword } from "../utils/hash";
import { BaseRepository } from "./BaseRepository";
import { v4 as uuidv4 } from "uuid";

export class AuthRepository extends BaseRepository<IAuth> {
    constructor() {
        super('auth')
    }

    async createAuthRecord(input: CreateAuthDTO, trx?: Knex.Transaction): Promise<IAuth | null> {
        const hashedSecret = await hashPassword(input.secret)

        // add provider record
        const provider = await this.db('providers').where('name', input.identifier).first();
        if (!provider) throw new Error("Invalid provider");
        
        const authdata: Partial<IAuth> = {
            id: uuidv4(),
            ...input,
            provider_id: provider.id,
            secret: hashedSecret,
            is_email_verified: false,
            is_phone_verified: false,
            created_at: new Date(),
            updated_at: new Date()
        }

        return await this.create(authdata)
    }  
    
    async generateToken() {
        
    }
}