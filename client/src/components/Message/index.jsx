import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Avatar, Input, Upload, message } from 'antd';
import { UploadOutlined, SendOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import "./style.css";

function Message() {
  const user = useSelector(state => state?.user);
  const params = useParams();

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Xử lý upload file
  const handleUpload = async () => {
    if (fileList.length === 0) return;

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });

    setUploading(true);
    try {
      const res = await fetch('https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log("Upload thành công:", data);
      message.success('Upload successfully.');

      // Xóa danh sách file sau khi upload thành công
      setFileList([]);
    } catch (error) {
      message.error('Upload failed.');
      console.log(error)
    } finally {
      setUploading(false);
    }
  };

  // Xử lý gửi tin nhắn
  const onFinish = async (values) => {
    console.log('Tin nhắn:', values);

    // Nếu có file => Upload trước khi gửi tin nhắn
    if (fileList.length > 0) {
      await handleUpload();
    }

    message.success('Tin nhắn đã được gửi!');
  };

  // Props của Upload Ant Design
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

  const online = user.onlineUser.includes(params.userId);


  return (
    <>
      <div className="containerMessage">
        {/* Header */}
        <div className="headerMessage">
          <div className="imgMessage">
            <Avatar src={user?.profile_pic} size={60} />
          </div>
          <div className="nameMessage">
            <h3>Toi la Adam</h3>
            {
              online ? <p style={{ color: 'green' }}>Online</p> : <p>Offline</p>
            }
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
