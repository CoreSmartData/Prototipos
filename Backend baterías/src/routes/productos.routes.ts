import { Router } from 'express';
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductosByCategoria,
  getProductosActivos
} from '../controllers/productos.controller';

const router = Router();

router.get('/', getProductos);
router.get('/activos', getProductosActivos);
router.get('/categoria/:categoriaId', getProductosByCategoria);
router.get('/:id', getProductoById);
router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

export default router; 