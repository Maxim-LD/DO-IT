import { Knex } from "knex"
import db from "../config/db"

export abstract class BaseRepository<T> {
    protected db: Knex
    protected tableName: string

    constructor(tableName: string) {
        this.db = db
        this.tableName = tableName
    }

    async findById(id: string, trx?: Knex.Transaction): Promise<T | null> {
        const query = this.db(this.tableName).where('id', id).first()
        if (trx) query.transacting(trx)
        return query
    }

    async create(data: Partial<T>, trx?: Knex.Transaction): Promise<T | null> {
        const query = this.db(this.tableName).insert(data).returning('*')
        if (trx) query.transacting(trx)
        const [result] = await query
        return result || null
    }

    async update(id: string, data: Partial<T>, trx?: Knex.Transaction): Promise<T | null> {
        const query = this.db(this.tableName)
            .where(id, 'id')
            .update({ ...data, updated_at: new Date() })
            .returning('*')
        if (trx) query.transacting(trx)
        const [result] = await query
        return result
    }

    async findAll(
        limit = 10,
        offset = 0,
        orderBy = 'created_at',
        order: 'asc' | 'desc' = 'desc',
        trx?: Knex.Transaction
    ): Promise<T[]> {
        const query = this.db(this.tableName)
            .limit(limit)
            .offset(offset)
            .orderBy(orderBy, order)
        if (trx) query.transacting(trx)
        return query
    }

    async delete(id: string, trx?: Knex.Transaction): Promise<boolean>{
        const query = this.db(this.tableName).where('id', id).del()
        if (trx) query.transacting(trx)
        const result = await query
        return result > 0
    }

     async count(conditions: any = {}, trx?: Knex.Transaction): Promise<number> {
        const query = this.db(this.tableName).where(conditions).count('* as count').first()
        if (trx) query.transacting(trx)
        const result = await query
        return parseInt(result?.count as string) || 0
    }

    async exists(conditions: any, trx?: Knex.Transaction): Promise<boolean> {
        const count = await this.count(conditions, trx)
        return count > 0
    }
}