import Logger from '../utils/logger.js'

import { userService } from '../services/index.js'

/*
  CRUD method: Search all the user in the database, format the output and send them as an array of objects.
*/
export async function getUsers(req, res) {
    const users = await userService.getUsers()
    if (!users) {
        Logger.error('Users collection was empty')
        return res.status(500).json('Users collection was empty')
    }
    return res.status(200).json(users)
}

/*
  CRUD method: Search an user with his id in the database, format it and send it as an object.
*/
export async function getUser(req, res) {
    const user = await userService.getUser(req.params.id)
    if (!user) {
        Logger.error('User not found in the database')
        return res
            .status(404)
            .json({ message: 'User not found in the database' })
    }
    return res.status(200).json(user)
}

/*
  CRUD method: Create an user from the variables given in the request body. 
  Checks first if an user with the same email exists in the database and return an error if it does
  Generate the hash from the password
  Then create the entry in the database and returns 201 with the generated jwt, email and id of the created user
*/
export async function addNewUser(req, res) {
    try {
        const emails = await userService.getUsersByKey({
            email: req.body.email,
        })
        if (emails.length > 0) {
            Logger.error('Email already found in the database')
            return res
                .status(400)
                .json({ message: 'Email already found in the database' })
        }
        const user = await userService.createUser(req.body)
        user.setPassword(req.body.password)
        return res.status(201).json(user.toAuthJSON(false))
    } catch (e) {
        Logger.error(e.message)
        return res.status(400).json({ message: e.message })
    }
}
/*
  CRUD method: Update an user in the database given his id as parameter and new variables in the request body.
  Check first if user exists, and returns error otherwise
  Modify the database entry and return a message
*/
export async function updateUser(req, res) {
    const { id } = req.params
    const user = await userService.getUser(id)
    if (!user) {
        Logger.error('Unable to find the user')
        return res.status(404).json({ message: 'Unable to find the user' })
    }
    for (const [key, value] of Object.entries(req.body)) {
        user[key] = value
    }
    try {
        await user.save()
        return res
            .status(200)
            .json({ message: 'User was updated with success' })
    } catch (e) {
        Logger.error(e.message)
        return res.status(400).json({ message: e.message })
    }
}

/*
  CRUD method: Delete an user object in the database.
  If the user does not exist, return an error
  Otherwise, return 200 with a message
*/
export async function deleteUser(req, res) {
    try {
        const userDeleted = await userService.deleteUser(req.params.id)
        if (!userDeleted || userDeleted.deletedCount == 0) {
            Logger.error('Unable to delete this user')
            return res.status(404).json({
                message: 'Unable to delete a user with this parameter',
            })
        }
        return res
            .status(200)
            .json({ message: 'The user has been deleted successfully' })
    } catch (e) {
        Logger.error(e.message)
        return res.status(404).json({ message: e.message })
    }
}

/*
    This function takes a body as parameter containing email and password.
    The body can also contain a rememberMe value (defaults false) which change the exp date of the token.
    It checks if an account exists with this mail and returns 400 otherwise.
    Then it compares the password with the hash in the database, and returns 400 if it doesn't match.
    Finally, it returns a JSON containing the token, the email and the id of the user.
*/

export async function loginUser(req, res) {
    const { email, password } = req.body
    const rememberMe = req.body.rememberMe || false
    try {
        const user = await userService.getUsersByEmail(email)
        if (user.length == 0) {
            Logger.error('No user found in the database with this email')
            return res
                .status(400)
                .json({
                    message: 'No user found in the database with this email',
                })
        }
        if (user[0].validPassword(password))
            return res.status(200).json(user[0].toAuthJSON(rememberMe))
        Logger.error('The password is not valid')
        return res.status(400).json({ message: 'The password is not valid' })
    } catch (e) {
        Logger.error(e.message)
        return res.status(400).json({ message: e.message })
    }
}
