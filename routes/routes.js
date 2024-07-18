import express from "express";
const router = express.Router();

import {
  registerUser,
  homePage,
  LoginUser,
} from "../controllers/userController.js";

// Routes
router.get("/home", homePage);
router.post("/register", registerUser);
router.post("/login", LoginUser);

export default router;
