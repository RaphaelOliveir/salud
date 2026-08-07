import { Router } from 'express'

import { makeUserController } from '@/main/factories/make-user-controller'

const userRoutes = Router()
const userController = makeUserController()

userRoutes.post('/users', (req, res) => {
  userController.create(req, res)
})

export default userRoutes
