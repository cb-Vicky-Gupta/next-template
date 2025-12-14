import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}
const JWT_SECRET = process.env.JWT_SECRET;

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};
export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const signToken = (payload: object, expiresIn: string = "7d") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};