const express = require("express");
const cors = require("cors");

const app = express();

// Importação das rotas
const userRoutes = require('./routes/user');
const compraRoutes = require('./routes/compraRoutes');
const entradaRoutes = require('./routes/entradaRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const bodyParser = require("body-parser");

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware para simular usuário logado (ID fixo)
app.use((req, res, next) => {
  req.user = { id: 1 }; // Sempre assume que o usuário logado tem ID 1
  next();
});

// Usuários "fake" só pro login (apenas pra testes visuais no front)
const usuarios = [
  { email: "matheus@gmail.com", password: "123456" }
];

// Rotas públicas
app.get('/status', (req, res) => {
  res.json({ status: 'Servidor operacional' });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (usuario) {
    res.json({ success: true, message: 'Login bem-sucedido', user: { email } });
  } else {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }
});

// Ativando as rotas
app.use('/user', userRoutes);
app.use('/compras', compraRoutes); // ← Rota protegida por usuário simulado
app.use('/entradas', entradaRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/dashboard', dashboardRoutes);

// Iniciando servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Status: http://localhost:${PORT}/status`);
});
