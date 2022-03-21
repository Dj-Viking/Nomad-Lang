import mongoose from "mongoose";
import request from "supertest";
import { IChangeThemeResponse, ICreateUserResponse } from "types";
import createServer from "../../app";
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
let newUserToken: null | string = null;
describe("test the user theme api request changes user theme in their database", () => {
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
    expect(typeof newUserId).toBe("string");
    expect(typeof parsed.user.token).toBe("string");
    newUserToken = parsed.user.token as string;
    expect(typeof newUserToken).toBe("string");
    expect(parsed.user.cards).toStrictEqual([]);
    expect(parsed.user.themePref).toBe("light");
  });
  // change their theme
  test("PUT /user/changeThemePref change the users theme from light to dark", async () => {
    const update = await request(app)
      .put("/user/changeThemePref")
      .send({
        themePref: "dark",
      })
      .set({
        authorization: `Bearer ${newUserToken}`,
      });
    expect(update.status).toBe(200);
    const parsed = JSON.parse(update.text) as IChangeThemeResponse;
    expect(parsed.themePref).toBe("dark");
  });
});
