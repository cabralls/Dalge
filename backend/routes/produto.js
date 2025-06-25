import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Criar produto
router.post('/', async (req, res) => {
  const { nome, referencia, categoria, lote, validade } = req.body;
  try {
    const produto = await prisma.produto.create({
      data: { nome, referencia, categoria, lote, validade: new Date(validade) }
    });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar produtos
router.get('/', async (req, res) => {
  const produtos = await prisma.produto.findMany();
  res.json(produtos);
});

export default router;
