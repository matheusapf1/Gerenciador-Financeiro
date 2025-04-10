const { prisma } = require("../services/prisma");
const { getComprasByUserId } = require("../repositories/compra");
const { replicarComprasMensais } = require('../utils/replicador');


// Dashboard geral (detalhado do mês atual)
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    await replicarComprasMensais(userId); // ← replica se necessário

    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

    const compras = await prisma.compra.findMany({
      where: {
        userId,
        data: {
          gte: inicioMes,
          lte: agora,
        },
      },
    });

    const totalGasto = compras.reduce((acc, c) => acc + Number(c.valor), 0);
    const quantidade = compras.length;
    const media = quantidade > 0 ? totalGasto / quantidade : 0;
    const ultimaCompra = compras.sort((a, b) => b.data - a.data)[0];

    res.status(200).send({
      totalGasto: totalGasto.toFixed(2),
      quantidade,
      media: media.toFixed(2),
      ultimaCompra,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

// Resumo geral de compras (sem filtro de mês)
exports.getResumo = async (req, res) => {
  try {
    const userId = req.user.id;
    const compras = await getComprasByUserId(userId);

    const totalGasto = compras.reduce((acc, c) => acc + Number(c.valor), 0);
    const quantidade = compras.length;
    const media = quantidade > 0 ? (totalGasto / quantidade).toFixed(2) : 0;
    const ultimaCompra = compras[0] || null;

    res.status(200).send({
      totalGasto: totalGasto.toFixed(2),
      quantidade,
      media,
      ultimaCompra,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

// Entradas, gastos e saldo
exports.dashboard = async (req, res) => {
  const userId = req.user.id;

  try {
    const entradas = await prisma.entrada.aggregate({
      _sum: { valor: true },
      where: { userId },
    });

    const compras = await prisma.compra.aggregate({
      _sum: { valor: true },
      where: { userId },
    });

    const totalEntradas = entradas._sum.valor || 0;
    const totalGastos = compras._sum.valor || 0;
    const saldo = totalEntradas - totalGastos;

    res.json({
      entradas: totalEntradas,
      gastos: totalGastos,
      saldo,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Total geral gasto
exports.getGastoTotal = async (req, res) => {
  try {
    const userId = req.user.id;

    const resultado = await prisma.compra.aggregate({
      _sum: { valor: true },
      where: { userId },
    });

    res.json({ total: resultado._sum.valor || 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Gasto por categoria (com nome da categoria incluído)
exports.getGastoPorCategoria = async (req, res) => {
  try {
    const userId = req.user?.id || 1; // fallback para testes

    const resultado = await prisma.compra.groupBy({
      by: ['categoriaId'],
      where: { userId },
      _sum: { valor: true },
    });

    // Buscar nomes das categorias
    const categorias = await prisma.categoria.findMany();

    // Juntar os dados
    const resposta = resultado.map((item) => {
      const categoria = categorias.find(c => c.id === item.categoriaId);
      return {
        _sum: item._sum,
        categoria: categoria || { nome: "Categoria Desconhecida" },
      };
    });

    res.json(resposta);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};


// Top 5 maiores despesas
exports.getTopDespesas = async (req, res) => {
  try {
    const userId = req.user.id;

    const resultado = await prisma.compra.findMany({
      where: { userId },
      orderBy: { valor: 'desc' },
      take: 5,
    });

    res.json(resultado);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
