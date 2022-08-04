import express from 'express'
import * as dotenv from 'dotenv'
import helmet from 'helmet'

import routes from './routes/index.js'
import connect from './db/config.js'
import middlewares from './middleware/index.js'

/*
    Setup of the express server, port and environment
*/
dotenv.config()
const port = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(helmet())

/*
    Database connection
*/
connect()

/*
    Middlewares
*/
app.use(middlewares.loggerMiddleware)

/*
    Routes
*/
app.use('/api/', routes)

app.listen(port)
