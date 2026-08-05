import type { JwtService, TokenPayload } from "@/infrastructure/services/JwtService"
import type { NextFunction, Request, Response } from "express"

export type AuthenticatedRequest = Request & {
    payload?: TokenPayload
}

export const authMiddleware =
    (jwtService: JwtService) =>
        (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const header = req.headers.authorization

            if (!header?.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Missing token' })
            }

            const token = header.replace('Bearer ', '')

            try {
                req.payload = jwtService.verify(token)
                return next()
            } catch {
                return res.status(401).json({ message: 'Invalid or expired token' })
            }
        }