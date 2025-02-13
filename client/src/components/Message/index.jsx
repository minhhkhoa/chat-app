import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Avatar, Input, Upload, message, Spin } from "antd";
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

  // Khi chọn file, tải lên Cloud ngay lập tức
  const handleFileSelect = async ({ file }) => {
    const fileType = file.type.split("/")[0]; // Lấy loại file (image, video, ...)

    // Thêm file vào danh sách với trạng thái loading
    const newFile = {
      file,
      url: "", // Chưa có URL từ cloud
      type: fileType,
      loading: true, // Đánh dấu đang tải lên
    };

    setPreviewFiles((prev) => [...prev, newFile]);

    try {
      // Gọi API uploadFile để tải lên Cloud
      const uploadedFile = await uploadFile(file);

      // Cập nhật danh sách, thay Spin bằng URL từ Cloud
      setPreviewFiles((prev) =>
        prev.map((f) => (f.file === file ? { ...f, url: uploadedFile.secure_url, loading: false } : f))
      );
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      message.error("Lỗi tải file!");
      // Nếu lỗi, loại bỏ file đó khỏi danh sách
      setPreviewFiles((prev) => prev.filter((f) => f.file !== file));
    }
  };

  // Xóa file đã chọn
  const handleRemoveFile = (index) => {
    setPreviewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Gửi tin nhắn
  const onFinish = async () => {
    // Lấy danh sách file đã tải lên thành công
    const successfulUploads = previewFiles.filter((file) => file.url !== "");

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
                  {fileObj.loading ? (
                    <Spin size="large" className="spin"/>
                  ) : fileObj.type === "image" ? (
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
                <Button type="primary" htmlType="submit" icon={<SendOutlined />} disabled={previewFiles.some(f => f.loading)}>
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
