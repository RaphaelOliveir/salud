import type { AuthenticateUserUseCase } from "@/application/use-cases/AuthenticateUserUseCase";
import type { Request, Response } from "express";

export class AuthController {
    constructor(
        private readonly authenticateUserUseCase: AuthenticateUserUseCase
    ) { }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const loggedUser = await this.authenticateUserUseCase.execute({
                email,
                password
            })

            return res.status(200).json(loggedUser);

        } catch {
            return res.status(401);
        }
    }
}