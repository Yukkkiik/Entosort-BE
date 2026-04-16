const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensor.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post("/sensor/data", sensorController.receiveSensorData)