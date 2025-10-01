import { secretConfig } from "../config";
import { setCache } from "../utils/caching";
import { generateToken } from "../utils/token";

export class TokenService {
    static async issueAuthTokens(user: { id: string, email: string }) {
        const accessToken = generateToken(
            { user_id: user.id, email: user.email },
            secretConfig.secretKey,
            '30'
        )

        const refreshToken = generateToken(
            { user_id: user.id, email: user.email },
            secretConfig.refreshSecret,
            secretConfig.refreshTokenExpiry
        )

        await setCache(
            `refresh-token:${user.id}`,
            refreshToken,
            secretConfig.refreshTokenExpiry
        )
        return { accessToken, refreshToken}
    }
}