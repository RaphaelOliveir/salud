import { CreateUserUseCase } from '@/application/use-cases/create-user.use-case'
import { UserRepository } from '@/infrastructure/repositories/user-repository'
import { UserController } from '@/presentation/controllers/user-controller'

export const makeUserController = (): UserController => {
  const userRepository = new UserRepository()
  const createUserUseCase = new CreateUserUseCase(userRepository)
  const userController = new UserController(createUserUseCase)

  return userController
}
