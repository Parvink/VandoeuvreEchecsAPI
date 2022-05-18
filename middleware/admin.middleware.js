import { userService } from '../services/index.js'
import Logger from '../utils/logger.js';

async function isAdmin(req, res, next) {
    const user = await userService.getUser(req.params.id)
    if (user.type === 'ADMIN') {
        next();
    }
    else {
        Logger.error('You do not have the permission to use this route')
        return res.status(403).json({ error: "Forbidden: You do not have the permission to use this route"})
    }
}

export default isAdmin;