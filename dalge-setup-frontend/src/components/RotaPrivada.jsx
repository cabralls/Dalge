import { Navigate } from 'react-router-dom';

export default function RotaPrivada({ children, nivelNecessario }) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  if (nivelNecessario && usuario.nivel_acesso !== nivelNecessario) {
    return <Navigate to="/" replace />;
  }

  return children;
}
