const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Qua nhieu yeu cau. Vui long thu lai sau 15 phut.",
  },
});

const registerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Qua nhieu yeu cau. Vui long thu lai sau 10 phut.",
  },
});

const verifyOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Qua nhieu yeu cau. Vui long thu lai sau 10 phut.",
  },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "Bạn yêu cầu OTP quá nhiều lần. Vui lòng thử lại sau.",
  },
});

module.exports = {
  registerLimiter,
  verifyOtpLimiter,
  loginLimiter,
  forgotPasswordLimiter,
};
