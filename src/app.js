require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger");

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", (req, res) => {
  res.json({ message: "API running" });
});

// Auth
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// Users
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);


const clientRoutes = require("./routes/ClientRoutes");
app.use("/clients", clientRoutes);


const invoiceRoutes = require("./routes/invoiceRoutes");
app.use("/invoices", invoiceRoutes);


const paymentRoutes = require("./routes/paymentRoutes");
app.use("/payments", paymentRoutes);


const recoveryActionRoutes = require("./routes/recoveryActionRoutes");
app.use("/recovery-actions", recoveryActionRoutes);


const statsRoutes = require("./routes/statsRoutes");
app.use("/stats", statsRoutes);

module.exports = app;