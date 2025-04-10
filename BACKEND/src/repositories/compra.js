const { prisma } = require("../services/prisma");

// Criar nova compra com validação
exports.createCompra = async (data) => {
  // Verifica se o usuário existe
  const userExists = await prisma.user.findUnique({
    where: { id: data.userId }
  });

  if (!userExists) {
    throw new Error("Usuário não encontrado.");
  }

  // Verifica se a categoria existe
  const categoriaExists = await prisma.categoria.findUnique({
    where: { id: data.categoriaId }
  });

  if (!categoriaExists) {
    throw new Error("Categoria não encontrada.");
  }

  return await prisma.compra.create({
    data: {
      item: data.item,
      valor: data.valor,
      data: new Date(data.data),
      recorrente: data.recorrente ?? false, // Corrigido aqui ✅
      user: {
        connect: { id: data.userId },
      },
      categoria: {
        connect: { id: data.categoriaId },
      },
    },
  });
};

// Buscar compras por usuário (com filtro opcional de datas)
exports.getComprasByUserId = async (userId, dataInicial, dataFinal) => {
  const where = { userId };

  if (dataInicial && dataFinal) {
    const start = new Date(dataInicial);
    const end = new Date(dataFinal);

    if (!isNaN(start) && !isNaN(end)) {
      where.data = {
        gte: start,
        lte: end,
      };
    }
  }

  return await prisma.compra.findMany({
    where,
    orderBy: {
      data: "desc",
    },
  });
};

// Deletar compra
exports.deleteCompra = async (id, userId) => {
  const compra = await prisma.compra.findUnique({
    where: { id }
  });

  if (!compra || compra.userId !== userId) {
    throw new Error("Compra não encontrada ou não autorizada.");
  }

  return await prisma.compra.delete({
    where: { id }
  });
};

// Atualizar compra
exports.updateCompra = async (id, userId, data) => {
  const compra = await prisma.compra.findUnique({
    where: { id },
  });

  if (!compra || compra.userId !== userId) {
    throw new Error("Compra não encontrada ou não autorizada.");
  }

  return await prisma.compra.update({
    where: { id },
    data: {
      item: data.item,
      valor: data.valor,
      data: data.data ? new Date(data.data) : undefined,
      recorrente: data.recorrente, // Incluído aqui também ✅
    },
  });
};

// Gasto total do usuário
exports.getGastoTotal = async (userId) => {
  const resultado = await prisma.compra.aggregate({
    where: { userId },
    _sum: {
      valor: true
    }
  });

  return resultado._sum.valor || 0;
};
