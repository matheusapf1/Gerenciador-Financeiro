const jwt = require('jsonwebtoken');

// Segredo para assinar o token
const SECRET = process.env.JWT_SECRET || "segredo-super-seguro";

exports.login = (req, res) => {
  const { email, senha } = req.body;

  // Simulação de usuário válido
  if (email === "matheus@gmail.com" && senha === "123456") {
    const payload = { email };

    const token = jwt.sign(payload, SECRET, {
      expiresIn: "1h"
    });

    res.status(200).json({
      mensagem: "Login bem-sucedido",
      token: token
    });
  } else {
    res.status(401).json({ mensagem: "Credenciais inválidas" });
  }
};
