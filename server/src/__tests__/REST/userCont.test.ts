import request from "supertest";
import mongoose from "mongoose";
import { User } from "../../models";
import createServer from "../../app";
import {
  ICard,
  ICreateUserResponse,
  ILoginError,
  ILoginResponse,
  IMeResponse,
  IUserCreateCardResponse,
} from "../../types";
import { MOCK_ADD_CARD } from "../../constants";

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
let newestUserToken: string | null = null;

describe("CRUD user tests", () => {
  test("POST /user/signup tries to create user without input args", async () => {
    const missing1 = await request(app).post("/user/signup").send({
      username: "kdjfkdkjf",
    });
    expect(missing1.status).toBe(400);
    const missing2 = await request(app).post("/user/signup").send({
      email: "kdjfkdkjf@dkjfkd.com",
    });
    expect(missing2.status).toBe(400);
    const missing3 = await request(app).post("/user/signup").send({
      password: "kdjfkdkjf@dkjfkd.com",
    });
    expect(missing3.status).toBe(400);
    const missing4 = await request(app).post("/user/signup").send({
      username: "kdjfkdkjf@dkjfkd.com",
      email: "kdjfkdkjf@dkjfkd.com",
    });
    expect(missing4.status).toBe(400);
  });
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
  test("POST /user/login hits login route", async () => {
    const login = await request(app).post("/user/login").send({
      email: "test@email.com",
      password: "test",
    });
    expect(login.status).toBe(200);
    const parsed = JSON.parse(login.text) as ILoginResponse;
    expect(typeof parsed.user._id).toBe("string");
    expect(typeof parsed.user.token).toBe("string");
    newUserToken = parsed.user.token as string;
    expect(typeof newUserToken).toBe("string");
  });
  test("POST /user/login with bad credentials no email", async () => {
    const login = await request(app)
      .post("/user/login")
      .send({
        email: void 0,
        password: "test",
      });
    expect(login.status).toBe(400);
    const parsed = JSON.parse(login.text) as ILoginError;
    expect(parsed.error).toBe("Incorrect Credentials");
  });
  test("POST /user/login with bad credentials no bad password", async () => {
    const login = await request(app).post("/user/login").send({
      email: "test@email.com",
      password: "testsdfd",
    });
    expect(login.status).toBe(400);
    const parsed = JSON.parse(login.text) as ILoginError;
    expect(parsed.error).toBe("Incorrect Credentials");
  });
  test("GET /me get me query", async () => {
    const me = await request(app)
      .get("/user/me")
      .set({
        authorization: `Bearer ${newUserToken}`,
      });
    expect(me.status).toBe(200);
    const parsed = JSON.parse(me.text) as IMeResponse;
    expect(typeof parsed.user.token).toBe("string");
    newestUserToken = parsed.user.token as string;
    expect(typeof newestUserToken).toBe("string");
    expect(newestUserToken).not.toBe(newUserToken);
  });
  test("POST /user/addCard tries to add card without token", async () => {
    const noToken = await request(app)
      .post("/user/addCard")
      .send(MOCK_ADD_CARD as ICard);
    expect(noToken.status).toBe(401);
  });
  test("POST /user/addCard hits add card route", async () => {
    const addCard = await request(app)
      .post("/user/addCard")
      .set({
        authorization: `Bearer ${newestUserToken}`,
      })
      .send(MOCK_ADD_CARD as ICard);
    expect(addCard.status).toBe(200);
    const parsed = JSON.parse(addCard.text) as IUserCreateCardResponse;
    expect(parsed.cards).toHaveLength(1);
    expect(parsed.cards[0].creator).toBe("test user");
    expect(typeof parsed.cards[0].createdAt).toBe("string");
    expect(typeof parsed.cards[0].updatedAt).toBe("string");
  });
  // test("POST /user/forgotPassword hits forgotPassword route", async () => {
  //   const forgotPassword = await request(app).post("/user/forgotPassword").send({
  //     username: "test user",
  //     email: "test@email.com",
  //     password: "test",
  //   });
  //   expect(forgotPassword.status).toBe(400);
  //   const parsed = JSON.parse(forgotPassword.text) as ICreateUserResponse;
  //   expect(parsed).toBe("dkfjdkj");
  // });
  // test("POST /user/changePassword hits changePassword route", async () => {
  //   const changePassword = await request(app).post("/user/changePassword").send({
  //     username: "test user",
  //     email: "test@email.com",
  //     password: "test",
  //   });
  //   expect(changePassword.status).toBe(400);
  //   const parsed = JSON.parse(changePassword.text) as ICreateUserResponse;
  //   expect(parsed).toBe("dkfjdkj");
  // });
  test("delete the user we just made from the database", async () => {
    await User.deleteOne({ _id: newUserId });
  });
});