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
  IUserEditCardResponse,
  IUserDeleteCardResponse,
} from "../../types";
import { MOCK_ADD_CARD, MOCK_EDIT_CARD } from "../../constants";

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost/rest-cats-test", {});
});

afterAll(async () => {
  mongoose.connection.db.dropDatabase(async () => {
    await mongoose.connection.close();
  });
});
const app = createServer();
let newCardId: string | null = null;
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
    expect(typeof parsed._id).toBe("string");
    newUserId = parsed._id;
    expect(typeof parsed.token).toBe("string");
    expect(parsed.cards).toStrictEqual([]);
    newUserToken = parsed.token as string;
    expect(typeof newUserToken).toBe("string");
  });
  test("POST /user/login hits login route", async () => {
    const login = await request(app).post("/user/login").send({
      email: "test@email.com",
      password: "test",
    });
    expect(login.status).toBe(200);
    const parsed = JSON.parse(login.text) as ILoginResponse;
    expect(typeof parsed._id).toBe("string");
    expect(typeof parsed.token).toBe("string");
    newUserToken = parsed.token as string;
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
    expect(typeof parsed.cards[0]._id).toBe("string");
    expect(typeof parsed.cards[0].frontSideLanguage).toBe("string");
    expect(parsed.cards[0].frontSideLanguage).toBe(MOCK_ADD_CARD.frontSideLanguage);
    newCardId = parsed.cards[0]._id as string;
    expect(parsed.cards[0].creator).toBe("test user");
    expect(typeof parsed.cards[0].createdAt).toBe("string");
    expect(typeof parsed.cards[0].updatedAt).toBe("string");
  });

  test("POST /user/addCard hits add card route adds another card to see if theres two", async () => {
    const addCard = await request(app)
      .post("/user/addCard")
      .set({
        authorization: `Bearer ${newestUserToken}`,
      })
      .send(MOCK_ADD_CARD as ICard);
    expect(addCard.status).toBe(200);
    const parsed = JSON.parse(addCard.text) as IUserCreateCardResponse;
    expect(parsed.cards).toHaveLength(2);
    expect(typeof parsed.cards[0]._id).toBe("string");
    expect(parsed.cards[0].creator).toBe("test user");
    expect(typeof parsed.cards[0].createdAt).toBe("string");
    expect(typeof parsed.cards[0].updatedAt).toBe("string");
  });

  test("PUT /user/editCard/:id test a user can edit their cards by id", async () => {
    const editCard = await request(app)
      .put(`/user/editCard/${newCardId}`)
      .set({
        authorization: `Bearer ${newestUserToken}`,
      })
      .send(MOCK_EDIT_CARD);
    expect(editCard.status).toBe(200);
    const parsed = JSON.parse(editCard.text) as IUserEditCardResponse;
    expect(parsed.cards).toHaveLength(2);
    expect(parsed.cards[0].frontSideLanguage).toBe(MOCK_EDIT_CARD.frontSideLanguage); //"edited language"
  });
  test("PUT /user/editCard/:id try to edit card with empty body", async () => {
    const editCard = await request(app)
      .put(`/user/editCard/${newCardId}`)
      .set({
        authorization: `Bearer ${newestUserToken}`,
      });
    expect(editCard.status).toBe(400);
    expect(JSON.parse(editCard.text).error).toBe(
      "Need to provide fields to the json body that match a card's schema properties"
    );
  });
  test("PUT /user/editCard/:id try to edit card badId", async () => {
    const badId = await request(app)
      .put(`/user/editCard/dkfjkdfjkdjkf`)
      .set({
        authorization: `Bearer ${newestUserToken}`,
      });
    expect(badId.status).toBe(400);
    expect(JSON.parse(badId.text).error).toBe(
      "Bad request, id parameter was not a valid id format"
    );
  });
  test("DELETE /user/deleteCard/:id user can delete a card", async () => {
    const deleted = await request(app)
      .delete(`/user/deleteCard/${newCardId}`)
      .set({
        authorization: `Bearer ${newestUserToken}`,
      });
    expect(deleted.status).toBe(200);
    const parsed = JSON.parse(deleted.text) as IUserDeleteCardResponse;
    expect(parsed.cards).toHaveLength(1);
  });
  test("DELETE /user/deleteCard/:id with bogus id param", async () => {
    const badId = await request(app)
      .delete("/user/deleteCard/ksdjfkjdsfjk")
      .set({
        authorization: `Bearer ${newestUserToken}`,
      });
    expect(badId.status).toBe(400);
    expect(JSON.parse(badId.text).error).toBe("Could not delete a card at this time");
  });
  test("PUT /user/clearCards update user cards clearing them", async () => {
    const cleared = await request(app)
      .put("/user/clearCards")
      .set({
        authorization: `Bearer ${newestUserToken}`,
      });
    expect(cleared.status).toBe(200);
    const parsed = JSON.parse(cleared.text);
    expect(parsed.user.cards).toHaveLength(0);
  });
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
