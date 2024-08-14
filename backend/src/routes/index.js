const express = require('express');
const router = express.Router();
const Shoe = require('../models/shoe');

// Endpoint tìm kiếm giày theo ID
router.get('/shoes/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    res.json(shoe);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Endpoint lấy danh sách giày và hỗ trợ tìm kiếm theo tên
router.get('/shoes', async (req, res) => {
  try {
    const searchTerm = req.query.search || ''; // Lấy từ khóa tìm kiếm từ query string
    const shoes = await Shoe.find({
      name: new RegExp(searchTerm, 'i') // Tìm kiếm không phân biệt chữ hoa chữ thường
    });
    res.json(shoes);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

