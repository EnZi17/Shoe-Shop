// models/Order.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  items: [
    {
      shoeid: { type: String, required: true }, // ID của giày
      quantity: { type: Number, required: true }, // Số lượng
    },
  ],
  phone: { type: String, required: true }, // Số điện thoại
  address: { type: String, required: true }, // Địa chỉ
  shippingCode: { type: String }, // Mã vận chuyển (nếu cần)
}, { timestamps: true }); // Tùy chọn để tự động thêm timestamp (createdAt, updatedAt)

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
