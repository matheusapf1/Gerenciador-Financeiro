import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CategoryPage() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState(null);
  const [editando, setEditando] = useState(null);
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
    <div style={styles.container}>
      <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>⬅ Voltar</button>
      <h2>Gerenciar Categorias</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Nome da categoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Criar</button>
      </form>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <ul style={styles.list}>
        {categorias.map((cat) => (
          <li key={cat.id} style={styles.item}>
            {editando === cat.id ? (
              <>
                <input value={nomeEditado} onChange={(e) => setNomeEditado(e.target.value)} style={styles.input} />
                <button onClick={() => handleSalvarEdicao(cat.id)} style={styles.button}>Salvar</button>
                <button onClick={() => setEditando(null)} style={styles.cancel}>Cancelar</button>
              </>
            ) : (
              <>
                {cat.nome}
                <button onClick={() => { setEditando(cat.id); setNomeEditado(cat.nome); }} style={styles.button}>Editar</button>
                <button onClick={() => handleExcluir(cat.id)} style={styles.cancel}>Excluir</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#121212',
    color: '#fff',
    minHeight: '100vh'
  },
  backBtn: {
    backgroundColor: '#444',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: 'none',
    cursor: 'pointer'
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    border: '1px solid #444'
  },
  button: {
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  cancel: {
    backgroundColor: '#c0392b',
    color: '#fff',
    padding: '8px 12px',
    marginLeft: '5px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  item: {
    backgroundColor: '#1f1f1f',
    padding: '12px',
    marginBottom: '10px',
    borderRadius: '4px'
  }
};
