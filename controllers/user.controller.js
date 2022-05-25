import Logger from "../utils/logger.js";

import { userService } from "../services/index.js";

/*
  CRUD method: Search all the content objects in the DB and send them as an array.
*/
export async function getUsers(req, res) {
  const users = await userService.getUsers();
  if (!users) {
    Logger.error("Users collection was empty");
    return res.status(500).json("Users collection was empty");
  }
  return res.status(200).json(users);
}

/*
  CRUD method: Search a content object with his id in the DB and send it as an object.
*/
export async function getUser(req, res) {
  const user = await userService.getUser(req.params.id);
  if (!user) {
    Logger.error("User not found in the database");
    return res.status(404).json({ error: "User not found in the database" });
  }
  return res.status(200).json(user);
}

export async function addNewUser(req, res) {
  try {
    const emails = await userService.getUsersByKey({ "email": req.body.email});
    if (emails.length > 0) {
      Logger.error("Email already found in the database");
      return res
        .status(400)
        .json({ error: "Email already found in the database" });
    }
    const newUser = userService.createUser(req.body);
    let user = await newUser.save();
    return res.status(201).json({
      message: "The user has been successfully created",
      id: user.id
    });
  } catch (e) {
    return res.status(400).json(e.message);
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const user = await userService.getUser(id);
  if (!user) {
    Logger.error("Unable to find the user");
    return res.status(404).json({ error: "Unable to find the user" });
  }
  for (const [key, value] of Object.entries(req.body)) {
    user[key] = value;
  }
  try {
    user.save();
    return res.status(200).json({ message: "User was updated with success" });
  } catch (e) {
    Logger.error(e.message);
    return res.status(400).json({ error: e.message });
  }
}

/*
  CRUD method: Search a content object with his id in the DB,
  remove it and send back a confirmation.
*/
export async function deleteUser(req, res) {
  try {
    const userDeleted = await userService.deleteUser(req.params.id);
    if (!userDeleted || userDeleted.deletedCount == 0) {
      Logger.error("Unable to delete this user");
      return res
        .status(404)
        .json({ error: "Unable to delete a user with this parameter" });
    }
  } catch (e) {
    Logger.error(e.message);
    return res.status(404).json({ error: e.message });
  }
}
