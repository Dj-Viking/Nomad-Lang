"use strict";
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
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../../models");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect("mongodb://localhost/app-lang", {});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("placeholder", () => {
    test("blah", () => __awaiter(void 0, void 0, void 0, function* () {
        const cards = yield models_1.Card.find({ creator: "viking" });
        const updatePromises = cards.map(card => {
            return models_1.Card.findOneAndUpdate({ _id: card._id.toHexString() }, {
                $set: {
                    choices: []
                },
            }, { new: true });
        });
        const updated = yield Promise.all(updatePromises);
        yield models_1.User.findOneAndUpdate({ username: "viking" }, {
            $set: {
                cards: [...updated].map(card => card === null || card === void 0 ? void 0 : card._id.toHexString())
            }
        });
    }));
});
//# sourceMappingURL=updateCardsScript.test.js.map