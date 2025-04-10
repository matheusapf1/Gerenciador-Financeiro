const {
    createConta,
    getContas,
    getContaById,
    updateConta,
    deleteConta,
  } = require('../repositories/conta');
  
  exports.create = async (req, res) => {
    try {
      const conta = await createConta(req.body);
      res.status(201).send(conta);
    } catch (e) {
      res.status(400).send({ message: 'Erro ao criar conta', error: e.message });
    }
  };
  
  exports.getAll = async (req, res) => {
    try {
      const contas = await getContas();
      res.status(200).send(contas);
    } catch (e) {
      res.status(400).send({ message: 'Erro ao buscar contas', error: e.message });
    }
  };
  
  exports.getById = async (req, res) => {
    try {
      const conta = await getContaById(Number(req.params.id));
  
      if (!conta) {
        return res.status(404).send({ message: 'Conta não encontrada' });
      }
  
      res.status(200).send(conta);
    } catch (e) {
      res.status(400).send({ message: 'Erro ao buscar conta', error: e.message });
    }
  };
  
  exports.update = async (req, res) => {
    try {
      const conta = await updateConta(Number(req.params.id), req.body);
      res.status(200).send(conta);
    } catch (e) {
      res.status(400).send({ message: 'Erro ao atualizar conta', error: e.message });
    }
  };
  
  exports.remove = async (req, res) => {
    try {
      await deleteConta(Number(req.params.id));
      res.status(204).send();
    } catch (e) {
      res.status(400).send({ message: 'Erro ao deletar conta', error: e.message });
    }
  };
  