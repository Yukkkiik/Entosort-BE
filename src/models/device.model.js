const DEVICE_STATUS = {
    ONLINE: "online",
    OFFLINE: "offline",
    ERROR: "error",
};

const DEVICES_STATUS_LIST = Object.values(DEVICE_STATUS);

const MANUAL_MODULES = {
    CONVEYER: "conveyer",
    VIBRATOR: "vibrator",
    SOLENOID: "solenoid",
    CAMERA: "camera"
};

const MANUAL_ACTIONS = {
    START: "start",
    STOP: "stop",
    TOGGLE: "toggle"
};

module.exports = { DEVICE_STATUS, DEVICES_STATUS_LIST, MANUAL_MODULES, MANUAL_ACTIONS};