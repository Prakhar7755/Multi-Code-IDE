import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./src/config/db.js";

connectDB();
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // for parsing cookies
app.use(express.static("public")); // for serving static files

/* app.get("/", (req, res) => {
  res.send("Hello World!");
}); */

// Import routes
import indexRouter from "./src/routes/index.js";
import usersRouter from "./src/routes/users.js";

// router setup
app.use("/", indexRouter);
app.use("/users", usersRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
