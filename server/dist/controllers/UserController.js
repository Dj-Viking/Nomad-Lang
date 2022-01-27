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
exports.UserController = void 0;
const models_1 = require("../models");
const signToken_1 = require("../utils/signToken");
const uuid = require("uuid");
exports.UserController = {
    me: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield models_1.User.findOne({ email: req.user.email }).select("-password");
                const token = (0, signToken_1.signToken)({
                    username: user.username,
                    email: user.email,
                    _id: user._id,
                    uuid: uuid.v4(),
                });
                const updated = yield models_1.User.findOneAndUpdate({ email: user.email }, { token }, { new: true })
                    .select("-password")
                    .select("-__v");
                return res.status(200).json({
                    user: {
                        username: updated.username,
                        email: updated.email,
                        _id: updated._id,
                        token,
                        cards: updated.cards,
                    },
                });
            }
            catch (error) { }
        });
    },
    login: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield models_1.User.findOne({ email });
                if (user === null)
                    return res.status(400).json({ error: "Incorrect Credentials" });
                const verifyPass = yield user.isCorrectPassword(password);
                if (!verifyPass)
                    return res.status(400).json({ error: "Incorrect Credentials" });
                const token = (0, signToken_1.signToken)({
                    username: user.username,
                    email: user.email,
                    uuid: uuid.v4(),
                });
                const updated = yield models_1.User.findOneAndUpdate({ _id: user._id }, { token }, { new: true }).select("-__v");
                return res.status(200).json({
                    user: {
                        username: updated.username,
                        _id: updated._id,
                        token,
                        cards: updated.cards,
                        email: updated.email,
                    },
                });
            }
            catch (error) { }
        });
    },
    signup: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = req.body;
                if (!username || !email || !password) {
                    return res.status(400).json({ error: "missing username email or password input!" });
                }
                const user = yield models_1.User.create({
                    username,
                    email,
                    password,
                });
                const token = (0, signToken_1.signToken)({
                    username,
                    email,
                    uuid: uuid.v4(),
                });
                const updated = yield models_1.User.findOneAndUpdate({
                    _id: user._id,
                }, { token }, { new: true })
                    .select("-password")
                    .select("-__v");
                return res.status(201).json({
                    user: {
                        _id: updated._id,
                        username: updated.username,
                        email: updated.email,
                        token,
                        cards: updated.cards,
                    },
                });
            }
            catch (error) { }
        });
    },
    getAllCards: function (_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ message: "found getAllCards route" });
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
                return res.status(200).json({ message: "found get categorized cards route" });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        });
    },
    clearCards: function (_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ message: "found clear cards route" });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        });
    },
    editCard: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield models_1.User.findOne({ email: req.user.email });
                user.cards[0] = Object.assign(Object.assign({}, user.cards[0]), req.body);
                return res.status(200).json({ cards: user.cards });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        });
    },
    deleteCard: function (_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ message: "found delete card route" });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        });
    },
    forgotPassword: function (_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ message: "found forgot password route" });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        });
    },
    changePassword: function (_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ message: "found changePassword route" });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        });
    },
    addCard: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield models_1.User.findOneAndUpdate({ email: req.user.email }, {
                    $push: {
                        cards: Object.assign(Object.assign({}, req.body), { creator: req.user.username }),
                    },
                }, { new: true })
                    .select("-password")
                    .select("-__v");
                return res.status(200).json({ cards: user.cards });
            }
            catch (error) { }
        });
    },
};
//# sourceMappingURL=UserController.js.map