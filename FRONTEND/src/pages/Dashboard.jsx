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
  const [editando, setEditando] = useState(null);
  const [editItem, setEditItem] = useState('');
  const [editValor, setEditValor] = useState('');
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

  const iniciarEdicao = (compra) => {
    setEditando(compra.id);
    setEditItem(compra.item);
    setEditValor(compra.valor);
  };

  const salvarEdicao = async (id) => {
    try {
      await fetch(`http://localhost:3001/compras/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: editItem,
          valor: parseFloat(editValor),
        }),
      });
      setEditando(null);
      fetchCompras();
    } catch (err) {
      console.error("Erro ao editar compra:", err);
    }
  };

  const excluirCompra = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta compra?')) {
      try {
        await fetch(`http://localhost:3001/compras/${id}`, {
          method: 'DELETE',
        });
        fetchCompras();
      } catch (err) {
        console.error("Erro ao excluir compra:", err);
      }
    }
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

      <DashboardCards />
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
                  {editando === compra.id ? (
                    <>
                      <input
                        type="text"
                        value={editItem}
                        onChange={(e) => setEditItem(e.target.value)}
                        style={styles.inputEdit}
                      />
                      <input
                        type="number"
                        value={editValor}
                        onChange={(e) => setEditValor(e.target.value)}
                        style={styles.inputEdit}
                      />
                      <button onClick={() => salvarEdicao(compra.id)} style={styles.saveBtn}>Salvar</button>
                      <button onClick={() => setEditando(null)} style={styles.cancelBtn}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <strong>{compra.item}</strong> - R$ {compra.valor.toFixed(2)}<br />
                      <span style={styles.date}>{new Date(compra.data).toLocaleDateString()}</span>
                      {compra.recorrente && <span style={styles.tag}>Recorrente</span>}
                      <br />
                      <button onClick={() => iniciarEdicao(compra)} style={styles.editBtn}>✏️</button>
                      <button onClick={() => excluirCompra(compra.id)} style={styles.deleteBtn}>🗑</button>
                    </>
                  )}
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
  },
  inputEdit: {
    marginBottom: '8px',
    marginRight: '10px',
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #333',
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
  editBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    marginRight: '5px',
    cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  saveBtn: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    marginRight: '5px',
    cursor: 'pointer',
  },
  cancelBtn: {
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default Dashboard;
