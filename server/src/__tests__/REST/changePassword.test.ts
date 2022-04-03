import mongoose from "mongoose";
import request from "supertest";
import { ICreateUserResponse, ILoginResponse } from "types";
import { signToken } from "../../utils/signToken";
import createServer from "../../app";
const uuid = require("uuid");
const app = createServer();

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost/rest-cats-test", {});
});

afterAll(async () => {
  mongoose.connection.db.dropDatabase(async () => {
    await mongoose.connection.close();
  });
});

let newUserId: null | string = null;

describe("test change password feature", () => {
  //create new user to change password on
  //create a user
  test("POST /user/signup creates a user", async () => {
    const signup = await request(app).post("/user/signup").send({
      username: "test user",
      email: "test@email.com",
      password: "test",
    });
    expect(signup.status).toBe(201);
    const parsed = JSON.parse(signup.text) as ICreateUserResponse;
    expect(typeof parsed._id).toBe("string");
    newUserId = parsed._id;
    expect(typeof newUserId).toBe("string");
    expect(typeof parsed.token).toBe("string");
    expect(parsed.cards).toStrictEqual([]);
  });

  test("PUT /user/changePassword test the password gets changed", async () => {
    const token = signToken({
      username: "test user",
      resetEmail: "test@email.com",
      uuid: uuid.v4(),
      exp: "5m",
    });
    const change = await request(app)
      .put("/user/changePassword")
      .set({
        authorization: `Bearer ${token}`,
      })
      .send({
        newPassword: "kdjfkdjf",
      });

    expect(change.status).toBe(200);
  });

  //login the test user with this password
  test("POST /user/login login the user with the new password", async () => {
    const login = await request(app).post("/user/login").send({
      email: "test@email.com",
      password: "kdjfkdjf",
    });
    expect(login.status).toBe(200);
    const parsed = JSON.parse(login.text) as ILoginResponse;
    expect(parsed.email).toBe("test@email.com");
  });
});
