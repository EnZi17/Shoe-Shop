require('dotenv').config({ path: './src/.env' });
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const indexRouter = require('./routes/index');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://enzi:thoenzi117@cluster0.uomnk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function() {
  console.log("Kết nối thành công tới MongoDB!");
});


// Sử dụng router chính
app.use('/api', indexRouter);


const PORT =  9000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

