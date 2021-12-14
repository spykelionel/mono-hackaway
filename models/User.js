const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    address: String,
    password: String,
    country: String,
    avatar: String,
    accounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    }],
    authenticated: {
        type: Boolean,
        default: false
    }
}, {timestamps:true})

const User = mongoose.model("User", userSchema);
module.exports = User;