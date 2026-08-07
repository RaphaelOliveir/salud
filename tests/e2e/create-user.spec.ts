import { Sequelize } from 'sequelize';
import request from 'supertest';

import { initUserModel } from '@/infrastructure/database/models/user.model';
import app from '@/main/app';

describe('User routes (e2e)', () => {
    let sequelize: Sequelize;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
        });

        initUserModel(sequelize);
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should create a new user and return 201', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                name: 'Raphael e2e',
                email: 'raphael.e2e@test.com',
                password: '123'
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: 'User created successfully' });
    });

    it('should return 400 when email already exists', async () => {
        await request(app)
            .post('/users')
            .send({
                name: 'Raphael e2e',
                email: 'raphael.e2e@test.com',
                password: '123'
            });

        const response = await request(app)
            .post('/users')
            .send({
                name: 'Raphael e2e 2',
                email: 'raphael.e2e@test.com',
                password: '123'
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Email already exists!' });
    });
});
