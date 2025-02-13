import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Avatar, Input, Upload, message } from "antd";
import { UploadOutlined, SendOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useParams, useLocation } from "react-router-dom";
import uploadFile from "../../helpers/uploadFile";
import "./style.css";

function Message() {
  const user = useSelector((state) => state?.user);
  const params = useParams();
  const online = user.onlineUser.includes(params.userId);
  const socketConnection = useSelector((state) => state?.user.socketConnection);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);
    }
  }, [socketConnection, params.userId]);

  const location = useLocation();
  const CurrentUserInbox = location.state;

  const [previewFiles, setPreviewFiles] = useState([]); // Danh sách file đã chọn
  const [messageContent, setMessageContent] = useState(""); // Nội dung tin nhắn

  // Khi chọn file
  const handleFileSelect = ({ file }) => {
    const fileType = file.type.split("/")[0]; // Lấy loại file (image, video, ...)
    const newFile = {
      file,
      url: URL.createObjectURL(file), // Tạo URL để preview
      type: fileType,
    };

    setPreviewFiles((prev) => [...prev, newFile]); // Thêm vào danh sách preview
  };

  // Xóa file đã chọn
  const handleRemoveFile = (index) => {
    setPreviewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Gửi tin nhắn
  const onFinish = async () => {
    const uploadedFiles = await Promise.all(
      previewFiles.map(async (fileObj) => {
        try {
          const uploadedFile = await uploadFile(fileObj.file);
          return { ...fileObj, url: uploadedFile.secure_url };
        } catch {
          message.error("Lỗi tải file!");
          return null;
        }
      })
    );

    const successfulUploads = uploadedFiles.filter((file) => file !== null);

    // Gửi dữ liệu lên backend
    const formData = new FormData();
    formData.append("senderId", user._id);
    formData.append("receiverId", params.userId);
    formData.append("message", messageContent);
    successfulUploads.forEach((file) => formData.append("files[]", file.url));

    console.log("Dữ liệu gửi:", Object.fromEntries(formData.entries()));
    message.success("Tin nhắn đã gửi!");

    // Reset
    setMessageContent("");
    setPreviewFiles([]);
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
            {online ? <p style={{ color: "green" }}>Online</p> : <p>Offline</p>}
          </div>
        </div>

        {/* Nội dung tin nhắn */}
        <div className="contentMessage">
          {/* Không cần preview giữ chỗ ở đây nữa */}
        </div>

        {/* Form gửi tin nhắn */}
        <div className="send-message">
          <Form onFinish={onFinish} style={{ maxWidth: 800 }}>
            {/* Hiển thị Preview file đã chọn */}
            <div className="previewContainer">
              {previewFiles.map((fileObj, index) => (
                <div key={index} className="previewItem">
                  {fileObj.type === "image" ? (
                    <img src={fileObj.url} alt="preview" className="image-preview" />
                  ) : (
                    <video src={fileObj.url} controls className="video-preview" />
                  )}
                  <Button
                    type="text"
                    icon={<CloseCircleOutlined />}
                    className="removeFileBtn"
                    onClick={() => handleRemoveFile(index)}
                  />
                </div>
              ))}
            </div>

            <div className="control">
              <Upload beforeUpload={() => false} onChange={handleFileSelect} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Chọn File</Button>
              </Upload>

              <Form.Item>
                <Input
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="inputMSG"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                  Gửi
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
