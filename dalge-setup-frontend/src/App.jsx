import { Routes, Route } from 'react-router-dom'; // ✅ sem BrowserRouter
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardLider from './pages/DashboardLider';
import Producao from './pages/Producao';
import RotaPrivada from './components/RotaPrivada';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/admin"
        element={
          <RotaPrivada nivelNecessario="admin">
            <DashboardAdmin />
          </RotaPrivada>
        }
      />
      <Route
        path="/dashboard-lider"
        element={
          <RotaPrivada nivelNecessario="lider">
            <DashboardLider />
          </RotaPrivada>
        }
      />
      <Route
        path="/producao"
        element={
          <RotaPrivada>
            <Producao />
          </RotaPrivada>
        }
      />
    </Routes>
  );
}
