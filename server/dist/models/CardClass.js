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
let CardClass = class CardClass {
};
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CardClass.prototype, "frontsideText", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CardClass.prototype, "frontsideLanguage", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CardClass.prototype, "frontsidePicture", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CardClass.prototype, "backsideText", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CardClass.prototype, "backsideLanguage", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CardClass.prototype, "backsidePicture", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], CardClass.prototype, "creator", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now() }),
    __metadata("design:type", Date)
], CardClass.prototype, "createdAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now() }),
    __metadata("design:type", Date)
], CardClass.prototype, "updatedAt", void 0);
CardClass = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            collection: "cards",
        },
    })
], CardClass);
exports.CardClass = CardClass;
//# sourceMappingURL=CardClass.js.map