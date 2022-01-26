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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardController = void 0;
exports.CardController = {
    getAllUserCards: function (_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ message: " found get all cards route" });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        });
    },
    editCard: function (_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ message: " found get all cards route" });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        });
    },
    getCategorizedCards: function (_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ message: " found get all cards route" });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        });
    },
    deleteOneCard: function (_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ message: " found get all cards route" });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        });
    },
    getOneCard: function (_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ message: " found get all cards route" });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        });
    },
};
//# sourceMappingURL=CardController.js.map