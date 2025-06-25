import { useEffect, useState } from 'react';
import axios from 'axios';

function IniciarProducao() {
  const [form, setForm] = useState({
    produtoId: '',
    funcionarioId: '',
    insumosUtilizados: [],
  });

  const [produtos, setProdutos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/produtos').then((res) => setProdutos(res.data));
    axios.get('http://localhost:3000/api/funcionarios').then((res) => setFuncionarios(res.data));
    axios.get('http://localhost:3000/api/estoque').then((res) => setInsumos(res.data));
  }, []);

  const handleInsumoChange = (id, quantidade) => {
    const atualizados = form.insumosUtilizados.filter((item) => item.insumoId !== id);
    if (quantidade > 0) {
      atualizados.push({ insumoId: id, quantidade: parseFloat(quantidade) });
    }
    setForm({ ...form, insumosUtilizados: atualizados });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Cria a produção
      const res = await axios.post('http://localhost:3000/api/producoes/iniciar', {
        produtoId: form.produtoId,
        funcionarioId: form.funcionarioId,
      });

      const producaoId = res.data.id;

      // 2. Envia as saídas de insumos relacionadas à produção
      for (const insumo of form.insumosUtilizados) {
        await axios.post('http://localhost:3000/api/estoque/saida', {
          insumoId: insumo.insumoId,
          quantidade: insumo.quantidade,
          producaoId,
          observacao: 'Uso na produção ID ' + producaoId,
        });
      }

      setMensagem('Produção iniciada e insumos baixados com sucesso!');
      setForm({ produtoId: '', funcionarioId: '', insumosUtilizados: [] });
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao iniciar produção.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Iniciar Produção</h2>
      {mensagem && <p className="text-green-600 mb-4">{mensagem}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={form.produtoId}
          onChange={(e) => setForm({ ...form, produtoId: e.target.value })}
          required
          className="border p-2 rounded w-full"
        >
          <option value="">Selecione um produto</option>
          {produtos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        <select
          value={form.funcionarioId}
          onChange={(e) => setForm({ ...form, funcionarioId: e.target.value })}
          required
          className="border p-2 rounded w-full"
        >
          <option value="">Selecione o funcionário responsável</option>
          {funcionarios.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nome}
            </option>
          ))}
        </select>

        <div className="border p-3 rounded bg-gray-50">
          <p className="font-semibold mb-2">Selecionar insumos utilizados:</p>
          {insumos.map((item) => (
            <div key={item.insumo.id} className="mb-2 flex items-center gap-2">
              <label className="w-1/3">{item.insumo.nome} ({item.quantidade} {item.insumo.unidade})</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Qtd a usar"
                className="border p-1 rounded w-1/3"
                onChange={(e) => handleInsumoChange(item.insumo.id, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Iniciar Produção
        </button>
      </form>
    </div>
  );
}

export default IniciarProducao;
