"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.CardClass = void 0;
const UserClass_1 = require("./UserClass");
const CardClass_1 = require("./CardClass");
Object.defineProperty(exports, "CardClass", { enumerable: true, get: function () { return CardClass_1.CardClass; } });
const typegoose_1 = require("@typegoose/typegoose");
const User = (0, typegoose_1.getModelForClass)(UserClass_1.UserClass);
exports.User = User;
//# sourceMappingURL=index.js.map