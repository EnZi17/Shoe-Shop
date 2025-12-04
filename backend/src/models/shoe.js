const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShoeSchema = new Schema({
    name:String,
    quantity: Number,
    price: Number,
    discount: Number,
    thum: String,
    pic1:String,
    pic2:String,
    pic3:String,
    pic4:String,
    pic5:String,
    description:String,
})

const Shoe = mongoose.model('Shoe',ShoeSchema)

module.exports = Shoe