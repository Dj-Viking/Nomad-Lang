import jwt from "jsonwebtoken";
import { MyJwtData } from "src/types";

const {
  EXPIRATION,
  SECRET
} = process.env;

export async function verifyAsync(token: string): Promise<MyJwtData | null | Error> {
  return new Promise((resolve) => {
    let returnMe: MyJwtData | null | any;
    console.log("is my exported verified async doing anyhting with token", token);
    jwt.verify(
      token as string,
      SECRET as string,
      { maxAge: EXPIRATION }, //maxage deprecated but still accepted...
      (error, decoded) => {
        console.log("is there an error", error);
        console.log("is there a decoded token in verify async", decoded);
        if (error?.message.includes("malformed")) returnMe = error;
        if (error?.message.includes("expired")) returnMe = error;
        if (error?.message.includes("invalid")) returnMe = error;
        if (decoded) returnMe = decoded;
      } 
    );
    resolve(returnMe);
  })
}