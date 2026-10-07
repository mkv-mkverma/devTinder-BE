import mongoose from "mongoose";

const connectionSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      require: true,
      enum: {
        values: ["ignore", "intrested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true },
);
// indexing is used to query fast
// compound index when we do indexing on 2 field
connectionSchema.index({ fromUserId: 1, toUserId: 1 });

// this is middleware
connectionSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("cannot send request to yourself");
  }
  next();
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionSchema,
);

export default ConnectionRequest;
