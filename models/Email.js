const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let emailSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    subject: {
        type: String,
    }, 
    message: {
        type: String,
    },
    status:{
        type:Boolean
    },
    date: {
        type: Date,
        default: Date.now(),
    },
})

module.exports = mongoose.model('Email', emailSchema)