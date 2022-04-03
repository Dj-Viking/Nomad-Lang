import mongoose from "mongoose";
import request from "supertest";
import { ICreateUserResponse, IForgotPassResponse } from "types";
import createServer from "../../app";
jest.mock("../../utils/sendEmail.ts");
beforeAll(async () => {
  await mongoose.connect("mongodb://localhost/rest-cats-test", {});
});

afterAll(async () => {
  mongoose.connection.db.dropDatabase(async () => {
    await mongoose.connection.close();
  });
});
let newUserId: null | string = null;
let newUserToken: null | string = null;
const app = createServer();

describe("test the reset email function", () => {
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
    newUserToken = parsed.token as string;
    expect(typeof newUserToken).toBe("string");
  });
  //try to reset their email
  test("POST /user/forgotPassword hits forgotPassword route without email arg", async () => {
    const forgotPassword = await request(app)
      .post("/user/forgotPassword")
      .send({
        email: void 0,
      });
    expect(forgotPassword.status).toBe(422);
    const parsed = JSON.parse(forgotPassword.text) as IForgotPassResponse;
    expect(parsed.error).toBe("email missing from request!");
  });
  test("POST /user/forgotPassword hits forgotPassword route without correctly formatted email send 200 anyway", async () => {
    const forgotPassword = await request(app).post("/user/forgotPassword").send({
      email: "kdjfkdjfkdk",
    });
    expect(forgotPassword.status).toBe(200);
    const parsed = JSON.parse(forgotPassword.text) as IForgotPassResponse;
    expect(parsed.done).toBe(true);
  });
  test("POST /user/forgotPassword even if email doesn't exist just return 200 obscurely", async () => {
    const forgotPassword = await request(app).post("/user/forgotPassword").send({
      email: "test1@email.com",
    });
    expect(forgotPassword.status).toBe(200);
    const parsed = JSON.parse(forgotPassword.text) as IForgotPassResponse;
    expect(parsed.done).toBe(true);
  });
  test("POST /user/forgotPassword hits forgotPassword route with a correct email and a user", async () => {
    const forgotPassword = await request(app).post("/user/forgotPassword").send({
      email: "test@email.com",
    });
    expect(forgotPassword.status).toBe(200);
    const parsed = JSON.parse(forgotPassword.text) as IForgotPassResponse;
    expect(parsed.done).toBe(true);
  });
});
