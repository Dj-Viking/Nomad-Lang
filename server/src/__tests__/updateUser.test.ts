import { request } from "graphql-request";
import { User } from "../entities/User";
import { 
  UPDATED_USERNAME, 
  REGISTER_MUTATION, 
  REGISTER_EMAIL,
  HOST
} from "../constants";
import { connectDb } from "./utils/connectDb";
import { RegisterResponse } from "../types";
import { logJson, ColorLog } from "../__tests__/utils/helpers";

const logger = ColorLog;

describe("Tests the user register", () => {
  it("get expected response from the register mutation", async () => {
    new logger("blue", "registering a new user").genLog();
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    console.log('user', logJson(res));
    expect(res.register.token).toBeTruthy();
    expect(res.register.errors).toBeNull();
    expect(res.register.user.email).toEqual(REGISTER_EMAIL);
  });

  it("checks if we try to register with the same credentials it returns an error", async () => {
    new logger("blue", "trying to register the same user").genLog();
    const res: RegisterResponse = await request(HOST + "/graphql", REGISTER_MUTATION);
    logJson(res);
    expect(res.register.errors).toHaveLength(1);
  });
});

describe("check user was added", () => {
  it("and check that the user got added to the db", async () => {
    new logger ("blue", "checking that the user got added to the DB").genLog();
    const connection = await connectDb();
    const users = await User.find({ where: { email: REGISTER_EMAIL }});
    logJson(users);
    expect(users).toHaveLength(1);
    await connection.close();
  });
});

describe("do the update action", () => {
  it("execute a query builder of updating a user's username", async () => {
    new logger("blue", "updating a user's username").genLog();
    const connection = await connectDb();
    const changedUser = await connection.getRepository(User).createQueryBuilder("user").update<User>(User, { 
      username: UPDATED_USERNAME 
    })
    .where("email = :email", { email: REGISTER_EMAIL })
    .returning('*')
    .updateEntity(true)
    .execute();

    const updated: User = changedUser.raw[0];
    console.log('changed user', logJson(updated));
    expect(updated.username).toEqual(UPDATED_USERNAME);
    await connection.close();
  });

});

describe("checks the delete action", () => {
  it("checks if we delete the user we just made", async () => {
    const connection = await connectDb();
    await User.delete({ email: REGISTER_EMAIL });
    const users = await User.find({ where: { email: REGISTER_EMAIL } });
    new logger("green", `deleting a user ${users}`).genLog();
    logJson(users);
    expect(users).toHaveLength(0);
    await connection.close();
  }); 
});