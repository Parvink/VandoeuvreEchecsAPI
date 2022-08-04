import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstname: {
        type: String,
        required: [true, 'First name is a required field'],
    },
    name: { type: String, required: [true, 'Name is a required field'] },
    email: {
        type: String,
        trim: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)
            },
            message: 'Please enter a valid email',
        },
        required: [true, 'Email is a required field'],
    },
    elo: { type: Number, default: 0, min: 0, max: 3500 },
    type: { type: String, enum: ['PLAYER', 'ADMIN'], default: 'PLAYER' },
    ageCategory: { type: Number, enum: [12, 20, 30], default: 20 },
    hash: { type: String },
})

userSchema.methods.setPassword = function (password) {
    this.hash = bcrypt.hashSync(password, 10)
    this.save()
}

/*
    This method encrypts the given password to check if it is equal the hash meaning
    the password is valid.
  */
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.hash)
}

/*
    This method returns a JWT string given the email,id and rememberMe parameters.
*/
userSchema.methods.generateJWT = function (rememberMe) {
    const expiration = rememberMe ? '10h' : '2h'
    return jwt.sign(
        {
            email: this.email,
            id: this._id,
        },
        process.env.JWT_KEY,
        { expiresIn: expiration }
    )
}

/*
    This method returns an object formatted with the generated JWT, id and email.
*/
userSchema.methods.toAuthJSON = function (rememberMe) {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(rememberMe),
    }
}

export default userSchema
