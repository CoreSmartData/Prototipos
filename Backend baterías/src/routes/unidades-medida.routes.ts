import { Router } from 'express';
import {
  getUnidadesMedida,
  getUnidadMedidaById,
  createUnidadMedida,
  updateUnidadMedida,
  deleteUnidadMedida
} from '../controllers/unidades-medida.controller';

const router = Router();

router.get('/', getUnidadesMedida);
router.get('/:id', getUnidadMedidaById);
router.post('/', createUnidadMedida);
router.put('/:id', updateUnidadMedida);
router.delete('/:id', deleteUnidadMedida);

export const unidadesMedidaRouter = router; 