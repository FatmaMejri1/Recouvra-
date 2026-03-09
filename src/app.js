const express = require("express");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ message: "API running" });
});


//auth routees
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

//user 
const userRoutes = require ("./routes/userRoutes"); 
app.use("/users" , userRoutes); 


const clientRoutes = require("./routes/ClientRoutes");
app.use("/clients", clientRoutes);

const invoiceRoutes = require("./routes/invoiceRoutes");
app.use("/invoices", invoiceRoutes);


module.exports = app;