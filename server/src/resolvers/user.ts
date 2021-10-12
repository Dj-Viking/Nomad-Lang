import { ErrorResponse } from '../utils/ErrorResponse';
import { signToken } from '../utils/signToken';
import { 
  Field, 
  InputType, 
  Resolver, 
  Arg, 
  Mutation, 
  Ctx, 
  ObjectType,
  Query 
} from 'type-graphql';
import { getConnection } from 'typeorm';
import argon2 from 'argon2';
import { MyContext, MyJwtData, MySendEmailOptions } from '../types';

import { User } from '../entities/User';
import { Card } from '../entities/Card';
import { verifyRegisterArgs } from '../utils/verifyRegisterArgs';
// import { decodeToken } from '../utils/decodeToken';
import { sendEmail } from '../utils/sendEmail';
import { APP_DOMAIN_PREFIX } from '../constants';
import { decodeToken } from '../utils/decodeToken';
import { verifyAsync } from '../utils/verifyAsync';
const uuid = require("uuid");
@InputType()
class RegisterInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class UserFieldError {
  @Field()
  field: String;
  @Field()
  message: String; 
}

//user returned if worked
// or error returned if error was there
@ObjectType()
class UserResponse {
  @Field(() => [UserFieldError], { nullable: true })
  errors?: UserFieldError[] | null

  @Field(() => User, { nullable: true })
  user?: User | null
  
  @Field(() => String, { nullable: true })
  token?: string | null

  @Field(() => [Card], { nullable: true })
  cards?: Card[] | null
}

@ObjectType()
class MeQueryResponse {
  @Field(() => [UserFieldError], { nullable: true })
  errors?: UserFieldError[] | null;

  @Field(() => User, { nullable: true })
  user?: User | null;

  @Field(() => String, { nullable: true })
  token?: string | null;

  @Field(() => [Card], { nullable: true })
  cards?: Card[] | null;
}

@ObjectType()
class LogoutResponse {
  @Field(() => Boolean, { nullable: true })
  done: boolean | null;
  @Field(() => [UserFieldError], { nullable: true })
  errors?: UserFieldError[] | null;
}

@InputType()
class LoginInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class ForgotPassResponse {

  //remove after testing
  // @Field(() => String, { nullable: true })
  // token: string | null;  

  @Field(() => Boolean, { nullable: true })
  done: boolean | null;

  @Field(() => [UserFieldError], { nullable: true })
  errors?: UserFieldError[] | null;
}

@ObjectType()
class ChangePasswordResponse {
  @Field(() => Boolean, { nullable: true })
  done: boolean | null;

  @Field(() => String, { nullable: true })
  token?: string | null;

  @Field(() => [Card], { nullable: true })
  cards?: Card[] | null
  
  @Field(() => [UserFieldError], { nullable: true })
  errors?: UserFieldError[] | null
}

@Resolver()
export class UserResolver {

  @Query(() => String)
  async helloUser(): Promise<string>{
    return "hello user"
  }

