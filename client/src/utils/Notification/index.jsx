import { notification } from 'antd';

const Notification = (type, message, description) => {
  notification[type]({
    message: message,
    description: description,
    placement: 'topRight', // Vị trí hiển thị
    duration: 3, // Thời gian tồn tại (giây)
  });
};

export default Notification;
