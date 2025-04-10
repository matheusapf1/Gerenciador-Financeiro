const { createEntrada, getEntradasByUserId } = require('../repositories/entrada');

exports.create = async (req, res) => {
  try {
    const entrada = await createEntrada({
      ...req.body,
      data: new Date(req.body.data),
      userId: req.user.id
    });
    
    res.status(201).json(entrada);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.get = async (req, res) => {
  try {
    const entradas = await getEntradasByUserId(req.user.id, req.query.dataInicial, req.query.dataFinal);
    res.json(entradas);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
