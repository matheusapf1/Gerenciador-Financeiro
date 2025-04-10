// src/routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// 📊 Rota principal do dashboard – retorna entradas, gastos e saldo
router.get('/', dashboardController.dashboard); // ex: GET /dashboard

// 📋 Resumo geral de compras (total, média, última compra, etc.)
router.get('/resumo', dashboardController.getResumo); // ex: GET /dashboard/resumo

// 📆 Detalhado do mês atual (total, média, última compra no mês)
router.get('/detalhado', dashboardController.getDashboard); // ex: GET /dashboard/detalhado

// 💰 Total gasto geral
router.get('/gasto-total', dashboardController.getGastoTotal); // ex: GET /dashboard/gasto-total

// 🧾 Gasto agrupado por categoria (nome + valor)
router.get('/gasto-por-categoria', dashboardController.getGastoPorCategoria); // ex: GET /dashboard/gasto-por-categoria

// 🔝 Top 5 maiores despesas
router.get('/top-despesas', dashboardController.getTopDespesas); // ex: GET /dashboard/top-despesas

module.exports = router;
