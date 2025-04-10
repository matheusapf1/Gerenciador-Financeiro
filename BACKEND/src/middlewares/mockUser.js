module.exports = (req, res, next) => {
    req.user = { id: 1 }; // ID fixo do usuário
    next();
  };
  