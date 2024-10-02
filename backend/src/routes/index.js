const express = require('express');
const router = express.Router();
const Shoe = require('../models/shoe');


// Endpoint cập nhật giày
router.put('/shoes/:id', async (req, res) => {
  try {
    const updatedShoe = await Shoe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedShoe) return res.status(404).send('Shoe not found');
    res.json(updatedShoe);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Endpoint tạo giày mới
router.post('/shoes', async (req, res) => {
  try {
    const newShoe = new Shoe(req.body);
    const savedShoe = await newShoe.save();
    res.status(201).json(savedShoe);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Endpoint tìm kiếm giày theo ID
router.get('/shoes/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    if (!shoe) return res.status(404).send('Shoe not found');
    res.json(shoe);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Endpoint lấy danh sách giày và hỗ trợ tìm kiếm theo tên
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

// Endpoint xóa giày theo ID
router.delete('/shoes/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndDelete(req.params.id);
    if (!shoe) return res.status(404).send('Shoe not found');
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).send(err);
  }
});

// Middleware kiểm tra mật khẩu
const checkPassword = (req, res, next) => {
  const { password } = req.body; // Lấy mật khẩu từ yêu cầu
  const adminPassword = process.env.ADMIN_PASSWORD||'1'; // Lưu mật khẩu trong biến môi trường
  
  if (password === adminPassword) {
      next(); // Cho phép truy cập
  } else {
      res.status(401).json({ message: 'Unauthorized access' });
  }
};

// Route Admin
router.post('/admin', checkPassword, (req, res) => {
  res.json({ message: 'Welcome to admin page' });
});

module.exports = router;
