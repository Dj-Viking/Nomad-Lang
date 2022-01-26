"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cardRouter_1 = require("./cardRouter");
const userRouter_1 = require("./userRouter");
const router = (0, express_1.Router)();
router.use("/user", userRouter_1.userRouter);
router.use("/card", cardRouter_1.cardRouter);
exports.default = router;
//# sourceMappingURL=index.js.map