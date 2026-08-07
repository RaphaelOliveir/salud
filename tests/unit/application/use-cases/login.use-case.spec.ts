import { LoginUseCase } from '@/application/use-cases/login.use-case'
import type { BcryptService } from '@/infrastructure/services/bcrypt-service'
import type { JwtService } from '@/infrastructure/services/jwt-service'
import type { IUserRepository } from '@/utils/types/user-types'

describe('LoginUseCase', () => {
  let sut: LoginUseCase
  let mockUserRepository: jest.Mocked<IUserRepository>
  let mockBcryptService: jest.Mocked<BcryptService>
  let mockJwtService: jest.Mocked<JwtService>

  beforeEach(() => {
    mockUserRepository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
    }

    mockBcryptService = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as unknown as jest.Mocked<BcryptService>

    mockJwtService = {
      generate: jest.fn().mockReturnValue('mocked_jwt_token'),
      verify: jest.fn(),
    } as unknown as jest.Mocked<JwtService>

    sut = new LoginUseCase(mockUserRepository, mockBcryptService, mockJwtService)
  })

  it('should authenticate user and return access token when credentials are valid', async () => {
    mockUserRepository.findByEmail.mockResolvedValue({
      id: 'user-id-123',
      name: 'Raphael Oliveira',
      email: 'raphael@test.com',
      password: 'hashed_password',
    })
    mockBcryptService.compare.mockResolvedValue(true)

    const result = await sut.execute({
      email: 'raphael@test.com',
      password: 'correct_password',
    })

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('raphael@test.com')
    expect(mockBcryptService.compare).toHaveBeenCalledWith('correct_password', 'hashed_password')
    expect(mockJwtService.generate).toHaveBeenCalledWith({
      id: 'user-id-123',
      email: 'raphael@test.com',
    })
    expect(result).toEqual({ accessToken: 'mocked_jwt_token' })
  })

  it('should throw error if email or password are missing', async () => {
    await expect(sut.execute({ email: '', password: '123' })).rejects.toThrow(
      'Email and password are required!',
    )

    await expect(sut.execute({ email: 'test@test.com', password: '' })).rejects.toThrow(
      'Email and password are required!',
    )
  })

  it('should throw error when user is not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null)

    await expect(
      sut.execute({ email: 'nonexistent@test.com', password: 'password123' }),
    ).rejects.toThrow('Invalid email or password!')
  })

  it('should throw error when password does not match', async () => {
    mockUserRepository.findByEmail.mockResolvedValue({
      id: 'user-id-123',
      name: 'Raphael Oliveira',
      email: 'raphael@test.com',
      password: 'hashed_password',
    })
    mockBcryptService.compare.mockResolvedValue(false)

    await expect(
      sut.execute({ email: 'raphael@test.com', password: 'wrong_password' }),
    ).rejects.toThrow('Invalid email or password!')
  })
})
