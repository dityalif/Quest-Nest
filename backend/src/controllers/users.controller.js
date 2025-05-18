const userRepository = require('../repositories/users.repository');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

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
    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    baseResponse(res, true, 200, "Login success", { user, token });
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", null);
  }
};

exports.getUserByEmail = async (req, res) => {
  const email = req.params.email;
  if (!email) {
    return baseResponse(res, false, 400, "Email is required", null);
  }
  try {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    baseResponse(res, true, 200, "User found", user);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", null);
  }
};

exports.getUserById = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return baseResponse(res, false, 400, "ID is required", null);
  }
  try {
    const user = await userRepository.getUserById(id);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    baseResponse(res, true, 200, "User found", user);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", null);
  }
};

exports.updateUser = async (req, res) => {
  const { id, email, password, name } = req.body;
  if (!id || !email || !password || !name) {
    return baseResponse(res, false, 400, "ID, email, password, and name are required", null);
  }
  if (!emailRegex.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format", null);
  }
  if (!passRegex.test(password)) {
    return baseResponse(res, false, 400, "Password must be at least 6 characters", null);
  }
  try {
    const user = await userRepository.updateUser({ id, email, password, name });
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    baseResponse(res, true, 200, "User updated", user);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", null);
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return baseResponse(res, false, 400, "ID is required", null);
  }
  try {
    const user = await userRepository.deleteUser(id);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    baseResponse(res, true, 200, "User deleted", user);
  } catch (error) {
    baseResponse(res, false, 500, error.message || "Server Error", null);
  }
};