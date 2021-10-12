import jwt from "jsonwebtoken";
import { MyJwtData } from "../types";
require("dotenv").config();


export function decodeToken(token: string): MyJwtData | null {
  const profile = jwt.decode(token);
  return profile as MyJwtData;
  
}