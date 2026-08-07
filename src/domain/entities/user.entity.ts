import type { IUserEntityProps } from '@/utils/types/user-types'

export class UserEntity {
  private _id: string
  private _name: string
  private _email: string
  private _password: string

  constructor(props: IUserEntityProps) {
    this.validate(props)

    this._id = props.id || crypto.randomUUID()
    this._name = props.name
    this._email = props.email
    this._password = props.password
  }

  get id(): string {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get email(): string {
    return this._email
  }

  get password(): string {
    return this._password
  }

  private isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private validate(props: IUserEntityProps): void {
    const { name, email, password } = props

    if (!name || name.trim().length === 0) {
      throw new Error('Name is required!')
    }

    if (!email || !this.isValidEmail(email)) {
      throw new Error('Invalid email!')
    }

    if (!password || password.length < 6) {
      throw new Error('Invalid password!')
    }
  }
}
