const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createConta = async (data) => {
  return await prisma.conta.create({
    data
  });
};

exports.getContas = async () => {
  return await prisma.conta.findMany();
};

exports.getContaById = async (id) => {
  return await prisma.conta.findUnique({
    where: { id }
  });
};

exports.updateConta = async (id, data) => {
  return await prisma.conta.update({
    where: { id },
    data
  });
};

exports.deleteConta = async (id) => {
  return await prisma.conta.delete({
    where: { id }
  });
};
