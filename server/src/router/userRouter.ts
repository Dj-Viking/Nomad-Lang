import { Router } from "express";
import { UserController } from "../controllers";
import { authMiddleware } from "../middleware/authMiddleWare";
const {
  login,
  signup,
  forgotPassword,
  changePassword,
  clearCards,
  me,
  addCard,
  editCard,
  changeThemePref,
  deleteCard,
  getFakeChoices,
  addChoicesToCards,
} = UserController;

const userRouter = Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.get("/getFakeChoices", getFakeChoices);

// need auth
userRouter.get("/me", authMiddleware, me);
userRouter.put("/clearCards", authMiddleware, clearCards);
userRouter.post("/addCard", authMiddleware, addCard);
userRouter.put("/editCard/:id", authMiddleware, editCard);
userRouter.put("/addChoicesToCards", authMiddleware, addChoicesToCards);
userRouter.delete("/deleteCard/:id", authMiddleware, deleteCard);
userRouter.put("/changePassword", authMiddleware, changePassword);
userRouter.put("/changeThemePref", authMiddleware, changeThemePref);

export { userRouter };
