import { connectDB } from "./config/database.js";
import express from "express";
import cors from "cors";
import User from "./models/user.js";
const username = "manishvermacse_db_user";
const password = "7mnb7jwyDdZvZzdZ";

const app = express();
const PORT = 3000;
app.use(express.json()); // express.json() is a middleware
app.use(cors());

connectDB(username, password)
  .then(() => {
    console.log("DB connection established successfull!!");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error("DB connection Failed!!", error));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "DevTinder BE App is working",
  });
});

// SIGN UP API - POST
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, age, gender } = req.body ?? {};

  if (!firstName || !email || !password) {
    return res.status(400).json({
      message: "firstName, lastName, email, password is required",
    });
  }

  // create new instance of the user model
  const UserModel = new User({
    firstName,
    lastName,
    email,
    password,
    age,
    gender,
  });

  try {
    await UserModel.save();
  } catch (error) {
    return res.status(400).json({
      message: "Bad request",
      error,
    });
  }

  res.status(200).json({
    message: "User create successfully",
  });
});

// find user by EmailID
app.get("/usersByEmail", async (req, res) => {
  console.log("params", req.params.email);
  try {
    const users = await User.find({ email: req.body.email });
    if (!users) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      res.status(200).json({
        message: "user found",
        data: users,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Bad request",
      error,
    });
  }
});

// findOne user by EmailID

// Feed API - GET /feed - gat all the users from the database

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).json({
        message: "No user found",
        data: [],
      });
    }
    res.status(200).json({
      message: "User Found",
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      message: "Bad request",
    });
  }
});

// Delete
//findByIdAndDelete(id)
app.delete("/user", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(404).json({
      message: "User does not exists",
    });
  }

  try {
    const user = await User.findByIdAndDelete(userId);

    res.status(201).json({
      message: "User Deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: "Bad request",
    });
  }
});

// update - patch
// findByIdAndUpdate(id, update, options)

app.patch("/user/:userID", async (req, res) => {
  const userId = req.params?.userID;
  const update = req.body;

  if (!userId || !update) {
    return res.status(400).json({
      message: "userId and update are required",
    });
  }

  try {
    const ALLOWED_UPDATE = ["photoUrl", "about", "age", "gender", "skills"];

    const isAllowedUpdate = Object.keys(update).every((k) =>
      ALLOWED_UPDATE.includes(k),
    );

    if (!isAllowedUpdate) {
      return res.status(400).json({
        message: "Update is not allowed",
      });
    }

    if (update?.skills.length >= 5) {
      return res.status(400).json({
        message: "Skill cannot be more than 5",
      });
    }
    const user = await User.findByIdAndUpdate(userId, update, {
      new: true, // return the updated document instead of the old one
      runValidators: true, // apply schema validations on update
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "user updated",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Bad request",
    });
  }
});

// Error handler (e.g. invalid JSON body)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : "Internal server error",
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});
