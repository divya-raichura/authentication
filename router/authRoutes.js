const express = require("express");
const router = express.Router();
const { login, register, getProfile, getUsers } = require("../controller/auth");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);

router.get("/users", getUsers);

module.exports = router;
