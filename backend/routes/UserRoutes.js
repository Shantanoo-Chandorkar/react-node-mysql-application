import express from "express";
import {
  register,
  login,
  logout,
  protectedRoute,
  getMealCart,
  addToMealCart,
  deleteUser,
  deleteFromMealCart,
} from "../controllers/UserControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.delete("/delete", deleteUser);
router.route("/profile/:id").get(protect, getMealCart);
router.route("/profile/:id").post(protect, addToMealCart);
router.delete("/profile/:id", deleteFromMealCart);
//   .post(protect, addToMealCart)
//   .delete(protect, deleteFromMealCart);
// router.get("/profile/:id", getMealCart);
// router.post("/profile/:id", addToMealCart);
export default router;
