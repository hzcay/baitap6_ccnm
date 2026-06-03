const { body, validationResult } = require("express-validator");

const registerRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên không được để trống")
    .isLength({ min: 2, max: 50 })
    .withMessage("Tên phải từ 2 đến 50 ký tự"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),

  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu tối thiểu 6 ký tự"),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Mật khẩu xác nhận không khớp");
    }
    return true;
  }),
];

const verifyOtpRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),

  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP không được để trống")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP phải có 6 ký tự"),
];

const loginRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),

  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống"),
];

const forgotPasswordValidation = [
  body("email")
    .isEmail()
    .withMessage("Email không hợp lệ"),
];

const resetPasswordValidation = [
  body("email")
    .isEmail()
    .withMessage("Email không hợp lệ"),

  body("otpCode")
    .notEmpty()
    .withMessage("OTP không được để trống"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới phải có ít nhất 6 ký tự"),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Mật khẩu xác nhận không khớp");
    }
    return true;
  }),
];

const editProfileValidation = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Tên không được để trống"),

  body("phone")
    .optional()
    .isLength({ min: 9, max: 20 })
    .withMessage("Số điện thoại không hợp lệ"),

  body("address")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Địa chỉ tối đa 255 ký tự"),

  body("avatar")
    .optional()
    .isURL()
    .withMessage("Avatar phải là URL hợp lệ"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

module.exports = {
  registerRules,
  verifyOtpRules,
  loginRules,
  forgotPasswordValidation,
  resetPasswordValidation,
  editProfileValidation,
  validate,
};