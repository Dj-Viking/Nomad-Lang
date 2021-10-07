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
import { MyContext } from '../types';

import { User } from '../entities/User';
import { Card } from '../entities/Card';
import { verifyRegisterArgs } from '../utils/verifyRegisterArgs';
import { decodeToken } from '../utils/decodeToken';

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

      console.log("user requesting their profile infomation and refreshtoken", req.user);

      const user = await User.findOne({ where:{ email: req.user.email }});
      
      console.log("user found", user);

      const cards = await Card.find({ where: { creatorId: user?.id as number }});
      console.log("checking cards given the creatorId", cards);

      //sign a new token
      const newToken = signToken({
        username: req.user.username,
        email: req.user.email,
        password: user?.password as string,
      });

      //debug
      const profile = decodeToken(newToken);
      console.log("heres the profile of the person doing me query", profile);
      
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
        password: hashedPassword
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
      console.log('what is the result', result.raw[0]);
      
      
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
    console.log("args sent from client", options);
    
    let user;
    user = await User.findOne({ where: { email: options.email } });
    console.log("found user by email?", user);
    if (!user) {
      user = await User.findOne({ where: { username: options.username } });
      console.log("found user by username", user);
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
      password: user.password
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
    console.log("got cards", cards);
    

    return {
      token: token,
      user: changedUser.raw[0],
      cards: cards
    };
  }
  @Mutation(() => LogoutResponse)
  async logout(
    @Arg("email", () => String) email: string,
    @Ctx() context: MyContext
  ): Promise<LogoutResponse | ErrorResponse> {
    console.log('context user', context.req.user);
    console.log("email entered", email);
    
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