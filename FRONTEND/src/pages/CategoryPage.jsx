import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CategoryPage() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState(null);
  const [editando, setEditando] = useState(null); // id da categoria sendo editada
  const [nomeEditado, setNomeEditado] = useState("");
  const navigate = useNavigate();

  const carregarCategorias = async () => {
    try {
      const res = await axios.get("http://localhost:3001/categorias");
      setCategorias(res.data);
    } catch (err) {
      setErro("Erro ao carregar categorias.");
      console.error(err);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/categorias", { nome });
      setNome("");
      carregarCategorias();
    } catch (err) {
      setErro("Erro ao criar categoria.");
      console.error(err);
    }
  };

  const handleExcluir = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/categorias/${id}`);
      carregarCategorias();
    } catch (err) {
      setErro("Erro ao excluir categoria.");
      console.error(err);
    }
  };

  const handleSalvarEdicao = async (id) => {
    try {
      await axios.put(`http://localhost:3001/categorias/${id}`, { nome: nomeEditado });
      setEditando(null);
      setNomeEditado("");
      carregarCategorias();
    } catch (err) {
      setErro("Erro ao editar categoria.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", color: "#fff", backgroundColor: "#1e1e1e", minHeight: "100vh" }}>
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          padding: "6px 12px",
          marginBottom: "20px",
          backgroundColor: "#444",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ⬅️ Voltar para o Dashboard
      </button>

      <h2>Gerenciar Categorias</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nome da categoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={{ marginRight: "10px" }}
        />
        <button type="submit">Criar</button>
      </form>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <h3>Categorias existentes:</h3>
      <ul>
        {categorias.map((cat) => (
          <li key={cat.id} style={{ marginBottom: "10px" }}>
            {editando === cat.id ? (
              <>
                <input
                  type="text"
                  value={nomeEditado}
                  onChange={(e) => setNomeEditado(e.target.value)}
                  style={{ marginRight: "10px" }}
                />
                <button onClick={() => handleSalvarEdicao(cat.id)}>Salvar</button>
                <button onClick={() => setEditando(null)} style={{ marginLeft: "5px" }}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                {cat.nome}
                <button onClick={() => {
                  setEditando(cat.id);
                  setNomeEditado(cat.nome);
                }} style={{ marginLeft: "10px" }}>
                  Editar
                </button>
                <button onClick={() => handleExcluir(cat.id)} style={{ marginLeft: "5px" }}>
                  Excluir
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
