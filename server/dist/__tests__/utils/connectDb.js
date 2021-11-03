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
exports.connectDb = void 0;
require("dotenv").config();
const User_1 = require("../../entities/User");
const typeorm_1 = require("typeorm");
const Card_1 = require("../../entities/Card");
const { DB_NAME, DB_USER, DB_PASSWORD, } = process.env;
function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, typeorm_1.createConnection)({
            type: "postgres",
            database: DB_NAME,
            username: DB_USER,
            password: DB_PASSWORD,
            logging: false,
            synchronize: true,
            entities: [User_1.User, Card_1.Card]
        });
    });
}
exports.connectDb = connectDb;
//# sourceMappingURL=connectDb.js.map