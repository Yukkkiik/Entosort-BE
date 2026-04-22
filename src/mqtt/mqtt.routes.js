const {mqttRoute} = require('./mqtt.router');

const deviceController = require('./controllers/mqtt.device.controller');

const registerMqttRoutes = () => {
    mqttRoute("bsf/device/heartbeat", deviceController.handleHearbet);
    mqttRoute("bsf/device/status", deviceController.handleStatus);
};

module.exports = registerMqttRoutes