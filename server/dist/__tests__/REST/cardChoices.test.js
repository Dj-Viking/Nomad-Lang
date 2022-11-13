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
const app_1 = __importDefault(require("../../app"));
const constants_1 = require("../../constants");
const models_1 = require("../../models");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect("mongodb://localhost/rest-cats-test", {});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connection.db.dropDatabase(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
}));
const app = (0, app_1.default)();
let newUserId = null;
let newUserToken = null;
describe("test adding in the card choices to the user's db card collection", () => {
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
    test("POST /user/addCard hits add card route", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const addCard = yield (0, supertest_1.default)(app)
            .post("/user/addCard")
            .set({
            authorization: `Bearer ${newUserToken}`,
        })
            .send(constants_1.MOCK_ADD_CARD);
        expect(addCard.status).toBe(200);
        const parsed = JSON.parse(addCard.text);
        expect(parsed.cards).toHaveLength(1);
        expect(typeof parsed.cards[0]._id).toBe("string");
        expect((_a = parsed.cards[0]) === null || _a === void 0 ? void 0 : _a.frontSideLanguage).toBe(constants_1.MOCK_ADD_CARD.frontSideLanguage);
        expect((_b = parsed.cards[0]) === null || _b === void 0 ? void 0 : _b.creator).toBe("test user");
        expect(typeof ((_c = parsed.cards[0]) === null || _c === void 0 ? void 0 : _c.createdAt)).toBe("number");
        expect(typeof ((_d = parsed.cards[0]) === null || _d === void 0 ? void 0 : _d.updatedAt)).toBe("number");
    }));
    test("just keep adding some cards", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app).post("/user/addCard").set({ authorization: `Bearer ${newUserToken}`, }).send(constants_1.MOCK_ADD_CARD);
        yield (0, supertest_1.default)(app).post("/user/addCard").set({ authorization: `Bearer ${newUserToken}`, }).send(constants_1.MOCK_ADD_CARD);
        yield (0, supertest_1.default)(app).post("/user/addCard").set({ authorization: `Bearer ${newUserToken}`, }).send(constants_1.MOCK_ADD_CARD);
        yield (0, supertest_1.default)(app).post("/user/addCard").set({ authorization: `Bearer ${newUserToken}`, }).send(constants_1.MOCK_ADD_CARD);
        yield (0, supertest_1.default)(app).post("/user/addCard").set({ authorization: `Bearer ${newUserToken}`, }).send(constants_1.MOCK_ADD_CARD);
        yield (0, supertest_1.default)(app).post("/user/addCard").set({ authorization: `Bearer ${newUserToken}`, }).send(constants_1.MOCK_ADD_CARD);
    }));
    test("/PUT /user/addChoicesToCards/:id add choices to cards in new endpoint for simplicity", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield models_1.User.findOne({ _id: newUserId });
        const add_choices = yield (0, supertest_1.default)(app).put(`/user/addChoicesToCards`).send({
            cardIds: user === null || user === void 0 ? void 0 : user.cards.map(card => card === null || card === void 0 ? void 0 : card._id.toHexString()),
            choices: constants_1.MOCK_CARD_CHOICES
        }).set({
            "authorization": `Bearer ${newUserToken}`
        });
        if (add_choices.status !== 200) {
            console.log("error?", JSON.parse(add_choices.text));
        }
        expect(add_choices.status).toBe(200);
        const parsed = JSON.parse(add_choices.text);
        expect(parsed.result).toBe(true);
    }));
    test("/GET /user/me check user's cards for choices in them after choices endpoint has been called", () => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        const user = yield (0, supertest_1.default)(app).get("/user/me").set({
            "authorization": `Bearer ${newUserToken}`
        });
        expect(user.status).toBe(200);
        const parsed = JSON.parse(user.text);
        expect(parsed.user.cards).toHaveLength(7);
        const userCards = yield models_1.Card.find({ creator: parsed.user.username });
        expect((_e = userCards[0]) === null || _e === void 0 ? void 0 : _e.choices).toHaveLength(4);
    }));
    test("delete the user we just made from the database", () => __awaiter(void 0, void 0, void 0, function* () {
        yield models_1.User.deleteOne({ _id: newUserId });
    }));
});
//# sourceMappingURL=cardChoices.test.js.map