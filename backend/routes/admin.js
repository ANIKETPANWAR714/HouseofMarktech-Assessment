const express = require("express");
const router = express.Router();
const { adminLogin } = require("../controllers/adminController.js");

router.post("/login", adminLogin);

module.exports = router;
