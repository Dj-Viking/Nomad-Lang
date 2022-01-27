"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardRouter = void 0;
const controllers_1 = require("../controllers");
const express_1 = require("express");
const authMiddleWare_1 = require("../middleware/authMiddleWare");
const { getAllUserCards, getOneCard, getCategorizedCards, editCard, deleteOneCard } = controllers_1.CardController;
const cardRouter = (0, express_1.Router)();
exports.cardRouter = cardRouter;
cardRouter.get("/getAllUserCards", authMiddleWare_1.authMiddleware, getAllUserCards);
cardRouter.get("/getOneCard/:id", authMiddleWare_1.authMiddleware, getOneCard);
cardRouter.get("/getCategorizedCards/:category", authMiddleWare_1.authMiddleware, getCategorizedCards);
cardRouter.get("/editCard/:id", authMiddleWare_1.authMiddleware, editCard);
cardRouter.get("/deleteOneCard/:id", authMiddleWare_1.authMiddleware, deleteOneCard);
//# sourceMappingURL=cardRouter.js.map