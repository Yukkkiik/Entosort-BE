const sensorservices = require('../services/sensor.service');
const { successResponse } = require('../utils/response');

const receiveSensorData = async(req, res, next) => {
    try {
        const sensor = await sensorservices.createSensorLog(req.body);
        return successResponse(res, {
            statusCode: 201,
            message: "SensorLog berhasil disimpan",
            data: sensor
        });
    } catch (error) {
        next(error)
    }
};

const getsensorData = async(req, res, next) => {
    try {
        const sensor = await sensorservices.getsensorLogs()
        return successResponse(res, {
            message: "Riwayat data sensor berhasil diambil",
            data: sensor
       });
    } catch (error) {
        next(error)
    } 
};

const getSummary = async(req, res ,next) => {
    try {
        const [nodeId, date] = req.query
        const summary = await sensorservices.getsensorSummary(nodeId, date);
        return successResponse(res, {
            message: "Ringkasan sensor berhasil diambil",
            data: sensor
        });
    } catch (error) {
        next(error)
    }
};

module.exports = {
    receiveSensorData,
    getsensorData,
    getSummary
}