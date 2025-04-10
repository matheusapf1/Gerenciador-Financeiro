import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CategoryPage from './pages/CategoryPage.jsx';
import GastoPorCategoria from './pages/GastoPorCategoria';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categorias" element={<CategoryPage />} />
        <Route path="/gastos-por-categoria" element={<GastoPorCategoria />} />
        
        {/* Redireciona qualquer rota inválida para login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
