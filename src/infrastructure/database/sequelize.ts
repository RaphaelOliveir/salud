import { Sequelize } from 'sequelize'

import { initUserModel } from './models/user.model'

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
})

export const initDatabase = async (): Promise<void> => {
  initUserModel(sequelize)
  await sequelize.sync()
}
