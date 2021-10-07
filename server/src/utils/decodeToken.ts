import jwt from "jsonwebtoken";
require("dotenv").config();


export function decodeToken(token: string): jwt.JwtPayload | null | string {
  const profile = jwt.decode(token);
  return profile;
  
}