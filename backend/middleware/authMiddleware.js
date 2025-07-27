import jwt from "jsonwebtoken";
import User from "../models/User.js"; // adjust if needed
import { ApiError } from "../utils/ApiError.js";

export const protect = async (req, res, next) => {
  try {
    const token = (req.cookies?.jwt || req.header("Authorization"))?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "No token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded) throw new ApiError(401, "Invalid token");
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) throw new ApiError(401, "User not found");

    next();
  } catch (error) {
    next(new ApiError(401, "Not authorized"));
  }
};
