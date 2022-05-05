import express from 'express'
import * as dotenv from 'dotenv';

import routes from './routes/index.js'
import connect from './db/config.js'
import loggerMiddleware from './middleware/logger.middleware.js'

dotenv.config()
const port = process.env.PORT || 3000
const app = express()
app.use(express.json())


connect();


app.use(loggerMiddleware)
app.use('/api/', routes)
app.listen(port)

/*getUsers() //get all users de la db
getUserById() // get an user by his id
updateUserById() //
deleteUserById()
createUser()*/