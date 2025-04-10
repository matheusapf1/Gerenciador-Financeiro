// src/testApi.js

fetch("http://localhost:3001/ping")
  .then((res) => res.text())
  .then((data) => console.log("✅ Resposta do backend:", data))
  .catch((err) => console.error("❌ Erro ao conectar com o backend:", err));

