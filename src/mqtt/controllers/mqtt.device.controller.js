const deviceServices = require('../../services/device.service');

const handleHearbet = async(message) => {
    const payload = JSON.parse(message);

    await deviceServices.hearthbeatDevice({
        nodeId: payload.nodeId,
        nodeType: payload.nodeType,
        ipAddress: payload.ipAddress,
        firmwareV: payload.firmwareV
    });
};

const handleStatus = async(message) => {
  const payload = JSON.parse(message);
  
  if (!payload.nodeId) {
    throw new Error("nodeId is required");
  }

  if (payload.status === "OFFLINE") {
    await deviceServices.hearthbeatDevice(payload.nodeId);
    return;
  }

  await deviceServices.hearthbeatDevice({
    nodeId: payload.nodeId,
    nodeType: payload.nodeType,
    ipAddress: payload.ipAddress,
    firmwareV: payload.firmwareV
  });
};

module.exports = { handleHearbet, handleStatus }