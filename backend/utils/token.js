import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const sendTokenCookie = (res, user, statusCode = 200) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: "Authentication successful",
    });
};
