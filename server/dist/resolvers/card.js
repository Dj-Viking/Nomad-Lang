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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardResolver = void 0;
const Card_1 = require("../entities/Card");
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const types_1 = require("../types");
const ErrorResponse_1 = require("../utils/ErrorResponse");
let CardError = class CardError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CardError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CardError.prototype, "message", void 0);
CardError = __decorate([
    (0, type_graphql_1.ObjectType)()
], CardError);
let DeleteCardResponse = class DeleteCardResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [CardError], { nullable: true }),
    __metadata("design:type", Object)
], DeleteCardResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Card_1.Card], { nullable: true }),
    __metadata("design:type", Object)
], DeleteCardResponse.prototype, "cards", void 0);
DeleteCardResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], DeleteCardResponse);
let ClearCardResponse = class ClearCardResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [CardError], { nullable: true }),
    __metadata("design:type", Object)
], ClearCardResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Object)
], ClearCardResponse.prototype, "done", void 0);
ClearCardResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], ClearCardResponse);
let AddCardInput = class AddCardInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AddCardInput.prototype, "frontSideText", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AddCardInput.prototype, "frontSideLanguage", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AddCardInput.prototype, "frontSidePicture", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AddCardInput.prototype, "backSideText", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AddCardInput.prototype, "backSideLanguage", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AddCardInput.prototype, "backSidePicture", void 0);
AddCardInput = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, type_graphql_1.InputType)()
], AddCardInput);
let EditCardInput = class EditCardInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", String)
], EditCardInput.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], EditCardInput.prototype, "frontSideText", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], EditCardInput.prototype, "frontSideLanguage", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], EditCardInput.prototype, "frontSidePicture", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], EditCardInput.prototype, "backSideText", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], EditCardInput.prototype, "backSideLanguage", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], EditCardInput.prototype, "backSidePicture", void 0);
EditCardInput = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, type_graphql_1.InputType)()
], EditCardInput);
let AddCardResponse = class AddCardResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [CardError], { nullable: true }),
    __metadata("design:type", Object)
], AddCardResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Card_1.Card], { nullable: true }),
    __metadata("design:type", Object)
], AddCardResponse.prototype, "cards", void 0);
AddCardResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], AddCardResponse);
let EditCardResponse = class EditCardResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [CardError], { nullable: true }),
    __metadata("design:type", Object)
], EditCardResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Card_1.Card], { nullable: true }),
    __metadata("design:type", Object)
], EditCardResponse.prototype, "cards", void 0);
EditCardResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], EditCardResponse);
let GetUserCardsResponse = class GetUserCardsResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [CardError], { nullable: true }),
    __metadata("design:type", Object)
], GetUserCardsResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Card_1.Card], { nullable: true }),
    __metadata("design:type", Object)
], GetUserCardsResponse.prototype, "cards", void 0);
GetUserCardsResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], GetUserCardsResponse);
let CardResolver = class CardResolver {
    helloCard() {
        return __awaiter(this, void 0, void 0, function* () {
            return "hello CARD";
        });
    }
    getUserCards({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                return new ErrorResponse_1.ErrorResponse("unauthenticated", "401 Unauthenticated");
            }
            console.log("req checking req.user", req.user);
            const foundUserByEmail = yield User_1.User.findOne({ where: { email: req.user.email } });
            if (!foundUserByEmail) {
                return new ErrorResponse_1.ErrorResponse("not found", "404 Not Found");
            }
            if ((foundUserByEmail === null || foundUserByEmail === void 0 ? void 0 : foundUserByEmail.email) !== req.user.email) {
                return new ErrorResponse_1.ErrorResponse("forbidden", "403 Forbidden");
            }
            try {
                const cards = yield Card_1.Card.find({ where: { creatorId: foundUserByEmail.id } });
                console.log("checking cards given the creatorId", cards);
                return {
                    cards: cards
                };
            }
            catch (error) {
                return new ErrorResponse_1.ErrorResponse("error", error.message);
            }
        });
    }
    editCardById(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, frontSideText, backSideLanguage, backSideText, frontSideLanguage, frontSidePicture } = options;
            if (!req.user) {
                return new ErrorResponse_1.ErrorResponse("unauthenticated", "401 Unauthenticated");
            }
            console.log("req checking req.user", req.user);
            const foundUserByEmail = yield User_1.User.findOne({ where: { email: req.user.email } });
            if (!foundUserByEmail) {
                return new ErrorResponse_1.ErrorResponse("not found", "404 Not Found");
            }
            if ((foundUserByEmail === null || foundUserByEmail === void 0 ? void 0 : foundUserByEmail.email) !== req.user.email) {
                return new ErrorResponse_1.ErrorResponse("forbidden", "403 Forbidden");
            }
            try {
                const changedCard = yield (0, typeorm_1.getConnection)()
                    .getRepository(Card_1.Card)
                    .createQueryBuilder("card")
                    .update(Card_1.Card, { frontSideText,
                    frontSidePicture,
                    frontSideLanguage,
                    backSideText,
                    backSideLanguage,
                    backSidePicture: frontSidePicture, })
                    .where("id = :id", { id })
                    .returning(["frontSideText", "frontSidePicture", "frontSideLanguage", "backsideText", "id", "creatorId", "createdAt", "updatedAt"])
                    .updateEntity(true)
                    .execute();
                if (!changedCard.raw[0])
                    return new ErrorResponse_1.ErrorResponse("card", "404 Card Not Found");
                const cards = yield Card_1.Card.find({ where: { creatorId: foundUserByEmail.id } });
                console.log('cards of the person editing a card', cards);
                return {
                    cards: cards
                };
            }
            catch (error) {
                return new ErrorResponse_1.ErrorResponse("error when editing a card", error);
            }
        });
    }
    deleteCard(id, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                return new ErrorResponse_1.ErrorResponse("unauthorized", "401 unauthorized");
            }
            try {
                const result = yield Card_1.Card.delete(id);
                console.log("delete result", result);
                const user = yield User_1.User.findOne({ where: { email: req.user.email } });
                const cards = yield Card_1.Card.find({ where: { creatorId: user === null || user === void 0 ? void 0 : user.id } });
                return {
                    cards: cards
                };
            }
            catch (error) {
                return new ErrorResponse_1.ErrorResponse("error when deleting a card", error);
            }
        });
    }
    clearUserCards({ req }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return new ErrorResponse_1.ErrorResponse("unauthorized", "401 unauthorized or expired token");
            console.log("req.user", req.user);
            const foundUserByEmail = yield User_1.User.findOne({ where: { email: req.user.email } });
            if (!foundUserByEmail)
                return new ErrorResponse_1.ErrorResponse("not found", "404 Not Found");
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) !== foundUserByEmail.email)
                return new ErrorResponse_1.ErrorResponse("forbidden", "403 Forbidden");
            try {
                const cardsToDelete = yield Card_1.Card.find({ where: { creatorId: foundUserByEmail.id } });
                const deletePromises = cardsToDelete.map((card) => __awaiter(this, void 0, void 0, function* () {
                    return Card_1.Card.delete(card.id);
                }));
                yield Promise.all(deletePromises);
                return {
                    done: true
                };
            }
            catch (error) {
                return new ErrorResponse_1.ErrorResponse("error", error.message);
            }
        });
    }
    addCard(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { backSideLanguage, frontSideText, backSideText, frontSideLanguage, frontSidePicture } = options;
            console.log("options input on add card", options);
            if (!req.user) {
                return new ErrorResponse_1.ErrorResponse("unauthenticated", "401 user not authenticated");
            }
            const foundUserByEmail = yield User_1.User.findOne({ where: { email: req.user.email } });
            if (!foundUserByEmail)
                return new ErrorResponse_1.ErrorResponse("not found", "404 Not Found");
            if (foundUserByEmail.email !== req.user.email)
                return new ErrorResponse_1.ErrorResponse("forbidden", "403 Forbidden");
            try {
                yield (0, typeorm_1.getConnection)()
                    .createQueryBuilder()
                    .insert()
                    .into(Card_1.Card)
                    .values({ frontSideText,
                    frontSideLanguage,
                    frontSidePicture,
                    backSideText,
                    backSideLanguage,
                    backSidePicture: frontSidePicture,
                    creatorId: foundUserByEmail === null || foundUserByEmail === void 0 ? void 0 : foundUserByEmail.id })
                    .returning(["frontSideText", "frontSidePicture", "frontSideLanguage", "backsideText", "id", "creatorId", "createdAt", "updatedAt"])
                    .execute();
                const cards = yield Card_1.Card.find({ where: { creatorId: foundUserByEmail === null || foundUserByEmail === void 0 ? void 0 : foundUserByEmail.id } });
                console.log(`${types_1.ANSI_ESCAPES.success}`, `Someone added a card!`, `${types_1.ANSI_ESCAPES.reset}`);
                console.log("heres new set of flashcards", cards);
                return {
                    cards: cards
                };
            }
            catch (error) {
                return new ErrorResponse_1.ErrorResponse("error", error.message);
            }
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "helloCard", null);
__decorate([
    (0, type_graphql_1.Query)(() => GetUserCardsResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "getUserCards", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => EditCardResponse),
    __param(0, (0, type_graphql_1.Arg)("options", () => EditCardInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditCardInput, Object]),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "editCardById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => DeleteCardResponse),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "deleteCard", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ClearCardResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "clearUserCards", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => AddCardResponse),
    __param(0, (0, type_graphql_1.Arg)("options", () => AddCardInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddCardInput, Object]),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "addCard", null);
CardResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CardResolver);
exports.CardResolver = CardResolver;
//# sourceMappingURL=card.js.map