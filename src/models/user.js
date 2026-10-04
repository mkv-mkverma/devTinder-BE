import mongoose from "mongoose";
import validator from "validator";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: function (value) {
        if (!validator.isEmail(value)) {
          throw new Error(`Invalid email address ${value}`);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate: function (value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            `password is not strong ${value}. Enter strong password`,
          );
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate: function (value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("invalid gender , should be male, female, others");
        }
      },
    },
    photoUrl: {
      type: String,
      default: function () {
        if (this.gender === "male") {
          return "https://api.dicebear.com/9.x/avataaars/svg?seed=male&top=shortFlat";
        }
        if (this.gender === "female") {
          return "https://api.dicebear.com/9.x/avataaars/svg?seed=female&top=longButNotTooLong&facialHairProbability=0";
        }
        return "https://api.dicebear.com/9.x/initials/svg?seed=User";
      },
      validate: function (value) {
        if (!validator.isURL(value)) {
          throw new Error(`Invalid URL ${value}`);
        }
      },
    },
    about: {
      type: String,
      default: "This is default user bio",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
