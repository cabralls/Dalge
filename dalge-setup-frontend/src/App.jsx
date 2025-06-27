import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardLider from './pages/DashboardLider';
import Producao from './pages/Producao';
import RotaPrivada from './components/RotaPrivada';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Login />} />

        {/* Rota privada para ADMIN */}
       <Route
        path="/admin"
        element={
        <RotaPrivada nivelNecessario="admin">
          <DashboardAdmin />
        </RotaPrivada>
      }
    />

        

        {/* Rota privada para LÍDER */}
        <Route
          path="/dashboard-lider"
          element={
            <RotaPrivada nivelNecessario="lider">
              <DashboardLider />
            </RotaPrivada>
          }
        />

        {/* Rota privada para FUNCIONÁRIO ou qualquer logado */}
        <Route
          path="/producao"
          element={
            <RotaPrivada>
              <Producao />
            </RotaPrivada>
          }
        />
      </Routes>
    </Router>
  );
}
