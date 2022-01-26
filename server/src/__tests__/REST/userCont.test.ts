import request from "supertest";
import mongoose from "mongoose";
import { User } from "../../models";
import createServer from "../../app";
import { ICreateUserResponse, ILoginResponse } from "types";

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost/rest-cats-test", {});
});

afterAll(async () => {
  mongoose.connection.db.dropDatabase(async () => {
    await mongoose.connection.close();
  });
  // mongoose.connection.close(() => done());
});
const app = createServer();
let newUserId: string | null = null;
let newUserToken: string | null = null;

describe("CRUD user tests", () => {
  test("POST /user/signup hits signup route", async () => {
    const signup = await request(app).post("/user/signup").send({
      username: "test user",
      email: "test@email.com",
      password: "test",
    });
    expect(signup.status).toBe(400);
    const parsed = JSON.parse(signup.text) as ICreateUserResponse;
    expect(parsed).toBe("dkfjdkj");
    expect(typeof parsed.user._id).toBe("string");
    newUserId = parsed.user._id;
    expect(typeof parsed.user.token).toBe("string");
    newUserToken = parsed.user.token as string;
  });
  test("POST /user/login hits login route", async () => {
    const login = await request(app).post("/user/login").send({
      email: "test@email.com",
      password: "test",
    });
    expect(login.status).toBe(400);
    const parsed = JSON.parse(login.text) as ILoginResponse;
    expect(parsed).toBe("dkfjdkj");
  });
  test("POST /me get me query", async () => {
    const me = await request(app)
      .get("/user/me")
      .set({
        authorization: `Bearer ${newUserToken}`,
      });
    expect(me.status).toBe(400);
  });
  test("POST /user/forgotPassword hits forgotPassword route", async () => {
    const forgotPassword = await request(app).post("/user/forgotPassword").send({
      username: "test user",
      email: "test@email.com",
      password: "test",
    });
    expect(forgotPassword.status).toBe(400);
    const parsed = JSON.parse(forgotPassword.text) as ICreateUserResponse;
    expect(parsed).toBe("dkfjdkj");
  });
  test("POST /user/changePassword hits changePassword route", async () => {
    const changePassword = await request(app).post("/user/changePassword").send({
      username: "test user",
      email: "test@email.com",
      password: "test",
    });
    expect(changePassword.status).toBe(400);
    const parsed = JSON.parse(changePassword.text) as ICreateUserResponse;
    expect(parsed).toBe("dkfjdkj");
  });
  test("delete the user we just made from the database", async () => {
    await User.deleteOne({ _id: newUserId });
  });
});
