import mongoose from 'mongoose'
import express from 'express'
import * as dotenv from 'dotenv';

import connect from './db/config.js'
import loggerMiddleware from './middleware/logger.middleware.js'

dotenv.config()
const port = process.env.PORT || 3000
const app = express()
app.use(express.json())

connect();
app.use('user/:id', (req, res, next) => {
    res.send(req.params.id);
})

app.listen(port)

/*getUsers() //get all users de la db
getUserById() // get an user by his id
updateUserById() //
deleteUserById()
createUser()*/