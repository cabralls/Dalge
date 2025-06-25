import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Rotas
import estoqueRoutes from './routes/estoque.js';
import composicaoRoutes from './routes/composicao.js';
import authRoutes from './routes/auth.js';
import funcionarioRoutes from './routes/funcionario.js';
import produtoRoutes from './routes/produto.js';
import producaoRoutes from './routes/producao.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());

// ✅ Isso aqui é essencial para interpretar JSON vindo do frontend
app.use(express.json());

// 🧱 Permitir acesso público às imagens dos rótulos finais
app.use('/uploads/finais', express.static('uploads/finais'));

// ✅ Rota de teste
app.get('/', (req, res) => {
  res.send('API Dalge Setup está rodando com sucesso!');
});

// ✅ Rotas organizadas
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/producoes', producaoRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/composicao', composicaoRoutes);
app.use('/api', authRoutes); // contém /api/login

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
