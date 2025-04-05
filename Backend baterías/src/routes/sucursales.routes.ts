import { Router } from 'express';
import {
  getSucursales,
  getSucursalById,
  createSucursal,
  updateSucursal,
  deleteSucursal
} from '../controllers/sucursales.controller';

const router = Router();

// GET /api/sucursales
router.get('/', getSucursales);

// GET /api/sucursales/:id
router.get('/:id', getSucursalById);

// POST /api/sucursales
router.post('/', createSucursal);

// PUT /api/sucursales/:id
router.put('/:id', updateSucursal);

// DELETE /api/sucursales/:id
router.delete('/:id', deleteSucursal);

export const sucursalesRouter = router; 