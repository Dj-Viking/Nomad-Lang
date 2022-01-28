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
    test("POST /user/signup creates a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const signup = yield (0, supertest_1.default)(app).post("/user/signup").send({
            username: "test user",
            email: "test@email.com",
            password: "test",
        });
        expect(signup.status).toBe(201);
        const parsed = JSON.parse(signup.text);
        expect(typeof parsed.user._id).toBe("string");
        newUserId = parsed.user._id;
        expect(typeof parsed.user.token).toBe("string");
        expect(parsed.user.cards).toStrictEqual([]);
        newUserToken = parsed.user.token;
        expect(typeof newUserToken).toBe("string");
    }));
    test("POST /user/login hits login route", () => __awaiter(void 0, void 0, void 0, function* () {
        const login = yield (0, supertest_1.default)(app).post("/user/login").send({
            email: "test@email.com",
            password: "test",
        });
        expect(login.status).toBe(200);
        const parsed = JSON.parse(login.text);
        expect(typeof parsed.user._id).toBe("string");
        expect(typeof parsed.user.token).toBe("string");
        newUserToken = parsed.user.token;
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
        newCardId = parsed.cards[0]._id;
        expect(parsed.cards[0].creator).toBe("test user");
        expect(typeof parsed.cards[0].createdAt).toBe("string");
        expect(typeof parsed.cards[0].updatedAt).toBe("string");
    }));
    test("POST /user/addCard hits add card route adds another card to see if theres two", () => __awaiter(void 0, void 0, void 0, function* () {
        const addCard = yield (0, supertest_1.default)(app)
            .post("/user/addCard")
            .set({
            authorization: `Bearer ${newestUserToken}`,
        })
            .send(constants_1.MOCK_ADD_CARD);
        expect(addCard.status).toBe(200);
        const parsed = JSON.parse(addCard.text);
        expect(parsed.cards).toHaveLength(2);
        expect(typeof parsed.cards[0]._id).toBe("string");
        expect(parsed.cards[0].creator).toBe("test user");
        expect(typeof parsed.cards[0].createdAt).toBe("string");
        expect(typeof parsed.cards[0].updatedAt).toBe("string");
    }));
    test("PUT /user/editCard test a user can edit their cards by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const editCard = yield (0, supertest_1.default)(app)
            .put(`/user/editCard/${newCardId}`)
            .set({
            authorization: `Bearer ${newestUserToken}`,
        })
            .send(constants_1.MOCK_EDIT_CARD);
        expect(editCard.status).toBe(200);
        const parsed = JSON.parse(editCard.text);
        expect(parsed.cards).toHaveLength(2);
        expect(parsed.cards[0].frontsideLanguage).toBe(constants_1.MOCK_EDIT_CARD.frontsideLanguage);
    }));
    test("PUT /user/editCard try to edit card with empty body", () => __awaiter(void 0, void 0, void 0, function* () {
        const editCard = yield (0, supertest_1.default)(app)
            .put(`/user/editCard/${newCardId}`)
            .set({
            authorization: `Bearer ${newestUserToken}`,
        });
        expect(editCard.status).toBe(400);
        expect(JSON.parse(editCard.text).error).toBe("Need to provide fields to the json body that match a card's schema properties");
    }));
    test("DELETE /user/deleteCard user can delete a card", () => __awaiter(void 0, void 0, void 0, function* () {
        const deleted = yield (0, supertest_1.default)(app)
            .delete(`/user/deleteCard/${newCardId}`)
            .set({
            authorization: `Bearer ${newestUserToken}`,
        });
        expect(deleted.status).toBe(200);
        const parsed = JSON.parse(deleted.text);
        expect(parsed.cards).toHaveLength(1);
    }));
    test("delete the user we just made from the database", () => __awaiter(void 0, void 0, void 0, function* () {
        yield models_1.User.deleteOne({ _id: newUserId });
    }));
});
//# sourceMappingURL=userCont.test.js.map