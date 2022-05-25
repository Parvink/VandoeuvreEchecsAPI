import mongoose from "mongoose";
import { userModel } from "../models/index.js";

const Users = mongoose.model("Users", userModel);

export async function getUser(id) {
  return Users.findById(id).select("firstname name elo email id ageCategory");
}

export async function getUsers() {
  return Users.find({})
    .select("firstname name elo email id ageCategory");
}

export function createUser(body) {
  return Users(body);
}

export async function getUsersByKey(keyPair) {
  return Users.find(keyPair).select("firstname name elo email id ageCategory");
}

export async function deleteUser(id) {
  return Users.deleteOne({ _id: id });
}
