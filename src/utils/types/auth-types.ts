export interface ILoginInput {
  email: string
  password: string
}

export interface ILoginOutput {
  accessToken: string
}

export interface IJwtPayload {
  id: string
  email: string
}

export interface IJwtService {
  generate(payload: IJwtPayload): string
  verify(token: string): IJwtPayload
}
