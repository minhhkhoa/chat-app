import { Button, Avatar, Modal } from "antd";
import {
  MessageOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
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
  )
}

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const user = useSelector(state => state?.user);
  // eslint-disable-next-line no-unused-vars
  const [allUser, setAllUser] = useState([]);

  //-start modal detail
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
          <SearchUser />
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
        <div className="block-top">
          <h1 style={{ fontSize: 38, marginLeft: 30, marginTop: 10, marginBottom: 10 }}>
            <i>Message</i>
          </h1>
        </div>
        <Driver />
        <div className="block-bottom">
          {allUser.length === 0 && (
            <div className="no-users">
              <div className="icon-container">
              </div>
              <p className="messageSidebar">Explore users to start a conversation with.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Sidebar;