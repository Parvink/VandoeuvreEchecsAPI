import loggerMiddleware from './logger.middleware.js'
import isAdmin from './admin.middleware.js'
import isValidID from './objectid.middleware.js'

const middlewares = {
    loggerMiddleware,
    isAdmin,
    isValidID
}
export default middlewares