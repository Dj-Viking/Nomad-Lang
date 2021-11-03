"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const { SECRET, EXPIRATION } = process.env;
function signToken(args) {
    const { username, uuid: someUuid, email } = args;
    const { resetEmail, uuid, exp } = args;
    switch (true) {
        case Boolean(username && someUuid && email): {
            return jsonwebtoken_1.default.sign({
                username,
                uuid,
                email
            }, SECRET, { expiresIn: EXPIRATION });
        }
        case Boolean(uuid && exp && resetEmail): {
            return jsonwebtoken_1.default.sign({
                resetEmail,
                uuid
            }, SECRET, { expiresIn: exp });
        }
        default: return "can't sign a valid token";
    }
}
exports.signToken = signToken;
//# sourceMappingURL=signToken.js.map