const {
  createCategoria,
  getCategorias,
  getCategoriaById,
  updateCategoria,
  deleteCategoria,
} = require('../repositories/categoria');

// Criar nova categoria
exports.create = async (req, res) => {
  try {
    const categoria = await createCategoria(req.body);
    res.status(201).json(categoria);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// Listar todas as categorias
exports.get = async (req, res) => {
  try {
    const categorias = await getCategorias();
    res.json(categorias);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// Buscar categoria por ID
exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const categoria = await getCategoriaById(id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    res.json(categoria);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// Atualizar categoria
exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const categoria = await updateCategoria(id, req.body);
    res.json(categoria);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// Deletar categoria
exports.delete = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await deleteCategoria(id);
    res.status(204).send(); // No content
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
