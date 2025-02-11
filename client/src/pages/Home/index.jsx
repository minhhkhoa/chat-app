import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { userDetail } from "../../api";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { logout, setUser } from '../../redux/userSlice';
import Notification from '../../utils/Notification';
import { Layout } from 'antd';
import Sidebar from '../../components/Sidebar/Sidebar';
const { Sider, Content } = Layout;
import logo from "../../assets/logo.png";
import "./style.css";

function Home() {
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
      }

      if (result.error) {
        //- nếu nó sửa token trong cookies thì chuyển nó về trang /email bắt login lại thì sẽ làm mới được token
        Notification("error", "Thông báo", "Đừng có mà tí toáy linh tinh!");
        dispatch(logout());
        navigate("/email");
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, navigate])

  useEffect(() => {
    dataUser();
  }, [dataUser]);

  return (
    <Layout className="layout-container">
      {/* Sidebar */}
      <Sider
        width={300}
        className={`sidebar ${!basePath ? "hidden" : ""}`}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <Sidebar />
      </Sider>

      {/* Content */}
      <Layout>
        <Content className={`message-section ${basePath ? "hidden" : "active"}`}>
          <Outlet />
        </Content>

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