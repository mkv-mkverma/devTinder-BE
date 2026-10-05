import express from "express";
import { validateSignUpData } from "../utils/validate.js";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const authRouter = express.Router();

authRouter.post("/auth/signup", async (req, res) => {
  try {
    // create a validator helper func
    validateSignUpData(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password } = req.body ?? {};

    const passwordHash = await bcrypt.hash(password, 10);

    // create new instance of the user model
    const UserModel = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await UserModel.save();
    res.status(200).json({
      message: "User create successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

authRouter.post("/auth/login", async (req, res) => {
  try {
    const { emailId, password } = req.body ?? {};

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordvalid = await user.validatePassword(password);

    if (isPasswordvalid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).json({
        message: "login Successful!!",
      });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

authRouter.post("/auth/logout", async (req, res) => {
  res.cookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    message: "Logout successful!!",
  });
});

export default authRouter;
