const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {  //xác nhận người dùng hợp lệ
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //giải mã token hợp lệ ko
    req.user = decoded; //hợp lệ->gắn info user 
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminMiddleware = (req, res, next) => { // xác nhận đó là admin
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin only' });
  }
};

module.exports = { authMiddleware, adminMiddleware };