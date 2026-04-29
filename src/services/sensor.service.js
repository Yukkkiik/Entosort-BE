"use strict";
const prisma = require('../config/database');
const { getPagination } = require('../utils/pagination');

const createSensorLog = async ({ nodeId, temperature, humidity, pressure }) => {
    const [sensorLog] = await prisma.$transaction([
        prisma.sensorLog.create({
            data: { nodeId, temperature, humidity, pressure},
        }),
        prisma.node.upsert({
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
    const startDate = new Date(baseDate);
    startDate.setHours(0,0,0,0);
    const endDate = new Date(baseDate);
    endDate.setHours(23, 59, 59, 999);

    const result = await prisma.sensorLog.aggregate({
        where: {
            ...(nodeId && { nodeId }),
            recordedAt: { gte: startDate, lte: endDate},
        },
        _avg: { temperature: true, humidity: true },
        _min : {temperature: true, humidity: true },
        _max: { temperature: true, humidity: true },
        _count: { temperature: true, humidity: true },
    });
    return result;
};

const createHarvestLog = async({
    nodeId,
    sessionId,
    larvaeCount,
    prepupaCount,
    rejectCount = 0,
    durationSec,
    notes,
}) => {
    const totalCount = larvaeCount + prepupaCount + rejectCount;

    const [harvestLog] = await prisma.$transaction([
        prisma.harvestLog.create({
            data:{
                nodeId,
                sessionId,
                larvaeCount,
                prepupaCount,
                rejectCount,
                totalCount,
                durationSec,
                notes,
            },
        }),
        prisma.node.upsert({
            where: {nodeId},
            update: { status: "ONLINE", lastSeen: new Date() },
            create: {
                nodeId,
                nodeType: "CAMERA",
                status: "ONLINE",
                lastSeen: new Date(),
            },
        }),
    ]);

    return harvestLog;
};

const getHarvestLog = async(query) => {
    const { skip, take, page, limit} = getPagination(query);
    const { nodeId, startDate, endDate, sessionId } = query;

    const where = {
        ...(nodeId && { nodeId }),
        ...(sessionId && { sessionId }),
        ...(startDate || endDate 
            ? {
                recordedAt: {
                    ...(startDate && { gte: new Date(startDate)}),
                    ...(endDate && { lte: new Date(endDate)}),
                },
            }
        : {}),
    };

    const [logs, total] = await prisma.$transaction([
        prisma.harvestLog.findMany({
            where,
            skip,
            take,
            orderBy: { recordedAt: "desc"},
        }),
        prisma.harvestLog.count({ where }),
    ]);
    return { logs, total, page, limit }; 
};

const getDailyProductionSumarry = async({ nodeId, starDate, endDate }) => {
    const start = starDate ? new Date(starDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const where = {
        ...(nodeId && { nodeId }),
        recordedAt: { gte: start, lte: end },
    };

    const logs = await prisma.harvestLog.findMany({
        where,
        select: {
            larvaeCount: true,
            prepupaCount: true,
            rejectCount: true,
            totalCount: true,
            recordedAt: true
        },
        orderBy: { recordedAt: "asc" },
    });

    const dailyMap = {};
    for (const log of logs) {
        const day = log.recordedAt.toISOString().split("T")[0];
        if(!dailyMap[day]) {
            dailyMap[day] = { date: day, larvae: 0, prepupa: 0, reject: 0, total: 0, sessions: 0 };
        }
        dailyMap[day].larvae += log.larvaeCount;
        dailyMap[day].prepupa += log.prepupaCount;
        dailyMap[day].reject += log.rejectCount;
        dailyMap[day].total += log.totalCount;
        dailyMap[day].sessions += 1;
    }
    return Object.values(dailyMap);
}
module.exports = {
    createSensorLog,
    getsensorLogs,
    getsensorSummary,
    createHarvestLog,
    getHarvestLog,
    getDailyProductionSumarry
}