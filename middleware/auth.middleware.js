import Logger from '../utils/logger.js'
import jwt from 'jsonwebtoken'

function validJWT(req, res, next) {
    try {
        const header = req.header('Authorization')
        const token = header.split('Bearer ')[1]
        jwt.verify(token, process.env.JWT_KEY)
        next()
    } catch (err) {
        Logger.error(err.message)
        return res.status(401).json({ error: err.message })
    }
}

export default validJWT
