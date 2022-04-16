const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    country: {
        type: String,
    },
    email: {
        type: String,
    },
    firstname: {
        type: String,
    }, 
    lastname: {
        type: String,
    },
    username: {
        type: String,
    },
    phonenumber: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    address: {
        type: String,
    },
    password: {
        type: String,
    },
    referral: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
})

module.exports = mongoose.model('User', userSchema)