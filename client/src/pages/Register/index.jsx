import { useState } from "react";
import { Card, Form, Input, Button, Tabs, Image, Radio } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import Notification from "../../utils/Notification";
import { register } from "../../api";

import dog from "../../assets/dog.png";
import cat from "../../assets/cat.png";
import chicken from "../../assets/chicken.png";
import monkey from "../../assets/monkey.png";
import elephant from "../../assets/elephant.png";

import naruto from "../../assets/naruto.png";
import goku from "../../assets/goku.png";
import zoro from "../../assets/zoro.png";
import luffy from "../../assets/luffy.png";
import tazigo from "../../assets/tazigo.png";

import girl from "../../assets/girl.png";
import boy from "../../assets/boy.png";
import boss from "../../assets/boss.png";
import man from "../../assets/man.png";
import woman from "../../assets/woman.png";

const photoGroups = {
  animal: [
    { name: "Cat", url: cat },
    { name: "Dog", url: dog },
    { name: "chicken", url: chicken },
    { name: "monkey", url: monkey },
    { name: "elephant", url: elephant },
  ],
  anime: [
    { name: "naruto", url: naruto },
    { name: "goku", url: goku },
    { name: "zoro", url: zoro },
    { name: "luffy", url: luffy },
    { name: "tazigo", url: tazigo },
  ],
  human: [
    { name: "girl", url: girl },
    { name: "boy", url: boy },
    { name: "boss", url: boss },
    { name: "man", url: man },
    { name: "woman", url: woman },
  ],
};

const Register = () => {
  const navigate = useNavigate()

  const [form] = Form.useForm();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleSubmit = async (values) => {
    try {
      const data = {
        ...values,
        profile_pic: selectedPhoto
      }
      const result = await register(data);

      if(result.success){
        Notification("success", "Thông báo", "Chúc mừng bạn đã đăng ký tài khoản thành công!");
        navigate("/email");
      }
      
      if(result.error){
        Notification("error", "Thông báo", "Email đã tồn tại!");
      }

      form.resetFields();
      setSelectedPhoto(null);
    } catch (error) {
      Notification("error", "Thông báo", error);
    }
  }

  return (
    <div className="pageRegister">
      <Card title="Welcome to Chat App!" className="register-card">
        <Form layout="vertical" form={form} onFinish={handleSubmit} className="form">
          {/* Name */}
          <div>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter your name!" }]}>
              <Input placeholder="Enter your name" />
            </Form.Item>

            {/* Email */}
            <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email!" }]}>
              <Input placeholder="Enter your email" type="email" />
            </Form.Item>

            {/* Password */}
            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password!" }]}>
              <Input.Password placeholder="Enter your password" autoComplete="new-password" />
            </Form.Item>
          </div>

          <hr style={{ display: 'flex', margin: "10px 10px" }} />

          <div className="blockPhoto">
            {/* Chọn ảnh đại diện */}
            <Form.Item
              label="Choose a profile photo"
              style={{ fontWeight: '500' }}
              rules={[{ required: true, message: "Please select a profile photo!" }]}>
              <Tabs
                defaultActiveKey="animal"
                items={Object.entries(photoGroups).map(([group, images]) => ({
                  key: group,
                  label: group.toUpperCase(),
                  children: (
                    <Radio.Group onChange={(e) => setSelectedPhoto(e.target.value)}>
                      {images.map((photo) => (
                        <Radio key={photo.name} value={photo.url} style={{ margin: "5px" }}>
                          <Image src={photo.url} width={50} height={50} style={{ borderRadius: "5px" }} />
                        </Radio>
                      ))}
                    </Radio.Group>
                  ),
                }))}
              />
            </Form.Item>

            {/* Register Button */}
            <Form.Item>
              <Button type="primary" htmlType="submit" className="register-button">
                Register
              </Button>
            </Form.Item>
          </div>
        </Form>

        {/* Link to Login */}
        <p style={{ textAlign: "center" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
