const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.model');

const getUserDetailsFromToken = async (token) => {

  if (!token || token==="") {
    return {
      message: "session out",
      logout: true,
    }
  }

  //-Giải mã token và xác minh tính hợp lệ. clg(decode) sẽ thấy nó có dạng obj giống tokenData bên checkpassword. Tức là nó sẽ giải mã như ban đầu nhập vào
  const decode = await jwt.verify(token, process.env.JWT_SECREAT_KEY);

  const user = await UserModel.findById(decode.id).select('-password');
  //-decode.id:
  //-Khi tạo token, dữ liệu chứa trong token có id của người dùng.
  //-Ở đây ta lấy id từ token để tìm người dùng trong database.

  return user;
}

module.exports = getUserDetailsFromToken;