const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let bookingSchema = new Schema({
    shipment_type: {
        type: String,
    },
    weight: {
        type: String,
    },
    length: {
        type: String,
    }, 
    width: {
        type: String,
    },
    height: {
        type: String,
    },
    description: {
        type: String,
    },
    number_items: {
        type: String,
    },
    value: {
        type: String,
    },
    pickup_address: {
        type: String,
    },
    pickup_hub:{
        type: String,
    },
    useDefaultAddress:{
        type: String,
    },
    country: {
        type: String,
    },
    delivery_address: {
        type: String,
    },
    delivery_name:{
        type: String,
    },
    delivery_email:{
        type: String,
    },
    delivery_number:{
        type: String,
    },
    tracking_id:{
        type: String,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
})

module.exports = mongoose.model('Booking', bookingSchema)