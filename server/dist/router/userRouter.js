"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const authMiddleWare_1 = require("../middleware/authMiddleWare");
const { login, signup, getCategorizedCards, getAllCards, forgotPassword, changePassword, clearCards, me, addCard, editCard, deleteCard, } = controllers_1.UserController;
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.get("/me", authMiddleWare_1.authMiddleware, me);
userRouter.put("/clearCards", authMiddleWare_1.authMiddleware, clearCards);
userRouter.post("/addCard", authMiddleWare_1.authMiddleware, addCard);
userRouter.put("/editCard", authMiddleWare_1.authMiddleware, editCard);
userRouter.delete("/deleteCard", authMiddleWare_1.authMiddleware, deleteCard);
userRouter.get("/getCategorizedCards", authMiddleWare_1.authMiddleware, getCategorizedCards);
userRouter.get("/getAllCards", authMiddleWare_1.authMiddleware, getAllCards);
userRouter.put("/changePassword", authMiddleWare_1.authMiddleware, changePassword);
//# sourceMappingURL=userRouter.js.map