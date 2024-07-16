import User from "../model/userModel.js";

export const registerUser = async (req, res) => {
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

  const user = await User.create({
    fullname,
    username,
    email,
    password,
    gender,
  });
  if (user) {
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  }
};
