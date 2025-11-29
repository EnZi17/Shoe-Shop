const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shoe',
        require: true
    },

    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
}, {
    timestamps: true
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;