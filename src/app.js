import connectDB from "./config/database.js";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import profileRoute from "./routes/profile.js";
import requestRoute from "./routes/request.js";
import userRoute from "./routes/user.js";
import cookieParser from "cookie-parser";

const username = "manishvermacse_db_user";
const password = "7mnb7jwyDdZvZzdZ";
const app = express();
const PORT = 3000;

app.use(express.json()); // express.json() is a middleware
app.use(cookieParser());
app.use(cors());

connectDB(username, password)
  .then(() => {
    console.log("DB connection established successfull!!");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error("DB connection Failed!!", error));

app.use("/", authRouter);
app.use("/", profileRoute);
app.use("/", requestRoute);
app.use("/", userRoute);

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
