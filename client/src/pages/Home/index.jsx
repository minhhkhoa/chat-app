import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { userDetail } from "../../api";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { logout, setUser } from '../../redux/userSlice';
import Notification from '../../utils/Notification';

function Home() {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();


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
    <>
      this is page home
      <Outlet/>
    </>
  )
}

export default Home;