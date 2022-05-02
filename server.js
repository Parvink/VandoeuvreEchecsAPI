import mongoose from 'mongoose'
import express from 'express'
import * as dotenv from 'dotenv';

import connect from './db/config.js'

dotenv.config()
const port = process.env.PORT || 3000
const app = express()
app.use(express.json())

connect();
app.use('/', (req, res, next) => {
})

app.listen(port)