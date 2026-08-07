import type { Request, Response } from 'express'

import { CreateUserUseCase } from '@/application/use-cases/create-user.use-case'

export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body

      await this.createUserUseCase.execute({
        name,
        email,
        password,
      })

      return res.status(201).json({ message: 'User created successfully' })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return res.status(400).json({ error: errorMessage })
    }
  }
}
