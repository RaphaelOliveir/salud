import type { Request, Response } from 'express'

import type { LoginUseCase } from '@/application/use-cases/login.use-case'
import { LoginController } from '@/presentation/controllers/login-controller'

describe('LoginController', () => {
  let sut: LoginController
  let mockLoginUseCase: jest.Mocked<LoginUseCase>
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockLoginUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<LoginUseCase>

    sut = new LoginController(mockLoginUseCase)

    mockRequest = {
      body: {
        email: 'raphael@test.com',
        password: '123',
      },
    }

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    }
  })

  it('should return 200 with access token when login is successful', async () => {
    mockLoginUseCase.execute.mockResolvedValue({ accessToken: 'jwt_token_example' })

    await sut.handle(mockRequest as Request, mockResponse as Response)

    expect(mockLoginUseCase.execute).toHaveBeenCalledWith({
      email: 'raphael@test.com',
      password: '123',
    })
    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.json).toHaveBeenCalledWith({ accessToken: 'jwt_token_example' })
  })

  it('should return 401 when authentication fails', async () => {
    mockLoginUseCase.execute.mockRejectedValue(new Error('Invalid email or password!'))

    await sut.handle(mockRequest as Request, mockResponse as Response)

    expect(mockResponse.status).toHaveBeenCalledWith(401)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid email or password!' })
  })
})
