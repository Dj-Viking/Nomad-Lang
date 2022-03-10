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
exports.UserController = void 0;
const models_1 = require("../models");
const signToken_1 = require("../utils/signToken");
const mongoose_1 = __importDefault(require("mongoose"));
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
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        });
    },
    login: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = req.body;
                let user = null;
                if (username) {
                    user = yield models_1.User.findOne({ username });
                }
                if (email) {
                    user = yield models_1.User.findOne({ email });
                }
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
                        token: updated.token,
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
    clearCards: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield models_1.User.findOneAndUpdate({ email: req.user.email }, {
                    $set: {
                        cards: [],
                    },
                }, { new: true })
                    .select("-password")
                    .select("-__v");
                return res.status(200).json({ user });
            }
            catch (error) { }
        });
    },
    editCard: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const validId = mongoose_1.default.Types.ObjectId.isValid(id);
                if (!validId)
                    return res
                        .status(400)
                        .json({ error: "Bad request, id parameter was not a valid id format" });
                let tempCard = {};
                let fieldCount = 0;
                for (let i = 0; i < Object.keys(req.body).length; i++)
                    fieldCount++;
                if (fieldCount === 0)
                    return res.status(400).json({
                        error: "Need to provide fields to the json body that match a card's schema properties",
                    });
                else
                    void 0;
                for (const key in req.body) {
                    tempCard = Object.assign(Object.assign({}, tempCard), { [`cards.$.${key}`]: req.body[key] });
                }
                const updatedUser = yield models_1.User.findOneAndUpdate({ email: req.user.email, "cards._id": id }, {
                    $set: Object.assign({}, tempCard),
                }, { new: true });
                return res.status(200).json({ cards: updatedUser.cards });
            }
            catch (error) { }
        });
    },
    deleteCard: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updatedUser = yield models_1.User.findOneAndUpdate({ email: req.user.email, "cards._id": id }, {
                    $pull: {
                        cards: { _id: id },
                    },
                }, { new: true });
                if (updatedUser === null)
                    return res.status(400).json({ error: "Could not delete a card at this time" });
                return res.status(200).json({ cards: updatedUser.cards });
            }
            catch (error) { }
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const card = Object.assign(Object.assign({}, req.body), { creator: (_a = req.user) === null || _a === void 0 ? void 0 : _a.username });
                const updatedUser = yield models_1.User.findOneAndUpdate({ email: req.user.email }, {
                    $push: {
                        cards: card,
                    },
                }, { new: true })
                    .select("-password")
                    .select("-__v");
                return res.status(200).json({ cards: updatedUser.cards });
            }
            catch (error) { }
        });
    },
};
//# sourceMappingURL=UserController.js.map