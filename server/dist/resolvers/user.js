"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserResolver = void 0;
const ErrorResponse_1 = require("../utils/ErrorResponse");
const signToken_1 = require("../utils/signToken");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const argon2_1 = __importDefault(require("argon2"));
const User_1 = require("../entities/User");
const Card_1 = require("../entities/Card");
const verifyRegisterArgs_1 = require("../utils/verifyRegisterArgs");
const sendEmail_1 = require("../utils/sendEmail");
const constants_1 = require("../constants");
const decodeToken_1 = require("../utils/decodeToken");
const verifyAsync_1 = require("../utils/verifyAsync");
const uuid = require("uuid");
let RegisterInput = class RegisterInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RegisterInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RegisterInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RegisterInput.prototype, "password", void 0);
RegisterInput = __decorate([
    (0, type_graphql_1.InputType)()
], RegisterInput);
let UserFieldError = class UserFieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserFieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserFieldError.prototype, "message", void 0);
UserFieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserFieldError);
let ThemeChangeResponse = class ThemeChangeResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], ThemeChangeResponse.prototype, "themePref", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [UserFieldError], { nullable: true }),
    __metadata("design:type", Object)
], ThemeChangeResponse.prototype, "errors", void 0);
ThemeChangeResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], ThemeChangeResponse);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [UserFieldError], { nullable: true }),
    __metadata("design:type", Object)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", Object)
], UserResponse.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], UserResponse.prototype, "token", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Card_1.Card], { nullable: true }),
    __metadata("design:type", Object)
], UserResponse.prototype, "cards", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let MeQueryResponse = class MeQueryResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [UserFieldError], { nullable: true }),
    __metadata("design:type", Object)
], MeQueryResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", Object)
], MeQueryResponse.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], MeQueryResponse.prototype, "token", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Card_1.Card], { nullable: true }),
    __metadata("design:type", Object)
], MeQueryResponse.prototype, "cards", void 0);
MeQueryResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], MeQueryResponse);
let LogoutResponse = class LogoutResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Object)
], LogoutResponse.prototype, "done", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [UserFieldError], { nullable: true }),
    __metadata("design:type", Object)
], LogoutResponse.prototype, "errors", void 0);
LogoutResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], LogoutResponse);
let LoginInput = class LoginInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
LoginInput = __decorate([
    (0, type_graphql_1.InputType)()
], LoginInput);
let ForgotPassResponse = class ForgotPassResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Object)
], ForgotPassResponse.prototype, "done", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [UserFieldError], { nullable: true }),
    __metadata("design:type", Object)
], ForgotPassResponse.prototype, "errors", void 0);
ForgotPassResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], ForgotPassResponse);
let ChangePasswordResponse = class ChangePasswordResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Object)
], ChangePasswordResponse.prototype, "done", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], ChangePasswordResponse.prototype, "token", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Card_1.Card], { nullable: true }),
    __metadata("design:type", Object)
], ChangePasswordResponse.prototype, "cards", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [UserFieldError], { nullable: true }),
    __metadata("design:type", Object)
], ChangePasswordResponse.prototype, "errors", void 0);
ChangePasswordResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], ChangePasswordResponse);
let UserResolver = class UserResolver {
    helloUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return "hello user";
        });
    }
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user)
                    return new ErrorResponse_1.ErrorResponse("unauthenticated", "401 user not authenticated");
                const user = yield User_1.User.findOne({ where: { email: req.user.email } });
                const cards = yield Card_1.Card.find({ where: { creatorId: user === null || user === void 0 ? void 0 : user.id } });
                const uncategorized = [];
                let categorized = {};
                let iterator = 0;
                while (iterator < cards.length) {
                    if (!cards[iterator].frontSideLanguage) {
                        uncategorized.push(cards[iterator]);
                    }
                    else {
                        categorized = Object.assign(Object.assign({}, categorized), { [cards[iterator].frontSideLanguage]: [cards[iterator]] });
                    }
                    iterator++;
                }
                const newToken = (0, signToken_1.signToken)({
                    username: req.user.username,
                    email: req.user.email,
                    uuid: uuid.v4()
                });
                const changedUser = yield (0, typeorm_1.getConnection)()
                    .getRepository(User_1.User)
                    .createQueryBuilder("user")
                    .update(User_1.User, { token: newToken })
                    .where("email = :email", { email: req.user.email })
                    .returning(["id", "username", "createdAt", "updatedAt", "token", "email", "themePref"])
                    .updateEntity(true)
                    .execute();
                return {
                    token: newToken,
                    user: changedUser.raw[0],
                    cards: cards,
                };
            }
            catch (error) {
                return new ErrorResponse_1.ErrorResponse("error during me query", error.message);
            }
        });
    }
    setUserTheme(themePref, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return new ErrorResponse_1.ErrorResponse("unauthenticated", "401 user not authenticated");
            const user = yield User_1.User.findOne({ where: { email: req.user.email } });
            try {
                const changedUser = yield (0, typeorm_1.getConnection)()
                    .getRepository(User_1.User)
                    .createQueryBuilder("user")
                    .update(User_1.User, { themePref })
                    .where("email = :email", { email: user === null || user === void 0 ? void 0 : user.email })
                    .returning(["themePref"])
                    .updateEntity(true)
                    .execute();
                return {
                    themePref: changedUser.raw[0].themePref
                };
            }
            catch (error) {
                const err = error;
                return new ErrorResponse_1.ErrorResponse("theme change", err.message);
            }
        });
    }
    register(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyRes = (0, verifyRegisterArgs_1.verifyRegisterArgs)(options);
                if (verifyRes instanceof ErrorResponse_1.ErrorResponse)
                    return verifyRes;
                const hashedPassword = yield argon2_1.default.hash(options.password);
                let tempUser = {
                    username: options.username,
                    email: options.email,
                    uuid: uuid.v4()
                };
                const token = (0, signToken_1.signToken)(tempUser);
                let user;
                const result = yield (0, typeorm_1.getConnection)().createQueryBuilder().insert().into(User_1.User).values({
                    username: options.username,
                    email: options.email,
                    password: hashedPassword,
                    token: token,
                    themePref: "light"
                })
                    .returning(["themePref", "username", "token", "email"])
                    .execute();
                user = result.raw[0];
                req.user = user;
                return {
                    token,
                    user
                };
            }
            catch (error) {
                if (error.code === '23505' || error.detail && error.detail.includes('already exists')) {
                    const field = 'User';
                    const message = "name and/or email is already taken!";
                    return new ErrorResponse_1.ErrorResponse(field, message);
                }
                else {
                    const field = 'Error';
                    const message = error;
                    return new ErrorResponse_1.ErrorResponse(field, message);
                }
            }
        });
    }
    login(options, _context) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            user = yield User_1.User.findOne({ where: { email: options.email } });
            if (!user) {
                user = yield User_1.User.findOne({ where: { username: options.username } });
            }
            if (!user) {
                return new ErrorResponse_1.ErrorResponse('Credentials', 'Incorrect Credentials');
            }
            const valid = yield argon2_1.default.verify(user.password, options.password);
            if (!valid) {
                return new ErrorResponse_1.ErrorResponse("Credentials", "Incorrect Credentials");
            }
            const token = (0, signToken_1.signToken)({
                username: user.username,
                email: user.email,
                uuid: uuid.v4()
            });
            const changedUser = yield (0, typeorm_1.getConnection)()
                .getRepository(User_1.User)
                .createQueryBuilder("user")
                .update(User_1.User, { token })
                .where("email = :email", { email: user.email })
                .returning(["id", "username", "createdAt", "updatedAt", "email", "token", "themePref"])
                .updateEntity(true)
                .execute();
            const cards = yield Card_1.Card.find({ where: { creatorId: user.id } });
            return {
                token: token,
                user: changedUser.raw[0],
                cards: cards
            };
        });
    }
    changePassword(password, token, _context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let verified = "something";
                verified = yield (0, verifyAsync_1.verifyAsync)(token);
                if (verified instanceof Error && verified.message.includes("expired"))
                    return new ErrorResponse_1.ErrorResponse("invalid", "reset token expired");
                else if (verified instanceof Error && (verified.message.includes("malformed") ||
                    verified.message.includes("invalid")))
                    return new ErrorResponse_1.ErrorResponse("invalid", "invalid token");
                const decodedToken = (0, decodeToken_1.decodeToken)(token);
                const hashedPassword = yield argon2_1.default.hash(password);
                const changedUser = yield (0, typeorm_1.getConnection)()
                    .getRepository(User_1.User)
                    .createQueryBuilder("user")
                    .update(User_1.User, { password: hashedPassword })
                    .where("email = :email", { email: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.resetEmail })
                    .returning(["id", "username", "createdAt", "updatedAt", "email", "token", "themePref"])
                    .updateEntity(true)
                    .execute();
                const loginToken = (0, signToken_1.signToken)({
                    username: changedUser.raw[0].username,
                    email: changedUser.raw[0].email,
                    uuid: uuid.v4()
                });
                const changedUserToken = yield (0, typeorm_1.getConnection)()
                    .getRepository(User_1.User)
                    .createQueryBuilder("user")
                    .update(User_1.User, { token: loginToken })
                    .where("email = :email", { email: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.resetEmail })
                    .returning(["id", "username", "createdAt", "updatedAt", "email", "token", "themePref"])
                    .updateEntity(true)
                    .execute();
                const cards = yield Card_1.Card.find({ where: { creatorId: changedUserToken.raw[0].id } });
                return {
                    done: true,
                    token: loginToken,
                    cards
                };
            }
            catch (error) {
                return new ErrorResponse_1.ErrorResponse("change pass", error.message);
            }
        });
    }
    forgotPassword(email, _context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resetToken = uuid.v4();
                const token = (0, signToken_1.signToken)({
                    uuid: resetToken,
                    resetEmail: email,
                    exp: "5m"
                });
                const forgotPasswordEmailOptions = {
                    fromHeader: "Password Reset",
                    subject: "Password Reset Request",
                    mailTo: email,
                    mailHtml: `
          <span>We were made aware that you request your password to be reset</span>
          <p>If this wasn't you. Then please disregard this email. Thank you!</p>
          <h2>This Request will expire after 5 minutes.</h2>
          <a href="${constants_1.APP_DOMAIN_PREFIX}/changepass/${token}">Reset your password</a>   
        `
                };
                yield (0, sendEmail_1.sendEmail)(forgotPasswordEmailOptions);
                return {
                    done: true
                };
            }
            catch (error) {
                const err = error;
                return new ErrorResponse_1.ErrorResponse("reset", err.message);
            }
        });
    }
    logout(email, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                return new ErrorResponse_1.ErrorResponse("noemail", "no email entered");
            try {
                const changedUser = yield (0, typeorm_1.getConnection)()
                    .getRepository(User_1.User)
                    .createQueryBuilder("user")
                    .update(User_1.User, { token: "" })
                    .where("email = :email", { email: email })
                    .returning(["id", "username", "createdAt", "updatedAt", "email", "themePref"])
                    .updateEntity(true)
                    .execute();
                if (!changedUser)
                    return new ErrorResponse_1.ErrorResponse("user", "user not found");
                context.req.user = null;
                return {
                    done: true
                };
            }
            catch (error) {
                console.log(error);
                const field = "error";
                const msg = `error in the logout mutation ${error}`;
                return new ErrorResponse_1.ErrorResponse(field, msg);
            }
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "helloUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => MeQueryResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ThemeChangeResponse),
    __param(0, (0, type_graphql_1.Arg)("themePref", () => String)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "setUserTheme", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)('options', () => RegisterInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)('options', () => LoginInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ChangePasswordResponse),
    __param(0, (0, type_graphql_1.Arg)("password")),
    __param(1, (0, type_graphql_1.Arg)("token")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ForgotPassResponse),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => LogoutResponse),
    __param(0, (0, type_graphql_1.Arg)("email", () => String)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map