import { Router } from 'express'

import { makeAuthMiddleware } from '@/main/factories/make-auth-middleware'
import { makeLoginController } from '@/main/factories/make-login-controller'
import type { AuthenticatedRequest } from '@/presentation/middlewares/auth-middleware'

const authRoutes = Router()
const loginController = makeLoginController()
const authMiddleware = makeAuthMiddleware()

authRoutes.post('/login', (req, res) => {
  loginController.handle(req, res)
})

authRoutes.get('/me', authMiddleware.handle, (req, res) => {
  const authReq = req as AuthenticatedRequest
  return res.status(200).json({ user: authReq.user })
})

export default authRoutes
