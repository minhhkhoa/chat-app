const url = `https://api.cloudinary.com/v1_1/dj6jqey93/auto/upload`; // Sửa CLOUD_NAME

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chat-app"); // Đúng với Upload Preset

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const responseData = await response.json();
    if (!response.ok) throw new Error(responseData.error?.message || "Upload thất bại");

    return responseData; // Trả về dữ liệu từ Cloudinary
  } catch (error) {
    console.error("Lỗi upload file lên Cloudinary:", error);
    throw error;
  }
};

export default uploadFile;
