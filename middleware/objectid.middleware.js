import Logger from '../utils/logger.js'
import isObjectId from '../utils/idvalidator.js'

async function isValidID(req, res, next) {
    if (isObjectId(req.params.id)) {
        next();
    }
    else {
        Logger.error('The id given as parameter was not a valid objectId')
        return res.status(400).json({ error: "The id given as parameter was not a valid objectId"})
    }
}

export default isValidID;