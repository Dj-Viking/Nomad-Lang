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
const connectDb_1 = require("./utils/connectDb");
const constants_1 = require("../constants");
const helpers_1 = require("./utils/helpers");
const readEnv_1 = require("../utils/readEnv");
(0, readEnv_1.readEnv)();
const { EXPIRED_TOKEN, } = process.env;
const logger = helpers_1.ColorLog;
let newToken = "";
let creatorId = 0;
let newCardId = 0;
let newUserId = 0;
describe("Tests the user register", () => {
    it("get expected response from the register mutation", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("purple", "Registering a new user with new logger class").genLog();
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", constants_1.REGISTER_MUTATION);
        (0, helpers_1.logJson)(res);
        console.log('user', res);
        expect(res.register.errors).toBeNull();
        expect(typeof res.register.user.id).toBe("number");
        creatorId = res.register.user.id;
        newUserId = creatorId;
        expect(res.register.token).toBeTruthy();
        newToken = res.register.token;
        expect(res.register.user.email).toEqual(constants_1.REGISTER_EMAIL);
    }));
    it("and check that the user got added to the db", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("purple", "checking that the user got added to the DB").genLog();
        const connection = yield (0, connectDb_1.connectDb)();
        const users = yield User_1.User.find({ where: { email: constants_1.REGISTER_EMAIL } });
        (0, helpers_1.logJson)(users);
        expect(users).toHaveLength(1);
        connection.close();
    }));
    it("checks if we try to register with the same credentials it returns an error", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("purple", "trying to register the same user").genLog();
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", constants_1.REGISTER_MUTATION);
        (0, helpers_1.logJson)(res);
        expect(res.register.errors).toHaveLength(1);
    }));
});
describe("Tests the card resolvers adding, reading, editing, and deleting", () => {
    it("tries to add a card with a invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
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
        const invalidToken = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createAddCardMutation)()}`, { options: addCardPayload.options }, { "authorization": `Bearer adsfadfs` });
        expect(invalidToken.addCard.errors).toHaveLength(1);
        expect(invalidToken.addCard.errors[0].message).toBe("401 user not authenticated");
    }));
    it("tries to add a card with an expired token", () => __awaiter(void 0, void 0, void 0, function* () {
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
        const invalidToken = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createAddCardMutation)()}`, { options: addCardPayload.options }, { "authorization": `Bearer ${EXPIRED_TOKEN}` });
        expect(invalidToken.addCard.errors).toHaveLength(1);
        expect(invalidToken.addCard.errors[0].message).toBe("401 user not authenticated");
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
        expect(foundCard === null || foundCard === void 0 ? void 0 : foundCard.creatorId).toEqual(creatorId);
    }));
});
describe("checks the getting cards mutation responses", () => {
    it("checks that the card is added to the DB by the creatorId that made the card", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        new logger("purple", "getting the card we just made from the id generated from the add card response").genLog();
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createGetUserCardsQuery)()}`, {}, { "authorization": `Bearer ${newToken}` });
        const foundCreatorCard = (_a = res.getUserCards.cards) === null || _a === void 0 ? void 0 : _a.filter(card => card.creatorId === newUserId)[0];
        expect(res.getUserCards.cards).toHaveLength(1);
        expect(foundCreatorCard === null || foundCreatorCard === void 0 ? void 0 : foundCreatorCard.creatorId).toEqual(newUserId);
        expect(res.getUserCards.errors).toBeNull();
        expect((_b = res.getUserCards.cards) === null || _b === void 0 ? void 0 : _b.length).toBeTruthy();
    }));
    it("checks the error messages are correct when not authenticated (not valid token)", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("purple", "checking for getting cards with invalid token");
        const notFound = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createGetUserCardsQuery)()}`, {}, { "authorization": `Bearer sdf` });
        expect(notFound.getUserCards.errors).toHaveLength(1);
        expect(notFound.getUserCards.errors[0].message).toBe("401 Unauthenticated");
    }));
    it("tries to get user cards with invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidToken = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createGetUserCardsQuery)()}`, {}, { "authorization": `Bearer asdfasdf` });
        expect(invalidToken.getUserCards.errors).toHaveLength(1);
        expect(invalidToken.getUserCards.errors[0].message).toBe("401 Unauthenticated");
    }));
    it("tries to get user cards with expired token", () => __awaiter(void 0, void 0, void 0, function* () {
        const expired = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createGetUserCardsQuery)()}`, {}, { "authorization": `Bearer ${EXPIRED_TOKEN}` });
        expect(expired.getUserCards.errors).toHaveLength(1);
        expect(expired.getUserCards.errors[0].message).toBe("401 Unauthenticated");
    }));
});
describe("checks editing a card", () => {
    describe("checks edit card access control logic", () => {
        it("tries to edit the card with an invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
            const editCardPayload = {
                options: {
                    id: newCardId,
                    frontSideText: constants_1.UPDATED_CARD_TEXT,
                    frontSideLanguage: "TEST LANGUAGE",
                    frontSidePicture: "PICTURE BASE 64 CRAP",
                    backSideText: "BACKSIDE TEXT",
                    backSideLanguage: "Backside language",
                    backSidePicture: "whatever front side will be"
                }
            };
            const invalidToken = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createEditCardMutation)()}`, { options: editCardPayload.options }, { "authorization": `Bearer asdfasdfasdf` });
            expect(invalidToken.editCardById.errors).toHaveLength(1);
            expect(invalidToken.editCardById.errors[0].message).toBe("401 Unauthenticated");
        }));
        it("tries to edit the card with an expired token", () => __awaiter(void 0, void 0, void 0, function* () {
            const editCardPayload = {
                options: {
                    id: newCardId,
                    frontSideText: constants_1.UPDATED_CARD_TEXT,
                    frontSideLanguage: "TEST LANGUAGE",
                    frontSidePicture: "PICTURE BASE 64 CRAP",
                    backSideText: "BACKSIDE TEXT",
                    backSideLanguage: "Backside language",
                    backSidePicture: "whatever front side will be"
                }
            };
            const expiredToken = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createEditCardMutation)()}`, { options: editCardPayload.options }, { "authorization": `Bearer ${EXPIRED_TOKEN}` });
            expect(expiredToken.editCardById.errors).toHaveLength(1);
            expect(expiredToken.editCardById.errors[0].message).toBe("401 Unauthenticated");
        }));
        it("tries to edit the card with a not found cardId", () => __awaiter(void 0, void 0, void 0, function* () {
            const editCardPayload = {
                options: {
                    id: 0,
                    frontSideText: constants_1.UPDATED_CARD_TEXT,
                    frontSideLanguage: "TEST LANGUAGE",
                    frontSidePicture: "PICTURE BASE 64 CRAP",
                    backSideText: "BACKSIDE TEXT",
                    backSideLanguage: "Backside language",
                    backSidePicture: "whatever front side will be"
                }
            };
            const notFound = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createEditCardMutation)()}`, { options: editCardPayload.options }, { "authorization": `Bearer ${newToken}` });
            expect(notFound.editCardById.errors).toHaveLength(1);
            expect(notFound.editCardById.errors[0].message).toBe("404 Card Not Found");
        }));
    });
    it("edits the card that was just added", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        new logger("blue", "editing the card we just added").genLog();
        const editCardPayload = {
            options: {
                id: newCardId,
                frontSideText: constants_1.UPDATED_CARD_TEXT,
                frontSideLanguage: "TEST LANGUAGE",
                frontSidePicture: "PICTURE BASE 64 CRAP",
                backSideText: "BACKSIDE TEXT",
                backSideLanguage: "Backside language",
                backSidePicture: "whatever front side will be"
            }
        };
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createEditCardMutation)()}`, { options: editCardPayload.options }, { "authorization": `Bearer ${newToken}` });
        (0, helpers_1.logJson)(res.editCardById.cards);
        const foundEditedCardIndex = (_a = res.editCardById.cards) === null || _a === void 0 ? void 0 : _a.findIndex((card) => card.id === newCardId);
        expect(res.editCardById.cards[foundEditedCardIndex].frontSideText).toEqual(constants_1.UPDATED_CARD_TEXT);
    }));
});
describe("deletes the cards", () => {
    it("tries to delete Cards with an invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("purple", "deleting the user's Cards that we made").genLog();
        const invalidToken = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createClearUserCardsMutation)()}`, {}, { "authorization": `Bearer al;kdjf;asfj` });
        new logger("red", "should get expired error or unauthed because of a mangled, missing, or invalid token").genLog();
        expect(invalidToken.clearUserCards.errors).toHaveLength(1);
        expect(invalidToken.clearUserCards.errors[0].message).toBe("401 unauthorized or expired token");
    }));
    it("tries to clear Cards with an expired token", () => __awaiter(void 0, void 0, void 0, function* () {
        const expiredToken = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createClearUserCardsMutation)()}`, {}, { "authorization": `Bearer ${EXPIRED_TOKEN}` });
        new logger("red", "should get expired error or unauthed").genLog();
        expect(expiredToken.clearUserCards.errors).toHaveLength(1);
        expect(expiredToken.clearUserCards.errors[0].message).toBe("401 unauthorized or expired token");
    }));
    it("should successfully clear cards", () => __awaiter(void 0, void 0, void 0, function* () {
        const successClear = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createClearUserCardsMutation)()}`, {}, { "authorization": `Bearer ${newToken}` });
        expect(successClear.clearUserCards.errors).toBeNull();
        expect(successClear.clearUserCards.done).toBe(true);
    }));
});
describe("deletes the cards we just made and then deletes the user", () => {
    it("checks the user's cards to see if the deleted card is now missing", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("purple", "checking if the user's cards are gone").genLog();
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", `${(0, helpers_1.createGetUserCardsQuery)()}`, {}, { "authorization": `Bearer ${newToken}` });
        expect(res.getUserCards.errors).toBeNull();
        expect(res.getUserCards.cards).toHaveLength(0);
    }));
    it("deletes the user", () => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield (0, connectDb_1.connectDb)();
        yield User_1.User.delete({ email: constants_1.REGISTER_EMAIL });
        const users = yield User_1.User.find({ where: { email: constants_1.REGISTER_EMAIL } });
        new logger("green", `deleting a user ${users}`).genLog();
        (0, helpers_1.logJson)(users);
        expect(users).toHaveLength(0);
        connection.close();
    }));
});
//# sourceMappingURL=card.test.js.map