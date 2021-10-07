import { request } from "graphql-request";
import { User } from "../entities/User";
import { 
  HOST,  
  REGISTER_EMAIL, 
  REGISTER_MUTATION, 
  REGISTER_PASSWORD, 
  REGISTER_USERNAME
} from "../constants";
import { connectDb } from "./utils/connectDb";
import { LoginInput, LoginResponse, RegisterResponse } from "../types";
import { logJson, ColorLog } from "./utils/helpers";
import { createLoginMutation } from "./graphql/myMutations";
// import { connectDb } from "./utils/connectDb";

const logger = ColorLog;

describe("log a cookie", () => {
  it("logs", () => {
    new logger("blue", "logging a cookie").genLog();
    let cookie = Buffer.from(JSON.stringify({"count": 2})).toString('base64');
    logJson(cookie);
  });
});

describe("Tests the user register", () => {
  it("get expected response from the register mutation", async () => {
    new logger("blue", "registering a new user").genLog();
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    
    expect(res.register.token).toBeTruthy();
    expect(res.register.errors).toBeNull();
    expect(res.register.user.email).toEqual(REGISTER_EMAIL);
  });
  
  it("and check that the user got added to the db", async () => {
    // console.log(`${ANSI_ESCAPES.blue}`, `checking that the user got added to the DB`, `${ANSI_ESCAPES.reset}`);
    new logger("blue", "checking that the user got added to the DB").genLog();
    const connection = await connectDb();
    const users = await User.find({ where: { email: REGISTER_EMAIL }});
    logJson(users);
    expect(users).toHaveLength(1);
    connection.close();
  });

  it("checks if we try to register with the same credentials it returns an error", async () => {
    new logger("blue", "trying to register the same user credentials should fail").genLog();
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    expect(res.register.errors).toHaveLength(1);
  });
});

// launch login mutation
describe("do the login mutation", () => {
  it("login the login mutation with email only", async () => {
    new logger("blue", "check the login mutation").genLog();
    const payload: LoginInput = {
      options: {
        username: "",
        email: REGISTER_EMAIL as string,
        password: REGISTER_PASSWORD as string
      }
    }

    const res: LoginResponse = await request(HOST + "/graphql", createLoginMutation(), payload);
    // check the response
    // logJson(res);
    console.log("user response in login", res);
    expect(res.login.errors).toBeNull();
    expect(res.login.user?.token).toBeTruthy();
    expect(res.login.user?.email).toEqual(REGISTER_EMAIL);
    expect(res.login.user?.username).toEqual(REGISTER_USERNAME);
  }); 
  it("login the login mutation with username only", async () => {
    new logger("blue", "check the login mutation").genLog();

    const payload: LoginInput = {
      options: {
        username: REGISTER_USERNAME as string,
        email: "",
        password: REGISTER_PASSWORD as string
      }
    }

    const res: LoginResponse = await request(HOST + "/graphql", createLoginMutation(), payload);
    // check the response
    // logJson("user response in login", res);
    console.log("user response in login", res);
    expect(res.login.errors).toBeNull();
    expect(res.login.token).toBeTruthy();
    expect(res.login.user?.email).toEqual(REGISTER_EMAIL);
    expect(res.login.user?.username).toEqual(REGISTER_USERNAME);
  }); 
});

// do a me query
//not sure how to test this yet
// describe("do a me query to check that I am logged in", () => {
//   it("me query", async () => {
//     console.log(`${ANSI_ESCAPES.blue}`, `check the me query`, `${ANSI_ESCAPES.reset}`);
//     const res = await request(HOST + "/graphql", ME_QUERY);
//     logJson(res);
//   });
// }); 

describe("delete the user we just made", () => {
  //delete the user
  it("checks if we delete the user we just made", async () => {
    new logger("green", "checks the delete action").genLog();
    const connection = await connectDb();
    await User.delete({ email: REGISTER_EMAIL });
    const users = await User.find({ where: { email: REGISTER_EMAIL } });
    expect(users).toHaveLength(0);
    connection.close();
  }); 
})
