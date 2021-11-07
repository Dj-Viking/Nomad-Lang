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
const constants_2 = require("../../src/constants");
const helpers_1 = require("../__tests__/utils/helpers");
let connection;
const logger = helpers_1.ColorLog;
describe("Tests the user register", () => {
    it("get expected response from the register mutation", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("blue", "registering a new user").genLog();
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", constants_2.REGISTER_MUTATION);
        (0, helpers_1.logJson)(res);
        console.log('user', res);
        expect(res.register.token).toBeTruthy();
        expect(res.register.errors).toBeNull();
        expect(res.register.user.email).toEqual(constants_2.REGISTER_EMAIL);
    }));
    it("and check that the user got added to the db", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("blue", "checking that the user got added to the DB").genLog();
        connection = yield (0, connectDb_1.connectDb)();
        const users = yield User_1.User.find({ where: { email: constants_2.REGISTER_EMAIL } });
        (0, helpers_1.logJson)(users);
        expect(users).toHaveLength(1);
        connection.close();
    }));
    it("checks if we try to register with the same credentials it returns an error", () => __awaiter(void 0, void 0, void 0, function* () {
        new logger("blue", "trying to register the same user credentials").genLog();
        const res = yield (0, graphql_request_1.request)(constants_1.HOST + "/graphql", constants_2.REGISTER_MUTATION);
        (0, helpers_1.logJson)(res);
        expect(res.register.errors).toHaveLength(1);
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
//# sourceMappingURL=register.test.js.map