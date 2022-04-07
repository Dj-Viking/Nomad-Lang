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
const signToken_1 = require("../../utils/signToken");
const app_1 = __importDefault(require("../../app"));
const uuid = require("uuid");
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
describe("test change password feature", () => {
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
    }));
    test("PUT /user/changePassword test the password gets changed", () => __awaiter(void 0, void 0, void 0, function* () {
        const token = (0, signToken_1.signToken)({
            username: "test user",
            resetEmail: "test@email.com",
            uuid: uuid.v4(),
            exp: "5m",
        });
        const change = yield (0, supertest_1.default)(app)
            .put("/user/changePassword")
            .set({
            authorization: `Bearer ${token}`,
        })
            .send({
            newPassword: "kdjfkdjf",
        });
        expect(change.status).toBe(200);
    }));
    test("POST /user/login login the user with the new password", () => __awaiter(void 0, void 0, void 0, function* () {
        const login = yield (0, supertest_1.default)(app).post("/user/login").send({
            email: "test@email.com",
            password: "kdjfkdjf",
        });
        expect(login.status).toBe(200);
        const parsed = JSON.parse(login.text);
        expect(parsed.email).toBe("test@email.com");
    }));
});
//# sourceMappingURL=changePassword.test.js.map