/* eslint-disable */
import request from "supertest";
import mongoose from "mongoose";
import createServer from "../../app";
import { ICard, ICreateUserResponse, IMeResponse, IUserAddChoicesResponse, IUserCreateCardResponse, IUserEditCardResponse } from "../../types";
import { MOCK_ADD_CARD, MOCK_CARD_CHOICES } from "../../constants";
import { User } from "../../models";

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


describe("test adding in the card choices to the user's db card collection", () => {

    //set up the user with the a mock card and choices
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

    test("POST /user/addCard hits add card route", async () => {
        const addCard = await request(app)
            .post("/user/addCard")
            .set({
                authorization: `Bearer ${newUserToken}`,
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

    test("/PUT /user/editCard/:id add in the choices using the edit card endpoint", async () => {
        const edit = await request(app)
            .put(`/user/editCard/${newCardId}`)
            .send({
                choices: MOCK_CARD_CHOICES
            })
            .set({
                "authorization": `Bearer ${newUserToken}`
            });
        expect(edit.status).toBe(200);
        const parsed = JSON.parse(edit.text) as IUserEditCardResponse;
        expect(parsed.cards[0].choices![0].text).toBe(MOCK_CARD_CHOICES[0].text);
    });

    test("/PUT /user/addChoicesToCards/:id add choices to cards in new endpoint for simplicity", async () => {
        const add_choices = await request(app).put(`/user/addChoicesToCards`).send({
            choices: MOCK_CARD_CHOICES
        }).set({
            "authorization": `Bearer ${newUserToken}`
        });
        expect(add_choices.status).toBe(200);
        const parsed = JSON.parse(add_choices.text) as IUserAddChoicesResponse
        expect(parsed.result).toBe(true);
    });

    test("/GET /user/me check user's cards for choices in them after choices endpoint has been called", async () => {
        const user = await request(app).get("/user/me").set({
            "authorization": `Bearer ${newUserToken}`
        });
        expect(user.status).toBe(200);
        const parsed = JSON.parse(user.text) as IMeResponse;
        expect(parsed.user.cards).toHaveLength(1);
        expect(parsed.user.cards![0].choices).toHaveLength(4);
    });

    test("delete the user we just made from the database", async () => {
        await User.deleteOne({ _id: newUserId });
    });
});