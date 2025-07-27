import User from "../models/User.js";
import { generateToken, sendTokenCookie } from "../utils/token.js";

// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ message: "Email or phone already registered" });
    }

    // Create new user
    const user = await User.create({ name, email, password, phone, address, role });

    // Send token in cookie
    sendTokenCookie(res, user, 201);
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Send token in cookie
    sendTokenCookie(res, user);
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// @route GET /api/auth/me
export const getProfile = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  res.json(user);
};

// @route POST /api/auth/logout
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
};
