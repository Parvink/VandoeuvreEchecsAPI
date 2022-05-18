import mongoose from 'mongoose'

function isObjectId(str) {
    return mongoose.isValidObjectId(str)
}

export default isObjectId