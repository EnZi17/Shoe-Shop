const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShoeSchema = new Schema({
    name:String,
    thum: String,
    price: String,
    pic1:String,
    pic2:String,
    pic3:String,
    pic4:String,
    pic5:String,
})

const Shoe = mongoose.model('Shoe',ShoeSchema)

module.exports = Shoe