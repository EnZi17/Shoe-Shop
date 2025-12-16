const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); //mã hóa mật khẩu trước khi lưu vào csdl

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, //giá trị username chỉ xuất hiện duy nhất 1 lần 
    trim: true,
    minlength: 3 //>= 3 kí tự
  },
  email: {
    type: String,
    required: true,
    unique: true, //
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user' //mặc định user
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]
}, {
  timestamps: true // tạo ra 2 fields createdAt và updatedAt
});

// Hash password trước khi lưu
userSchema.pre('save', async function(next) { //
  if (!this.isModified('password')) return next(); //mk chưa thay đổi thì return
  this.password = await bcrypt.hash(this.password, 10); //có thay đổi(hoặc tạo mới user), hash mk có độ mạnh salt = 10
  next(); //tiếp tục thao tác save
});

// Method kiểm tra password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
//bcrypt + salt: mk đc băm bởi thuật toán và salt sẽ thêm 1 chuỗi kí tự (mỗi máy mỗi khác) vào mk 