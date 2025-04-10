const express = require("express");
const cors = require("cors");

const app = express();

// Configurações básicas
app.use(cors());
app.use(express.json());

// Banco de dados em memória
let compras = [];
let usuarios = [
  {
    id: 1,
    email: "matheus@gmail.com",
    password: "123456", // Em produção, utilize hashes seguros
  },
];

// Middleware de autenticação
const autenticar = (req, res, next) => {
  const { email, password } = req.body;
  const usuario = usuarios.find(
    (u) => u.email === email && u.password === password
  );
  if (!usuario) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }
  req.usuario = usuario;
  next();
};

// Rotas públicas
app.get("/status", (req, res) => {
  res.json({ status: "Servidor operacional" });
});

// Sistema de login
app.post("/auth/login", autenticar, (req, res) => {
  res.json({
    success: true,
    message: "Login bem-sucedido",
    user: { id: req.usuario.id, email: req.usuario.email },
  });
});

// Rotas de usuários
app.post("/usuarios", (req, res) => {
  const { email, password } = req.body;
  if (usuarios.some((u) => u.email === email)) {
    return res.status(400).json({ message: "E-mail já cadastrado" });
  }
  const novoUsuario = {
    id: usuarios.length + 1,
    email,
    password, // Em produção, armazene hashes seguros
  };
  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
});

app.get("/usuarios", (req, res) => {
  res.json(usuarios.map(({ id, email }) => ({ id, email })));
});

app.get("/usuarios/:id", (req, res) => {
  const usuario = usuarios.find((u) => u.id === parseInt(req.params.id));
  if (!usuario) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }
  res.json({ id: usuario.id, email: usuario.email });
});

app.put("/usuarios/:id", (req, res) => {
  const usuario = usuarios.find((u) => u.id === parseInt(req.params.id));
  if (!usuario) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }
  const { email, password } = req.body;
  if (email) usuario.email = email;
  if (password) usuario.password = password; // Em produção, armazene hashes seguros
  res.json({ message: "Usuário atualizado com sucesso" });
});

app.delete("/usuarios/:id", (req, res) => {
  const index = usuarios.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }
  usuarios.splice(index, 1);
  res.json({ message: "Usuário removido com sucesso" });
});

// Rotas de compras
app.get("/compras", (req, res) => {
  res.json(compras);
});

app.post("/compras", (req, res) => {
  const { descricao, valor, data } = req.body;
  if (!descricao || !valor || !data) {
    return res
      .status(400)
      .json({ error: "Descrição, valor e data são obrigatórios" });
  }
  const novaCompra = {
    id: compras.length + 1,
    descricao,
    valor: parseFloat(valor),
    data,
    criadoEm: new Date().toISOString(),
  };
  compras.push(novaCompra);
  res.status(201).json(novaCompra);
});

app.get("/compras/:id", (req, res) => {
  const compra = compras.find((c) => c.id === parseInt(req.params.id));
  if (!compra) {
    return res.status(404).json({ message: "Compra não encontrada" });
  }
  res.json(compra);
});

app.put("/compras/:id", (req, res) => {
  const compra = compras.find((c) => c.id === parseInt(req.params.id));
  if (!compra) {
    return res.status(404).json({ message: "Compra não encontrada" });
  }
  const { descricao, valor, data } = req.body;
  if (descricao) compra.descricao = descricao;
  if (valor) compra.valor = parseFloat(valor);
  if (data) compra.data = data;
  res.json({ message: "Compra atualizada com sucesso" });
});

app.delete("/compras/:id", (req, res) => {
  const index = compras.findIndex((c) => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Compra não encontrada" });
  }
  compras.splice(index, 1);
  res.json({ message: "Compra removida com sucesso" });
});

// Inicialização do servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Teste o status em: http://localhost:${PORT}/status`);
});
