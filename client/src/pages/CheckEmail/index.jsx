import { Card, Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "./style.css";
import { checkEmail } from "../../api";
import Notification from "../../utils/Notification";

const CheckEmail = () => {

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const result = await checkEmail(values);

      if (result.success) {
        //- truyền dữ liệu của user đã xác minh email sang bên checkpassword
        //- bên đó sẽ nhận thông qua useLocation
        navigate("/password", {
          state: result.data
        });
      }

      if (result.error) {
        Notification("error", "Thông báo", "Email không tồn tại!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="containerEmail">
      <Card className="cardEmail">
        {/* Icon User */}
        <div className="iconEmail">
          <UserOutlined />
        </div>

        {/* Title */}
        <h3 className="titleEmail">Welcome to Chat App!</h3>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="formEmail"
        >
          {/* Email Input */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" }
            ]}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className="inputEmail"
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="buttonEmail"
            >
              Let&apos;s Go
            </Button>
          </Form.Item>
        </Form>

        {/* Register Link */}
        <p className="linkEmail">
          New User?{" "}
          <Link to="/register">Register</Link>
        </p>
      </Card>
    </div>
  );
};

export default CheckEmail;
