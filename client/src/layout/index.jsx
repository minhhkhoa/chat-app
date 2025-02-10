import logo from '../assets/logo.png';
import "./style.css";
import { useLocation } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const AuthLayouts = ({ children }) => {
  const location = useLocation();

  return (
    <>
      {
        location.pathname ?
          <></> :
          <header className="header">
            <img src={logo} alt="logo" width={180} height={60} />
          </header>
      }
      
      {children}
    </>

  )
}

export default AuthLayouts