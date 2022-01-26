"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const authMiddleWare_1 = require("../middleware/authMiddleWare");
const { login, signup, getCategorizedCards, getUserCards, forgotPassword, changePassword, clearCards, me, } = UserController_1.UserController;
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.get("/me", authMiddleWare_1.authMiddleware, me);
userRouter.put("/clearCards", authMiddleWare_1.authMiddleware, clearCards);
userRouter.get("/getCategorizedCards", authMiddleWare_1.authMiddleware, getCategorizedCards);
userRouter.get("/getUserCards", authMiddleWare_1.authMiddleware, getUserCards);
userRouter.put("/changePassword", authMiddleWare_1.authMiddleware, changePassword);
//# sourceMappingURL=userRouter.js.map