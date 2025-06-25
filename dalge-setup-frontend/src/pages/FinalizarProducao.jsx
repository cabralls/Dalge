import { useEffect, useState } from 'react';
import axios from 'axios';

function FinalizarProducao() {
  const [producoes, setProducoes] = useState([]);
  const [liderId, setLiderId] = useState('');
  const [producaoId, setProducaoId] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [insumos, setInsumos] = useState([]);
  const [perdas, setPerdas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/producoes/ativas').then((res) =>
      setProducoes(res.data)
    );
    axios.get('http://localhost:3000/api/estoque').then((res) =>
      setInsumos(res.data)
    );
  }, []);

  const adicionarPerda = () => {
    setPerdas([
      ...perdas,
      { insumoId: '', tipo: 'perda', quantidade: 0, observacao: '' },
    ]);
  };

  const atualizarPerda = (index, campo, valor) => {
    const atualizadas = [...perdas];
    atualizadas[index][campo] = valor;
    setPerdas(atualizadas);
  };

  const removerPerda = (index) => {
    const atualizadas = [...perdas];
    atualizadas.splice(index, 1);
    setPerdas(atualizadas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/producoes/finalizar', {
        liderId,
        producaoId,
        perdasInsumos: perdas.map((p) => ({
          insumoId: parseInt(p.insumoId),
          tipo: p.tipo,
          quantidade: parseFloat(p.quantidade),
          observacao: p.observacao,
        })),
      });
      setMensagem('Produção finalizada com sucesso!');
      setLiderId('');
      setProducaoId('');
      setPerdas([]);
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao finalizar produção.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Finalizar Produção</h2>
      {mensagem && <p className="text-green-600 mb-2">{mensagem}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={producaoId}
          onChange={(e) => setProducaoId(e.target.value)}
          required
          className="border p-2 rounded w-full"
        >
          <option value="">Selecione uma produção</option>
          {producoes.map((p) => (
            <option key={p.id} value={p.id}>
              ID {p.id} - {p.produto?.nome}
            </option>
          ))}
        </select>

        <input
          type="password"
          placeholder="Senha do líder"
          value={liderId}
          onChange={(e) => setLiderId(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />

        <div className="border p-3 bg-gray-50 rounded">
          <p className="font-semibold mb-2">Perdas ou sobras de insumos</p>
          {perdas.map((perda, index) => (
            <div key={index} className="mb-2 flex flex-wrap gap-2 items-center">
              <select
                value={perda.insumoId}
                onChange={(e) =>
                  atualizarPerda(index, 'insumoId', e.target.value)
                }
                className="border p-2 rounded"
              >
                <option value="">Insumo</option>
                {insumos.map((i) => (
                  <option key={i.insumo.id} value={i.insumo.id}>
                    {i.insumo.nome}
                  </option>
                ))}
              </select>

              <select
                value={perda.tipo}
                onChange={(e) => atualizarPerda(index, 'tipo', e.target.value)}
                className="border p-2 rounded"
              >
                <option value="perda">Perda</option>
                <option value="sobra">Sobra</option>
              </select>

              <input
                type="number"
                placeholder="Qtd"
                min="0"
                value={perda.quantidade}
                onChange={(e) =>
                  atualizarPerda(index, 'quantidade', e.target.value)
                }
                className="border p-2 rounded w-24"
              />

              <input
                type="text"
                placeholder="Observação"
                value={perda.observacao}
                onChange={(e) =>
                  atualizarPerda(index, 'observacao', e.target.value)
                }
                className="border p-2 rounded flex-1"
              />

              <button
                type="button"
                onClick={() => removerPerda(index)}
                className="text-red-600"
              >
                Remover
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={adicionarPerda}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
          >
            Adicionar Perda/Sobra
          </button>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Finalizar Produção
        </button>
      </form>
    </div>
  );
}

export default FinalizarProducao;
