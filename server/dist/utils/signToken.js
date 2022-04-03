"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const readEnv_1 = require("./readEnv");
(0, readEnv_1.readEnv)();
const { SECRET, EXPIRATION } = process.env;
function signToken(args) {
    const { username, _id, uuid: someUuid, email, } = args;
    const { resetEmail, uuid, exp } = args;
    switch (true) {
        case Boolean(username && someUuid && email && _id): {
            return jsonwebtoken_1.default.sign({
                username,
                uuid,
                _id,
                email,
            }, SECRET, { expiresIn: EXPIRATION });
        }
        case Boolean(username && uuid && exp && resetEmail): {
            return jsonwebtoken_1.default.sign({
                username,
                resetEmail,
                uuid,
            }, SECRET, { expiresIn: exp });
        }
        default:
            return "can't sign a valid token";
    }
}
exports.signToken = signToken;
//# sourceMappingURL=signToken.js.map