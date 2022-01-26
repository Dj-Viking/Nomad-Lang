import { Router } from "express";
import { cardRouter } from "./cardRouter";
import { userRouter } from "./userRouter";
const router = Router();

router.use("/user", userRouter);
router.use("/card", cardRouter);

export default router;
