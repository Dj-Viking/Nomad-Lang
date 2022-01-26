import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middleware/authMiddleWare";
const {
  login,
  signup,
  getCategorizedCards,
  getUserCards,
  forgotPassword,
  changePassword,
  clearCards,
  me,
} = UserController;

const userRouter = Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.post("/forgotPassword", forgotPassword);

// need auth
userRouter.get("/me", authMiddleware, me);
userRouter.put("/clearCards", authMiddleware, clearCards);
userRouter.get("/getCategorizedCards", authMiddleware, getCategorizedCards);
userRouter.get("/getUserCards", authMiddleware, getUserCards);
userRouter.put("/changePassword", authMiddleware, changePassword);

export { userRouter };
