const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensor.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post("/sensor/data", sensorController.receiveSensorData);
router.get("/sensor/data", authenticate, sensorController.getsensorData);
router.get("/sensor/summary", authenticate, sensorController.getSummary);
router.post("/harvest/data", sensorController.receiveHarvestData);
router.get("/harvest/data", authenticate, sensorController.getHarvestData);

module.exports = router;