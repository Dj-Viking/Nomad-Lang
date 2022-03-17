import mongoose from "mongoose";
import request from "supertest";
import { ICreateUserResponse } from "types";
import createServer from "../../app";
beforeAll(async () => {
  await mongoose.connect("mongodb://localhost/rest-cats-test", {});
});

afterAll(async () => {
  mongoose.connection.db.dropDatabase(async () => {
    await mongoose.connection.close();
  });
  // mongoose.connection.close(() => done());
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
    expect(typeof parsed.user._id).toBe("string");
    newUserId = parsed.user._id;
    expect(typeof parsed.user.token).toBe("string");
    expect(parsed.user.cards).toStrictEqual([]);
    newUserToken = parsed.user.token as string;
    expect(typeof newUserToken).toBe("string");
  });
  //try to reset their email
});
// test("POST /user/forgotPassword hits forgotPassword route", async () => {
//   const forgotPassword = await request(app)
//     .post("/user/forgotPassword")
//     .send({
//       email: void 0,
//     });
//   expect(forgotPassword.status).toBe(422);
//   const parsed = JSON.parse(forgotPassword.text) as IForgotPassResponse;
//   expect(parsed.error).toBe("email missing from request!");
// });
// test("POST /user/forgotPassword hits forgotPassword route", async () => {
//   const forgotPassword = await request(app).post("/user/forgotPassword").send({
//     email: "test@email.com",
//   });
//   expect(forgotPassword.status).toBe(200);
//   const parsed = JSON.parse(forgotPassword.text) as IForgotPassResponse;
//   expect(parsed.done).toBe(true);
// });
