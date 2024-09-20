import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("jwt-linkedin", token, {
    httpOnly: true, // Prevents client side JS from reading the cookie
    sameSite: "strict", // Cookie is only sent to the same site as the request
    secure: process.env.NODE_ENV === "production", // Cookie is only sent in production over https
    maxAge: 3 * 24 * 60 * 60 * 1000, // Cookie expires in 3 days
  });
};
