/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Avatar, Input, Upload, message, Spin } from "antd";
import { UploadOutlined, SendOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useParams, useLocation } from "react-router-dom";
import moment from "moment";
import uploadFile from "../../helpers/uploadFile";
import "./style.css";

function Message() {
  const user = useSelector((state) => state?.user);
  const params = useParams();
  const online = user.onlineUser.includes(params.userId);
  const socketConnection = useSelector((state) => state?.user.socketConnection);

  const [allMessage, setAllMessage] = useState([]); // Danh sách tin nhắn
  const [previewFiles, setPreviewFiles] = useState([]); // Danh sách file đã chọn (để upload)
  const [messageContent, setMessageContent] = useState(""); // Nội dung tin nhắn

  const location = useLocation();
  const CurrentUserInbox = location.state;

  // Ref dùng để cuộn xuống tin nhắn cuối cùng
  const messagesEndRef = useRef(null);

  // Khi chọn file, tải lên Cloud ngay lập tức
  const handleFileSelect = async ({ file }) => {
    const fileType = file.type.split("/")[0]; // Lấy loại file (image, video, ...)
    // Thêm file vào danh sách với trạng thái loading
    const newFile = {
      file,
      url: "", // Chưa có URL từ Cloud
      type: fileType,
      loading: true, // Đang tải lên
    };

    setPreviewFiles((prev) => [...prev, newFile]);

    try {
      // Gọi API uploadFile để tải lên Cloud
      const uploadedFile = await uploadFile(file);
      // Cập nhật danh sách, thay Spin bằng URL từ Cloud
      setPreviewFiles((prev) =>
        prev.map((f) =>
          f.file === file ? { ...f, url: uploadedFile.secure_url, loading: false } : f
        )
      );
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

    // Tạo FormData để gửi dữ liệu lên backend
    const formData = new FormData();
    formData.append("senderId", user._id);
    formData.append("receiverId", params.userId);
    formData.append("message", messageContent);
    successfulUploads.forEach((file) => formData.append("files", file.url));
    const urlFile = Object.fromEntries(formData.entries()).files;

    if (messageContent || urlFile) {
      const data = {
        sender: user._id,
        receiver: params.userId,
        text: messageContent,
        urlFile: urlFile,
        msgByUserId: user._id,
        createdAt: new Date().toISOString(),
      };

      if (socketConnection) {
        socketConnection.emit("new message", data);
      }
    }

    // Reset tin nhắn và file preview
    setMessageContent("");
    setPreviewFiles([]);
  };

  // Lắng nghe sự kiện "message" từ server khi userId thay đổi
  useEffect(() => {
    if (socketConnection) {
      // Reset lại danh sách tin nhắn cũ khi chuyển chat
      setAllMessage([]);
      // Yêu cầu load tin nhắn cho userId mới
      socketConnection.emit("message-page", params.userId);

      const handleMessage = (data) => {
        // Nếu backend trả về toàn bộ danh sách tin nhắn, set luôn state
        setAllMessage(data);
      };

      socketConnection.on("message", handleMessage);

      return () => {
        socketConnection.off("message", handleMessage);
      };
    }
  }, [socketConnection, params.userId]);

  // Cuộn xuống tin nhắn cuối cùng mỗi khi danh sách tin nhắn thay đổi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [allMessage]);

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
          {allMessage.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.msgByUserId === user._id ? "sent" : "received"}`}
            >
              {msg.text && <p className="messageText">{msg.text}</p>}
              {msg.urlFile && msg.urlFile !== "" && (
                msg.urlFile.includes("/video/") ? (
                  <video src={msg.urlFile} controls className="messageVideo" />
                ) : (
                  <img src={msg.urlFile} alt="sent file" className="messageImage" />
                )
              )}
              {msg.createdAt && (
                <span className="messageTime">
                  {moment(msg.createdAt).format("h:mm A")}
                </span>
              )}
            </div>
          ))}
          {/* Phần trống dùng để cuộn đến */}
          <div ref={messagesEndRef} />
        </div>

        {/* Form gửi tin nhắn */}
        <div className="send-message">
          <Form onFinish={onFinish} style={{ maxWidth: 800 }}>
            {/* Hiển thị Preview file đã chọn */}
            <div className="previewContainer">
              {previewFiles.map((fileObj, index) => (
                <div key={index} className="previewItem">
                  {fileObj.loading ? (
                    <Spin size="large" className="spin" />
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
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  disabled={previewFiles.some((f) => f.loading)}
                >
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

//-nn
