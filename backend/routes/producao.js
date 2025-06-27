import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Configuração do upload para foto final do rótulo
const storage = multer.diskStorage({
  destination: './uploads/finais/',
  filename: (req, file, cb) => {
    const nomeArquivo = `rotulo_final_${Date.now()}_${file.originalname}`;
    cb(null, nomeArquivo);
  },
});
const upload = multer({ storage });

/**
 * Criar nova produção
 */
router.post('/', async (req, res) => {
  const { produtoId, funcionarioId } = req.body;

  try {
    const novaProducao = await prisma.producao.create({
      data: {
        produtoId: parseInt(produtoId),
        funcionarioId: parseInt(funcionarioId),
        dataInicio: new Date(),
        status: 'em_andamento',
      },
    });
    res.status(201).json(novaProducao);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar produção.' });
  }
});

/**
 * Registrar etapa
 */
router.post('/:id/etapas', async (req, res) => {
  const { tipo, descricao } = req.body;
  const { id } = req.params;

  try {
    const etapa = await prisma.etapa.create({
      data: {
        producaoId: parseInt(id),
        tipo,
        descricao,
        dataHora: new Date(),
      },
    });
    res.status(201).json(etapa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar etapa.' });
  }
});

/**
 * Buscar etapas com filtros (data e tipo)
 */
router.get('/:id/etapas', async (req, res) => {
  const { id } = req.params;
  const { tipo, inicio, fim } = req.query;

  try {
    const where = {
      producaoId: parseInt(id),
    };

    if (tipo) where.tipo = tipo;
    if (inicio && fim) {
      where.dataHora = {
        gte: new Date(inicio),
        lte: new Date(fim),
      };
    }

    const etapas = await prisma.etapa.findMany({
      where,
      orderBy: { dataHora: 'asc' },
    });

    res.json(etapas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar etapas.' });
  }
});

/**
 * Buscar produções por líder (após login)
 */
router.get('/', async (req, res) => {
  const { liderId } = req.query;

  try {
    const producoes = await prisma.producao.findMany({
      where: {
        liderFimId: parseInt(liderId),
        status: 'finalizada',
      },
      orderBy: { dataFim: 'desc' },
    });

    res.json(producoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produções.' });
  }
});

/**
 * Finalizar produção com validação do líder e foto
 */

router.post('/finalizar', async (req, res) => {
  const { liderId, producaoId, perdasInsumos } = req.body;

  try {
    const producao = await prisma.producao.findUnique({
      where: { id: Number(producaoId) },
    });

    if (!producao) {
      return res.status(404).json({ error: 'Produção não encontrada' });
    }

    // Atualiza a produção como finalizada
    const producaoFinalizada = await prisma.producao.update({
      where: { id: Number(producaoId) },
      data: {
        horarioFinal: new Date(),
        finalizadaPorId: Number(liderId),
      },
    });

    // Registra perdas e sobras (se houver)
    if (perdasInsumos && perdasInsumos.length > 0) {
      for (const perda of perdasInsumos) {
        await prisma.perdaInsumo.create({
          data: {
            producaoId: producaoFinalizada.id,
            insumoId: perda.insumoId,
            tipo: perda.tipo,
            quantidade: perda.quantidade,
            observacao: perda.observacao || '',
          },
        });
      }
    }

    return res.json(producaoFinalizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao finalizar produção' });
  }
});

router.post('/:id/finalizar', upload.single('fotoRotuloFinal'), async (req, res) => {
  const { liderUsuario, liderSenha, observacoesFinais } = req.body;
  const { id } = req.params;

  try {
    const lider = await prisma.usuario.findFirst({
      where: {
        usuario: liderUsuario,
        senha: liderSenha,
        nivelAcesso: 'lider',
      },
    });

    if (!lider) {
      return res.status(401).json({ erro: 'Autenticação do líder falhou.' });
    }

    const producaoFinal = await prisma.producao.update({
      where: { id: parseInt(id) },
      data: {
        dataFim: new Date(),
        liderFimId: lider.id,
        status: 'finalizada',
        observacoesFinais,
        fotoRotuloFinal: req.file ? req.file.filename : null,
      },
    });

    res.json({ mensagem: 'Produção finalizada com sucesso!', producao: producaoFinal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao finalizar produção.' });
  }
});

/**
 * Rota administrativa para visualizar todas as produções finalizadas
 */
router.get('/admin/all', async (req, res) => {
  try {
    const producoes = await prisma.producao.findMany({
      where: { status: 'finalizada' },
      orderBy: { fim: 'desc' }, // Corrigido: campo correto de ordenação
      include: {
        produto: true,
        funcionario: true,
        liderFinalizou: true, // Corrigido: nome correto da relação no schema
      },
    });

    res.json(producoes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar produções para admin' });
  }
});

export default router;
