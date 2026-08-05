import jwt from "jsonwebtoken";

export type TokenPayload = {
    sub: string
    email: string
    role?: string | undefined
}

export class JwtService {
    constructor(
        private readonly secret: string,
        private readonly expiresIn: number,
    ) { }

    sign(payload: TokenPayload) {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn })
    }

    verify(token: string): TokenPayload {
        return jwt.verify(token, this.secret) as TokenPayload
    }
}