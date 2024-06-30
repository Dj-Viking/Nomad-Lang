import path from "path";
import { Router } from "express";
import { userRouter } from "./userRouter";
const router = Router();
router.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "../../../client/dist/index.html"));
});
router.use("/user", userRouter);

router.use("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../../../client/dist/index.html"));
});

export default router;
