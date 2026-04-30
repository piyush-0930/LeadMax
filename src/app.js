const express = require("express");
const cors = require("cors");

const app = express();

// routes import
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const bankRoutes = require("./routes/bank.routes");
const paymentRoutes = require("./routes/payment.routes");

// error middleware import
const errorHandler = require("./middlewares/error.middleware");

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/payment", paymentRoutes);

// health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(errorHandler);

module.exports = app;