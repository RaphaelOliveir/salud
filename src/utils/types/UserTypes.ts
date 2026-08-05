export type User = {
    id: string
    name: string
    email: string
    passwordHashed: string
    role?: string
}

export type UserInput = {
    email: string
    password: string
}

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>
}