import { BcryptService } from '@/infrastructure/services/bcrypt-service'
import { JwtService } from '@/infrastructure/services/jwt-service'
import type { ILoginInput, ILoginOutput } from '@/utils/types/auth-types'
import type { IUserRepository } from '@/utils/types/user-types'

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private bcryptService: BcryptService = new BcryptService(),
    private jwtService: JwtService = new JwtService(),
  ) {}

  async execute(input: ILoginInput): Promise<ILoginOutput> {
    const { email, password } = input

    if (!email || !password) {
      throw new Error('Email and password are required!')
    }

    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new Error('Invalid email or password!')
    }

    const isPasswordValid = await this.bcryptService.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid email or password!')
    }

    const accessToken = this.jwtService.generate({
      id: user.id || '',
      email: user.email,
    })

    return { accessToken }
  }
}
