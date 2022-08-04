import morgan from 'morgan'

import Logger from '../utils/logger.js'

const stream = {
    write: (message) => Logger.http(message),
}

const loggerMiddleware = morgan(
    ':method :url :status :req[body] :response-time ms',
    { stream }
)

export default loggerMiddleware
