import type { UserInput, UserRepository } from "@/utils/types/UserTypes"
import { BcryptService } from "@/infrastructure/services/BcryptService"
import { JwtService } from "@/infrastructure/services/JwtService"

export class AuthenticateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService
    ) { }

    async execute(input: UserInput) {
        const { email, password } = input
        const user = await this.userRepository.findByEmail(email)

        if (!user) throw new Error('Invalid Email')


        const valid = await this.bcryptService.compare(
            password,
            user.passwordHashed
        )

        if (!valid) throw new Error('Invalid Password')


        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
        })

        return {
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    }
}