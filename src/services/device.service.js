"use strict";

const prisma = require('../config/database');

const OFFLINE_THRESHOLD_SEC = parseInt(process.env.NODE_OFFLINE_THRESHOLD_SEC) || 60;


const getAllDevices = async() => {
    const thresholdTime = new Date(Date.now() - OFFLINE_THRESHOLD_SEC * 1000);

    await prisma.node.updateMany({
        where: {
            status: "ONLINE",
            lastSeen: { lt: thresholdTime },
        },
        data: { status: "OFFLINE" }
    });

    return prisma.node.findMany({
        orderBy: { lastSeen: "desc" }
    });
};

const getDeviceById = async(nodeId) => {
    const device = await prisma.node.findUnique({ where: { nodeId } });
    if (!device) throw{
        status: 404,
        message: 'ID device ini tidak ditemukan'
    }
    return device
}

const updateDevice = async(nodeId, { ipAddress, firmwareV, nodeType }) => {
    const data = {};
    if (ipAddress !== undefined) data.ipAddress = ipAddress;
    if (firmwareV !== undefined) data.firmwareV = firmwareV;
    if (nodeType !== undefined) data.nodeType = nodeType;

    return prisma.node.update({
        where: {nodeId},
        data,
    });
};

const deleteDevice = async(nodeId) => {
    await prisma.node.delete({
        where: {nodeId}
    });
};

const hearthbeatDevice = async({ nodeId, nodeType, ipAddress, firmwareV }) => {
    await prisma.node.upsert({
        where: { nodeId },
        update: {
            status: "ONLINE",
            lastSeen: new Date(),
            ...(ipAddress && {ipAddress}),
            ...(firmwareV && {firmwareV}),
        },
        create: {
            nodeId,
            nodeType,
            status: "ONLINE",
            lastSeen: new Date(),
            ipAddress,
            firmwareV,
        },
    });
};

const getSettingsByNodeId = async(nodeId) => {
    const settings = await prisma.settings.findUnique({ where: {nodeId} });
    if(!settings) {
        const err = new Error(`Settings unutk node '${nodeId}' tidak ditemukan.`);
        err.statuscode = 404;
        throw err
    };
    return settings;
};


module.exports = {
    getAllDevices,
    getDeviceById,
    updateDevice,
    deleteDevice,
    hearthbeatDevice,
    getSettingsByNodeId
}