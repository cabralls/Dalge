import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 📌 Listar todos os insumos
router.get('/insumos', async (req, res) => {
  const insumos = await prisma.insumo.findMany();
  res.json(insumos);
});

// 📌 Criar um novo insumo
router.post('/insumos', async (req, res) => {
  const { nome, tipo, unidade } = req.body;
  try {
    const insumo = await prisma.insumo.create({
      data: { nome, tipo, unidade },
    });
    await prisma.estoqueInsumo.create({
      data: {
        insumoId: insumo.id,
        quantidade: 0,
      },
    });
    res.status(201).json(insumo);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar insumo.' });
  }
});

// 📌 Atualizar insumo
router.put('/insumos/:id', async (req, res) => {
  const { nome, tipo, unidade } = req.body;
  const { id } = req.params;
  try {
    const insumo = await prisma.insumo.update({
      where: { id: parseInt(id) },
      data: { nome, tipo, unidade },
    });
    res.json(insumo);
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar insumo.' });
  }
});

// 📌 Remover insumo
router.delete('/insumos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.estoqueInsumo.delete({ where: { insumoId: parseInt(id) } });
    await prisma.insumo.delete({ where: { id: parseInt(id) } });
    res.sendStatus(204);
  } catch {
    res.status(500).json({ error: 'Erro ao remover insumo.' });
  }
});

// 📌 Entrada no estoque
router.post('/entrada', async (req, res) => {
  const { insumoId, quantidade, observacao } = req.body;
  try {
    await prisma.movimentacaoEstoque.create({
      data: {
        insumoId,
        tipo: 'entrada',
        quantidade,
        observacao,
      },
    });
    await prisma.estoqueInsumo.update({
      where: { insumoId },
      data: {
        quantidade: { increment: quantidade },
        atualizadoEm: new Date(),
      },
    });
    res.json({ mensagem: 'Entrada registrada com sucesso!' });
  } catch {
    res.status(500).json({ error: 'Erro ao registrar entrada.' });
  }
});

// 📌 Saída do estoque
router.post('/saida', async (req, res) => {
  const { insumoId, quantidade, observacao, producaoId } = req.body;
  try {
    await prisma.movimentacaoEstoque.create({
      data: {
        insumoId,
        tipo: 'saida',
        quantidade,
        observacao,
        producaoId: producaoId || null,
      },
    });
    await prisma.estoqueInsumo.update({
      where: { insumoId },
      data: {
        quantidade: { decrement: quantidade },
        atualizadoEm: new Date(),
      },
    });
    res.json({ mensagem: 'Saída registrada com sucesso!' });
  } catch {
    res.status(500).json({ error: 'Erro ao registrar saída.' });
  }
});

// 📌 Estoque atual
router.get('/', async (req, res) => {
  const estoque = await prisma.estoqueInsumo.findMany({
    include: { insumo: true },
    orderBy: { atualizadoEm: 'desc' },
  });
  res.json(estoque);
});

// 📌 Histórico de movimentações
router.get('/movimentacoes', async (req, res) => {
  const movimentacoes = await prisma.movimentacaoEstoque.findMany({
    include: { insumo: true, producao: true },
    orderBy: { data: 'desc' },
  });
  res.json(movimentacoes);
});

export default router;
