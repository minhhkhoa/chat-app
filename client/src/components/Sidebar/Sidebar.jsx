import { Button, Avatar, Modal } from "antd";
import { MessageOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import "./style.css";
import { logout } from "../../api";
import { useNavigate } from "react-router-dom";
import { logout as loggout } from '../../redux/userSlice';
import SearchUser from "../Search";

export function Driver() {
  return (
    <>
      <div style={{
        padding: 0.5,
        backgroundColor: "black",
        margin: "4px 0",
        width: "250px"
      }}>
      </div>
    </>
  );
}

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state?.user);
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const [allUser, setAllUser] = useState([]);

  useEffect(() => {
    if (socketConnection) {
      // Yêu cầu backend gửi danh sách conversation cho user hiện tại
      socketConnection.emit('sidebar', user._id);

      socketConnection.on('conversation', (data) => {
        // Xử lý dữ liệu để lấy thông tin người đối thoại
        const conversationUserData = data.map((conversationUser) => {
          // Nếu hai bên là giống nhau (hiếm gặp) thì chọn sender
          if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender
            };
          }
          // Nếu receiver không phải là user hiện tại, nghĩa là đó là người đối thoại
          else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender
            };
          }
        });
        setAllUser(conversationUserData);
      });

      return () => {
        socketConnection.off('conversation');
      };
    }
  }, [socketConnection, user]);

  // Modal hiển thị thông tin cá nhân
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Logout
  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        dispatch(loggout());
        navigate("/email");
        localStorage.clear();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Khi click vào một conversation item, điều hướng đến trang chat với user đó
  const handleConversationClick = (userDetails) => {
    // Giả sử bạn dùng đường dẫn: /{userId} để mở trang chat
    navigate(`/${userDetails._id}`, { state: userDetails });
  };

  console.log(allUser);

  // console.log(allUser);

  return (
    <div className="sidebar">
      <div className="sidebar-left">
        <div className="block block-one">
          <Button icon={<MessageOutlined />} />
          <SearchUser />
        </div>
        <div className="block block-two">
          <Avatar
            size={40}
            src={user.profile_pic}
            className="user-avatarPassword"
            onClick={showModal}
          >
            {user.name}
          </Avatar>
          <Modal
            title="Profile detail"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <div>
              <p>Name: </p>
              <h3>{user.name}</h3>
              <p>Photo</p>
              <Avatar
                size={70}
                src={user.profile_pic}
                className="user-avatarPassword"
              >
                {user.name}
              </Avatar>
            </div>
          </Modal>
          <Button icon={<LogoutOutlined />} onClick={handleLogout} />
        </div>
      </div>
      <div className="sidebar-right">
        <div className="block-top">
          <h1 style={{ fontSize: 38, marginLeft: 30, marginTop: 10, marginBottom: 10 }}>
            <i>Message</i>
          </h1>
        </div>
        <Driver />
        <div className="block-bottom">
          {allUser.length === 0 ? (
            <div className="no-users">
              <div className="icon-container"></div>
              <p className="messageSidebar">Explore users to start a conversation with.</p>
            </div>
          ) : (
            <div className="conversationList">
              {allUser.map((conversation, index) => (
                <div
                  key={index}
                  className="conversationItem"
                  onClick={() => handleConversationClick(conversation.userDetails)}
                >
                  <Avatar size={40} src={conversation.userDetails?.profile_pic} />
                 
                  <div className="conversationInfo">
                    <p className="conversationName">{conversation.userDetails?.name}</p>
                    <p className="conversationLastMessage">
                      {conversation.lastMsg.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
