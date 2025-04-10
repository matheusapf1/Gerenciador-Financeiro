const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 🧹 Limpa os dados antigos 
  await prisma.compra.deleteMany();
  await prisma.Entrada.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.user.deleteMany();

  // 👤 Cria usuário fixo com ID = 1
  const user = await prisma.user.create({
    data: {
      id: 1, // 👈 Força ID 1
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
    },
  });

  // 🏷️ Cria categoria padrão
  const categoria = await prisma.categoria.create({
    data: {
      nome: "Alimentação",
    },
  });

  console.log("Seed criada ✅");
  console.log("User ID:", user.id);
  console.log("Categoria ID:", categoria.id);
  console.log(prisma)
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
