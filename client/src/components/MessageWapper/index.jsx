import { useParams } from "react-router-dom";
import Message from "../Message/index";

const MessageWrapper = () => {
  const { userId } = useParams();
  // Sử dụng key dựa trên userId để buộc remount Message mỗi khi userId thay đổi
  return <Message key={userId} />;
};

export default MessageWrapper;
