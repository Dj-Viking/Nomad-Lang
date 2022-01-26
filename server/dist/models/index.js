"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Card = void 0;
const UserClass_1 = require("./UserClass");
const CardClass_1 = require("./CardClass");
const typegoose_1 = require("@typegoose/typegoose");
exports.Card = (0, typegoose_1.getModelForClass)(CardClass_1.CardClass, {
    schemaOptions: {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    },
});
exports.User = (0, typegoose_1.getModelForClass)(UserClass_1.UserClass, {
    schemaOptions: {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    },
});
//# sourceMappingURL=index.js.map