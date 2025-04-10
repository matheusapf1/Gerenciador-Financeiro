const { prisma } = require("../services/prisma");

exports.createUser = async (data) => {
    console.log("DADOS QUE CHEGARAM NO REPOSITORY:", data); // 👀 debug

    const user = await prisma.user.create({
        data,
        select: {
            id: true,
            name: true,
            email: true,
            password: false,
        },
    });
    
    return user;
};

exports.getUser = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            password: false,
        }
    });
    return users; // Corrigido
};

exports.getById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            password: false,
        }
    });
    return user; // Corrigido
};

exports.updateUser = async (id, data) => { // Corrigido nome da função
    const user = await prisma.user.update({
        where: {
            id,
        },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            password: false,
        }
    });
    return user;
};

exports.removeUser = async (id) => {
    await prisma.user.delete({
        where: {
            id,
        },
    });
    return;
};
