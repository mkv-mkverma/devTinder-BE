import express from "express";
import userAuth from "../middlewares/auth.js";
import { validateEditProfileData } from "../utils/validate.js";
const profileRoute = express.Router();

// userAuth if token is not validate then below code will not called
profileRoute.get("/profile/view", userAuth, async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new Error("User is not there ");
  }
  console.log(user);
  res.status(200).json({
    message: "reading cookies",
    data: user,
  });
});

profileRoute.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) throw new Error("Invalid Edit Request");

    let loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.status(200).json({
      message: `${loggedInUser?.firstName} your data saved successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).json({
      message: `Error: ${error.message}`,
    });
  }
});
profileRoute.patch("/profile/password", (req, res) => {});

export default profileRoute;
