import { Sequelize } from 'sequelize'
import request from 'supertest'

import { initUserModel } from '@/infrastructure/database/models/user.model'
import app from '@/main/app'

describe('Auth routes (e2e)', () => {
  let sequelize: Sequelize

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    })

    initUserModel(sequelize)
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should register a user, login and access protected profile route', async () => {
    const registerResponse = await request(app).post('/users').send({
      name: 'Raphael Auth',
      email: 'raphael.auth@test.com',
      password: 'password123',
    })

    expect(registerResponse.status).toBe(201)

    const loginResponse = await request(app).post('/login').send({
      email: 'raphael.auth@test.com',
      password: 'password123',
    })

    expect(loginResponse.status).toBe(200)
    expect(loginResponse.body).toHaveProperty('accessToken')
    const token = loginResponse.body.accessToken

    const profileResponse = await request(app).get('/me').set('Authorization', `Bearer ${token}`)

    expect(profileResponse.status).toBe(200)
    expect(profileResponse.body.user).toHaveProperty('email', 'raphael.auth@test.com')
  })

  it('should return 401 when logging in with incorrect password', async () => {
    const loginResponse = await request(app).post('/login').send({
      email: 'raphael.auth@test.com',
      password: 'wrong_password',
    })

    expect(loginResponse.status).toBe(401)
    expect(loginResponse.body).toEqual({ error: 'Invalid email or password!' })
  })

  it('should return 401 when accessing protected route without token', async () => {
    const response = await request(app).get('/me')

    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: 'Token not provided!' })
  })

  it('should return 401 when accessing protected route with invalid token', async () => {
    const response = await request(app)
      .get('/me')
      .set('Authorization', 'Bearer invalid_token_value')

    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: 'Invalid or expired token!' })
  })
})
