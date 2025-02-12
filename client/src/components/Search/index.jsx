import { useCallback, useEffect, useState } from "react";
import { Modal, Input, List, Avatar, Spin, Button } from "antd";
import { SearchOutlined, UserAddOutlined, CloseOutlined } from "@ant-design/icons";
import { searchUser as apisearch } from "../../api";
import Notification from "../../utils/Notification";

const SearchUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSearchUser([]); // Xóa kết quả tìm kiếm khi đóng modal
    setSearch("");
  };

  const handleSearchUser = useCallback(async () => {
    if (!search.trim()) return;

    try {
      setLoading(true);
      const response = await apisearch({ search });

      if (response?.data) {
        setSearchUser(response.data);
      } else {
        setSearchUser([]);
        Notification('warning', "Thông báo", "Không tìm thấy người dùng");
      }
    } catch (error) {
      Notification('warning', "Thông báo", "Không tìm thấy người dùng");
      console.log(error)
    } finally {
      setLoading(false);
    }
  }, [search])

  useEffect(() => {
    if (search) {
      handleSearchUser();
    }
  }, [search, handleSearchUser]);

  return (
    <>
      <Button onClick={showModal} icon={<UserAddOutlined />}>
      </Button>

      <Modal
        title="Tìm kiếm người dùng"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        closeIcon={<CloseOutlined />}
      >
        {/* Input tìm kiếm */}
        <Input
          placeholder="Nhập tên hoặc email..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          allowClear
        />

        {/* Danh sách kết quả */}
        <div style={{ marginTop: 10, maxHeight: 300, overflowY: "auto" }}>
          {loading ? (
            <Spin tip="Đang tìm kiếm..." style={{ display: "flex", justifyContent: "center", marginTop: 20 }} />
          ) : searchUser.length > 0 ? (
            <List
              dataSource={searchUser}
              renderItem={(user) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={user.profile_pic} />}
                    title={user.name}
                    description={user.email}
                  />
                </List.Item>
              )}
            />
          ) : (
            <p style={{ textAlign: "center", color: "#999", marginTop: 10 }}>Không tìm thấy người dùng!</p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default SearchUser;
