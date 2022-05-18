import express from 'express'
import * as dotenv from 'dotenv';
import helmet from 'helmet'

import routes from './routes/index.js'
import connect from './db/config.js'
import middlewares from './middleware/index.js'

dotenv.config()
const port = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(helmet())

connect();

app.use(middlewares.loggerMiddleware)
app.use('/api/', routes)
app.listen(port)