  //whenever a user navigates somewhere on the applicaton they are still active
  // so we are signing a new token with a new expiration
  // so the token doesn't expire when the user is still active
  // this also lets the UI stay in a "logged in state" if the token isn't expired
  @Query(() => MeQueryResponse)
  async me(
    @Ctx() { req }: MyContext
  ): Promise<MeQueryResponse | ErrorResponse> {
    try {
      //cant query themselves if they are not logged in with a fresh token to make a me query
      if (!req.user) return new ErrorResponse("unauthenticated", "401 user not authenticated");
      // user not found

      // console.log("user requesting their profile infomation and refreshtoken", req.user);

      const user = await User.findOne({ where:{ email: req.user.email }});
      
      // console.log("user found", user);

      const cards = await Card.find({ where: { creatorId: user?.id as number }});
      // console.log("checking cards given the creatorId", cards);

      //sign a new token
      const newToken = signToken({
        username: req.user.username,
        email: req.user.email,
        uuid: uuid.v4()
      });

      //debug
      // const profile = decodeToken(newToken);
      // console.log("heres the profile of the person doing me query", profile);
      
      const changedUser = await getConnection()
      .getRepository(User)
      .createQueryBuilder("user")
      .update<User>(User, 
                    { token: newToken })
      .where("email = :email", { email: req.user.email })
      .returning(["id", "username", "createdAt", "updatedAt", "token", "email"])
      .updateEntity(true)
      .execute();

      // console.log("updated user's info adding in todos", changedUser);
      

      return {
        token: newToken,
        user: changedUser.raw[0],
        cards: cards
      }
      //if user is found sign a new token for them with a new expiration
    } catch (error) {
      return new ErrorResponse("error during me query", error.message);
    }
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options', () => RegisterInput) options: RegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    try 
    {
      const verifyRes = verifyRegisterArgs(options);
      if (verifyRes instanceof ErrorResponse) return verifyRes;
      const hashedPassword = await argon2.hash(options.password);

      let tempUser = {
        username: options.username,
        email: options.email,
        uuid: uuid.v4()
      };
      const token = signToken(tempUser);

      let user: User;
      const result = await getConnection().createQueryBuilder().insert().into(User).values(
        {
          username: options.username,
          email: options.email,
          password: hashedPassword,
          token: token
        }
      )
      .returning(['username', 'token', 'email'])
      .execute();
      //only returning the first user object in the array, 
      // i guess I could insert as many objects into the table and will
      // return more created objects into the raw array
      user = result.raw[0];

      req.user = user;
      // console.log('what is the result', result.raw[0]);
      
      
      return {
        token,
        user
      };
    } catch (error) {
      if (error.code === '23505' || error.detail && error.detail.includes('already exists'))
      {
        const field = 'User';
        const message = "name and/or email is already taken!";
        return new ErrorResponse(field, message);
      } else {
        const field = 'Error';
        const message = error;
        return new ErrorResponse(field, message);
      }
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options', () => LoginInput) options: LoginInput,
    @Ctx() _context: MyContext
  ): Promise<UserResponse>{ 
    // console.log("args sent from client", options);
    
    let user;
    user = await User.findOne({ where: { email: options.email } });
    // console.log("found user by email?", user);
    if (!user) {
      user = await User.findOne({ where: { username: options.username } });
      // console.log("found user by username", user);
    }
    if (!user) 
    {
      return new ErrorResponse(
        'Credentials',
        'Incorrect Credentials'
      );
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid)
    {
      return new ErrorResponse(
        "Credentials",
        "Incorrect Credentials"
      );
    }

    //create a new token and then update the user's token in the database
    const token = signToken({
      username: user.username,
      email: user.email,
      uuid: uuid.v4()
    });


    const changedUser = await getConnection()
    .getRepository(User)
    .createQueryBuilder("user")
    .update<User>(User, 
                  { token })
    .where("email = :email", { email: user.email })
    .returning(["id", "username", "createdAt", "updatedAt", "email", "token"])
    .updateEntity(true)
    .execute();

    // console.log("updated user's token after logging in ", changedUser.raw[0]);
      

    const cards = await Card.find({ where: { creatorId: user.id }});
    // console.log("got cards", cards);
    

    return {
      token: token,
      user: changedUser.raw[0],
      cards: cards
    };
  }

  // TODO: add change password mutation here that somehow verifies 
  // the temporary token that is available for a short time
  // to allow the user to actually reset the password

  @Mutation(() => ChangePasswordResponse)
  async changePassword(
    @Arg("password") password: string,
    //remove after testing
    @Arg("token") token: string,
    @Ctx() _context: MyContext
  ): Promise<ChangePasswordResponse | ErrorResponse> {
    try {
      
      //check if token is expired if so return an error response
      let verified: MyJwtData | null | any = "something";
      verified = await verifyAsync(token);
      // console.log("what is the response of verify async here as an awaited function", verified);
      // console.log("verified is an instance of Error??", verified instanceof Error);
      
      //create the error response if verifying the token creates an error
      if (verified instanceof Error && verified.message.includes("expired")) 
        return new ErrorResponse("invalid", "reset token expired");
      else if (
        verified instanceof Error && (
          verified.message.includes("malformed") ||
          verified.message.includes("invalid")
        )
      ) return new ErrorResponse("invalid", "invalid token");
      
      const decodedToken = decodeToken(token);
      // console.log("decoded token", decodedToken);
      
      //create a new password to update the user table with
      const hashedPassword = await argon2.hash(password);

      //update the user's password in their db table

      const changedUser = await getConnection()
      .getRepository(User)
      .createQueryBuilder("user")
      .update<User>(User, 
                    { password: hashedPassword })
      .where("email = :email", { email: decodedToken?.resetEmail })
      .returning(["id", "username", "createdAt", "updatedAt", "email", "token"])
      .updateEntity(true)
      .execute();

      console.log("did we get a changed user", changedUser.raw[0]);
      

      const loginToken = signToken({
        username: changedUser.raw[0].username,
        email: changedUser.raw[0].email,
        uuid: uuid.v4()
      });

      //update the user's token in the db

      const changedUserToken = await getConnection()
      .getRepository(User)
      .createQueryBuilder("user")
      .update<User>(User, 
                    { token: loginToken })
      .where("email = :email", { email: decodedToken?.resetEmail })
      .returning(["id", "username", "createdAt", "updatedAt", "email", "token"])
      .updateEntity(true)
      .execute();
      //decode the token to have the email of the person who isn't logged in 
      // and needs their password reset

      //get cards
      const cards = await Card.find({ where: { creatorId: changedUserToken.raw[0].id }});

      return {
        done: true,
        token: loginToken,
        cards
      }
    } catch (error) {
      return new ErrorResponse("change pass", error.message);
    }
  }

  @Mutation(() => ForgotPassResponse)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() _context: MyContext
  ): Promise<ForgotPassResponse | ErrorResponse> {
    try {
      // TODO: once deployed apply the production domain URL 
      // to supply a link to the page where the user will change
      // their password (execute change password mutation)
      // 
      //create token to send and verify
      const resetToken = uuid.v4();

      const token = signToken({
        uuid: resetToken,
        resetEmail: email,
        exp: "5m"
      });

      const forgotPasswordEmailOptions: MySendEmailOptions = {
        fromHeader: "Password Reset",
        subject: "Password Reset Request",
        mailTo: email,
        mailHtml:  `
          <span>We were made aware that you request your password to be reset</span>
          <p>If this wasn't you. Then please disregard this email. Thank you!</p>
          <h2>This Request will expire after 5 minutes.</h2>
          <a href="${APP_DOMAIN_PREFIX}/changepass/${token}">Reset your password</a>   
        `
      }
      //send email logic
      await sendEmail(forgotPasswordEmailOptions);

      return {
        //for testing send the token for use in the change password mutation
        // token,
        done: true
      }
    } catch (error) {
      const err = error as Error;
      return new ErrorResponse("reset", err.message);
    }
  }

  @Mutation(() => LogoutResponse)
  async logout(
    @Arg("email", () => String) email: string,
    @Ctx() context: MyContext
  ): Promise<LogoutResponse | ErrorResponse> {
    // console.log('context user', context.req.user);
    // console.log("email entered", email);
    
    if (!email) return new ErrorResponse("noemail", "no email entered")
    try {
      //remove token from user table?
      const changedUser = await getConnection()
      .getRepository(User)
      .createQueryBuilder("user")
      .update<User>(User, 
                    { token: "" })
      .where("email = :email", { email: email })
      .returning(["id", "username", "createdAt", "updatedAt", "email"])
      .updateEntity(true)
      .execute();
      if (!changedUser) return new ErrorResponse("user", "user not found");

      // console.log('changed user', changedUser.raw[0]);

      context.req.user = null;
      
      return {
        done: true
      };

    } catch (error) {
      console.log(error);
      const field = "error";
      const msg = `error in the logout mutation ${error}`
      return new ErrorResponse(field, msg);
      
    }
  }
}