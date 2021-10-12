require("dotenv").config();
import { request } from "graphql-request";
import { User } from "../entities/User";
import { 
  HOST, 
} from "../constants";
import { connectDb } from "./utils/connectDb";
import {
  REGISTER_MUTATION, 
  REGISTER_EMAIL,
} from "../../src/constants";
import { MeQueryResponse, RegisterResponse } from "../types";
import { ColorLog, logJson, createMeQuery } from "../__tests__/utils/helpers";
import { decodeToken } from "../utils/decodeToken";
// import jwt from "jsonwebtoken";
const {
  // NOT_FOUND_EMAIL,
  // NOT_MY_EMAIL
} = process.env;

let connection;
const logger = ColorLog;
let newToken: string = "";
let userEmail: string = "";

const {
  EXPIRED_TOKEN
} = process.env;

describe("Tests the user register", () => {
  it("get expected response from the register mutation", async () => {
    new logger("purple", "registering a new user").genLog();
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    console.log('user', res);

    
    expect(res.register.token).toBeTruthy();
    expect(typeof res.register.user.id).toBe("number");
    userEmail = res.register.user.email;
    newToken = res.register.token;
    expect(res.register.errors).toBeNull();
    expect(userEmail).toEqual(REGISTER_EMAIL);
  });
  
  it("and check that the user got added to the db", async () => {
    new logger("purple", "checking that the user got added to the DB").genLog();
    connection = await connectDb();
    const users = await User.find({ where: { email: REGISTER_EMAIL }});
    logJson(users);
    expect(users).toHaveLength(1);
    connection.close();
  });

  it("checks if we try to register with the same credentials it returns an error", async () => {
    new logger("purple", "trying to register the same user credentials").genLog();
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    expect(res.register.errors).toHaveLength(1);
  });

  it("checks the me query is returning the unauthenticated error", async () => {
    //expired or unauthenticated token test
    const invalidToken: MeQueryResponse = await request(
      HOST + "/graphql", 
      `${createMeQuery()}`,
      {},
      { "authorization": `Bearer asdfasdf` }
    );
    console.log("request with invalid token", invalidToken);
    expect(invalidToken.me.errors).toHaveLength(1);
    expect(invalidToken.me.errors[0].message).toBe("401 user not authenticated");
  });
  it("checks the me query is returning the unauthenticated error", async () => {
    //expired or unauthenticated token test
    const expired: MeQueryResponse = await request(HOST + "/graphql", `${createMeQuery()}`, {}, {
      "authorization": `Bearer ${EXPIRED_TOKEN}`
    });
    console.log("request with expired token", expired);
    expect(expired.me.errors).toHaveLength(1);
    expect(expired.me.errors[0].message).toBe("401 user not authenticated");
  });

  it("checks that we can perform a me query with our new token after registering and also get back a new token", async () => {
    new logger("yellow", "testing mequery to get a refresh token").genLog();
    
    const res: MeQueryResponse = await request(HOST + "/graphql", `${createMeQuery()}`, {}, {
      "authorization": `Bearer ${newToken}`
    });

    console.log("errors length property should be undefined: ", res.me.errors?.length);

    //if the length of the actual array is 0 for some reason the length property is set to typeof "undefined"
    expect(res.me.errors).toBeNull();
    expect(res.me.user.token).toBeTruthy();

    //check if old token is expired
    //get new token
    newToken = res.me.user.token as string;

    console.log("new token", newToken);
    
    expect(newToken).toBeTruthy();
    console.log("me query response test", res);
  });

  it("does me query again and checks that the old token is not the same as the one sent back from the me query", async () => {
    // const decoded = decodeToken(newToken) as jwt.JwtPayload;
    new logger("yellow", "testing me query again to get a new refresh token should be different than the previous newToken").genLog();

    console.log("decoded token previous", decodeToken(newToken));

    async function sleep(ms:number): Promise<void> {
      return new Promise((resolve, _reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    await sleep(1000)

    const newerMe: MeQueryResponse = await request(HOST + "/graphql", `${createMeQuery()}`, {}, {
      "authorization": `Bearer ${newToken}`
    });
    //check that the token is different than the previous one
    new logger("blue",  `me query OLD TOKEN ${newToken}`, ).genLog();
    new logger("blue", `me query user NEW TOKEN ${newerMe.me.user && newerMe.me.user.token ? newerMe.me.user.token : "couldn't get a token"}`).genLog();
    new logger("blue", `me query outside user NEW TOKEN ${newerMe.me.token}`).genLog();

    expect(newerMe.me.token !== newToken).toBe(true);
  });

  it("checks if we delete the user we just made", async () => {
    connection = await connectDb();
    await User.delete({ email: REGISTER_EMAIL });
    const users = await User.find({ where: { email: REGISTER_EMAIL } });
    new logger("green", "deleting a user").genLog();
    logJson(users);
    expect(users).toHaveLength(0);
    connection.close();
  }); 
});