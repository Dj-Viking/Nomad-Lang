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
import { RegisterResponse } from "../types";
import { ColorLog, logJson } from "../__tests__/utils/helpers";

let connection;
const logger = ColorLog;

describe("Tests the user register", () => {
  it("get expected response from the register mutation", async () => {
    new logger("blue", "registering a new user").genLog();
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    console.log('user', res);
    
    expect(res.register.token).toBeTruthy();
    expect(res.register.errors).toBeNull();
    expect(res.register.user.email).toEqual(REGISTER_EMAIL);
  });
  
  it("and check that the user got added to the db", async () => {
    new logger("blue", "checking that the user got added to the DB").genLog();
    connection = await connectDb();
    const users = await User.find({ where: { email: REGISTER_EMAIL }});
    logJson(users);
    expect(users).toHaveLength(1);
    connection.close();
  });

  it("checks if we try to register with the same credentials it returns an error", async () => {
    new logger("blue", "trying to register the same user credentials").genLog();
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    expect(res.register.errors).toHaveLength(1);
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