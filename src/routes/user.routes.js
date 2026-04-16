const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/user.controller');
const { 
    authenticate, 
    authorizeAdmin
} = require('../middleware/auth.middleware');

router.use(authenticate,authorizeAdmin);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser)
router.put("/:id", updateUser);
router.delete("/:id", deleteUser)

module.exports = router;