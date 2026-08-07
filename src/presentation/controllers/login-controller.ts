import type { Request, Response } from 'express'

import type { LoginUseCase } from '@/application/use-cases/login.use-case'

export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body

      const result = await this.loginUseCase.execute({
        email,
        password,
      })

      return res.status(200).json(result)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return res.status(401).json({ error: errorMessage })
    }
  }
}
