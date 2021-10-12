import jwt from "jsonwebtoken";
import { SignLoginRegisterMeTokenArgs, SignResetPasswordTokenArgs } from "../types";
require("dotenv").config();

const {
  SECRET,
  EXPIRATION
} = process.env;

export function signToken(args: SignLoginRegisterMeTokenArgs | SignResetPasswordTokenArgs): string {
  console.log("what are args here to sign a token", args);
  
  const {
    username, 
    uuid: someUuid, //i think im aliasing here
    email
  } = args as SignLoginRegisterMeTokenArgs;


  const {
    resetEmail
,   uuid,
    exp
  } = args as SignResetPasswordTokenArgs;
  
  switch (true) {
    case Boolean(username && someUuid && email): {
      return jwt.sign({
        username,
        uuid,
        email
      },
      SECRET as string,
      { expiresIn: EXPIRATION as string });
    }
    case Boolean(uuid && exp && resetEmail): {
      return jwt.sign({
        resetEmail,
        uuid
      },
      SECRET as string,
      { expiresIn: exp })
    }
    default: return "can't sign a valid token";
  }
} 