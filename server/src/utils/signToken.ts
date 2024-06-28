import jwt from "jsonwebtoken";
import { SignLoginRegisterMeTokenArgs, SignResetPasswordTokenArgs } from "../types";
require("dotenv").config();
import { readEnv } from "./readEnv";
readEnv();

const { SECRET, EXPIRATION } = process.env;

export function signToken(args: SignLoginRegisterMeTokenArgs | SignResetPasswordTokenArgs): string {
  const {
    username,
    _id,
    uuid: someUuid, //aliasing the uuid to another name to store the value of uuid into
    email,
  } = args as SignLoginRegisterMeTokenArgs;

  const { resetEmail, uuid, exp } = args as SignResetPasswordTokenArgs;

  switch (true) {
    case Boolean(username && someUuid && email && _id): {
      return jwt.sign(
        {
          username,
          uuid,
          _id,
          email,
        },
        SECRET as string,
        { expiresIn: "1d" as string }
      );
    }
    case Boolean(username && uuid && exp && resetEmail): {
      return jwt.sign(
        {
          username,
          resetEmail,
          uuid,
        },
        SECRET as string,
        { expiresIn: exp }
      );
    }
    default:
      return "can't sign a valid token";
  }
}
