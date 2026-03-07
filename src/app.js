const express = require("express");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ message: "API running" });
});


//auth routees
const authRoutes = require("./routes/authRoutes");

app.use("/auth", authRoutes);

module.exports = app;