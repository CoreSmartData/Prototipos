import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { UnidadMedida } from '../entities/UnidadMedida';
import { AppError } from '../middleware/error.middleware';

const unidadMedidaRepository = AppDataSource.getRepository(UnidadMedida);

export const getUnidadesMedida = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unidades = await unidadMedidaRepository.find();
    res.json(unidades);
  } catch (error) {
    next(error);
  }
};

export const getUnidadMedidaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unidad = await unidadMedidaRepository.findOneBy({ id_unidad: parseInt(req.params.id) });
    
    if (!unidad) {
      throw new AppError('Unidad de medida no encontrada', 404);
    }

    res.json(unidad);
  } catch (error) {
    next(error);
  }
};

export const createUnidadMedida = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { unidad } = req.body;

    const unidadMedida = unidadMedidaRepository.create({
      unidad
    });

    await unidadMedidaRepository.save(unidadMedida);
    res.status(201).json(unidadMedida);
  } catch (error) {
    next(error);
  }
};

export const updateUnidadMedida = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { unidad } = req.body;
    const unidadMedida = await unidadMedidaRepository.findOneBy({ id_unidad: parseInt(req.params.id) });

    if (!unidadMedida) {
      throw new AppError('Unidad de medida no encontrada', 404);
    }

    unidadMedidaRepository.merge(unidadMedida, {
      unidad
    });

    const results = await unidadMedidaRepository.save(unidadMedida);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const deleteUnidadMedida = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unidadMedida = await unidadMedidaRepository.findOneBy({ id_unidad: parseInt(req.params.id) });

    if (!unidadMedida) {
      throw new AppError('Unidad de medida no encontrada', 404);
    }

    await unidadMedidaRepository.remove(unidadMedida);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}; 