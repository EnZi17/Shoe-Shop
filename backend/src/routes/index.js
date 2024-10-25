const express = require('express');
const router = express.Router();
const Shoe = require('../models/shoe');
const Order = require('../models/order');

// Middleware kiểm tra API Key
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key']; // API key truyền qua headers
  const validApiKey = process.env.API_KEY||'enzi117apikey';

  if (apiKey && apiKey === validApiKey) {
    next(); // Cho phép truy cập
  } else {
    res.status(403).json({ message: 'Invalid API Key' });
  }
};

// Áp dụng middleware kiểm tra API Key cho tất cả các route
router.use(checkApiKey);

// Cập nhật mã vận đơn của đơn hàng theo ID
router.put('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { shippingCode } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, { shippingCode }, { new: true });
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating tracking number', error });
  }
});

// Xóa đơn hàng
router.delete('/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
});

// Thêm mới đơn hàng
router.post('/orders', async (req, res) => {
  try {
    const { items, phone, address, shippingCode } = req.body;
    const order = new Order({ items, phone, address, shippingCode });
    const savedOrder = await order.save();

    res.status(201).json({
      message: 'Order placed successfully',
      orderid: savedOrder._id,
      createdAt: savedOrder.createdAt,
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order', error });
  }
});

// Lấy đơn hàng theo ID
router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve order', error });
  }
});

// Lấy tất cả đơn hàng
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders', error });
  }
});

// Cập nhật giày theo ID
router.put('/shoes/:id', async (req, res) => {
  try {
    const updatedShoe = await Shoe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedShoe) return res.status(404).send('Shoe not found');
    res.json(updatedShoe);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Thêm mới giày
router.post('/shoes', async (req, res) => {
  try {
    const newShoe = new Shoe(req.body);
    const savedShoe = await newShoe.save();
    res.status(201).json(savedShoe);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Tìm giày theo ID
router.get('/shoes/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    if (!shoe) return res.status(404).send('Shoe not found');
    res.json(shoe);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Tìm kiếm giày
router.get('/shoes', async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    const shoes = await Shoe.find({
      name: new RegExp(searchTerm, 'i')
    });
    res.json(shoes);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Xóa giày theo ID
router.delete('/shoes/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndDelete(req.params.id);
    if (!shoe) return res.status(404).send('Shoe not found');
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

// Middleware kiểm tra mật khẩu Admin
const checkPassword = (req, res, next) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'enzi117';

  if (password === adminPassword) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized access' });
  }
};

// Route đăng nhập Admin
router.post('/login', checkPassword, (req, res) => {
  res.json({ message: 'Welcome to admin page' });
});

module.exports = router;
