import { Button, Avatar, Modal } from "antd";
import { MessageOutlined, UserAddOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import "./style.css";
import { logout } from "../../api";
import { useNavigate } from "react-router-dom";
import { logout as loggout} from '../../redux/userSlice';

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const user = useSelector(state => state?.user);
  console.log(user);

  //-start modal
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
  //-end modal

  //-start logout
  const handleLogout = async () => {
    try {
      const result = await logout();

      if (result.success) {
        dispatch(loggout());
        navigate("/email");
        localStorage.clear()
      }

    } catch (error) {
      console.log(error);
    }
  }
  //-end logout

  return (
    <div className="sidebar">
      <div className="sidebar-left">
        <div className="block block-one">
          <Button icon={<MessageOutlined />}></Button>
          <Button icon={<UserAddOutlined />}></Button>
        </div>
        <div className="block block-two">

          <Avatar
            size={40}
            src={user.profile_pic}
            className="user-avatarPassword"
            onClick={showModal}
          >
            {location?.state?.name}
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
                onClick={showModal}
              >
                {location?.state?.name}
              </Avatar>
            </div>
          </Modal>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          />
        </div>
      </div>
      <div className="sidebar-right">
        <h1>Message</h1>
      </div>
    </div>
  )
}

export default Sidebar;