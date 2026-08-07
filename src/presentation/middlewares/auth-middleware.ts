import type { NextFunction, Request, Response } from 'express'

import type { JwtService } from '@/infrastructure/services/jwt-service'
import type { IJwtPayload } from '@/utils/types/auth-types'

export interface AuthenticatedRequest extends Request {
  user?: IJwtPayload
}

export class AuthMiddleware {
  constructor(private jwtService: JwtService) {}

  handle = (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: 'Token not provided!' })
    }

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Token malformatted!' })
    }

    const token = parts[1]
    if (!token) {
      return res.status(401).json({ error: 'Token not provided!' })
    }

    try {
      const payload = this.jwtService.verify(token)
      req.user = payload
      return next()
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token!' })
    }
  }
}
