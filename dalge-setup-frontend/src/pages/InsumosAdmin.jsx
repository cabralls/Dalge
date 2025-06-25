import { useEffect, useState } from 'react';
import axios from 'axios';

function InsumosAdmin() {
  const [insumos, setInsumos] = useState([]);
  const [form, setForm] = useState({ nome: '', tipo: '', unidade: '' });
  const [editando, setEditando] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const carregarInsumos = async () => {
    const res = await axios.get('http://localhost:3000/api/estoque');
    setInsumos(res.data);
  };

  useEffect(() => {
    carregarInsumos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(`http://localhost:3000/api/estoque/insumos/${editando}`, form);
        setMensagem('Insumo atualizado com sucesso!');
      } else {
        await axios.post('http://localhost:3000/api/estoque/insumos', form);
        setMensagem('Insumo criado com sucesso!');
      }
      setForm({ nome: '', tipo: '', unidade: '' });
      setEditando(null);
      carregarInsumos();
    } catch {
      setMensagem('Erro ao salvar insumo.');
    }
  };

  const editarInsumo = (insumo) => {
    setForm({
      nome: insumo.insumo.nome,
      tipo: insumo.insumo.tipo,
      unidade: insumo.insumo.unidade,
    });
    setEditando(insumo.insumo.id);
  };

  const excluirInsumo = async (id) => {
    if (!window.confirm('Deseja realmente excluir este insumo?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/estoque/insumos/${id}`);
      setMensagem('Insumo removido com sucesso!');
      carregarInsumos();
    } catch {
      setMensagem('Erro ao excluir insumo.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Cadastro de Insumos</h2>

      {mensagem && <p className="text-green-600 mb-2">{mensagem}</p>}

      <form onSubmit={handleSubmit} className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Tipo (ex: frasco, solvente)"
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Unidade (ex: ml, kg)"
          value={form.unidade}
          onChange={(e) => setForm({ ...form, unidade: e.target.value })}
          required
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editando ? 'Atualizar' : 'Cadastrar'}
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2">Estoque Atual</h3>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Nome</th>
              <th className="border px-2 py-1">Tipo</th>
              <th className="border px-2 py-1">Unidade</th>
              <th className="border px-2 py-1">Quantidade</th>
              <th className="border px-2 py-1">Ações</th>
            </tr>
          </thead>
          <tbody>
            {insumos.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.insumo.nome}</td>
                <td className="border px-2 py-1">{item.insumo.tipo}</td>
                <td className="border px-2 py-1">{item.insumo.unidade}</td>
                <td className="border px-2 py-1">{item.quantidade}</td>
                <td className="border px-2 py-1">
                  <button
                    onClick={() => editarInsumo(item)}
                    className="text-blue-500 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => excluirInsumo(item.insumo.id)}
                    className="text-red-500"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InsumosAdmin;
