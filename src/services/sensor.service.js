"use strict";
const prisma = require('../config/database');
const { getPagination } = require('../utils/pagination');

const createSensorLog = async ({ nodeId, temperature, humidity, pressure }) => {
    const [sensorLog] = await prisma.$transaction([
        prisma.sensorLog.create({
            data: { nodeId, temperature, humidity, pressure},
        }),
        prisma.deviceStatus.upsert({
            where: { nodeId },
            update: { status: "ONLINE", lastSeen: new Date()},
            create: {
                nodeId,
                nodeType: "MICROCONTROLLER",
                status: "ONLINE",
                lastSeen: new Date(),
            }
        }),
    ]);
    return sensorLog;
};

const getsensorLogs = async(query) => {
    const { skip, take, page, limit} = getPagination(query);
    const { nodeId, startDate, endDate } = query;

    const where = {
    ...(nodeId && { nodeId }),
    ...(startDate || endDate
      ? {
          recordedAt: {
            ...(startDate && { gte: new Date(startDate) }),
            ...(endDate && { lte: new Date(endDate) }),
          },
        }
      : {}),
  };

  const [logs, total] = await prisma.$transaction([
    prisma.sensorLog.findMany({
        where,
        skip,
        take,
        orderBy: { recordedAt: "desc"},
    }),
    prisma.sensorLog.count({ where }),
  ]);
  return { logs, total, page, limit };
};

const getsensorSummary = async(nodeId, date) => {
    const baseDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(baseDate);
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(baseDate);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await prisma.sensorLog.aggregate({
        where: {
            ...(nodeId && { nodeId }),
            recordedAt: { gte: startOfDay, Ite: endOfDay},
        },
        _avg: { temperature: true, humidity: true },
        _min : {temperature: true, humidity: true },
        _max: { temperature: true, humidity: true },
        _count: { temperature: true, humidity: true },
    });
    return result;
};

module.exports = {
    createSensorLog,
    getsensorLogs,
    getsensorSummary
}