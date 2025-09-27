import { Knex } from "knex"
import db from "../config/db"

export abstract class BaseRepository<T> {
    protected db: Knex
    protected tableName: string
    protected primaryKey: string

    constructor(tableName: string, primaryKey: string = 'id') {
        this.db = db
        this.tableName = tableName
        this.primaryKey = primaryKey
    }

    async findById(id: string, trx?: Knex.Transaction): Promise<T | null> {
        const query = this.db(this.tableName).where('id', id).first()
        if (trx) query.transacting(trx)
        return query
    }

    async create(data: Partial<T>, trx?: Knex.Transaction): Promise<T | null> {
        const query = this.db(this.tableName).insert(data);
        if (trx) query.transacting(trx);

        const [insertedId] = await query;
        const pk = this.primaryKey || 'id';
        const fetchQuery = this.db(this.tableName).where(pk, insertedId).first();
        if (trx) fetchQuery.transacting(trx);

        const result = await fetchQuery;
        return result || null;
    }

    async update(id: string, data: Partial<T>, trx?: Knex.Transaction): Promise<T | null> {
        const query = this.db(this.tableName)
            .where({ id })
            .update({ ...data, updated_at: new Date() });

        if (trx) query.transacting(trx);
        await query;

        const selectQuery = this.db(this.tableName).where({ id }).first();
        if (trx) selectQuery.transacting(trx);
        const result = await selectQuery;

        return result || null;
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