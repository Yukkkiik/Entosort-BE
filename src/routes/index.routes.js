const router = require("express").Router();
 
const authRoutes    = require("./auth.routes");
const userRoutes    = require("./user.routes");
// const sensorRoutes  = require("./sensor.routes"); // berisi /sensor & /harvest
const deviceRoutes  = require("./device.routes");
// const errorRoutes   = require("./error.routes");
// const reportRoutes  = require("./report.routes");
 
router.use("/auth",    authRoutes);
router.use("/users",   userRoutes);
// router.use("/",        sensorRoutes); // /sensor/data & /harvest/data
router.use("/devices", deviceRoutes);
// router.use("/errors",  errorRoutes);
// router.use("/reports", reportRoutes);
 
module.exports = router;