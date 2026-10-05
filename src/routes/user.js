import express from "express";

const userRoute = express.Router();

userRoute.get("/user/connections", (req, res) => {});
userRoute.get("/user/requests/received", (req, res) => {});
userRoute.get("/user/feed", (req, res) => {});

export default userRoute;
