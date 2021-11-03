"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRegisterArgs = void 0;
const ErrorResponse_1 = require("../utils/ErrorResponse");
;
function verifyRegisterArgs(args) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(args.email) === false) {
        const field = "Email";
        const message = "Email is not in correct format. Must be like example@mail.com";
        return new ErrorResponse_1.ErrorResponse(field, message);
    }
    if (args.username.length <= 2) {
        const field = "Username";
        const message = "username length too short must be greater than 2 characters";
        return new ErrorResponse_1.ErrorResponse(field, message);
    }
    if (args.password.length <= 3) {
        const field = "Password";
        const message = "password length too short must be greater than 3 characters";
        return new ErrorResponse_1.ErrorResponse(field, message);
    }
}
exports.verifyRegisterArgs = verifyRegisterArgs;
//# sourceMappingURL=verifyRegisterArgs.js.map