const sensorservices = require('../services/sensor.service');
const { successResponse, paginationResponse } = require('../utils/response');

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
        const { logs, total, page, limit} = await sensorservices.getsensorLogs(req.query);
        return paginationResponse(res, {
            data: logs,
            total,
            page,
            limit,
            message: "Riwayat data sensor berhasil diambil.",
       });
    } catch (error) {
        next(error)
    } 
};

const getSummary = async(req, res ,next) => {
    try {
        const {nodeId, date} = req.query
        const summary = await sensorservices.getsensorSummary(nodeId, date);
        return successResponse(res, {
            message: "Ringkasan sensor berhasil diambil",
            data: summary
        });
    } catch (error) {
        next(error)
    }
};

const receiveHarvestData = async(req, res, next) => {
    try {
        const log = await sensorservices.createHarvestLog(req.body);
        return successResponse(res, {
            statusCode: 201,
            message: "Data panen berhasil diambil",
            data: log
        })
    } catch(error) {
        next(error)
    }
};

const getHarvestData = async(req, res ,next) => {
    try {
        const {logs, total, page, limit} = await sensorservices.getHarvestLog(req.query);
        return paginationResponse(res, {
            data: logs,
            total,
            page,
            limit,
            message: "Riwayat data panen berhasil diambil.",
        });
    } catch(error) {
        next(error);
    }
}

module.exports = {
    receiveSensorData,
    getsensorData,
    getSummary,
    receiveHarvestData,
    getHarvestData
}