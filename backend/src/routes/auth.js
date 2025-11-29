const express = require('express');
const router = express.Router();
const User = require('../models/users');

// Endpoints Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName, phone, address } = req.body;
    console.log('Received registration data:', req.body);
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Tạo user mới
    const user = new User({ 
      username, 
      email, 
      password,
      fullName,
      phone,
      address,
      role: 'user'
    });
    
    await user.save();
    console.log('User saved successfully:', user);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Endpoints Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;
    console.log('Login attempt:', { email, isAdmin, password });

    // Xử lý đăng nhập admin
    if (isAdmin) {
      if (password === "1") {
        return res.json({
          message: 'Admin login successful',
          user: {
            role: 'admin'
          }
        });
      }
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Xử lý đăng nhập user thông thường
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;