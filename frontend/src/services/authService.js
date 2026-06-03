import api from "../api/axios";

// Đăng ký
export const registerAPI = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// Xác thực OTP
export const verifyOtpAPI = async (data) => {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
};

// Đăng nhập
export const loginAPI = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

// Quên mật khẩu
export const forgotPasswordAPI = async (data) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

// Reset mật khẩu
export const resetPasswordAPI = async (data) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

// Cập nhật profile
export const editProfileAPI = async (data) => {
  // Token sẽ được Interceptor tự động thêm vào Header
  const response = await api.put("/auth/edit-profile", data);
  return response.data;
};

// Lấy thông tin profile
export const getProfileAPI = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};