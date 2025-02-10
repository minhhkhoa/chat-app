import { useEffect } from "react";
import { Card, Form, Input, Button, Avatar } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.css"; // Import file CSS
import { checkPassword } from "../../api";
import Notification from "../../utils/Notification";

const CheckPassWord = () => {
  const location = useLocation();
  const navigate = useNavigate();

  //- nếu checkEmail chưa nhập mà biết đường dẫn /password thì location?.state?.name
  //- se ko có gia tri nen se cho về trang /email
  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email')
    }
  }, [location?.state?.name, navigate])

  const handleSubmit = async (values) => {
    values = {
      ...values,
      userId: location.state._id
    }

    try {
      const result = await checkPassword(values);

      if (result.success) {
        const token = result.token;
        Notification("success", "Thông báo", "Đăng nhập thành công!");
        
        // navigate("/home");
      }

      if (result.error) {
        Notification("error", "Thông báo", "Mật khẩu không chính xác!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="containerPassword">
      <Card className="cardPassword">
        {/* Avatar + Tên Người Dùng */}
        <div className="avatar-containerPassword">
          <Avatar
            size={70}
            src={location?.state?.profile_pic}
            className="user-avatarPassword"
          >
            {location?.state?.name}
          </Avatar>
          <h2 className="user-namePassword">{location?.state?.name}</h2>
        </div>

        {/* Form Đăng Nhập */}
        <Form layout="vertical" onFinish={handleSubmit} className="formPassword">
          {/* Password */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              placeholder="Enter your password"
              className="inputPassword"
            />
          </Form.Item>

          {/* Nút Login */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="submit-buttonPassword">
              Login
            </Button>
          </Form.Item>
        </Form>

        {/* Quên mật khẩu */}
        <p className="forgot-password">
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot password?
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default CheckPassWord;
