require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')

const rateLimiter = require("./middleware/ratelimiter");
const apiRoutes = require("./routes/index.routes");
const registerMqttRoutes = require('./mqtt/mqtt.routes');
const prisma = require("./config/database");

const PORT = process.env.PORT || 3000
const app = express();

app.use(cookieParser())
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(morgan('combined'));

app.use("/api/", rateLimiter);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "EntoSort API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use("/api/v1", apiRoutes);

const startServer = async () => {
  try {
    console.log("⏳ Sedang mencoba terhubung ke database...");
    await prisma.$connect(); 
    console.log("✅ Database berhasil terhubung!");

    registerMqttRoutes();

    app.listen(PORT, () => {
      console.log(`\n🚀 Server berhasil berjalan!`);
      console.log(`-------------------------------------------`);
      console.log(`➡️  Local:   http://localhost:${PORT}`);
      console.log(`➡️  Network: http://0.0.0.0:${PORT}`);
      console.log(`📌 Environment : ${process.env.NODE_ENV}`);
      console.log(`📋 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.log("Gagal menjalankan server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;