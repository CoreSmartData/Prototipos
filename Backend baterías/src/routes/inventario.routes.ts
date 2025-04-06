import { Router } from 'express';
import {
  getInventario,
  getInventarioById,
  getInventarioBySucursal,
  getInventarioByProducto,
  createInventario,
  updateStock,
  ajustarStock
} from '../controllers/inventario.controller';

const router = Router();

router.get('/', getInventario);
router.get('/sucursal/:sucursalId', getInventarioBySucursal);
router.get('/producto/:productoId', getInventarioByProducto);
router.get('/:id', getInventarioById);
router.post('/', createInventario);
router.put('/:productoId/sucursal/:sucursalId/stock', updateStock);
router.put('/:productoId/sucursal/:sucursalId/ajuste', ajustarStock);

export const inventarioRouter = router; 