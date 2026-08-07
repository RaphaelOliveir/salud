import { Sequelize } from 'sequelize'

import { UserModel, initUserModel } from '@/infrastructure/database/models/user.model'
import { UserRepository } from '@/infrastructure/repositories/user-repository'

describe('SequelizeUserRepository', () => {
  let sequelize: Sequelize
  let sut: UserRepository

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    })

    initUserModel(sequelize)
    await sequelize.sync({ force: true })

    sut = new UserRepository()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should insert a new user', async () => {
    const userProps = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed_password',
    }

    await sut.save(userProps)

    const userModel = await UserModel.findOne({ where: { email: 'john@example.com' } })
    expect(userModel).toBeTruthy()
    expect(userModel?.toJSON()).toMatchObject({
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed_password',
    })
  })

  it('should find a user by email', async () => {
    const userProps = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'hashed_password',
    }

    await UserModel.create(userProps)

    const user = await sut.findByEmail('jane@example.com')
    expect(user).toBeTruthy()
    expect(user).toEqual({
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'hashed_password',
    })
  })

  it('should return null when finding a non-existent user by email', async () => {
    const user = await sut.findByEmail('nonexistent@example.com')
    expect(user).toBeNull()
  })
})
