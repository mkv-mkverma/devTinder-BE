import express from "express";
import userAuth from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";

const requestRoute = express.Router();

requestRoute.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedRequest = ["intrested", "ignored"];

      if (!allowedRequest.includes(status))
        throw new Error("ERROR: Invalid requesr");

      // findById(id): finds a document by its _id only
      const isUserExists = await User.findById(toUserId);
      if (!isUserExists)
        throw new Error("ERROR: Request cannot Be Send, User not found");

      // we need indexing since findOne will be costly for > 10M records
      // If there is an existing connection request
      //findOne(filter): finds the first document that matches any filter you give it.
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Request already send");
      }

      // new instance of connection request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      // it will save in DB
      const data = await connectionRequest.save();

      res.status(200).json({
        message: "Connection Request send Successfully",
        data,
      });
    } catch (error) {
      return res.status(400).json({
        message: `ERROR: ${error.message}`,
      });
    }
  },
);

/**
 * IMPL:
 * status should be accepted, rejected
 * toUserId (loggedin user) can only accept the request
 * status should be intrested ignore will not (accepted, rejected)
 * requestId should be present in DB, should be intrested, toUserId is loggedInuser
 *
 */
requestRoute.post("/request/review/accepted/:requestId", (req, res) => {});

requestRoute.post("/request/review/rejected/:requestId", (req, res) => {});

export default requestRoute;
