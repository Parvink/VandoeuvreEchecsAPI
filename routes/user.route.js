import { Router } from 'express'
import { userController } from '../controllers/index.js'
import middlewares from '../middleware/index.js'

const { isValidID } = middlewares
const userRouter = Router()

userRouter.route('/auth').post(userController.loginUser)

userRouter
    .route('/:id')
    .get(isValidID, userController.getUser)
    .put(isValidID, userController.updateUser)
    .delete(isValidID, userController.deleteUser)
userRouter
    .route('/')
    .get(userController.getUsers)
    .post(userController.addNewUser)

export default userRouter
