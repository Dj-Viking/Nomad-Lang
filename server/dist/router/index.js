"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = require("express");
const userRouter_1 = require("./userRouter");
const router = (0, express_1.Router)();
router.get("*", (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../../client/dist/index.html"));
});
router.use("/user", userRouter_1.userRouter);
exports.default = router;
//# sourceMappingURL=index.js.map