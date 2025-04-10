import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PurchaseForm({ onCreated }) {
  const [form, setForm] = useState({
    item: "",
    valor: "",
    data: "",
    categoriaId: "",
    recorrente: false,
  });

  const [categorias, setCategorias] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await axios.get("http://localhost:3001/categorias");
        setCategorias(res.data);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        setErro("Erro ao carregar categorias.");
      }
    }

    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    try {
      await axios.post("http://localhost:3001/compras", {
        ...form,
        valor: parseFloat(form.valor),
        categoriaId: parseInt(form.categoriaId),
      });

      setForm({
        item: "",
        valor: "",
        data: "",
        categoriaId: "",
        recorrente: false,
      });

      setMensagem("Compra cadastrada com sucesso!");
      if (onCreated) onCreated();
    } catch (err) {
      console.error("Erro ao cadastrar compra:", err);
      setErro("Erro ao cadastrar compra.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.title}>Nova Compra</h3>

      <input
        type="text"
        name="item"
        placeholder="Descrição do item"
        value={form.item}
        onChange={handleChange}
        style={styles.input}
        required
      />

      <input
        type="number"
        name="valor"
        placeholder="Valor"
        value={form.valor}
        onChange={handleChange}
        style={styles.input}
        required
      />

      <input
        type="date"
        name="data"
        value={form.data}
        onChange={handleChange}
        style={styles.input}
        required
      />

      <select
        name="categoriaId"
        value={form.categoriaId}
        onChange={handleChange}
        style={styles.input}
        required
      >
        <option value="">Selecione uma categoria</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nome}
          </option>
        ))}
      </select>

      <label style={styles.checkboxLabel}>
        <input
          type="checkbox"
          name="recorrente"
          checked={form.recorrente}
          onChange={handleChange}
          style={{ marginRight: "8px" }}
        />
        Compra recorrente?
      </label>

      <button type="submit" style={styles.button}>
        Cadastrar
      </button>

      {mensagem && <p style={styles.success}>{mensagem}</p>}
      {erro && <p style={styles.error}>{erro}</p>}
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#1e1e1e",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "400px",
    marginBottom: "20px",
    color: "#fff",
  },
  title: {
    marginBottom: "15px",
  },
  input: {
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "4px",
    border: "1px solid #333",
    backgroundColor: "#2a2a2a",
    color: "#fff",
  },
  checkboxLabel: {
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  success: {
    color: "lightgreen",
    marginTop: "10px",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};
