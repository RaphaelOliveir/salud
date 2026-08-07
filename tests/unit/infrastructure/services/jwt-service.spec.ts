import { JwtService } from '@/infrastructure/services/jwt-service'

describe('JwtService', () => {
  let sut: JwtService

  beforeEach(() => {
    sut = new JwtService('test_secret', '1h')
  })

  it('should generate a valid jwt token', () => {
    const payload = {
      id: '1234',
      email: 'raphael@test.com',
    }

    const token = sut.generate(payload)

    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
  })

  it('should verify and decode a valid token', () => {
    const payload = {
      id: '1234',
      email: 'raphael@test.com',
    }

    const token = sut.generate(payload)
    const decoded = sut.verify(token)

    expect(decoded.id).toBe(payload.id)
    expect(decoded.email).toBe(payload.email)
  })

  it('should throw error for invalid token', () => {
    expect(() => {
      sut.verify('invalid_token')
    }).toThrow()
  })
})
