import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Avatar, Input, Upload, message } from 'antd';
import { UploadOutlined, SendOutlined } from '@ant-design/icons';
import { useParams, useLocation } from 'react-router-dom';
import uploadFile from '../../helpers/uploadFile'; // Import hàm upload lên Cloudinary
import "./style.css";

function Message() {
  const user = useSelector(state => state?.user);
  const params = useParams();
  const online = user.onlineUser.includes(params.userId);
  const socketConnection = useSelector(state => state?.user.socketConnection);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId);
    }
  }, [socketConnection, params.userId]);

  const location = useLocation();
  const CurrentUserInbox = location.state;

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Hàm gửi tin nhắn
  const onFinish = async (values) => {
    setUploading(true);

    try {
      let uploadedFileUrls = [];

      // Nếu có file -> Upload lên Cloudinary
      if (fileList.length > 0) {
        const uploadPromises = fileList.map(file => uploadFile(file)); // Sử dụng trực tiếp file
        const uploadedFiles = await Promise.all(uploadPromises);
        uploadedFileUrls = uploadedFiles.map(file => file.secure_url);
      }

      // Chuẩn bị dữ liệu gửi về backend
      const formData = new FormData();
      formData.append("senderId", user._id);
      formData.append("receiverId", params.userId);
      formData.append("message", values["content-send"] || "");
      uploadedFileUrls.forEach(url => formData.append("files[]", url));

      console.log("Dữ liệu gửi đi:", Object.fromEntries(formData.entries()));

    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      message.error("Đã xảy ra lỗi khi gửi tin nhắn.");
    } finally {
      setUploading(false);
    }
  };




  // Props của Upload
  const uploadProps = {
    onRemove: (file) => {
      setFileList(fileList.filter(item => item.uid !== file.uid));
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <>
      <div className="containerMessage">
        {/* Header */}
        <div className="headerMessage">
          <div className="imgMessage">
            <Avatar src={CurrentUserInbox?.profile_pic} size={60} />
          </div>
          <div className="nameMessage">
            <h3>{CurrentUserInbox?.name}</h3>
            {online ? <p style={{ color: 'green' }}>Online</p> : <p>Offline</p>}
          </div>
        </div>

        {/* Nội dung tin nhắn */}
        <div className="contentMessage"></div>

        {/* Form gửi tin nhắn */}
        <div className="send-message">
          <Form name="sendMessage" onFinish={onFinish} style={{ maxWidth: 800 }}>
            <div className="control">
              {/* Upload file */}
              <Upload {...uploadProps} className='uploadfile'>
                <Button icon={<UploadOutlined />}>Chọn File</Button>
              </Upload>

              {/* Input nhập tin nhắn */}
              <Form.Item name="content-send">
                <Input className='inputt' placeholder="Nhập tin nhắn..." />
              </Form.Item>

              {/* Nút gửi tin nhắn */}
              <Form.Item label={null}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={uploading}
                  icon={<SendOutlined />}
                >
                  {uploading ? 'Đang gửi...' : 'Gửi'}
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Message;
