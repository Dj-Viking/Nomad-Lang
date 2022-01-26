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
exports.UserClass = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const CardClass_1 = require("./CardClass");
const argon2_1 = __importDefault(require("argon2"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
let UserClass = class UserClass {
    isCorrectPassword(plainPass) {
        return __awaiter(this, void 0, void 0, function* () {
            return argon2_1.default.verify(this.password, plainPass);
        });
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], UserClass.prototype, "username", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], UserClass.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], UserClass.prototype, "password", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserClass.prototype, "token", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => CardClass_1.CardClass }),
    __metadata("design:type", Array)
], UserClass.prototype, "cards", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserClass.prototype, "themePref", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now() }),
    __metadata("design:type", Date)
], UserClass.prototype, "createdAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now() }),
    __metadata("design:type", Date)
], UserClass.prototype, "updatedAt", void 0);
UserClass = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            collection: "users",
        },
    }),
    (0, typegoose_1.pre)("save", function (next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isNew)
                this.password = yield argon2_1.default.hash(this.password);
            next();
        });
    }),
    (0, typegoose_1.plugin)(mongoose_unique_validator_1.default)
], UserClass);
exports.UserClass = UserClass;
//# sourceMappingURL=UserClass.js.map