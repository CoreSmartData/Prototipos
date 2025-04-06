import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { MovimientoInventario } from '../entities/MovimientoInventario';
import { Inventario } from '../entities/Inventario';
import { AppError } from '../middleware/error.middleware';
import { Between } from 'typeorm';

const movimientoInventarioRepository = AppDataSource.getRepository(MovimientoInventario);
const inventarioRepository = AppDataSource.getRepository(Inventario);

export const getMovimientosInventario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movimientos = await movimientoInventarioRepository.find({
      relations: ['producto', 'sucursal', 'tipoMovimiento']
    });
    res.json(movimientos);
  } catch (error) {
    next(error);
  }
};

export const getMovimientoInventarioById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movimiento = await movimientoInventarioRepository.findOne({
      where: { id_movimiento: parseInt(req.params.id) },
      relations: ['producto', 'sucursal', 'tipoMovimiento']
    });
    
    if (!movimiento) {
      throw new AppError('Movimiento de inventario no encontrado', 404);
    }

    res.json(movimiento);
  } catch (error) {
    next(error);
  }
};

export const createMovimientoInventario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      id_producto,
      id_sucursal,
      id_tipo_movimiento,
      cantidad,
      referencia,
      observaciones
    } = req.body;

    // Verificar si existe el inventario
    const inventario = await inventarioRepository.findOne({
      where: {
        id_producto,
        id_sucursal
      }
    });

    if (!inventario) {
      throw new AppError(`No hay inventario para el producto ${id_producto} en la sucursal ${id_sucursal}`, 400);
    }

    // Crear el movimiento
    const movimiento = movimientoInventarioRepository.create({
      id_producto,
      id_sucursal,
      id_tipo_movimiento,
      cantidad,
      referencia,
      observaciones
    });

    await movimientoInventarioRepository.save(movimiento);

    // Actualizar el inventario
    const tipoMovimiento = await AppDataSource.getRepository('tipos_movimiento').findOneBy({ id_tipo_movimiento });
    
    if (!tipoMovimiento) {
      throw new AppError(`Tipo de movimiento con ID ${id_tipo_movimiento} no encontrado`, 404);
    }
    
    if (tipoMovimiento.tipo === 'entrada') {
      inventario.stock += cantidad;
    } else {
      if (inventario.stock < cantidad) {
        throw new AppError(`No hay suficiente stock para el producto ${id_producto}`, 400);
      }
      inventario.stock -= cantidad;
    }

    await inventarioRepository.save(inventario);

    // Obtener el movimiento completo con sus relaciones
    const movimientoCompleto = await movimientoInventarioRepository.findOne({
      where: { id_movimiento: movimiento.id_movimiento },
      relations: ['producto', 'sucursal', 'tipoMovimiento']
    });

    res.status(201).json(movimientoCompleto);
  } catch (error) {
    next(error);
  }
};

export const getMovimientosBySucursal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movimientos = await movimientoInventarioRepository.find({
      where: { id_sucursal: parseInt(req.params.sucursalId) },
      relations: ['producto', 'sucursal', 'tipoMovimiento']
    });
    res.json(movimientos);
  } catch (error) {
    next(error);
  }
};

export const getMovimientosByProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movimientos = await movimientoInventarioRepository.find({
      where: { id_producto: parseInt(req.params.productoId) },
      relations: ['producto', 'sucursal', 'tipoMovimiento']
    });
    res.json(movimientos);
  } catch (error) {
    next(error);
  }
};

export const getMovimientosByFecha = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    const movimientos = await movimientoInventarioRepository.find({
      where: {
        fecha: Between(new Date(fechaInicio as string), new Date(fechaFin as string))
      },
      relations: ['producto', 'sucursal', 'tipoMovimiento']
    });
    
    res.json(movimientos);
  } catch (error) {
    next(error);
  }
}; 