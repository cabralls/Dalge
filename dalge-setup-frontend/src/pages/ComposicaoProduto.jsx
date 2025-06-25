import { useEffect, useState } from 'react';
import axios from 'axios';

function ComposicaoProduto() {
  const [produtos, setProdutos] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [composicao, setComposicao] = useState([]);
  const [novoInsumo, setNovoInsumo] = useState({ insumoId: '', quantidade: '' });
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/produtos').then((res) => setProdutos(res.data));
    axios.get('http://localhost:3000/api/estoque').then((res) => setInsumos(res.data));
  }, []);

  useEffect(() => {
    if (produtoSelecionado) {
      axios.get(`http://localhost:3000/api/composicao/${produtoSelecionado}`)
        .then((res) => setComposicao(res.data))
        .catch(() => setComposicao([]));
    }
  }, [produtoSelecionado]);

  const adicionarInsumo = async () => {
    if (!novoInsumo.insumoId || !novoInsumo.quantidade || !produtoSelecionado) return;

    try {
      await axios.post('http://localhost:3000/api/composicao', {
        produtoId: parseInt(produtoSelecionado),
        insumoId: parseInt(novoInsumo.insumoId),
        quantidade: parseFloat(novoInsumo.quantidade),
      });
      setMensagem('Insumo adicionado com sucesso!');
      setNovoInsumo({ insumoId: '', quantidade: '' });
      const atualizada = await axios.get(`http://localhost:3000/api/composicao/${produtoSelecionado}`);
      setComposicao(atualizada.data);
    } catch (err) {
      setMensagem('Erro ao adicionar insumo');
    }
  };

  const removerInsumo = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/composicao/${id}`);
      const atualizada = await axios.get(`http://localhost:3000/api/composicao/${produtoSelecionado}`);
      setComposicao(atualizada.data);
    } catch (err) {
      setMensagem('Erro ao remover insumo');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Composição de Produtos</h2>

      {mensagem && <p className="text-green-600 mb-4">{mensagem}</p>}

      <select
        value={produtoSelecionado}
        onChange={(e) => setProdutoSelecionado(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="">Selecione um produto</option>
        {produtos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nome}
          </option>
        ))}
      </select>

      {produtoSelecionado && (
        <>
          <div className="bg-gray-50 p-4 rounded mb-4">
            <p className="font-semibold mb-2">Adicionar Insumo</p>
            <div className="flex flex-wrap gap-2">
              <select
                value={novoInsumo.insumoId}
                onChange={(e) => setNovoInsumo({ ...novoInsumo, insumoId: e.target.value })}
                className="border p-2 rounded"
              >
                <option value="">Insumo</option>
                {insumos.map((i) => (
                  <option key={i.insumo.id} value={i.insumo.id}>
                    {i.insumo.nome}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Quantidade"
                value={novoInsumo.quantidade}
                onChange={(e) => setNovoInsumo({ ...novoInsumo, quantidade: e.target.value })}
                className="border p-2 rounded w-32"
              />

              <button
                type="button"
                onClick={adicionarInsumo}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Adicionar
              </button>
            </div>
          </div>

          <div className="border p-4 rounded bg-white">
            <p className="font-semibold mb-2">Insumos da Composição:</p>
            {composicao.length === 0 ? (
              <p className="text-gray-500">Nenhum insumo cadastrado.</p>
            ) : (
              <ul className="space-y-2">
                {composicao.map((c) => (
                  <li key={c.id} className="flex justify-between items-center border-b pb-1">
                    <span>
                      {c.insumo.nome} - {c.quantidade} {c.insumo.unidade}
                    </span>
                    <button
                      onClick={() => removerInsumo(c.id)}
                      className="text-red-600 hover:underline"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ComposicaoProduto;
