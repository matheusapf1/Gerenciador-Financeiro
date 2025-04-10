import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function GastoPorCategoria() {
  const [gastos, setGastos] = useState([]);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const res = await axios.get("http://localhost:3001/dashboard/gasto-por-categoria");
        setGastos(res.data);
      } catch (err) {
        console.error("Erro ao buscar gastos por categoria:", err);
        setErro("Erro ao carregar dados.");
      }
    };

    fetchGastos();
  }, []);

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
        ⬅️ Voltar
      </button>

      <h2 style={styles.title}>Gastos por Categoria</h2>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {gastos.length === 0 ? (
        <p style={styles.empty}>Nenhum dado encontrado.</p>
      ) : (
        <ul style={styles.list}>
          {gastos.map((item, index) => (
            <li key={index} style={styles.item}>
              <strong>{item.categoria?.nome || "Categoria Desconhecida"}</strong>
              <span style={styles.valor}>
                R$ {(item._sum?.valor || 0).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    minHeight: '100vh',
  },
  backButton: {
    backgroundColor: '#444',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    marginBottom: '20px',
    cursor: 'pointer',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  item: {
    backgroundColor: '#2a2a2a',
    padding: '12px',
    marginBottom: '10px',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  valor: {
    color: '#bbb',
  },
  empty: {
    color: '#ccc',
  },
};
