import { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Navbar from '../components/Navbar';

export default function DashboardAdmin() {
  const [producoes, setProducoes] = useState([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [filtro, setFiltro] = useState([]);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    fetchProducoes();
  }, []);

  const fetchProducoes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/producoes/admin/all');
      setProducoes(res.data);
      setFiltro(res.data);
    } catch (error) {
      setMensagem('Erro ao carregar produções.');
    }
  };

  const aplicarFiltro = () => {
    if (!dataInicio || !dataFim) {
      setFiltro(producoes);
      return;
    }

    const ini = new Date(dataInicio);
    const fim = new Date(dataFim);

    const filtrado = producoes.filter(p => {
      const data = new Date(p.dataFim);
      return data >= ini && data <= fim;
    });

    setFiltro(filtrado);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Produções Finalizadas', 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Produto', 'Funcionário', 'Líder', 'Início', 'Fim', 'Observações']],
      body: filtro.map(p => [
        p.produto?.nome || '',
        p.funcionario?.nome || '',
        p.liderFim?.nome || '',
        new Date(p.dataInicio).toLocaleString(),
        new Date(p.dataFim).toLocaleString(),
        p.observacoesFinais || '',
      ]),
    });
    doc.save('producoes_finalizadas.pdf');
  };

  const exportarExcel = () => {
    const data = filtro.map(p => ({
      Produto: p.produto?.nome || '',
      Funcionário: p.funcionario?.nome || '',
      Líder: p.liderFim?.nome || '',
      Início: new Date(p.dataInicio).toLocaleString(),
      Fim: new Date(p.dataFim).toLocaleString(),
      Observações: p.observacoesFinais || '',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Produções');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'producoes_finalizadas.xlsx');
  };

  return (
    <>
      <Navbar />
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Painel do Administrador</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="date"
            value={dataInicio}
            onChange={e => setDataInicio(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={dataFim}
            onChange={e => setDataFim(e.target.value)}
            className="border p-2 rounded"
          />
          <button onClick={aplicarFiltro} className="bg-blue-500 text-white px-4 py-2 rounded">
            Aplicar Filtro
          </button>
          <button onClick={exportarPDF} className="bg-red-500 text-white px-4 py-2 rounded">
            Exportar PDF
          </button>
          <button onClick={exportarExcel} className="bg-green-600 text-white px-4 py-2 rounded">
            Exportar Excel
          </button>
        </div>

        {mensagem && <p className="text-red-500">{mensagem}</p>}

        <div className="overflow-x-auto">
          <table className="w-full table-auto border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Produto</th>
                <th className="border px-2 py-1">Funcionário</th>
                <th className="border px-2 py-1">Líder</th>
                <th className="border px-2 py-1">Início</th>
                <th className="border px-2 py-1">Fim</th>
                <th className="border px-2 py-1">Foto</th>
                <th className="border px-2 py-1">Observações</th>
              </tr>
            </thead>
            <tbody>
              {filtro.map((p) => (
                <tr key={p.id}>
                  <td className="border px-2 py-1">{p.produto?.nome}</td>
                  <td className="border px-2 py-1">{p.funcionario?.nome}</td>
                  <td className="border px-2 py-1">{p.liderFim?.nome}</td>
                  <td className="border px-2 py-1">{new Date(p.dataInicio).toLocaleString()}</td>
                  <td className="border px-2 py-1">{new Date(p.dataFim).toLocaleString()}</td>
                  <td className="border px-2 py-1">
                    {p.fotoRotuloFinal ? (
                      <img
                        src={`http://localhost:3000/uploads/finais/${p.fotoRotuloFinal}`}
                        alt="Rótulo final"
                        className="w-16 h-16 object-cover"
                      />
                    ) : (
                      'Sem foto'
                    )}
                  </td>
                  <td className="border px-2 py-1">{p.observacoesFinais}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
