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
exports.TestServer = void 0;
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const user_1 = require("../resolvers/user");
const card_1 = require("../resolvers/card");
const authMiddleWare_1 = require("../utils/authMiddleWare");
function TestServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        const MyGraphQLSchema = yield (0, type_graphql_1.buildSchema)({
            resolvers: [user_1.UserResolver, card_1.CardResolver],
            validate: false
        });
        const apolloServer = new apollo_server_express_1.ApolloServer({
            schema: MyGraphQLSchema,
            context: authMiddleWare_1.authMiddleware
        });
        apolloServer.applyMiddleware({
            app,
        });
        return app;
    });
}
exports.TestServer = TestServer;
//# sourceMappingURL=TestServer.js.map