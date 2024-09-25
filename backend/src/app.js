
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const indexRouter = require('./routes/index');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { 
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function() {
  console.log("MongoDB connected!");
});



app.use('/api', indexRouter);


const PORT =  9000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

