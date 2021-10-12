import { MyJwtData, MyContext } from "../types";
import jwt from "jsonwebtoken";
require('dotenv').config();

const {
  SECRET,
  EXPIRATION
} = process.env

export function authMiddleware(
  context: MyContext
): MyContext {
  // console.log("chekcing the user", context.req.user);
  
  async function verifyAsync(token: string): Promise<jwt.JwtPayload> {
    let returnedDecoded: any;
    jwt.verify(
      token as string,
      SECRET as string,
      { maxAge: EXPIRATION }, //maxage deprecated but still accepted...
      (error, decoded) => {
        if (error?.message.includes("malformed")) throw new Error(error.message);
        if (error?.message.includes("expired")) throw new Error(error.message);
        if (error?.message.includes("invalid")) throw new Error(error.message);
        if (decoded) {
          context.req.user = decoded as MyJwtData;
          // const oldDecoded = decodeToken(token);
          // console.log("comparing old decoded token", oldDecoded);
          // console.log("context user as decoded token", context.req.user);

          returnedDecoded = decoded;
        }
        
      } 
    );
    return returnedDecoded;
  }
  try {
    // allows token to be sent via req.body, req.query, or headers
    let token = context.req.headers.authorization;
    // console.log("token sent in headers", Date.now(), token);
    
    
    
    // console.log("got token from middleware??", token);
    
    // ["Bearer", "<tokenvalue>"] 
    //received by apollo server and the login mutation
    if (context.req.headers.authorization) {
      //token = Bearer `${token}`<- getting this token part from the context request headers
      // and remove any white space before or after the token string if any
      token = token?.split(' ')?.pop()?.trim() as string;
    }
    
    // console.log(ANSI_ESCAPES.warning, `token recieved ${token}`, ANSI_ESCAPES.reset);
    if (!token) {
      context.req.user = null;
      return context;
    }

    verifyAsync(token).then((decoded) => {
      context.req.user = <MyJwtData>decoded;
      // console.log("context user requesting information", context.req.user, Date.now());
      
      //this error will throw in the console....instead of the catch block of the authmiddleware
    }).catch((_err: Error) => {
      context.req.user = null;
      //cant use logger here because i need the whole stack in the error logs
      // console.error(
        
      //   `${ANSI_ESCAPES.danger}`, 
      //   `ERROR in verifying the token async function ${err.stack}`, 
      //   `${ANSI_ESCAPES.reset}`
      // );
    });
    
    return context;
  } catch (error) {
    console.log("got an error in the auth middleware", error);
    return context;
  }

}