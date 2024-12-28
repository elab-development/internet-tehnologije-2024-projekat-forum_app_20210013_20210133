const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const { initCloudinary } = require("./config/cloudinary");
const userRoutes = require("./routes/userRoutes.js");
const questionRoutes = require("./routes/questionRoutes.js");
const answerRoutes = require("./routes/answerRoutes.js");

dotenv.config();
const app = express();

app.use(
  cors({
    origin: `http://localhost:${process.env.FRONTEND_PORT}`,
  })
);

app.use(express.json({ limit: "10mb" }));

connectDB();
initCloudinary();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to NullPointer!" });
});

app.use("/users", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}!`);
});

module.exports = app;
