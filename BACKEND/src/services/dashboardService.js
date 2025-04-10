// src/services/dashboardService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getGastoTotal() {
  const resultado = await prisma.compra.aggregate({
    _sum: { valor: true },
  });
  return resultado._sum.valor || 0;
}

async function getGastoPorCategoria() {
  const resultado = await prisma.compra.groupBy({
    by: ['categoriaId'],
    _sum: { valor: true },
    _count: true,
  });

  return resultado;
}

async function getTopDespesas(limit = 5) {
  const resultado = await prisma.compra.findMany({
    orderBy: { valor: 'desc' },
    take: limit,
  });

  return resultado;
}

module.exports = {
  getGastoTotal,
  getGastoPorCategoria,
  getTopDespesas,
};
