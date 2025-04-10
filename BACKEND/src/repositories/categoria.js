const { prisma } = require("../services/prisma");

// Criar nova categoria
exports.createCategoria = async (data) => {
  return await prisma.Categoria.create({
    data: {
      nome: data.nome,
    },
  });
};

// Buscar todas as categorias
exports.getCategorias = async () => {
  return await prisma.Categoria.findMany({
    orderBy: {
      nome: 'asc',
    },
  });
};

// Buscar todas as categorias pro Id
exports.getCategoriaById = async (id) => {
  return await prisma.categoria.findUnique({
    where: { id },
  });
};
// Deletar categorias
exports.deleteCategoria = async (id) => {
  return await prisma.categoria.delete({
    where: { id },
  });
};

// Editar categoria
exports.updateCategoria = async (id, data) => {
  return await prisma.categoria.update({
    where: { id },
    data: {
      nome: data.nome,
    },
  });
};
