export interface IAuth {
    sn: bigint
    id: string,
    user_sn: bigint
    provider_id: string
    identifier: string
    secret: string
    is_email_verified: boolean
    is_phone_verified: boolean
    created_at: Date;
    updated_at: Date;
}

export interface CreateAuthDTO {
    user_sn: bigint
    provider_id?: string
    identifier: string
    secret: string
}