const { 
    createUser,      // Corrigido
    getById,
    getUser, 
    removeUser,
    updateUser,
} = require("../repositories/user"); // Corrigido
const bcrypt = require("bcrypt")
const { userValidation } = require("../validations/user");

exports.create = async (req, res) => {
    try {
        const data = await userValidation.parse(req.body);
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        const user = await createUser(req.body);
        res.status(200).send(user);
    } catch (e) {
        // Se for erro de e-mail duplicado
        if (e.code === 'P2002' && e.meta?.target?.includes('email')) {
            return res.status(400).send({ message: 'E-mail já está em uso.' });
        }

        // Qualquer outro erro
        res.status(500).send({ message: 'Erro ao criar usuário', error: e.message });
    }
};


exports.get = async (req, res) => {
    try {
        const user = await getUser();
        res.status(200).send(user); // Corrigido
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.getID = async (req, res) => {
    try {
        const user = await getById(Number(req.params.id));
        res.status(200).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.update = async (req, res) => {
    try {
        const user = await updateUser(Number(req.params.id), req.body);
        res.status(200).send(user); // Corrigido
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.remove = async (req, res) => {
    try {
        await removeUser(Number(req.params.id));
        res.status(200).send();
    } catch (e) {
        res.status(400).send(e);
    }
};
