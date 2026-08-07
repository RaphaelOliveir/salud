import type { Request, Response } from 'express';

import { CreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import { UserController } from '@/presentation/controllers/user-controller';

jest.mock('@/application/use-cases/create-user.use-case');

describe('UserController', () => {
    let userController: UserController;
    let mockCreateUserUseCase: jest.Mocked<CreateUserUseCase>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockCreateUserUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<CreateUserUseCase>;

        userController = new UserController(mockCreateUserUseCase);

        mockRequest = {
            body: {
                name: 'Raphael',
                email: 'raphael@test.com',
                password: '123'
            }
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
    });

    it('should return 201 when user is successfully created', async () => {
        await userController.create(mockRequest as Request, mockResponse as Response);

        expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(mockRequest.body);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User created successfully' });
    });

    it('should return 400 when an error occurs', async () => {
        mockCreateUserUseCase.execute.mockRejectedValue(new Error('Email already exists!'));

        await userController.create(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Email already exists!' });
    });
});
