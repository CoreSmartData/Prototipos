import { Router } from 'express';
import categoriasRoutes from './categorias.routes';
import unidadesMedidaRoutes from './unidades-medida.routes';
import productosRoutes from './productos.routes';
import inventarioRoutes from './inventario.routes';
import tiposPagoRoutes from './tipos-pago.routes';
import ventasRoutes from './ventas.routes';
import tiposMovimientoRoutes from './tipos-movimiento.routes';
import movimientosInventarioRoutes from './movimientos-inventario.routes';

const router = Router();

// Registro de rutas
router.use('/categorias', categoriasRoutes);
router.use('/unidades-medida', unidadesMedidaRoutes);
router.use('/productos', productosRoutes);
router.use('/inventario', inventarioRoutes);
router.use('/tipos-pago', tiposPagoRoutes);
router.use('/ventas', ventasRoutes);
router.use('/tipos-movimiento', tiposMovimientoRoutes);
router.use('/movimientos-inventario', movimientosInventarioRoutes);

export default router; 