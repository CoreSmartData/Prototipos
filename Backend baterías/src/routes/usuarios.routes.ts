import { Router } from 'express';
import { 
  register, 
  login, 
  getMe,
  getUsuarios, 
  getUsuarioById, 
  updateUsuario, 
  deleteUsuario 
} from '../controllers/usuarios.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { RolUsuario } from '../entities/Usuario';

const router = Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/me', authenticate, getMe);
router.get('/', authenticate, authorize(RolUsuario.ADMIN), getUsuarios);
router.get('/:id', authenticate, authorize(RolUsuario.ADMIN), getUsuarioById);
router.put('/:id', authenticate, authorize(RolUsuario.ADMIN), updateUsuario);
router.delete('/:id', authenticate, authorize(RolUsuario.ADMIN), deleteUsuario);

export default router; 