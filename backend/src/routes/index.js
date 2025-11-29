const express = require('express');
const router = express.Router();
const Shoe = require('../models/shoe');
const Order = require('../models/order');
const Cart = require('../models/cart');

//Thêm giỏ hàng
router.post('/cart', async (req, res)=>{
  try{
    const{userId, productId, quantity = 1} = req.body;

    //tạo đối tượng giỏ hàng
    const cartItem = new Cart({
      userId,
      productId,
      quantity
    });

    const saveCart = await cartItem.save();
    res.json({message: 'Added to cart ', cartItem});
  } catch(error){
    res.status(500).json({message: 'Error add to cart', error});
  }
});

//Lấy giỏ hàng
router.get('/cart/:userId', async(req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId}).populate('productId');
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
});
// Cập nhật mã vận đơn của đơn hàng theo ID
router.put('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { shippingCode } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id, 
      { shippingCode }, 
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating tracking number', error });
  }
});

//Xóa đơn hàng
router.delete('/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
});

// POST /orders
router.post('/orders', async (req, res) => { //tạo đơn hàng
  try {
    const { items, phone, address, shippingCode } = req.body;

    // Tạo đối tượng đơn hàng
    const order = new Order({
      items,
      phone,
      address,
      shippingCode,
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    const savedOrder = await order.save();

    // Trả về thông tin đơn hàng, bao gồm cả ngày giờ tạo
    res.status(201).json({
      message: 'Order placed successfully',
      orderid: savedOrder._id, // Trả về _id của đơn hàng như orderid
      createdAt: savedOrder.createdAt, // Trả về ngày giờ tạo đơn hàng
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order', error });
  }
});


// GET /orders/:id
router.get('/orders/:id', async (req, res) => { //route xem chi tiết đơn hàng
  try {
    const { id } = req.params;

    // Tìm kiếm đơn hàng theo _id
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve order', error });
  }
});

//Lấy toàn bộ đơn hàng(admin)
router.get('/orders',  async (req, res) => {
  try {
    const orders = await Order.find(); // Lấy tất cả đơn hàng
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders', error });
  }
});


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
router.post('/shoes',  async (req, res) => {
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
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 8, 1);
    const query = { name: new RegExp(searchTerm, 'i') }; //tìm kiếm theo tên không pb hoa thường

    const totalItems = await Shoe.countDocuments(query); //đếm tổng số sản phẩm
    const totalPages = Math.max(1, Math.ceil(totalItems / limit)); // tính số trang
    const shoes = await Shoe.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.json({ shoes, totalPages, currentPage: page, totalItems });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Endpoint xóa giày theo ID
router.delete('/shoes/:id',async (req, res) => {
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
router.post('/login', checkPassword, (req, res) => {
  res.json({ message: 'Welcome to admin page',
    user: {
      role: 'admin'
    }
   });
});

module.exports = router;
