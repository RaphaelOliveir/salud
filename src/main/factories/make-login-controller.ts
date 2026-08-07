import { LoginUseCase } from '@/application/use-cases/login.use-case'
import { UserRepository } from '@/infrastructure/repositories/user-repository'
import { BcryptService } from '@/infrastructure/services/bcrypt-service'
import { JwtService } from '@/infrastructure/services/jwt-service'
import { LoginController } from '@/presentation/controllers/login-controller'

export const makeLoginController = (): LoginController => {
  const userRepository = new UserRepository()
  const bcryptService = new BcryptService()
  const jwtService = new JwtService()
  const loginUseCase = new LoginUseCase(userRepository, bcryptService, jwtService)
  const loginController = new LoginController(loginUseCase)

  return loginController
}
