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
jest.mock("../../utils/sendEmail.ts");
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
const app = (0, app_1.default)();
describe("test the reset email function", () => {
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
        expect(parsed.cards).toStrictEqual([]);
        newUserToken = parsed.token;
        expect(typeof newUserToken).toBe("string");
    }));
    test("POST /user/forgotPassword hits endpoint with bad email but still sends 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const forgot = yield (0, supertest_1.default)(app).post("/user/forgotPassword").send({
            email: "kdjfkdjf",
        });
        expect(forgot.status).toBe(200);
    }));
    test("POST /user/forgotPassword hits forgotPassword route without email arg", () => __awaiter(void 0, void 0, void 0, function* () {
        const forgotPassword = yield (0, supertest_1.default)(app)
            .post("/user/forgotPassword")
            .send({
            email: void 0,
        });
        expect(forgotPassword.status).toBe(422);
        const parsed = JSON.parse(forgotPassword.text);
        expect(parsed.error).toBe("email missing from request!");
    }));
    test("POST /user/forgotPassword hits forgotPassword route without correctly formatted email send 200 anyway", () => __awaiter(void 0, void 0, void 0, function* () {
        const forgotPassword = yield (0, supertest_1.default)(app).post("/user/forgotPassword").send({
            email: "kdjfkdjfkdk",
        });
        expect(forgotPassword.status).toBe(200);
        const parsed = JSON.parse(forgotPassword.text);
        expect(parsed.done).toBe(true);
    }));
    test("POST /user/forgotPassword even if email doesn't exist just return 200 obscurely", () => __awaiter(void 0, void 0, void 0, function* () {
        const forgotPassword = yield (0, supertest_1.default)(app).post("/user/forgotPassword").send({
            email: "test1@email.com",
        });
        expect(forgotPassword.status).toBe(200);
        const parsed = JSON.parse(forgotPassword.text);
        expect(parsed.done).toBe(true);
    }));
    test("POST /user/forgotPassword hits forgotPassword route with a correct email and a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const forgotPassword = yield (0, supertest_1.default)(app).post("/user/forgotPassword").send({
            email: "test@email.com",
        });
        expect(forgotPassword.status).toBe(200);
        const parsed = JSON.parse(forgotPassword.text);
        expect(parsed.done).toBe(true);
    }));
});
//# sourceMappingURL=resetEmail.test.js.map