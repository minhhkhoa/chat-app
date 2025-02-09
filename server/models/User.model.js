const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "provide name"] //-"provide name" → Đây là thông báo lỗi nếu không nhập giá trị.
  },
  email: {
    type: String,
    required: [true, "provide email"], 
    unique: true
  },
  password: {
    type: String,
    required: [true, "provide password"]
  },
  profile_pic: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel;