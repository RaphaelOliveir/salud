import jwt, { type SignOptions } from 'jsonwebtoken'

import type { IJwtPayload, IJwtService } from '@/utils/types/auth-types'

export class JwtService implements IJwtService {
  private readonly secret: string
  private readonly expiresIn: NonNullable<SignOptions['expiresIn']>

  constructor(secret?: string, expiresIn?: NonNullable<SignOptions['expiresIn']>) {
    this.secret = secret || process.env.JWT_SECRET || 'default_jwt_secret'
    this.expiresIn = expiresIn ?? '1d'
  }

  generate(payload: IJwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn })
  }

  verify(token: string): IJwtPayload {
    return jwt.verify(token, this.secret) as IJwtPayload
  }
}
