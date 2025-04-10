const { prisma } = require("../services/prisma");

async function replicarComprasMensais(userId) {
  const agora = new Date();
  const inicioDoMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

  // Verifica se já existem compras recorrentes neste mês
  const jaExiste = await prisma.compra.findFirst({
    where: {
      userId,
      recorrente: true,
      data: {
        gte: inicioDoMes,
      },
    },
  });

  if (jaExiste) {
    return; // Já foi replicado esse mês
  }

  // Pega todas as compras marcadas como recorrente (modelo)
  const comprasRecorrentes = await prisma.compra.findMany({
    where: {
      userId,
      recorrente: true,
    },
  });

  for (const compra of comprasRecorrentes) {
    await prisma.compra.create({
      data: {
        item: compra.item,
        valor: compra.valor,
        data: new Date(),
        userId: compra.userId,
        categoriaId: compra.categoriaId,
        recorrente: true,
      },
    });
  }

  console.log("✅ Compras recorrentes replicadas com sucesso");
}

module.exports = { replicarComprasMensais };
