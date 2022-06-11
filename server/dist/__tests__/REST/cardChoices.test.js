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
let newCardId = null;
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
        expect(typeof parsed.cards[0].frontSideLanguage).toBe("string");
        expect(parsed.cards[0].frontSideLanguage).toBe(constants_1.MOCK_ADD_CARD.frontSideLanguage);
        newCardId = parsed.cards[0]._id;
        expect(parsed.cards[0].creator).toBe("test user");
        expect(typeof parsed.cards[0].createdAt).toBe("string");
        expect(typeof parsed.cards[0].updatedAt).toBe("string");
    }));
    test("/PUT /user/editCard/:id add in the choices using the edit card endpoint", () => __awaiter(void 0, void 0, void 0, function* () {
        const edit = yield (0, supertest_1.default)(app)
            .put(`/user/editCard/${newCardId}`)
            .send({
            choices: constants_1.MOCK_CARD_CHOICES
        })
            .set({
            "authorization": `Bearer ${newUserToken}`
        });
        expect(edit.status).toBe(200);
        const parsed = JSON.parse(edit.text);
        expect(parsed.cards[0].choices[0].text).toBe(constants_1.MOCK_CARD_CHOICES[0].text);
    }));
    test("delete the user we just made from the database", () => __awaiter(void 0, void 0, void 0, function* () {
        yield models_1.User.deleteOne({ _id: newUserId });
    }));
});
//# sourceMappingURL=cardChoices.test.js.map