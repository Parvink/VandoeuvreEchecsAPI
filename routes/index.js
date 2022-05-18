import userRouter from './user.route.js'
import eventRouter from './event.route.js'

import { Router } from 'express'

const completeRouter = Router()

completeRouter.use('/user', userRouter)
completeRouter.use('/event', eventRouter)

export default completeRouter
