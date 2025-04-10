const express = require("express");
const router = express.Router();
const compraController = require("../controllers/compra");

// Criar nova compra
router.post("/", compraController.create);

// Buscar compras (com filtros por mês/ano ou datas)
router.get("/", compraController.get);

// Atualizar compra
router.put("/:id", compraController.update);

// Deletar compra
router.delete("/:id", compraController.remove);

// Gasto total do usuário (dashboard)
router.get("/dashboard", compraController.dashboard);

// Compras fixas do mês atual
router.get("/recorrentes", compraController.getRecorrentesDoMes);

// Compras replicadas automaticamente (não-recorrentes)
router.get("/recorrentes/replicadas", compraController.getReplicadasDoMes);

module.exports = router;
