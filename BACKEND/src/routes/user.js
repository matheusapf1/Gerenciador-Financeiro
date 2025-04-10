const express = require('express');
const router = express.Router();
const userController = require('../controllers/user'); // Nome do arquivo correto

// Rota para criar usuário
router.post('/', userController.create);

// Rota para listar todos os usuários
router.get('/', userController.get);

// Rota para buscar um usuário por ID
router.get('/:id', userController.getID);

// Rota para atualizar um usuário
router.put('/:id', userController.update);

// Rota para deletar um usuário
router.delete('/:id', userController.remove);

module.exports = router;
