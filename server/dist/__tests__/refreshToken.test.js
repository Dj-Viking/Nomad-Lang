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
require("dotenv").config();
const graphql_request_1 = require("graphql-request");
const User_1 = require("../entities/User");
const constants_1 = require("../constants");
const connectDb_1 = require("./utils/connectDb");
const constants_2 = require("../../src/constants");
const helpers_1 = require("../__tests__/utils/helpers");
const decodeToken_1 = require("../utils/decodeToken");
let connection;
const logger = helpers_1.ColorLog;
let newToken = "";
let userEmail = "";
const { EXPIRED_TOKEN } = process.env;
describe("Tests the user register", () => {
    it("get expected response from the register mutation", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("purple", "registering a new user").genLog();
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", constants_2.REGISTER_MUTATION);
        (0, helpers_1.logJson)(res);
        console.log('user', res);
        expect(res.register.token).toBeTruthy();
        expect(typeof res.register.user.id).toBe("number");
        userEmail = res.register.user.email;
        newToken = res.register.token;
        expect(res.register.errors).toBeNull();
        expect(userEmail).toEqual(constants_2.REGISTER_EMAIL);
    }));
    it("and check that the user got added to the db", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("purple", "checking that the user got added to the DB").genLog();
        connection = yield (0, connectDb_1.connectDb)();
        const users = yield User_1.User.find({ where: { email: constants_2.REGISTER_EMAIL } });
        (0, helpers_1.logJson)(users);
        expect(users).toHaveLength(1);
        connection.close();
    }));
    it("checks if we try to register with the same credentials it returns an error", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("purple", "trying to register the same user credentials").genLog();
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", constants_2.REGISTER_MUTATION);
        (0, helpers_1.logJson)(res);
        expect(res.register.errors).toHaveLength(1);
    }));
    it("checks the me query is returning the unauthenticated error", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidToken = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createMeQuery)()}`, {}, { "authorization": `Bearer asdfasdf` });
        console.log("request with invalid token", invalidToken);
        expect(invalidToken.me.errors).toHaveLength(1);
        expect(invalidToken.me.errors[0].message).toBe("401 user not authenticated");
    }));
    it("checks the me query is returning the unauthenticated error", () => __awaiter(void 0, void 0, void 0, function* () {
        const expired = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createMeQuery)()}`, {}, {
            "authorization": `Bearer ${EXPIRED_TOKEN}`
        });
        console.log("request with expired token", expired);
        expect(expired.me.errors).toHaveLength(1);
        expect(expired.me.errors[0].message).toBe("401 user not authenticated");
    }));
    it("checks that we can perform a me query with our new token after registering and also get back a new token", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        new logger("yellow", "testing mequery to get a refresh token").genLog();
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createMeQuery)()}`, {}, {
            "authorization": `Bearer ${newToken}`
        });
        console.log("errors length property should be undefined: ", (_a = res.me.errors) === null || _a === void 0 ? void 0 : _a.length);
        expect(res.me.errors).toBeNull();
        expect(res.me.user.token).toBeTruthy();
        newToken = res.me.user.token;
        console.log("new token", newToken);
        expect(newToken).toBeTruthy();
        console.log("me query response test", res);
    }));
    it("does me query again and checks that the old token is not the same as the one sent back from the me query", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("yellow", "testing me query again to get a new refresh token should be different than the previous newToken").genLog();
        console.log("decoded token previous", (0, decodeToken_1.decodeToken)(newToken));
        function sleep(ms) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, _reject) => {
                    setTimeout(() => {
                        resolve();
                    }, ms);
                });
            });
        }
        yield sleep(1000);
        const newerMe = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createMeQuery)()}`, {}, {
            "authorization": `Bearer ${newToken}`
        });
        new logger("blue", `me query OLD TOKEN ${newToken}`).genLog();
        new logger("blue", `me query user NEW TOKEN ${newerMe.me.user && newerMe.me.user.token ? newerMe.me.user.token : "couldn't get a token"}`).genLog();
        new logger("blue", `me query outside user NEW TOKEN ${newerMe.me.token}`).genLog();
        expect(newerMe.me.token !== newToken).toBe(true);
    }));
    it("checks if we delete the user we just made", () => __awaiter(void 0, void 0, void 0, function* () {
        connection = yield (0, connectDb_1.connectDb)();
        yield User_1.User.delete({ email: constants_2.REGISTER_EMAIL });
        const users = yield User_1.User.find({ where: { email: constants_2.REGISTER_EMAIL } });
        new logger("green", "deleting a user").genLog();
        (0, helpers_1.logJson)(users);
        expect(users).toHaveLength(0);
        connection.close();
    }));
});
//# sourceMappingURL=refreshToken.test.js.map