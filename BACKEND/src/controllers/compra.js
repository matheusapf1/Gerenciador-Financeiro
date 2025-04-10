const { prisma } = require("../services/prisma");
const {
  createCompra,
  getComprasByUserId,
  deleteCompra,
  updateCompra,
  getGastoTotal
} = require("../repositories/compra");

const { z } = require("zod");

const userId = 1;

const compraSchema = z.object({
  item: z.string().min(1, "Item é obrigatório"),
  valor: z.number().positive("Valor deve ser maior que zero"),
  categoriaId: z.number(),
  data: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Data inválida"
  }),
  recorrente: z.boolean().optional()
});

// Criar nova compra (recorrente ou não)
exports.create = async (req, res) => {
  try {
    const parsed = compraSchema.parse(req.body);
    const data = { ...parsed, userId };
    const compra = await createCompra(data);
    res.status(201).send(compra);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors });
    }
    res.status(400).send({ error: e.message });
  }
};

// Buscar todas as compras com filtros por mês e ano
exports.get = async (req, res) => {
  try {
    const { mes, ano, dataInicial, dataFinal } = req.query;

    let compras;

    if (mes && ano) {
      const mesInt = parseInt(mes) - 1;
      const anoInt = parseInt(ano);
      const inicio = new Date(anoInt, mesInt, 1);
      const fim = new Date(anoInt, mesInt + 1, 1);

      compras = await prisma.compra.findMany({
        where: {
          userId,
          data: {
            gte: inicio,
            lt: fim
          }
        },
        orderBy: { data: 'desc' }
      });
    } else {
      compras = await getComprasByUserId(userId, dataInicial, dataFinal);
    }

    res.status(200).send(compras);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

// Atualizar compra
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    await updateCompra(parseInt(id), userId, req.body);
    res.status(200).send({ message: "Compra atualizada com sucesso!" });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

// Deletar compra
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCompra(parseInt(id), userId);
    res.status(204).send();
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

// Gasto total (dashboard)
exports.dashboard = async (req, res) => {
  try {
    const total = await getGastoTotal(userId);
    res.status(200).json({ gastoTotal: total });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Compras recorrentes do mês atual
exports.getRecorrentesDoMes = async (req, res) => {
  try {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);

    const recorrentes = await prisma.compra.findMany({
      where: {
        userId,
        recorrente: true,
        data: {
          gte: inicioMes,
          lte: fimMes
        }
      },
      orderBy: { data: 'desc' }
    });

    res.json(recorrentes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Compras replicadas (não recorrentes) do mês atual
exports.getReplicadasDoMes = async (req, res) => {
  try {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);

    const replicadas = await prisma.compra.findMany({
      where: {
        userId,
        recorrente: false,
        data: {
          gte: inicioMes,
          lte: fimMes
        }
      },
      orderBy: { data: 'desc' }
    });

    res.json(replicadas);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
