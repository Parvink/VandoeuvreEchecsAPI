import Logger from '../utils/logger.js'
import mongoose from 'mongoose'

async function isValidID(req, res, next) {
    if (mongoose.isValidObjectId(req.params.id)) {
        next();
    }
    else {
        Logger.error('The id given as parameter was not a valid objectId')
        return res.status(400).json({ error: "The id given as parameter was not a valid objectId"})
    }
}

export default isValidID;