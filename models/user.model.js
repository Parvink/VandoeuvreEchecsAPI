import crypto from 'crypto'
import mongoose from 'mongoose'
import * as jwt from 'jsonwebtoken'
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstname: { type: String, default: 'nofirstname' },
  name: { type: String, default: 'noname' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  elo: { type: Number, default: 0},
  type: { type: String, enum: ["PLAYER", "ADMIN"], default: "PLAYER"},
  ageCategory: { type: Number, enum: [12, 20, 30], default: 20}
  //hash: String,
  //salt: String,
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  };
  
  /**
    This method encrypts the given password to check if it is equal the hash meaning
    the password is valid.
  */
  userSchema.methods.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
  };
  
  userSchema.methods.generateJWT = function (rememberMe) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setHours(today.getHours() + 5000);
    if (rememberMe === false) {
      return jwt.sign({
        email: this.email,
        id: this._id,
        type: this.type,
        exp: parseInt(expirationDate.getTime(), 10)
      }, process.env.JWT_KEY);
    }
    return jwt.sign({
      email: this.email,
      id: this._id,
      type: this.type
    }, process.env.JWT_KEY);
  };
  
  userSchema.methods.toAuthJSON = function (rememberMe) {
    return ({
      _id: this._id,
      email: this.email,
      token: this.generateJWT(rememberMe),
    });
  };
  
  export default userSchema;
