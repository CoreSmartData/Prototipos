import { Router } from 'express';
import {
  getVentas,
  getVentaById,
  createVenta,
  getVentasByCliente,
  getVentasBySucursal,
  getVentasByFecha
} from '../controllers/ventas.controller';

const router = Router();

router.get('/', getVentas);
router.get('/cliente/:clienteId', getVentasByCliente);
router.get('/sucursal/:sucursalId', getVentasBySucursal);
router.get('/fecha', getVentasByFecha);
router.get('/:id', getVentaById);
router.post('/', createVenta);

export default router; 