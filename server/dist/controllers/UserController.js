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
const argon2_1 = require("argon2");
const sendEmail_1 = require("../utils/sendEmail");
const constants_1 = require("../constants");
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
                        themePref: updated.themePref,
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
                        themePref: updated.themePref,
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
                    themePref: "light",
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
                        themePref: updated.themePref,
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
            catch (error) {
                console.error(error);
            }
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
    forgotPassword: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const { email } = req.body;
                if (!email)
                    return res.status(422).json({ error: "email missing from request!" });
                const user = yield models_1.User.findOne({ email });
                if (user === null)
                    return res.status(200).json({ done: true });
                if (!emailRegex.test(email))
                    return res.status(200).json({ done: true });
                const resetToken = (0, signToken_1.signToken)({
                    username: user.username,
                    resetEmail: email,
                    uuid: uuid.v4(),
                    exp: "5m",
                });
                const sendEmailArgs = {
                    fromHeader: "Password Reset",
                    subject: "Password Reset Request",
                    mailTo: email,
                    mailHtml: `
          <span>We were made aware that you request your password to be reset</span>
          <p>If this wasn't you. Then please disregard this email. Thank you!</p>
          <h2>This Request will expire after 5 minutes.</h2>
          <a href="${constants_1.APP_DOMAIN_PREFIX}/changepass/${resetToken}">Reset your password</a>
        `,
                };
                yield (0, sendEmail_1.sendEmail)(sendEmailArgs);
                return res.status(200).json({ done: true });
            }
            catch (error) {
                console.error(error);
                return res
                    .status(500)
                    .json({ error: "We're sorry there was a problem with this request :(" });
            }
        });
    },
    changePassword: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { newPassword } = req.body;
                if (!newPassword)
                    return res.status(400).json({ error: "missing password input" });
                const hashed = yield (0, argon2_1.hash)(newPassword);
                const token = (0, signToken_1.signToken)({
                    username: req.user.username,
                    email: req.user.resetEmail,
                    uuid: uuid.v4(),
                });
                const user = yield models_1.User.findOneAndUpdate({ email: req.user.resetEmail }, {
                    $set: {
                        password: hashed,
                        token,
                    },
                }, { new: true });
                return res.status(200).json({
                    cards: user.cards,
                    done: true,
                    token: user.token,
                });
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
                const updatedUser = yield models_1.User.findOneAndUpdate({ email: req.user.email }, {
                    $push: {
                        cards: Object.assign({}, req.body),
                    },
                }, { new: true })
                    .select("-password")
                    .select("-__v");
                return res.status(200).json({ cards: updatedUser.cards });
            }
            catch (error) {
                console.error(error);
            }
        });
    },
    changeThemePref: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { themePref } = req.body;
                const updated = yield models_1.User.findOneAndUpdate({ email: req.user.email }, {
                    $set: {
                        themePref,
                    },
                }, { new: true });
                if (updated === null)
                    return res.status(404).json({ error: "user not found" });
                return res.status(200).json({
                    themePref: updated.themePref,
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: "error while changing theme preference" });
            }
        });
    },
};
//# sourceMappingURL=UserController.js.map