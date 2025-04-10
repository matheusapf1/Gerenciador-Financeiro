import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PurchaseForm from '../components/PurchaseForm.jsx';
import DashboardCards from '../components/DashboardCards';
import TopDespesas from '../components/TopDespesas';

function Dashboard() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  const fetchCompras = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/compras?mes=${mes}&ano=${ano}`);
      if (!response.ok) throw new Error(`Erro: ${response.status}`);
      const data = await response.json();
      setCompras(data);
    } catch (error) {
      console.error("Erro ao carregar compras:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCompras();
  }, [navigate, mes, ano]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Dashboard</h2>
        <div>
          <button onClick={handleLogout} style={styles.button}>Sair</button>
          <Link to="/categorias"><button style={styles.button}>📁 Categorias</button></Link>
          <Link to="/gastos-por-categoria"><button style={styles.button}>📊 Gastos</button></Link>
        </div>
      </div>

      {/* 🔥 Adicionado os cards de saldo e gasto total */}
      <DashboardCards />

      {/* 🔥 Adicionado o Top 5 despesas */}
      <TopDespesas />

      <div style={styles.filtros}>
        <label>Mês:
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))} style={styles.select}>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: '10px' }}>Ano:
          <select value={ano} onChange={(e) => setAno(Number(e.target.value))} style={styles.select}>
            {[2023, 2024, 2025, 2026].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>
      </div>

      <PurchaseForm onCreated={fetchCompras} />

      <h3 style={styles.subtitle}>Minhas Compras:</h3>
      {loading ? <div>Carregando...</div> :
        error ? <div>Erro: {error}</div> :
          compras.length === 0 ? <p>Nenhuma compra para o período.</p> : (
            <ul style={styles.list}>
              {compras.map((compra) => (
                <li key={compra.id} style={styles.listItem}>
                  <strong>{compra.item}</strong> - R$ {compra.valor.toFixed(2)}<br />
                  <span style={styles.date}>{new Date(compra.data).toLocaleDateString()}</span>
                  {compra.recorrente && <span style={styles.tag}>Recorrente</span>}
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
    backgroundColor: '#121212',
    color: '#fff',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    margin: 0,
  },
  button: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '8px 14px',
    marginLeft: '10px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: '0.2s',
  },
  filtros: {
    marginBottom: '20px',
  },
  select: {
    marginLeft: '8px',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    border: '1px solid #333',
    padding: '6px',
    borderRadius: '4px'
  },
  subtitle: {
    marginTop: '40px'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    backgroundColor: '#2a2a2a',
    padding: '12px',
    marginBottom: '10px',
    borderRadius: '5px'
  },
  date: {
    fontSize: '12px',
    color: '#bbb'
  },
  tag: {
    marginLeft: '10px',
    fontSize: '11px',
    backgroundColor: '#555',
    padding: '2px 6px',
    borderRadius: '3px',
    color: '#ccc'
  }
};

export default Dashboard;
