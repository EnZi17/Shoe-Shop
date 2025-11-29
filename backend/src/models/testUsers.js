const mongoose = require('mongoose');
const User = require('./users');

async function run() {
  try {
    // Kết nối tới MongoDB Atlas
    await mongoose.connect('mongodb+srv://minhthongvo170106_db_user:maiNAvuANbmFHII2@cluster0.vdtlau7.mongodb.net/test');
    console.log('✅ Kết nối thành công!');

    // Tạo thử một user
    const newUser = await User.create({
      username: 'khang123',
      email: 'khang@example.com',
      password: '123456',
      fullName: 'Le Duy Khang',
      phone: '0901234567',
      address: 'Da Nang'
    });

    console.log('👤 User mới tạo:', newUser);
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
