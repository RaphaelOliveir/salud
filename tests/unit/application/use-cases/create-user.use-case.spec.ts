import { CreateUserUseCase } from "@/application/use-cases/create-user.use-case";
import type { IUserRepository } from "@/utils/types/user-types";

const MockedRepository: IUserRepository = {
    save: jest.fn(),
    findByEmail: jest.fn().mockResolvedValue(null),
};

describe('CreateUserUseCase', () => {
    it('should create a new user', async () => {
        const useCase = new CreateUserUseCase(MockedRepository);

        await useCase.execute({
            name: 'Raphael',
            email: 'raphael@test.com',
            password: '123'
        });

        expect(MockedRepository.save).toHaveBeenCalled();
    });

    it('should not create user if email already exists', async () => {
        MockedRepository.findByEmail = jest.fn().mockResolvedValue(true);
        const useCase = new CreateUserUseCase(MockedRepository);

        await expect(
            useCase.execute({ name: 'Raphael', email: 'raphael@test.com', password: '123' })
        ).rejects.toThrow('Email already exists!');
    });
})