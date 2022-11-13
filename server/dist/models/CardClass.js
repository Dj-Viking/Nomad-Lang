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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardClass = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const ChoiceClass_1 = require("./ChoiceClass");
let CardClass = class CardClass {
};
__decorate([
    (0, typegoose_1.prop)({ type: () => ChoiceClass_1.ChoiceClass, default: [] }),
    __metadata("design:type", Array)
], CardClass.prototype, "choices", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CardClass.prototype, "frontSideText", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CardClass.prototype, "frontSideLanguage", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CardClass.prototype, "frontSidePicture", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CardClass.prototype, "backSideText", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CardClass.prototype, "backSideLanguage", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CardClass.prototype, "backSidePicture", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CardClass.prototype, "creator", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now() }),
    __metadata("design:type", Object)
], CardClass.prototype, "createdAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now() }),
    __metadata("design:type", Object)
], CardClass.prototype, "updatedAt", void 0);
CardClass = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            collection: "cards",
            timestamps: {
                createdAt: "createdAt",
                updatedAt: "updatedAt",
            },
        },
    })
], CardClass);
exports.CardClass = CardClass;
//# sourceMappingURL=CardClass.js.map