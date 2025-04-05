import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { TipoMovimiento } from '../entities/TipoMovimiento';
import { AppError } from '../middleware/error.middleware';

const tipoMovimientoRepository = AppDataSource.getRepository(TipoMovimiento);

export const getTiposMovimiento = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tiposMovimiento = await tipoMovimientoRepository.find();
    res.json(tiposMovimiento);
  } catch (error) {
    next(error);
  }
};

export const getTipoMovimientoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tipoMovimiento = await tipoMovimientoRepository.findOneBy({ id_tipo_movimiento: parseInt(req.params.id) });
    
    if (!tipoMovimiento) {
      throw new AppError('Tipo de movimiento no encontrado', 404);
    }

    res.json(tipoMovimiento);
  } catch (error) {
    next(error);
  }
};

export const createTipoMovimiento = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tipo } = req.body;

    if (tipo !== 'entrada' && tipo !== 'salida') {
      throw new AppError('El tipo de movimiento debe ser "entrada" o "salida"', 400);
    }

    const tipoMovimiento = tipoMovimientoRepository.create({
      tipo
    });

    await tipoMovimientoRepository.save(tipoMovimiento);
    res.status(201).json(tipoMovimiento);
  } catch (error) {
    next(error);
  }
};

export const updateTipoMovimiento = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tipo } = req.body;
    const tipoMovimiento = await tipoMovimientoRepository.findOneBy({ id_tipo_movimiento: parseInt(req.params.id) });

    if (!tipoMovimiento) {
      throw new AppError('Tipo de movimiento no encontrado', 404);
    }

    if (tipo !== 'entrada' && tipo !== 'salida') {
      throw new AppError('El tipo de movimiento debe ser "entrada" o "salida"', 400);
    }

    tipoMovimientoRepository.merge(tipoMovimiento, {
      tipo
    });

    const results = await tipoMovimientoRepository.save(tipoMovimiento);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const deleteTipoMovimiento = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tipoMovimiento = await tipoMovimientoRepository.findOneBy({ id_tipo_movimiento: parseInt(req.params.id) });

    if (!tipoMovimiento) {
      throw new AppError('Tipo de movimiento no encontrado', 404);
    }

    await tipoMovimientoRepository.remove(tipoMovimiento);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}; 