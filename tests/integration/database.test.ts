import { UserModel } from '@/infrastructure/database/models/user.model'
import { initDatabase, sequelize } from '@/infrastructure/database/sequelize'

describe('Database Configuration', () => {
  beforeAll(async () => {
    await initDatabase()
  })

  afterAll(async () => {
    await UserModel.destroy({ where: {}, truncate: true })
    await sequelize.close()
  })

  it('should connect to SQLite database successfully', async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow()
  })

  it('should have created the users table', async () => {
    const queryInterface = sequelize.getQueryInterface()
    const tables = await queryInterface.showAllTables()
    expect(tables).toContain('users')
  })

  it('should have correct columns in users table', async () => {
    const queryInterface = sequelize.getQueryInterface()
    const tableDefinition = await queryInterface.describeTable('users')

    expect(tableDefinition).toHaveProperty('id')
    expect(tableDefinition).toHaveProperty('name')
    expect(tableDefinition).toHaveProperty('email')
    expect(tableDefinition).toHaveProperty('password')
    expect(tableDefinition).toHaveProperty('createdAt')
    expect(tableDefinition).toHaveProperty('updatedAt')
  })

  it('should insert and retrieve a user using UserModel', async () => {
    const userData = {
      id: 'd9b2b512-88f5-4c07-9b2f-488665979854',
      name: 'Test User',
      email: 'test@database.com',
      password: 'secure_password',
    }

    const createdUser = await UserModel.create(userData)
    expect(createdUser.id).toBe(userData.id)

    const foundUser = await UserModel.findByPk(userData.id)
    expect(foundUser).not.toBeNull()
    expect(foundUser?.email).toBe(userData.email)
  })
})
