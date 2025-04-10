import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PurchaseForm from '../components/PurchaseForm.jsx';

function Dashboard() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mes, setMes] = useState(new Date().getMonth() + 1); // 1-12
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
  }, [navigate, mes, ano]); // atualiza sempre que mês/ano mudarem

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Dashboard</h2>

      <button onClick={handleLogout} style={styles.logout}>Sair</button>

      <Link to="/categorias">
        <button style={styles.logout}>Gerenciar Categorias</button>
      </Link>

      <Link to="/gastos-por-categoria" style={styles.linkBtn}>
        📊 Ver Gastos por Categoria
      </Link>

      {/* Filtros */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Mês:
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))} style={styles.select}>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {String(i + 1).padStart(2, '0')}
              </option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: '10px' }}>
          Ano:
          <select value={ano} onChange={(e) => setAno(Number(e.target.value))} style={styles.select}>
            {[2023, 2024, 2025, 2026].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>
      </div>

      <PurchaseForm onCreated={fetchCompras} />

      <h3 style={{ marginTop: "30px" }}>Minhas Compras:</h3>

      {loading ? (
        <div>Carregando compras...</div>
      ) : error ? (
        <div>Erro: {error}</div>
      ) : compras.length === 0 ? (
        <p>Nenhuma compra registrada para o período selecionado.</p>
      ) : (
        <ul style={styles.list}>
          {compras.map((compra) => (
            <li key={compra.id} style={styles.listItem}>
              <strong>{compra.item}</strong> - R$ {compra.valor.toFixed(2)} <br />
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
    backgroundColor: '#1e1e1e',
    color: '#fff',
    minHeight: '100vh',
  },
  title: {
    marginBottom: '10px',
  },
  logout: {
    padding: '8px 12px',
    marginBottom: '10px',
    backgroundColor: '#444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'block',
  },
  linkBtn: {
    display: 'inline-block',
    marginBottom: '20px',
    padding: '8px 12px',
    backgroundColor: '#555',
    color: '#fff',
    borderRadius: '4px',
    textDecoration: 'none',
    marginLeft: '10px',
  },
  select: {
    marginLeft: '5px',
    padding: '4px 6px',
    borderRadius: '4px',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    border: '1px solid #555',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    backgroundColor: '#2a2a2a',
    padding: '12px',
    marginBottom: '10px',
    borderRadius: '5px',
  },
  date: {
    fontSize: '12px',
    color: '#bbb',
  },
  tag: {
    marginLeft: '10px',
    fontSize: '11px',
    backgroundColor: '#444',
    padding: '2px 6px',
    borderRadius: '3px',
    color: '#ccc',
  },
};

export default Dashboard;
