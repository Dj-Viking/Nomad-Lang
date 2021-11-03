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
require('dotenv').config();
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const constants_1 = require("./constants");
const cors_1 = __importDefault(require("cors"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const User_1 = require("./entities/User");
const Card_1 = require("./entities/Card");
const user_1 = require("./resolvers/user");
const card_1 = require("./resolvers/card");
const authMiddleWare_1 = require("./utils/authMiddleWare");
const helpers_1 = require("./__tests__/utils/helpers");
const path_1 = __importDefault(require("path"));
const logger = helpers_1.ColorLog;
const { DB_NAME, DB_USER, DB_PASSWORD, CORS_ALLOWED_PROD, CORS_ALLOWED_DEV, DATABASE_URL, } = process.env;
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("hello world");
        yield (0, typeorm_1.createConnection)({
            type: "postgres",
            url: constants_1.IS_PROD ? DATABASE_URL : undefined,
            database: !constants_1.IS_PROD ? DB_NAME : undefined,
            password: !constants_1.IS_PROD ? DB_PASSWORD : undefined,
            username: !constants_1.IS_PROD ? DB_USER : undefined,
            logging: !constants_1.IS_PROD,
            synchronize: true,
            ssl: constants_1.IS_PROD,
            extra: constants_1.IS_PROD && {
                ssl: {
                    rejectUnauthorized: false,
                },
            },
            entities: [User_1.User, Card_1.Card]
        });
        new logger("green", "postgres connection success").genLog();
        const app = (0, express_1.default)();
        let MyGraphQLSchema;
        console.log("resolvers");
        console.log(user_1.UserResolver);
        console.log(card_1.CardResolver);
        MyGraphQLSchema = yield (0, type_graphql_1.buildSchema)({
            resolvers: [user_1.UserResolver, card_1.CardResolver],
            validate: false
        });
        new logger("purple", "graphql schema build success").genLog();
        const corsRegExp = (() => {
            if (constants_1.IS_PROD) {
                return new RegExp(CORS_ALLOWED_PROD);
            }
            return new RegExp(CORS_ALLOWED_DEV);
        })();
        app.use((0, cors_1.default)({
            origin: corsRegExp,
            credentials: true
        }));
        const apolloServer = new apollo_server_express_1.ApolloServer({
            schema: MyGraphQLSchema,
            context: authMiddleWare_1.authMiddleware
        });
        apolloServer.applyMiddleware({
            app,
            cors: {
                origin: corsRegExp,
                credentials: true
            }
        });
        app.use(express_1.default.urlencoded({
            extended: false
        }));
        app.use(express_1.default.json());
        if (process.env.NODE_ENV === 'production') {
            app.use(express_1.default.static(path_1.default.join(__dirname, '../../client/dist')));
            app.use((req, res, next) => {
                if (req.header('x-forwarded-proto') !== 'https')
                    res.redirect(`https://${req.header('host')}${req.url}`);
                next();
            });
        }
        app.use('/', (_, res) => __awaiter(this, void 0, void 0, function* () {
            res.status(404).send("client path eventually");
        }));
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            new logger("green", `server started on ${PORT}`).genLog();
            new logger("purple", `graphql server started? ${apolloServer.graphqlPath}`).genLog();
        });
    });
})().catch((e) => {
    return console.error(e);
});
//# sourceMappingURL=index.js.map