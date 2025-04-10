# 💸 Sistema de Controle Financeiro Pessoal

Este projeto é um sistema completo para controle de gastos pessoais, com funcionalidades de login, registro de entradas, despesas, categorias, dashboard com estatísticas e suporte a gastos recorrentes.

---

## 📌 Visão Geral

Um sistema full-stack (Node.js + React) que permite ao usuário:

- Cadastrar suas **compras e entradas** financeiras
- Acompanhar um **dashboard inteligente**
- Criar e gerenciar **categorias de gastos**
- Trabalhar com **gastos recorrentes**
- Visualizar o **total de gastos por categoria**

---

## 🌐 Tecnologias Utilizadas

### 🖥️ Frontend
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- CSS puro

### 🔧 Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [SQLite](https://www.sqlite.org/index.html)

---

## 🧱 Estrutura do Projeto

├── backend/ │ ├── src/ │ │ ├── controllers/ │ │ ├── routes/ │ │ ├── repositories/ │ │ ├── services/ │ │ └── scripts/ │ └── prisma/ │ └── schema.prisma ├── frontend/ │ ├── src/ │ │ ├── pages/ │ │ ├── components/ │ │ └── App.jsx


---

## 🔐 Autenticação Simulada

- O sistema **não usa JWT**, apenas simula autenticação com `req.user.id = 1`
- Ideal para fins didáticos e testes locais

---

## 🧑‍💻 Funcionalidades Implementadas

### 📥 Entradas

- `POST /entradas`: Cadastra uma entrada (ex: salário)
- `GET /entradas`: Lista todas as entradas do usuário

### 🛒 Compras

- `POST /compras`: Cria nova compra
- `GET /compras`: Lista todas as compras
- `PUT /compras/:id`: Atualiza uma compra
- `DELETE /compras/:id`: Deleta uma compra
- `GET /compras/recorrentes`: Lista compras fixas do mês atual

### 📂 Categorias

- `POST /categorias`: Cria uma nova categoria
- `GET /categorias`: Lista categorias
- `PUT /categorias/:id`: Edita uma categoria
- `DELETE /categorias/:id`: Exclui categoria

### 📊 Dashboard

- `GET /dashboard`: Retorna saldo (entradas - gastos)
- `GET /dashboard/resumo`: Total, média e última compra
- `GET /dashboard/gasto-total`: Somatório de todas as compras
- `GET /dashboard/gasto-por-categoria`: Agrupa por categoria
- `GET /dashboard/top-despesas`: Retorna as 5 maiores compras

### 🔁 Compras Recorrentes

- O campo `"recorrente": true` no JSON ativa a recorrência
- Roda o script com:
  ```bash
  npm run replicar:recorrentes

🧪 Testes com Insomnia (Exemplos)

Criar uma compra

POST http://localhost:3001/compras
{
  "item": "Aluguel",
  "valor": 1500,
  "categoriaId": 5,
  "data": "2025-04-01",
  "recorrente": true
}

Criar uma entrada

POST http://localhost:3001/entradas
{
  "valor": 3000,
  "data": "2025-04-01"
}

🖥️ Frontend – Telas Implementadas

Página - Descrição
/login	Tela de login fake com email/senha
/dashboard	Painel principal com lista de compras
/categorias	CRUD de categorias
/gastos-por-categoria	Dashboard agrupado por categoria

🐞 Erros Enfrentados e Soluções

❌ Erro de prisma is not defined: resolvido importando corretamente o prisma no controller

❌ Erro de casing no Windows (Dashboard.jsx vs dashboard.jsx): resolvido padronizando letras maiúsculas/minúsculas

❌ Frontend não reconhecia rota /categorias: corrigido adicionando rota em App.jsx e reiniciando Vite

❌ Campos recorrente não eram salvos: resolvido adicionando no schema do Zod e no repositório do backend


📈 Melhorias Futuras

✅ Autenticação com JWT

✅ Upload de comprovantes (arquivos)

✅ Gráficos visuais (Chart.js ou Recharts)

✅ Filtro por categoria no dashboard

✅ Exportar para PDF ou CSV

🚀 Como Rodar o Projeto
# No backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# No frontend
cd frontend
npm install
npm run dev




