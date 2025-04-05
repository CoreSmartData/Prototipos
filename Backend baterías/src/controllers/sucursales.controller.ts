import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Sucursal } from '../entities/Sucursal';
import { AppError } from '../middleware/error.middleware';

const sucursalRepository = AppDataSource.getRepository(Sucursal);

export const getSucursales = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sucursales = await sucursalRepository.find();
    res.json(sucursales);
  } catch (error) {
    next(error);
  }
};

export const getSucursalById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sucursal = await sucursalRepository.findOneBy({ id_sucursal: parseInt(req.params.id) });
    
    if (!sucursal) {
      throw new AppError('Sucursal no encontrada', 404);
    }

    res.json(sucursal);
  } catch (error) {
    next(error);
  }
};

export const createSucursal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, direccion, telefono, responsable } = req.body;

    const sucursal = sucursalRepository.create({
      nombre,
      direccion,
      telefono,
      responsable
    });

    await sucursalRepository.save(sucursal);
    res.status(201).json(sucursal);
  } catch (error) {
    next(error);
  }
};

export const updateSucursal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, direccion, telefono, responsable, activo } = req.body;
    const sucursal = await sucursalRepository.findOneBy({ id_sucursal: parseInt(req.params.id) });

    if (!sucursal) {
      throw new AppError('Sucursal no encontrada', 404);
    }

    sucursalRepository.merge(sucursal, {
      nombre,
      direccion,
      telefono,
      responsable,
      activo
    });

    const results = await sucursalRepository.save(sucursal);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const deleteSucursal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sucursal = await sucursalRepository.findOneBy({ id_sucursal: parseInt(req.params.id) });

    if (!sucursal) {
      throw new AppError('Sucursal no encontrada', 404);
    }

    await sucursalRepository.remove(sucursal);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}; 