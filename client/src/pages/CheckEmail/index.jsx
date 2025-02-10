import { useState } from "react";
import { Card, Form, Input, Button } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "./style.css";

const CheckEmail = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState({ email: "" });

  const handleOnChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (values) => {
    console.log("Submitted email:", values.email);
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
              value={data.email}
              onChange={handleOnChange}
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
