const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoria");

// Criar categoria
router.post("/", categoriaController.create);

// Listar todas as categorias
router.get("/", categoriaController.get);

// Buscar categoria por ID
router.get("/:id", categoriaController.getById);

// Atualizar categoria
router.put("/:id", categoriaController.update);

// Deletar categoria
router.delete("/:id", categoriaController.delete);

module.exports = router;
