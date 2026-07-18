const express = require("express");
const router = express.Router();
const { signup, login, getProfile, resetPassword } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;