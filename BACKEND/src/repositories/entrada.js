const { prisma } = require('../services/prisma');

exports.createEntrada = async (data) => {
  return await prisma.Entrada.create({ data }); 
};

exports.getEntradasByUserId = async (userId, dataInicial, dataFinal) => {
  const where = { userId };

  if (dataInicial && dataFinal) {
    where.data = {
      gte: new Date(dataInicial),
      lte: new Date(dataFinal),
    };
  }

  return await prisma.Entrada.findMany({
    where,
    orderBy: { data: 'desc' },
  });
};
