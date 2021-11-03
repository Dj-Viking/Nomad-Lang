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
const constants_1 = require("../constants");
const helpers_1 = require("./utils/helpers");
const connectDb_1 = require("./utils/connectDb");
const User_1 = require("../entities/User");
const decodeToken_1 = require("../utils/decodeToken");
const createCategorizedCardsObject_1 = require("./utils/createCategorizedCardsObject");
let creatorId = 0;
let newCardId = 0;
let newUserId = 0;
let newToken = "";
let userEmail = "";
let connection;
const { EXPIRED_TOKEN } = process.env;
describe("Tests the user register", () => {
    it("get expected response from the register mutation", () => __awaiter(void 0, void 0, void 0, function* () {
        new helpers_1.ColorLog("purple", "registering a new user").genLog();
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", constants_1.REGISTER_MUTATION);
        (0, helpers_1.logJson)(res);
        console.log('user', res);
        expect(res.register.token).toBeTruthy();
        expect(typeof res.register.user.id).toBe("number");
        creatorId = res.register.user.id;
        newUserId = res.register.user.id;
        expect(creatorId).toBeTruthy();
        userEmail = res.register.user.email;
        newToken = res.register.token;
        expect(res.register.errors).toBeNull();
        expect(userEmail).toEqual(constants_1.REGISTER_EMAIL);
    }));
    it("and check that the user got added to the db", () => __awaiter(void 0, void 0, void 0, function* () {
        new helpers_1.ColorLog("purple", "checking that the user got added to the DB").genLog();
        connection = yield (0, connectDb_1.connectDb)();
        const users = yield User_1.User.find({ where: { email: constants_1.REGISTER_EMAIL } });
        (0, helpers_1.logJson)(users);
        expect(users).toHaveLength(1);
        connection.close();
    }));
    it("checks if we try to register with the same credentials it returns an error", () => __awaiter(void 0, void 0, void 0, function* () {
        new helpers_1.ColorLog("purple", "trying to register the same user credentials").genLog();
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", constants_1.REGISTER_MUTATION);
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
    it("should successfully add a Card with the proper credentials", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const addCardPayload = {
            options: {
                frontSideText: "add card front side text",
                frontSideLanguage: "add card front side language",
                frontSidePicture: "add card front side picture",
                backSideText: "add card backside text",
                backSideLanguage: "add card backside language",
                backSidePicture: "add card backside picture"
            }
        };
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createAddCardMutation)()}`, { options: addCardPayload.options }, { "authorization": `Bearer ${newToken}` });
        expect(res.addCard.errors).toBeNull();
        (0, helpers_1.logJson)(res.addCard);
        console.log("\x1b[32m", "res add card", res.addCard, "\x1b[00m");
        console.log("\x1b[33m", "creatorId at this point", newUserId, "\x1b[00m");
        const foundCard = (_a = res.addCard.cards) === null || _a === void 0 ? void 0 : _a.filter((card) => card.creatorId === newUserId)[0];
        console.log("did i find the card i just made?", foundCard);
        expect(typeof (foundCard === null || foundCard === void 0 ? void 0 : foundCard.id)).toBe("number");
        expect(typeof (foundCard === null || foundCard === void 0 ? void 0 : foundCard.creatorId)).toBe("number");
        newCardId = foundCard === null || foundCard === void 0 ? void 0 : foundCard.id;
        expect(typeof newCardId).toBe("number");
        expect(foundCard === null || foundCard === void 0 ? void 0 : foundCard.creatorId).toEqual(creatorId);
    }));
    it("checks that we can perform a me query with our new token after registering and also get back a new token", () => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        new helpers_1.ColorLog("yellow", "testing mequery to get a refresh token").genLog();
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createMeQuery)()}`, {}, {
            "authorization": `Bearer ${newToken}`
        });
        console.log("errors length property should be undefined: ", (_b = res.me.errors) === null || _b === void 0 ? void 0 : _b.length);
        expect(res.me.cards).toHaveLength(1);
        const categorizedCardsObj = (0, createCategorizedCardsObject_1.createCategorizedCardsObject)(res.me.cards);
        console.log("\x1b[33m", JSON.stringify(categorizedCardsObj, null, 2));
        expect(categorizedCardsObj).toStrictEqual(JSON.parse(`{
      "add card front side language": {
        "cards": [
          {
            "id": ${newCardId},
            "frontSideText": "add card front side text",
            "frontSideLanguage": "add card front side language",
            "frontSidePicture": "add card front side picture",
            "backSideText": "add card backside text",
            "backSideLanguage": "add card backside language",
            "backSidePicture": "add card front side picture"
          }
        ]
      }
    }`));
        expect(res.me.errors).toBeNull();
        expect(res.me.user.token).toBeTruthy();
        newToken = res.me.user.token;
        console.log("new token", newToken);
        expect(newToken).toBeTruthy();
        console.log("me query response test", res);
    }));
    it("does me query again and checks that the old token is not the same as the one sent back from the me query", () => __awaiter(void 0, void 0, void 0, function* () {
        new helpers_1.ColorLog("yellow", "testing me query again to get a new refresh token should be different than the previous newToken").genLog();
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
        new helpers_1.ColorLog("blue", `me query OLD TOKEN ${newToken}`).genLog();
        new helpers_1.ColorLog("blue", `me query user NEW TOKEN ${newerMe.me.user && newerMe.me.user.token ? newerMe.me.user.token : "couldn't get a token"}`).genLog();
        new helpers_1.ColorLog("blue", `me query outside user NEW TOKEN ${newerMe.me.token}`).genLog();
        expect(newerMe.me.token !== newToken).toBe(true);
    }));
    it("checks if we delete the user we just made", () => __awaiter(void 0, void 0, void 0, function* () {
        connection = yield (0, connectDb_1.connectDb)();
        yield User_1.User.delete({ email: constants_1.REGISTER_EMAIL });
        const users = yield User_1.User.find({ where: { email: constants_1.REGISTER_EMAIL } });
        new helpers_1.ColorLog("green", "deleting a user").genLog();
        (0, helpers_1.logJson)(users);
        expect(users).toHaveLength(0);
        connection.close();
    }));
});
//# sourceMappingURL=categ.test.js.map