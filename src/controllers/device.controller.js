const deviceService = require('../services/device.service');
const { successResponse } = require('../utils/response');

const getAllDevices = async(req, res, next) => {
    try {
        const devices = await deviceService.getAllDevices();
        return successResponse (res, {
            message: "Status semua Perangkat berhasil diambil",
            data: devices
        });
    } catch (error) {
        next(error)
    }
};

const getDeviceById = async(req, res, next) => {
    try {
        const { nodeId } = req.params;
        const device = await deviceService.getDeviceById(nodeId);
        return successResponse (res, {
            message: "Detail Perangkat berhasil diambil",
            data: device
        });
    } catch (error) {
        next(error)
    }
};

const updateDevice = async(req, res, next) => {
    try {
        const { nodeId } = req.params;
        const device = await deviceService.updateDevice(nodeId, req.body);
        return successResponse (res, {
            message: "Perangkat berhasil diperbarui",
            data: device
        });
    } catch (error) {
        next(error)
    }
};

const deleteDevice = async(req, res, next) =>{
    try {
        const {nodeId} = req.params;
        await deviceService.deleteDevice(nodeId);
        return successResponse (res, {
            message: "Perangkat berhasil dihapus",
        });
    } catch (error) {
        next(error)
    }
};

const hearthbeat = async(req, res ,next) => {
    try {
        const device = await deviceService.heartbeatDevice(req.body);
        return successResponse (res, {
            message: "Status Perangkat berhasil diperbarui",
            data: device
        });
    } catch (error) {
        next(error)
    }
};

const getSettings = async(req, res, next) => {
    try {
        const { nodeId } = req.params
        const settings = await deviceService.getSettingsByNodeId(nodeId);
        return successResponse (res, {
            message: "Settings perangkat berhasil diambil ",
            data: settings
        });
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllDevices,
    getDeviceById,
    updateDevice,
    deleteDevice,
    hearthbeat,
    getSettings
}