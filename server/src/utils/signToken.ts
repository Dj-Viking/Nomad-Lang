import jwt from "jsonwebtoken";
require("dotenv").config();

const {
  SECRET,
  EXPIRATION
} = process.env;

export function signToken(user: { username: string, email: string, password: string, token?: string }): string {

  const payload = {
    username: user.username,
    email: user.email,
    password: user.password
  };

  return jwt.sign(payload,
                  SECRET as string,
                  { expiresIn: EXPIRATION as string });
}