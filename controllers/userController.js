import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
export const homePage = (req, res) => {
  res.status(200).json({ message: "Welcome to sodia social media" });
};
export const registerUser = async (req, res) => {
  try {
    const { fullname, username, email, password, gender, confirmpassword } =
      req.body;

    if (!fullname || !username || !email || !password || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const useremail = await User.findOne({ email });
    if (useremail) {
      return res
        .status(400)
        .json({ message: "Email already exists login instead" });
    }

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const validatePassword = (password) => {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!.@#$%^&*()_+])[A-Za-z\d!@#$.%^&*()_+]{8,}$/;
      return regex.test(password);
    };
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    if (password != confirmpassword) {
      return res.status(400).json({
        message: "password not match",
      });
    }

    const hashespassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      username,
      email,
      password: hashespassword,
      gender,
    });
    if (user) {
      res.status(201).json({
        message: "User registered successfully",
        user,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error unable to register user",
      error: error.message,
    });
  }
};

export const LoginUser = async (req, res) => {
  const { password, email } = req.body;
  if (!password || !email) {
    return res.status(400).json({
      message: "Please enter all required fields",
    });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found Create an account",
      });
    }

    // Compare passwords with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      config.JWT_SECRET || process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error unable to login",
      error: error.message,
    });
  }
};
