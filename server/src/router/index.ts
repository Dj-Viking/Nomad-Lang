import path from "path";
import { Router } from "express";
import { userRouter } from "./userRouter";
const router = Router();
router.get("/", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "client/dist/index.html"));
});
router.use("/user", userRouter);

export default router;
