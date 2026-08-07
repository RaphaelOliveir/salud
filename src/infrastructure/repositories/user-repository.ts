import { UserModel } from '../database/models/user.model'

import type { IUserRepository, IUserEntityProps } from '@/utils/types/user-types'

export class UserRepository implements IUserRepository {
  async save(user: IUserEntityProps): Promise<void> {
    await UserModel.create({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    })
  }

  async findByEmail(email: string): Promise<IUserEntityProps | null> {
    const userModel = await UserModel.findOne({ where: { email } })
    if (!userModel) {
      return null
    }

    return {
      id: userModel.id,
      name: userModel.name,
      email: userModel.email,
      password: userModel.password,
    }
  }
}
