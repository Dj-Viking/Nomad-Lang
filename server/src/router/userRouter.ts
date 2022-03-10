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
  deleteCard,
} = UserController;

const userRouter = Router();

// /user/login
userRouter.post("/login", login);
// /user/signup
userRouter.post("/signup", signup);
// /user/forgotPassword
userRouter.post("/forgotPassword", forgotPassword);

// need auth
// /user/me
userRouter.get("/me", authMiddleware, me);
// /user/clearCards
userRouter.put("/clearCards", authMiddleware, clearCards);
// /user/addCard
userRouter.post("/addCard", authMiddleware, addCard);
// /user/editCard/:id
userRouter.put("/editCard/:id", authMiddleware, editCard);
// /user/deleteCard/:id
userRouter.delete("/deleteCard/:id", authMiddleware, deleteCard);
// /user/changePassword
userRouter.put("/changePassword", authMiddleware, changePassword);

export { userRouter };
