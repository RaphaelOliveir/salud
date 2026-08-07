import { UserEntity } from '@/domain/entities/user.entity'

const MockedUser = {
  id: '1234',
  name: 'Raphael Oliveira',
  email: 'raphael.oliveira@test.com',
  passoword: 'raphael@1234',
}

describe('User Entity', () => {
  it('should create a valid user', () => {
    const user = new UserEntity({
      id: MockedUser.id,
      name: MockedUser.name,
      email: MockedUser.email,
      password: MockedUser.passoword,
    })

    expect(user.id).toBe('1234')
    expect(user.name).toBe('Raphael Oliveira')
    expect(user.email).toBe('raphael.oliveira@test.com')
    expect(user.password).toBe('raphael@1234')
  })

  it('should throw new error for invalid name', () => {
    expect(() => {
      new UserEntity({
        id: MockedUser.id,
        name: '',
        email: MockedUser.email,
        password: MockedUser.passoword,
      })
    }).toThrow('Name is required!')
  })

  it('should throw new error for invalid email', () => {
    expect(() => {
      new UserEntity({
        id: MockedUser.id,
        name: MockedUser.name,
        email: 'invalid-email',
        password: MockedUser.passoword,
      })
    }).toThrow('Invalid email!')
  })

  it('should throw new error for invalid password', () => {
    expect(() => {
      new UserEntity({
        id: MockedUser.id,
        name: MockedUser.name,
        email: MockedUser.email,
        password: 'pass',
      })
    }).toThrow('Invalid password!')
  })
})
