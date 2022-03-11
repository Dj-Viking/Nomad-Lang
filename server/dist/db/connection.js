"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default
    .connect(process.env.MONGODB_URI || "mongodb://localhost/rest-cats", {
    autoIndex: true,
})
    .catch((e) => console.log("error on connection", e));
//# sourceMappingURL=connection.js.map