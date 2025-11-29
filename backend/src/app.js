require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const indexRouter = require('./routes/index');

// // Add new imports
const authRouter = require('./routes/auth'); // Tạo file này sau
const cookieParser = require('cookie-parser'); //thư viện đọc dữ liệu từ request của cookie

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function() {
  console.log("MongoDB connected!");
});

app.use('/', indexRouter);
app.use('/auth', authRouter); // Add auth routes

const PORT =  process.env.PORT||9000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});
