import { Navigate } from 'react-router-dom';

export default function RotaPrivada({ children, nivelNecessario }) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario) {
    // Usuário não está logado
    return <Navigate to="/" />;
  }

  if (nivelNecessario && usuario.nivel_acesso !== nivelNecessario) {
    // Usuário logado, mas sem o nível necessário
    return <Navigate to="/" />;
  }

  return children;
}
