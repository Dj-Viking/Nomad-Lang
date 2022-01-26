import { CardController } from "controllers";
import { Router } from "express";
// import { UserController } from "../controllers/UserController";

const cardRouter = Router();

cardRouter.get("/");

export { cardRouter };
