import { Router } from 'express';
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductosByCategoria,
  getProductosActivos,
  updateStock
} from '../controllers/productos.controller';

const router = Router();

router.get('/', getProductos);
router.get('/activos', getProductosActivos);
router.get('/categoria/:categoriaId', getProductosByCategoria);
router.get('/:id', getProductoById);
router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);
router.patch('/:id/stock', updateStock);

export const productosRouter = router; 