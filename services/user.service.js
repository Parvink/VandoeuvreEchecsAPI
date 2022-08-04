import mongoose from 'mongoose'
import { userModel } from '../models/index.js'

const Users = mongoose.model('Users', userModel)

export  function getUser(id) {
    return Users.findById(id).select('firstname name elo email id ageCategory')
}

export  function getUsers() {
    return Users.find({}).select('firstname name elo email id ageCategory')
}

export  function getUsersByEmail(email) {
    return Users.find({ email: email}).select('hash email id firstname name')
}

export function createUser(body) {
    return Users.create(body)
}

export  function getUsersByKey(keyPair) {
    return Users.find(keyPair).select('firstname name elo email id ageCategory')
}

export function deleteUser(id) {
    return Users.deleteOne({ _id: id })
}
