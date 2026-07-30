// server/routes/repositoryRoutes.js
const express = require("express");
const { analyzeRepository } = require("../controllers/repositoryController");

const router = express.Router();

router.post("/analyze", analyzeRepository);

module.exports = router;