import jwt from "jsonwebtoken";
import User from "../models/user.js";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token || typeof token !== "string") {
      throw new Error("Token is not valid");
    }

    const decodedObj = jwt.verify(token, "DEV@Tinder$123");
    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next(); // move to request handler
    
  } catch (error) {
    res.status(401).json({
      message: `Error ${error.message}`,
    });
  }
};

export default userAuth;
