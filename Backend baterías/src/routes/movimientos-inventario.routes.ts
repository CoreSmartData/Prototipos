import { Router } from 'express';
import {
  getMovimientosInventario,
  getMovimientoInventarioById,
  createMovimientoInventario,
  getMovimientosBySucursal,
  getMovimientosByProducto,
  getMovimientosByFecha
} from '../controllers/movimientos-inventario.controller';

const router = Router();

router.get('/', getMovimientosInventario);
router.get('/sucursal/:sucursalId', getMovimientosBySucursal);
router.get('/producto/:productoId', getMovimientosByProducto);
router.get('/fecha', getMovimientosByFecha);
router.get('/:id', getMovimientoInventarioById);
router.post('/', createMovimientoInventario);

export default router; 