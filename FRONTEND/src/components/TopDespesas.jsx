// src/components/TopDespesas.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const TopDespesas = () => {
  const [topDespesas, setTopDespesas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/top-despesas')
      .then(res => setTopDespesas(res.data))
      .catch(err => console.error('Erro ao buscar top despesas:', err));
  }, []);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>💸 Top 5 Maiores Despesas</h3>
      <ul style={styles.list}>
        {topDespesas.length > 0 ? topDespesas.map((d, idx) => (
          <li key={idx} style={styles.item}>
            <strong>{d.item}</strong>: R$ {d.valor.toFixed(2)}
          </li>
        )) : <li style={styles.item}>Carregando...</li>}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#2a2a2a',
    padding: '20px',
    borderRadius: '8px',
    color: '#fff',
    marginBottom: '30px',
    boxShadow: '0 0 5px rgba(0,0,0,0.3)',
  },
  title: {
    marginBottom: '10px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  item: {
    marginBottom: '10px',
  },
};

export default TopDespesas;
