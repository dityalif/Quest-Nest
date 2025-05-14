const userRepository = require('../repositories/users.repository');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRegex = /^.{6,}$/; // minimal 6 karakter

const baseResponse = (res, success, code, message, data) => {
  res.status(code).json({ success, message, data });
};

exports.register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return baseResponse(res, false, 400, "Email, password, and name are required", null);
  }
  if (!emailRegex.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format", null);
  }
  if (!passRegex.test(password)) {
    return baseResponse(res, false, 400, "Password must be at least 6 characters", null);
  }
  try {
    const emailExists = await userRepository.checkEmailExists(email);
    if (emailExists) {
      return baseResponse(res, false, 400, "Email already used", null);
    }
    const user = await userRepository.register({ email, password, name });
    baseResponse(res, true, 201, "Register success", user);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", null);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return baseResponse(res, false, 400, "Email and password are required", null);
  }
  try {
    const user = await userRepository.login(email, password);
    if (!user) {
      return baseResponse(res, false, 400, "Invalid email or password", null);
    }
    baseResponse(res, true, 200, "Login success", user);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", null);
  }
};