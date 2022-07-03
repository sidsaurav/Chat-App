const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        pic: {
            type: String,
            default:
                'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
        },
    },
    { timestamps: true }
)

userSchema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, 10)
})

const User = mongoose.model('User', userSchema)
module.exports = User
