import type { NextFunction, Response } from 'express'

import type { JwtService } from '@/infrastructure/services/jwt-service'
import {
  AuthMiddleware,
  type AuthenticatedRequest,
} from '@/presentation/middlewares/auth-middleware'

describe('AuthMiddleware', () => {
  let sut: AuthMiddleware
  let mockJwtService: jest.Mocked<JwtService>
  let mockRequest: Partial<AuthenticatedRequest>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    mockJwtService = {
      generate: jest.fn(),
      verify: jest.fn(),
    } as unknown as jest.Mocked<JwtService>

    sut = new AuthMiddleware(mockJwtService)

    mockRequest = {
      headers: {
        authorization: 'Bearer valid_token',
      },
    }

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    mockNext = jest.fn()
  })

  it('should return 401 if authorization header is not provided', () => {
    mockRequest.headers = {}

    sut.handle(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(401)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token not provided!' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 if authorization header is malformatted', () => {
    mockRequest.headers = {
      authorization: 'invalid_format_token',
    }

    sut.handle(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(401)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token malformatted!' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 if jwt verification fails', () => {
    mockJwtService.verify.mockImplementation(() => {
      throw new Error('Invalid token')
    })

    sut.handle(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext)

    expect(mockJwtService.verify).toHaveBeenCalledWith('valid_token')
    expect(mockResponse.status).toHaveBeenCalledWith(401)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid or expired token!' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should attach payload to req.user and call next on valid token', () => {
    const payload = { id: 'user-123', email: 'raphael@test.com' }
    mockJwtService.verify.mockReturnValue(payload)

    sut.handle(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext)

    expect(mockJwtService.verify).toHaveBeenCalledWith('valid_token')
    expect(mockRequest.user).toEqual(payload)
    expect(mockNext).toHaveBeenCalled()
  })
})
