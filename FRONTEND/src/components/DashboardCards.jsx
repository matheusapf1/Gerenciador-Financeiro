// src/components/DashboardCards.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardCards = () => {
  const [saldo, setSaldo] = useState(null);
  const [gastoTotal, setGastoTotal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const saldoRes = await axios.get('http://localhost:3001/dashboard');
        const gastoRes = await axios.get('http://localhost:3001/dashboard/gasto-total');

        setSaldo(saldoRes.data?.saldo ?? null);
        setGastoTotal(gastoRes.data?.gastoTotal ?? null);
      } catch (err) {
        console.error('Erro ao buscar saldo ou gasto total:', err);
      }
    };

    fetchData();
  }, []);

  const formatValor = (valor) => {
    return typeof valor === 'number' ? `R$ ${valor.toFixed(2)}` : 'Carregando...';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3>Saldo Geral</h3>
        <p>{formatValor(saldo)}</p>
      </div>
      <div style={styles.card}>
        <h3>Gasto Total</h3>
        <p>{formatValor(gastoTotal)}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: '20px',
    borderRadius: '8px',
    flex: 1,
    boxShadow: '0 0 5px rgba(0,0,0,0.3)',
  }
};

export default DashboardCards;
