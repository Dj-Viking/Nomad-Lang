
import {
  ErrorResponse
} from "../utils/ErrorResponse";;
interface RegisterArgs {
  email: string;
  username: string;
  password: string;
}
export function verifyRegisterArgs(args: RegisterArgs): ErrorResponse | void {
  //check email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(args.email) === false) 
  {
    const field = "Email";
    const message = "Email is not in correct format. Must be like example@mail.com";
    return new ErrorResponse(field, message);
  }
  //check username
  if (args.username.length <= 2) 
  {
    const field =  "Username";
    const message = "username length too short must be greater than 2 characters";
    return new ErrorResponse(field, message);
  }
  //check password
  if (args.password.length <= 3) 
  {
    const field = "Password";
    const message = "password length too short must be greater than 3 characters";
    return new ErrorResponse(field, message);
  }

}