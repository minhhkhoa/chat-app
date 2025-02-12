import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { userDetail } from "../../api";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { logout, setOnlineUser, setSocketConnection, setToken, setUser } from '../../redux/userSlice';
import Notification from '../../utils/Notification';
import { Layout } from 'antd';
import Sidebar from '../../components/Sidebar/Sidebar';
import logo from "../../assets/logo.png";
import io from "socket.io-client";
import "./style.css";

function Home() {
  // eslint-disable-next-line no-unused-vars
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname === "/";


  const dataUser = useCallback(async () => {
    try {
      const result = await userDetail();

      if (result.success) {
        //- lưu user vào redux khi fetch thành công
        dispatch(setUser(result.data));
        dispatch(setToken(localStorage.getItem("token")));
      }

      if (result.error) {
        //- nếu nó sửa token trong cookies thì chuyển nó về trang /email bắt login lại thì sẽ làm mới được token
        Notification("error", "Thông báo", "Đừng có mà tí toáy linh tinh!");
        dispatch(logout());
        console.log("first")
        navigate("/email");
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, navigate]);


  useEffect(() => {
    dataUser();
  }, [dataUser]);

  //-socket connect
  useEffect(() => {
    const socketConnect = io('http://localhost:2302', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    //- lay ra dua onl
    socketConnect.on('onlineUser', (data) => {
      dispatch(setOnlineUser(data));
    })

    dispatch(setSocketConnection(socketConnect));

    return () => {
      socketConnect.disconnect();
    }
 
  }, [dispatch]);


  return (
    <Layout className="layout-container">
      {/* Sidebar */}
      <div
        width={300}
        className={`sidebar ${!basePath ? "hidden" : ""}`}
      >
        <Sidebar />
      </div>

      {/* Content */}
      <Layout>
        <div className={`message-section ${basePath ? "hidden" : "active"}`}>
          <Outlet />
        </div>

        {/* Hiển thị logo khi ở trang chủ */}
        {basePath && (
          <div className="center-container">
              <img src={logo} width={250} alt="logo" />
              <p>Select user to send message</p>
          </div>
        )}
      </Layout>
    </Layout>
  );
}

export default Home;