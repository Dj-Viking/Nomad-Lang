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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
const readEnv_1 = require("./readEnv");
(0, readEnv_1.readEnv)();
const { SECRET, EXPIRATION } = process.env;
function authMiddleware(context) {
    var _a, _b;
    function verifyAsync(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let returnedDecoded;
            jsonwebtoken_1.default.verify(token, SECRET, { maxAge: EXPIRATION }, (error, decoded) => {
                if (error === null || error === void 0 ? void 0 : error.message.includes("malformed"))
                    throw new Error(error.message);
                if (error === null || error === void 0 ? void 0 : error.message.includes("expired"))
                    throw new Error(error.message);
                if (error === null || error === void 0 ? void 0 : error.message.includes("invalid"))
                    throw new Error(error.message);
                if (decoded) {
                    context.req.user = decoded;
                    returnedDecoded = decoded;
                }
            });
            return returnedDecoded;
        });
    }
    try {
        let token = context.req.headers.authorization;
        if (context.req.headers.authorization) {
            token = (_b = (_a = token === null || token === void 0 ? void 0 : token.split(' ')) === null || _a === void 0 ? void 0 : _a.pop()) === null || _b === void 0 ? void 0 : _b.trim();
        }
        if (!token) {
            context.req.user = null;
            return context;
        }
        verifyAsync(token).then((decoded) => {
            context.req.user = decoded;
        }).catch((_err) => {
            context.req.user = null;
        });
        return context;
    }
    catch (error) {
        console.log("got an error in the auth middleware", error);
        return context;
    }
}
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleWare.js.map