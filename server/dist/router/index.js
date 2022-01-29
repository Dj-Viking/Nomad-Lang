"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRouter_1 = require("./userRouter");
const router = (0, express_1.Router)();
router.use("/user", userRouter_1.userRouter);
exports.default = router;
//# sourceMappingURL=index.js.map