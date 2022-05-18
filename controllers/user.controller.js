import Logger from '../utils/logger.js'
import mongoose from 'mongoose'

import { userService } from '../services/index.js'

/*
  CRUD method: Search all the content objects in the DB and send them as an array.
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
  CRUD method: Search a content object with his id in the DB and send it as an object.
*/
export async function getUser(req, res) {
  if (!req.params.id) {
    Logger.error('Id parameter not found or not an objectId')
    return res.status(400).json({error: 'Id parameter not found or not an objectId'})
  }
  const user = await userService.getUser(req.params.id)
  if (!user) {
    Logger.error('User not found in the database')
    return res.status(404).json({error: 'User not found in the database'})
  }
  return res.status(200).json(user);
}

export async function addNewUser(req, res) {
  const user = await userService.createUser(req.body)
  if (!user || user.errors) {
    Logger.error("Error when creating user")
    return res.status(400).json(user)
  }
  return res.status(201).json(user)
}


//TODO needs more testing, success all the time even with unexisting keys
export async function updateUser(req, res) {
  if (!req.params.id) {
    Logger.error('Id parameter not found or not an objectId')
    return res.status(400).json({error: 'Id parameter not found or not an objectId'})
  }
  const user = await userService.updateUser(req.body, req.params.id)
  if (!user) {
    Logger.error('Unable to update the user')
    return res.status(500).json({error: 'Unable to update the user'})
  }
  return res.status(200).json({ message: 'User was updated with success'});
}

/*
  CRUD method: Search a content object with his id in the DB,
  remove it and send back a confirmation.
*/
export async function deleteUser(req, res) {
  if (!req.params.id) {
    Logger.error('Id parameter not found or not an objectId')
    return res.status(400).json({error: 'Id parameter not found or not an objectId'})
  }
  const userDeleted = await userService.deleteUser(req.params.id)

  if (!userDeleted || userDeleted.deletedCount == 0) {
    Logger.error('Unable to delete this user')
    return res.status(404).json({ error: 'Unable to delete a user with this parameter'})
  }
  return res.status(200).json({ message: 'User was deleted with success'})
}


/*
  CRUD method: Create a content object with valid params
  in the DB, save it and send it as an object.
*/
/*export function addNewUser(req, res) {
  if (req.body.email === null || req.body.email === undefined) {
    return res.status(422).json({
      errors: {
        email: 'is required'
      }
    });
  }

  if (!req.body.password) {
    return res.status(422).json({
      errors: {
        password: 'is required'
      }
    });
  }
  Users.find({ email: req.body.email }).exec((err, users) => {
    if (users.length >= 1) {
      return res.status(409).json({ error: 'This email is already used ' });
    }
    const finalUser = new Users(req.body);
    finalUser.setPassword(req.body.password);
    finalUser.save((errorsave) => {
      if (errorsave) {
        return res.status(400).json(errorsave);
      }
      const token = new Token({ userId: finalUser.id, token:
        crypto.randomBytes(3).toString('hex') });
        token.save((error) => {
          if (error) {
            return res.status(500).send({ error: error.message });
          }
          let smtpTransport = nodemailer.createTransport({
           host: 'smtp.ethereal.email',
           port: 587,
           auth: {
               user: 'mattie.kshlerin@ethereal.email',
               pass: 'fbafce9417Qgj1Eef6'
           }
       });
          if (process.env.NODE_ENV === 'test') {
            res.status(201).json(finalUser.toAuthJSON(false));
          }
          else {
            const mailOptions = {
              from: 'no-reply@syty.fr', to: finalUser.email,
              subject: 'Account Verification Token', text: `${`Hello,\n\nPlease
              verify your account by
              entering the following code: \n${token.token}`}.\n`
            };
            smtpTransport.sendMail(mailOptions, (errormail) => {
              if (errormail) {
//                return res.status(500).json({ error: errormail.message });
                  console.log(errormail);
              }
              res.status(201).json(finalUser.toAuthJSON(false));
            });
          }
        });
      res.status(201).json(finalUser.toAuthJSON(false));
    });
  });
}*/

export function emailAvailable(req, res) {
  Users.find({ email: req.body.email }).lean().exec((err, users) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (users.length >= 1) {
      res.status(409).json({ error: 'Email already used' });
      return;
    }
    res.status(200).json({ message: 'Email is available' });
  });
}
