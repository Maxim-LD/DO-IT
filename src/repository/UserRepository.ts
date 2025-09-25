import { Knex } from "knex";
import { CreateUserDTO, IUser } from "../types/user";
import { BaseRepository } from "./BaseRepository";
import { v4 as uuidv4 } from "uuid";

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super('users')
    }

    async findByEmail(email: string, trx?: Knex.Transaction): Promise<IUser | null> {
        const query = this.db(this.tableName).where('email', email).first()
        if (trx) query.transacting(trx)
        return query
    }

    async findByPhone(phone: string, trx?: Knex.Transaction): Promise<IUser | null> {
        const query = this.db(this.tableName).where('phone', phone).first()
        if (trx) query.transacting(trx)
        return query
    }

    async createUser(input: CreateUserDTO, trx?: any): Promise<IUser | null> {
        const userData: Partial<IUser> = {
            id: uuidv4(),
           ...input,
            created_at: new Date(),
            updated_at: new Date(),
        }

        return await this.create(userData)
    }
}