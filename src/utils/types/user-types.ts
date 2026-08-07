export interface IUserEntityProps {
  id?: string
  name: string
  email: string
  password: string
}

export type TUserInput = {
  email: string
  password: string
}

export interface IUserRepository {
  save(user: IUserEntityProps): Promise<void>
  findByEmail(email: string): Promise<IUserEntityProps | null>
}
