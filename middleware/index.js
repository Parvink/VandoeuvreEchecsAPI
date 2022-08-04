import loggerMiddleware from './logger.middleware.js'
import isAdmin from './admin.middleware.js'
import isValidID from './objectid.middleware.js'
import validJWT from './auth.middleware.js'

const middlewares = {
    loggerMiddleware,
    isAdmin,
    isValidID,
    validJWT,
}
export default middlewares
