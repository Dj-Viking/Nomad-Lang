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
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const User_1 = require("../entities/User");
const constants_1 = require("../constants");
const connectDb_1 = require("./utils/connectDb");
const helpers_1 = require("./utils/helpers");
const myMutations_1 = require("./graphql/myMutations");
const logger = helpers_1.ColorLog;
describe("log a cookie", () => {
    it("logs", () => {
        new logger("blue", "logging a cookie").genLog();
        let cookie = Buffer.from(JSON.stringify({ "count": 2 })).toString('base64');
        (0, helpers_1.logJson)(cookie);
    });
});
describe("Tests the user register", () => {
    it("get expected response from the register mutation", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("blue", "registering a new user").genLog();
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", constants_1.REGISTER_MUTATION);
        (0, helpers_1.logJson)(res);
        expect(res.register.token).toBeTruthy();
        expect(res.register.errors).toBeNull();
        expect(res.register.user.email).toEqual(constants_1.REGISTER_EMAIL);
    }));
    it("and check that the user got added to the db", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("blue", "checking that the user got added to the DB").genLog();
        const connection = yield (0, connectDb_1.connectDb)();
        const users = yield User_1.User.find({ where: { email: constants_1.REGISTER_EMAIL } });
        (0, helpers_1.logJson)(users);
        expect(users).toHaveLength(1);
        connection.close();
    }));
    it("checks if we try to register with the same credentials it returns an error", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("blue", "trying to register the same user credentials should fail").genLog();
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", constants_1.REGISTER_MUTATION);
        (0, helpers_1.logJson)(res);
        expect(res.register.errors).toHaveLength(1);
    }));
});
describe("do the login mutation", () => {
    it("login the login mutation with email only", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        new logger("blue", "check the login mutation").genLog();
        const payload = {
            options: {
                username: "",
                email: constants_1.REGISTER_EMAIL,
                password: constants_1.REGISTER_PASSWORD
            }
        };
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", (0, myMutations_1.createLoginMutation)(), payload);
        console.log("user response in login", res);
        expect(res.login.errors).toBeNull();
        expect((_a = res.login.user) === null || _a === void 0 ? void 0 : _a.token).toBeTruthy();
        expect((_b = res.login.user) === null || _b === void 0 ? void 0 : _b.email).toEqual(constants_1.REGISTER_EMAIL);
        expect((_c = res.login.user) === null || _c === void 0 ? void 0 : _c.username).toEqual(constants_1.REGISTER_USERNAME);
    }));
    it("login the login mutation with username only", () => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e;
        new logger("blue", "check the login mutation").genLog();
        const payload = {
            options: {
                username: constants_1.REGISTER_USERNAME,
                email: "",
                password: constants_1.REGISTER_PASSWORD
            }
        };
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", (0, myMutations_1.createLoginMutation)(), payload);
        console.log("user response in login", res);
        expect(res.login.errors).toBeNull();
        expect(res.login.token).toBeTruthy();
        expect((_d = res.login.user) === null || _d === void 0 ? void 0 : _d.email).toEqual(constants_1.REGISTER_EMAIL);
        expect((_e = res.login.user) === null || _e === void 0 ? void 0 : _e.username).toEqual(constants_1.REGISTER_USERNAME);
    }));
});
describe("delete the user we just made", () => {
    it("checks if we delete the user we just made", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("green", "checks the delete action").genLog();
        const connection = yield (0, connectDb_1.connectDb)();
        yield User_1.User.delete({ email: constants_1.REGISTER_EMAIL });
        const users = yield User_1.User.find({ where: { email: constants_1.REGISTER_EMAIL } });
        expect(users).toHaveLength(0);
        connection.close();
    }));
});
//# sourceMappingURL=login.test.js.map