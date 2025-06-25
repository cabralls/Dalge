import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Criar composição
router.post('/', async (req, res) => {
  const { produtoId, insumoId, quantidade } = req.body;
  try {
    const nova = await prisma.composicaoProduto.create({
      data: { produtoId, insumoId, quantidade },
    });
    res.json(nova);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar composição' });
  }
});

// Listar composição por produto
router.get('/:produtoId', async (req, res) => {
  const { produtoId } = req.params;
  try {
    const composicao = await prisma.composicaoProduto.findMany({
      where: { produtoId: Number(produtoId) },
      include: { insumo: true },
    });
    res.json(composicao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar composição' });
  }
});

// Remover item da composição
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.composicaoProduto.delete({ where: { id: Number(id) } });
    res.json({ mensagem: 'Composição removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir composição' });
  }
});

export default router;
