import { CardController } from "../controllers";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleWare";

const { getAllUserCards, getOneCard, getCategorizedCards, editCard, deleteOneCard } =
  CardController;

const cardRouter = Router();

cardRouter.get("/getAllUserCards", authMiddleware, getAllUserCards);
cardRouter.get("/getOneCard/:id", authMiddleware, getOneCard);
cardRouter.get("/getCategorizedCards/:category", authMiddleware, getCategorizedCards);
cardRouter.get("/editCard/:id", authMiddleware, editCard);
cardRouter.get("/deleteOneCard/:id", authMiddleware, deleteOneCard);

export { cardRouter };
