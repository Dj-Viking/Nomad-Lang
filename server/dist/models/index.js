"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoiceClass = exports.UserClass = exports.CardClass = exports.User = exports.Card = void 0;
const UserClass_1 = require("./UserClass");
Object.defineProperty(exports, "UserClass", { enumerable: true, get: function () { return UserClass_1.UserClass; } });
const CardClass_1 = require("./CardClass");
Object.defineProperty(exports, "CardClass", { enumerable: true, get: function () { return CardClass_1.CardClass; } });
const ChoiceClass_1 = require("./ChoiceClass");
Object.defineProperty(exports, "ChoiceClass", { enumerable: true, get: function () { return ChoiceClass_1.ChoiceClass; } });
const typegoose_1 = require("@typegoose/typegoose");
const User = (0, typegoose_1.getModelForClass)(UserClass_1.UserClass);
exports.User = User;
const Card = (0, typegoose_1.getModelForClass)(CardClass_1.CardClass);
exports.Card = Card;
//# sourceMappingURL=index.js.map