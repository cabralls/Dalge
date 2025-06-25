import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Criar funcionário
router.post('/', async (req, res) => {
    const { nome, cargo } = req.body;
    try {
        const funcionario = await prisma.funcionario.create({ data: { nome, cargo } });
        res.json(funcionario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar funcionários
router.get('/', async (req, res) => {
    const funcionarios = await prisma.funcionario.findMany();
    res.json(funcionarios);
});

export default router;