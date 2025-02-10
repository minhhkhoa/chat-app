import logo from '../assets/logo.png';
import "./style.css";

// eslint-disable-next-line react/prop-types
const AuthLayouts = ({ children }) => {
  return (
    <>
      <header className="header">
        <img src={logo} alt="logo" width={180} height={60} />
      </header>
      {children}
    </>

  )
}

export default AuthLayouts