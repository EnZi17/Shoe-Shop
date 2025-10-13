require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const indexRouter = require('./routes/index');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function() {
  console.log("MongoDB connected!");
});

app.use('/', indexRouter);

const PORT =  process.env.PORT||9000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});
