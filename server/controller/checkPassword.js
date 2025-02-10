const UserModel = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function checkPassword(request, response) {
  try {
    const { password, userId } = request.body;

    const user = await UserModel.findById(userId);

    //- so sanh mat khau xem co chinh xac khong
    const verifyPassword = await bcryptjs.compare(password, user.password);

    if (!verifyPassword) {
      return response.status(400).json({
        message: "Please check password",
        error: true
      });
    }

    //-Tạo dữ liệu chứa trong token ở web khi được lưu
    const tokenData = {
      id: user._id,
      email: user.email
    }

    //-Tạo token với jwt.sign()
    const token = await jwt.sign(tokenData, process.env.JWT_SECREAT_KEY, { expiresIn: '1d' });
    //-Tham số 1: Dữ liệu cần mã hóa (tokenData).
    //-Tham số 2: Secret Key (process.env.JWT_SECREAT_KEY) để mã hóa token.
    //-Tham số 3: { expiresIn: '1d' } nghĩa là token có hạn sử dụng 1 ngày.


    //-Cài đặt cookie để lưu token
    const cookieOptions = {
      http: true,
      secure: true
    }

    //-Lưu token vào cookie để người dùng không phải đăng nhập lại sau mỗi request.
    return response.cookie('token', token, cookieOptions).status(200).json({
      message: "Login successfully",
      token: token,
      success: true
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true
    })
  }
}

module.exports = checkPassword;