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
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const app = (0, app_1.default)();
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect("mongodb://localhost/rest-cats-test", {});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connection.db.dropDatabase(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
}));
let newUserId = null;
let newUserToken = null;
describe("test the user theme api request changes user theme in their database", () => {
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
        expect(typeof newUserId).toBe("string");
        expect(typeof parsed.token).toBe("string");
        newUserToken = parsed.token;
        expect(typeof newUserToken).toBe("string");
        expect(parsed.cards).toStrictEqual([]);
        expect(parsed.themePref).toBe("light");
    }));
    test("PUT /user/changeThemePref change the users theme from light to dark", () => __awaiter(void 0, void 0, void 0, function* () {
        const update = yield (0, supertest_1.default)(app)
            .put("/user/changeThemePref")
            .send({
            themePref: "dark",
        })
            .set({
            authorization: `Bearer ${newUserToken}`,
        });
        expect(update.status).toBe(200);
        const parsed = JSON.parse(update.text);
        expect(parsed.themePref).toBe("dark");
    }));
});
//# sourceMappingURL=userTheme.test.js.map