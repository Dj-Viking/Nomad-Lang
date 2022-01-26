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
exports.createDbConnection = void 0;
const typeorm_1 = require("typeorm");
const readEnv_1 = require("../utils/readEnv");
const constants_1 = require("../constants");
const User_1 = require("../entities/User");
const Card_1 = require("../entities/Card");
(0, readEnv_1.readEnv)();
const { DB_NAME, DB_USER, DB_PASSWORD, DATABASE_URL, } = process.env;
function createDbConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, typeorm_1.createConnection)({
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
    });
}
exports.createDbConnection = createDbConnection;
//# sourceMappingURL=connection.js.map