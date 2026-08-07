import { JwtService } from '@/infrastructure/services/jwt-service'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'

export const makeAuthMiddleware = (): AuthMiddleware => {
  const jwtService = new JwtService()
  const authMiddleware = new AuthMiddleware(jwtService)

  return authMiddleware
}
