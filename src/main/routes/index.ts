import { Router } from 'express'

import authRoutes from './auth-routes'
import userRoutes from './user-routes'

const routes = Router()

routes.use(userRoutes)
routes.use(authRoutes)

export default routes
