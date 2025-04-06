import { Router } from 'express';
import {
  getTiposPago,
  getTipoPagoById,
  createTipoPago,
  updateTipoPago,
  deleteTipoPago
} from '../controllers/tipos-pago.controller';

const router = Router();

router.get('/', getTiposPago);
router.get('/:id', getTipoPagoById);
router.post('/', createTipoPago);
router.put('/:id', updateTipoPago);
router.delete('/:id', deleteTipoPago);

export const tiposPagoRouter = router; 