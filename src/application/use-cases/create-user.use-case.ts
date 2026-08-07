import { randomUUID } from "node:crypto";

import { UserEntity } from "@/domain/entities/user.entity";
import type { UserRepository } from "@/infrastructure/repositories/user-repository";
import { BcryptService } from "@/infrastructure/services/bcrypt-service";
import type { IUserEntityProps } from "@/utils/types/user-types";

export class CreateUserUseCase {
    constructor(
        private userRepository: UserRepository
    ) { }

    async execute(user: IUserEntityProps): Promise<void> {
        const { email, name, password } = user;
        const emailAlreadyExists = await this.userRepository.findByEmail(email);

        if (emailAlreadyExists) throw new Error('Email already exists!');

        const hashedPassword = await new BcryptService().hash(password);

        const newUser = new UserEntity({
            id: randomUUID(),
            name: name,
            email: email,
            password: hashedPassword,
        });

        await this.userRepository.save(newUser);
    };
}