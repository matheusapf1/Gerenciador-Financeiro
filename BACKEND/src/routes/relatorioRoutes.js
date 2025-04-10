const express = require("express");
const router = express.Router();
const { obterRelatorio } = require("../controllers/relatorioController");

router.get("/relatorio", obterRelatorio);

module.exports = router;
