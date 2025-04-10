const { prisma } = require("../services/prisma");

// Total de gastos por categoria
exports.getTotalGastosPorCategoria = async (userId) => {
  return await prisma.compra.groupBy({
    by: ['categoriaId'],
    _sum: {
      valor: true,
    },
    where: {
      userId: userId,
    },
  });
};

// Média de gastos mensais
exports.getMediaGastosMensais = async (userId) => {
  const result = await prisma.compra.aggregate({
    _avg: {
      valor: true,
    },
    where: {
      userId: userId,
    },
  });
  return result._avg.valor || 0;
};

// Total de compras no mês atual
exports.getTotalComprasMesAtual = async (userId) => {
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const fimMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  return await prisma.compra.count({
    where: {
      userId: userId,
      data: {
        gte: inicioMes,
        lte: fimMes,
      },
    },
  });
};

// Mês com maior gasto
exports.getMesComMaiorGasto = async (userId) => {
  const result = await prisma.compra.groupBy({
    by: ['data'],
    _sum: {
      valor: true,
    },
    where: {
      userId: userId,
    },
    orderBy: {
      _sum: {
        valor: 'desc',
      },
    },
    take: 1,
  });

  if (result.length > 0) {
    const data = new Date(result[0].data);
    const mes = data.toLocaleString('default', { month: 'long' });
    return { mes, total: result[0]._sum.valor };
  }
  return null;
};

// Quantidade total de compras
exports.getQuantidadeTotalCompras = async (userId) => {
  return await prisma.compra.count({
    where: {
      userId: userId,
    },
  });
};
