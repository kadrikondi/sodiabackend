import express from "express";
const router = express.Router();

import {
  registerUser,
  homePage,
  LoginUser,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";

// Routes
router.get("/home", homePage);
router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/users", getAllUsers);
router.get("/user/:userId", getUserById);

export default router;
