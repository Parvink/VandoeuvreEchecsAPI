import userRouter from './route.user.js'
import { Router } from 'express'

const completeRouter = Router()

completeRouter.use('/user', userRouter)

export default completeRouter
