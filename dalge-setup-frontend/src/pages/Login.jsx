import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅
import api from '../services/api';
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate(); // ✅

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/api/login', { email, senha });

      setSucesso(`Bem-vindo, ${res.data.usuario.nome}!`);
      setErro('');

      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));

      const nivel = res.data.usuario.nivel_acesso;

      // ✅ Redirecionar sem recarregar a aplicação
        if (nivel === 'admin') {
          navigate('/admin'); // 👈 Rota correta
        } else if (nivel === 'lider') {
          navigate('/dashboard-lider');
        } else {
          navigate('/producao');
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
