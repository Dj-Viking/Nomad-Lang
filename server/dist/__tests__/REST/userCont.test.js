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
describe("CRUD user tests", () => {
    test("POST /user/signup hits signup route", () => __awaiter(void 0, void 0, void 0, function* () {
        const signup = yield (0, supertest_1.default)(app).post("/user/signup").send({
            username: "test user",
            email: "test@email.com",
            password: "test",
        });
        expect(signup.status).toBe(400);
        const parsed = JSON.parse(signup.text);
        expect(parsed).toBe("dkfjdkj");
        expect(typeof parsed.user._id).toBe("string");
        newUserId = parsed.user._id;
        expect(typeof parsed.user.token).toBe("string");
        newUserToken = parsed.user.token;
    }));
    test("POST /user/login hits login route", () => __awaiter(void 0, void 0, void 0, function* () {
        const login = yield (0, supertest_1.default)(app).post("/user/login").send({
            email: "test@email.com",
            password: "test",
        });
        expect(login.status).toBe(400);
        const parsed = JSON.parse(login.text);
        expect(parsed).toBe("dkfjdkj");
    }));
    test("POST /me get me query", () => __awaiter(void 0, void 0, void 0, function* () {
        const me = yield (0, supertest_1.default)(app)
            .get("/user/me")
            .set({
            authorization: `Bearer ${newUserToken}`,
        });
        expect(me.status).toBe(400);
    }));
    test("POST /user/forgotPassword hits forgotPassword route", () => __awaiter(void 0, void 0, void 0, function* () {
        const forgotPassword = yield (0, supertest_1.default)(app).post("/user/forgotPassword").send({
            username: "test user",
            email: "test@email.com",
            password: "test",
        });
        expect(forgotPassword.status).toBe(400);
        const parsed = JSON.parse(forgotPassword.text);
        expect(parsed).toBe("dkfjdkj");
    }));
    test("POST /user/changePassword hits changePassword route", () => __awaiter(void 0, void 0, void 0, function* () {
        const changePassword = yield (0, supertest_1.default)(app).post("/user/changePassword").send({
            username: "test user",
            email: "test@email.com",
            password: "test",
        });
        expect(changePassword.status).toBe(400);
        const parsed = JSON.parse(changePassword.text);
        expect(parsed).toBe("dkfjdkj");
    }));
    test("delete the user we just made from the database", () => __awaiter(void 0, void 0, void 0, function* () {
        yield models_1.User.deleteOne({ _id: newUserId });
    }));
});
//# sourceMappingURL=userCont.test.js.map