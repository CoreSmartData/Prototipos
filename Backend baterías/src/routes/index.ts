import { Router } from 'express';
import { categoriasRouter } from './categorias.routes';
import { unidadesMedidaRouter } from './unidades-medida.routes';
import { productosRouter } from './productos.routes';
import { inventarioRouter } from './inventario.routes';
import { tiposPagoRouter } from './tipos-pago.routes';
import { ventasRouter } from './ventas.routes';
import { tiposMovimientoRouter } from './tipos-movimiento.routes';
import { movimientosInventarioRouter } from './movimientos-inventario.routes';
import { sucursalesRouter } from './sucursales.routes';
import { clientesRouter } from './clientes.routes';

const router = Router();

// Registro de rutas
router.use('/categorias', categoriasRouter);
router.use('/unidades-medida', unidadesMedidaRouter);
router.use('/productos', productosRouter);
router.use('/inventario', inventarioRouter);
router.use('/tipos-pago', tiposPagoRouter);
router.use('/ventas', ventasRouter);
router.use('/tipos-movimiento', tiposMovimientoRouter);
router.use('/movimientos-inventario', movimientosInventarioRouter);
router.use('/sucursales', sucursalesRouter);
router.use('/clientes', clientesRouter);

export default router; 