const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    account_number: String,
    account_type: String,
    balance: Number
}, {timestamps:true})

const Account = mongoose.model("Account", accountSchema);
module.exports = Account;