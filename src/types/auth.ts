export interface IAuth {
    sn: bigint
    id: string,
    user_sn: bigint
    provider_sn: string
    provider_name: string
    provider_identity: string
    hashed_secret: string
    created_at: Date;
    updated_at: Date;
}

export interface CreateAuthDTO {
    user_sn: bigint
    provider_sn?: string
    provider_name?: string
    provider_identity: string
    secret?: string
}