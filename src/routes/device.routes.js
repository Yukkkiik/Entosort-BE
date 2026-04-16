const express = require('express');
const router = express.Router();
const {
    getAllDevices,
    getDeviceById,
    updateDevice,
    deleteDevice,
    hearthbeat,
    getSettings
} = require('../controllers/device.controller');
const { 
    authenticate, 
    authorizeAdmin
} = require('../middleware/auth.middleware');

router.post("/hearthbeat", hearthbeat)

router.use(authenticate);

router.get("/", getAllDevices);
router.get("/:nodeId", getDeviceById);
router.put("/:nodeId", authorizeAdmin, updateDevice);
router.delete("/:nodeId", authorizeAdmin, deleteDevice);
router.get("/settings/:nodeId", getSettings)


module.exports = router;