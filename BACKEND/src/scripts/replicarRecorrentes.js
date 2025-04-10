const { prisma } = require('../services/prisma');

async function replicarComprasRecorrentes() {
  const userId = 1;

  const agora = new Date();
  const anoAtual = agora.getFullYear();
  const mesAtual = agora.getMonth(); // ex: abril = 3

  // Corrige o cálculo do mês anterior
  const anoAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
  const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;

  const inicioMesAnterior = new Date(anoAnterior, mesAnterior, 1);
  const fimMesAnterior = new Date(anoAnterior, mesAnterior + 1, 0);

  const inicioMesAtual = new Date(anoAtual, mesAtual, 1);

  const comprasRecorrentes = await prisma.compra.findMany({
    where: {
      userId,
      recorrente: true,
      data: {
        gte: inicioMesAnterior,
        lte: fimMesAnterior,
      },
    },
  });

  for (const compra of comprasRecorrentes) {
    const novaData = new Date(anoAtual, mesAtual, compra.data.getDate());

    const jaExiste = await prisma.compra.findFirst({
      where: {
        item: compra.item,
        valor: compra.valor,
        userId,
        data: novaData,
      },
    });

    if (!jaExiste) {
      await prisma.compra.create({
        data: {
          item: compra.item,
          valor: compra.valor,
          data: novaData,
          categoriaId: compra.categoriaId,
          userId: compra.userId,
          recorrente: false, // réplicas são marcadas como não recorrentes
        },
      });

      console.log(`✅ "${compra.item}" replicado para ${novaData.toLocaleDateString()}`);
    } else {
      console.log(`⚠️ "${compra.item}" já existe para ${novaData.toLocaleDateString()}`);
    }
  }

  console.log('✅ Finalizado com sucesso.');
}

replicarComprasRecorrentes()
  .catch((e) => {
    console.error('❌ Erro:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
