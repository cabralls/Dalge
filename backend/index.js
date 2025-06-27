import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import funcionarioRoutes from './routes/funcionario.js';
import produtoRoutes from './routes/produto.js';
import producaoRoutes from './routes/producao.js';
import estoqueRoutes from './routes/estoque.js';
import composicaoRoutes from './routes/composicao.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('API Dalge Setup está rodando com sucesso!');
});

app.use('/api', authRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/producoes', producaoRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/composicao', composicaoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
process.on('SIGINT', async () => {
  console.log('Fechando o servidor...');
  await prisma.$disconnect();
  process.exit(0);
});