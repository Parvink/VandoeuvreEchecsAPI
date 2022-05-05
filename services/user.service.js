import mongoose from 'mongoose'
import { userModel } from "../models/index.js"

const Users = mongoose.model('Users', userModel);

export async function getUser (id) {
    return Users.findById(id).select('firstname name elo email id ageCategory');
}

export async function getUsers() {
    return Users.find({}).select('firstname name elo email id ageCategory');
}


//TODO refactor this dirty function
export async function createUser(body) {
    let user = Users(body)
    try {
    await user.save()
    return user;
    }
    catch (error) {
        return error
    }
}

export async function updateUser(body, id) {
    return Users.findOneAndUpdate({_id: id }, body)
}

export async function deleteUser(id) {
    return Users.deleteOne({ _id: id})
}