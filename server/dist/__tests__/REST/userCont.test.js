"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../../models");
const app_1 = __importDefault(require("../../app"));
const constants_1 = require("../../constants");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect("mongodb://localhost/rest-cats-test", {});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connection.db.dropDatabase(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
}));
const app = (0, app_1.default)();
let newCardId = null;
let newUserId = null;
let newUserToken = null;
let newestUserToken = null;
describe("CRUD user tests", () => {
    test("POST /user/signup tries to create user without input args", () => __awaiter(void 0, void 0, void 0, function* () {
        const missing1 = yield (0, supertest_1.default)(app).post("/user/signup").send({
            username: "kdjfkdkjf",
        });
        expect(missing1.status).toBe(400);
        const missing2 = yield (0, supertest_1.default)(app).post("/user/signup").send({
            email: "kdjfkdkjf@dkjfkd.com",
        });
        expect(missing2.status).toBe(400);
        const missing3 = yield (0, supertest_1.default)(app).post("/user/signup").send({
            password: "kdjfkdkjf@dkjfkd.com",
        });
        expect(missing3.status).toBe(400);
        const missing4 = yield (0, supertest_1.default)(app).post("/user/signup").send({
            username: "kdjfkdkjf@dkjfkd.com",
            email: "kdjfkdkjf@dkjfkd.com",
        });
        expect(missing4.status).toBe(400);
    }));
    test("POST /user/signup signup with wrong email format", () => __awaiter(void 0, void 0, void 0, function* () {
        const wrongEmail = yield (0, supertest_1.default)(app).post("/user/signup").send({
            username: "kdjfj",
            email: "kjdfkjd",
            password: "kdjfkjd",
        });
        expect(wrongEmail.status).toBe(400);
        const parsed = JSON.parse(wrongEmail.text);
        expect(parsed.error).toBe("Email was not correct format");
    }));
    test("POST /user/signup creates a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const signup = yield (0, supertest_1.default)(app).post("/user/signup").send({
            username: "test user",
            email: "test@email.com",
            password: "test",
        });
        expect(signup.status).toBe(201);
        const parsed = JSON.parse(signup.text);
        expect(typeof parsed._id).toBe("string");
        newUserId = parsed._id;
        expect(typeof parsed.token).toBe("string");
        expect(parsed.cards).toStrictEqual([]);
        newUserToken = parsed.token;
        expect(typeof newUserToken).toBe("string");
    }));
    test("POST /user/login with only username", () => __awaiter(void 0, void 0, void 0, function* () {
        const login = yield (0, supertest_1.default)(app).post("/user/login").send({
            username: "test user",
            password: "test",
        });
        expect(login.status).toBe(200);
    }));
    test("POST /user/login hits login route", () => __awaiter(void 0, void 0, void 0, function* () {
        const login = yield (0, supertest_1.default)(app).post("/user/login").send({
            email: "test@email.com",
            password: "test",
        });
        expect(login.status).toBe(200);
        const parsed = JSON.parse(login.text);
        expect(typeof parsed._id).toBe("string");
        expect(typeof parsed.token).toBe("string");
        newUserToken = parsed.token;
        expect(typeof newUserToken).toBe("string");
    }));
    test("POST /user/login with bad credentials no email", () => __awaiter(void 0, void 0, void 0, function* () {
        const login = yield (0, supertest_1.default)(app)
            .post("/user/login")
            .send({
            email: void 0,
            password: "test",
        });
        expect(login.status).toBe(400);
        const parsed = JSON.parse(login.text);
        expect(parsed.error).toBe("Incorrect Credentials");
    }));
    test("POST /user/login with bad credentials no bad password", () => __awaiter(void 0, void 0, void 0, function* () {
        const login = yield (0, supertest_1.default)(app).post("/user/login").send({
            email: "test@email.com",
            password: "testsdfd",
        });
        expect(login.status).toBe(400);
        const parsed = JSON.parse(login.text);
        expect(parsed.error).toBe("Incorrect Credentials");
    }));
    test("GET /me get me query", () => __awaiter(void 0, void 0, void 0, function* () {
        const me = yield (0, supertest_1.default)(app)
            .get("/user/me")
            .set({
            authorization: `Bearer ${newUserToken}`,
        });
        expect(me.status).toBe(200);
        const parsed = JSON.parse(me.text);
        expect(typeof parsed.user.token).toBe("string");
        newestUserToken = parsed.user.token;
        expect(typeof newestUserToken).toBe("string");
        expect(newestUserToken).not.toBe(newUserToken);
    }));
    test("POST /user/addCard tries to add card without token", () => __awaiter(void 0, void 0, void 0, function* () {
        const noToken = yield (0, supertest_1.default)(app)
            .post("/user/addCard")
            .send(constants_1.MOCK_ADD_CARD);
        expect(noToken.status).toBe(401);
    }));
    test("POST /user/addCard hits add card route", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const addCard = yield (0, supertest_1.default)(app)
            .post("/user/addCard")
            .set({
            authorization: `Bearer ${newestUserToken}`,
        })
            .send(constants_1.MOCK_ADD_CARD);
        expect(addCard.status).toBe(200);
        const parsed = JSON.parse(addCard.text);
        expect(parsed.cards).toHaveLength(1);
        expect(typeof parsed.cards[0]._id).toBe("string");
        expect(typeof parsed.cards[0]).toBe("object");
        newCardId = parsed.cards[0]._id;
        expect(typeof ((_a = parsed.cards[0]) === null || _a === void 0 ? void 0 : _a.frontSideLanguage)).toBe("string");
        expect((_b = parsed.cards[0]) === null || _b === void 0 ? void 0 : _b.frontSideLanguage).toBe(constants_1.MOCK_ADD_CARD.frontSideLanguage);
        expect((_c = parsed.cards[0]) === null || _c === void 0 ? void 0 : _c.creator).toBe("test user");
        expect(typeof ((_d = parsed.cards[0]) === null || _d === void 0 ? void 0 : _d.createdAt)).toBe("number");
        expect(typeof ((_e = parsed.cards[0]) === null || _e === void 0 ? void 0 : _e.updatedAt)).toBe("number");
    }));
    test("POST /user/addCard hits add card route adds another card to see if theres two", () => __awaiter(void 0, void 0, void 0, function* () {
        var _f, _g, _h, _j;
        const addCard = yield (0, supertest_1.default)(app)
            .post("/user/addCard")
            .set({
            authorization: `Bearer ${newestUserToken}`,
        })
            .send(constants_1.MOCK_ADD_CARD);
        expect(addCard.status).toBe(200);
        const parsed = JSON.parse(addCard.text);
        expect(parsed.cards).toHaveLength(2);
        const cards = yield models_1.Card.find({ _id: newCardId });
        expect(typeof ((_f = cards[0]) === null || _f === void 0 ? void 0 : _f._id.toHexString())).toBe("string");
        expect((_g = cards[0]) === null || _g === void 0 ? void 0 : _g.creator).toBe("test user");
        expect(typeof ((_h = cards[0]) === null || _h === void 0 ? void 0 : _h.createdAt)).toBe("number");
        expect(typeof ((_j = cards[0]) === null || _j === void 0 ? void 0 : _j.updatedAt)).toBe("number");
    }));
    test("GET /user/me get user cards on me query", () => __awaiter(void 0, void 0, void 0, function* () {
        const me = yield (0, supertest_1.default)(app)
            .get("/user/me")
            .set({
            authorization: `Bearer ${newUserToken}`,
        });
        expect(me.status).toBe(200);
        const parsed = JSON.parse(me.text);
        expect(parsed.user.cards).toHaveLength(2);
    }));
    test("PUT /user/editCard/:id test a user can edit their cards by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const editCard = yield (0, supertest_1.default)(app)
            .put(`/user/editCard/${newCardId}`)
            .set({
            authorization: `Bearer ${newestUserToken}`,
        })
            .send(constants_1.MOCK_EDIT_CARD);
        expect(editCard.status).toBe(200);
        const card = yield models_1.Card.findOne({ _id: newCardId });
        expect(card === null || card === void 0 ? void 0 : card.frontSideLanguage).toBe(constants_1.MOCK_EDIT_CARD.frontSideLanguage);
    }));
    test("PUT /user/editCard/:id try to edit card with empty body", () => __awaiter(void 0, void 0, void 0, function* () {
        const editCard = yield (0, supertest_1.default)(app)
            .put(`/user/editCard/${newCardId}`)
            .set({
            authorization: `Bearer ${newestUserToken}`,
        });
        expect(editCard.status).toBe(422);
        expect(JSON.parse(editCard.text).error).toBe("Unprocessable body");
    }));
    test("PUT /user/editCard/:id try to edit card badId", () => __awaiter(void 0, void 0, void 0, function* () {
        const badId = yield (0, supertest_1.default)(app)
            .put(`/user/editCard/dkfjkdfjkdjkf`)
            .send({ something: "dkjfkdj" })
            .set({
            authorization: `Bearer ${newestUserToken}`,
        });
        expect(badId.status).toBe(400);
        expect(JSON.parse(badId.text).error).toBe("Bad request, id parameter was not a valid id format");
    }));
    test("DELETE /user/deleteCard/:id user can delete a card", () => __awaiter(void 0, void 0, void 0, function* () {
        const deleted = yield (0, supertest_1.default)(app)
            .delete(`/user/deleteCard/${newCardId}`)
            .set({
            authorization: `Bearer ${newestUserToken}`,
        });
        expect(deleted.status).toBe(200);
        const parsed = JSON.parse(deleted.text);
        expect(parsed.cards).toHaveLength(1);
    }));
    test("DELETE /user/deleteCard/:id with bogus id param", () => __awaiter(void 0, void 0, void 0, function* () {
        const badId = yield (0, supertest_1.default)(app)
            .delete("/user/deleteCard/ksdjfkjdsfjk")
            .set({
            authorization: `Bearer ${newestUserToken}`,
        });
        expect(badId.status).toBe(404);
        expect(JSON.parse(badId.text).error).toBe("Card not found");
    }));
    test("PUT /user/clearCards update user cards clearing them", () => __awaiter(void 0, void 0, void 0, function* () {
        const cleared = yield (0, supertest_1.default)(app)
            .put("/user/clearCards")
            .set({
            authorization: `Bearer ${newestUserToken}`,
        });
        expect(cleared.status).toBe(200);
        const parsed = JSON.parse(cleared.text);
        expect(parsed.user.cards).toHaveLength(0);
    }));
    test("delete the user we just made from the database", () => __awaiter(void 0, void 0, void 0, function* () {
        yield models_1.User.deleteOne({ _id: newUserId });
    }));
});
//# sourceMappingURL=userCont.test.js.map