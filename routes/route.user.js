import { Router } from 'express'
import { userController } from '../controllers/index.js'

const userRouter = Router()

userRouter.route('/:id')
.get(userController.getUser)
.put(userController.updateUser)
.delete(userController.deleteUser)
userRouter.route('/')
.get(userController.getUsers)
.post(userController.addNewUser)

export default userRouter;