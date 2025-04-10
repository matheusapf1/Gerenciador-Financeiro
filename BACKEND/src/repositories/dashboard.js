const { prisma } = require("../services/prisma");

exports.getTotalGastoByUserId = async (userId) => {
  const result = await prisma.compra.aggregate({
    _sum: {
      valor: true,
    },
    where: {
      userId,
    },
  });

  return result._sum.valor || 0;
};
