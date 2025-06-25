import { useState } from 'react';
import api from '../services/api';
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/api/login', { email, senha });

      setSucesso(`Bem-vindo, ${res.data.usuario.nome}!`);
      setErro('');

      // Aqui você pode guardar o nível de acesso para redirecionamento futuro
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));

      // Redirecionar com base no nível de acesso (exemplo)
      const nivel = res.data.usuario.nivel_acesso;
      if (nivel === 'admin') {
        window.location.href = '/admin';
      } else if (nivel === 'lider') {
        window.location.href = '/dashboard-lider';
      } else {
        window.location.href = '/producao';
      }

    } catch (err) {
      setErro('Email ou senha inválidos');
      setSucesso('');
    }
  };

  return (
    <div className="login-container">
      <h2>Login - Dalge Setup</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {erro && <p className="erro">{erro}</p>}
      {sucesso && <p className="sucesso">{sucesso}</p>}
    </div>
  );
}
