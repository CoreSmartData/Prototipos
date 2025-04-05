import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Inventario } from '../entities/Inventario';
import { AppError } from '../middleware/error.middleware';

const inventarioRepository = AppDataSource.getRepository(Inventario);

export const getInventario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventario = await inventarioRepository.find({
      relations: ['producto', 'sucursal']
    });
    res.json(inventario);
  } catch (error) {
    next(error);
  }
};

export const getInventarioById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventario = await inventarioRepository.findOne({
      where: { id_inventario: parseInt(req.params.id) },
      relations: ['producto', 'sucursal']
    });
    
    if (!inventario) {
      throw new AppError('Registro de inventario no encontrado', 404);
    }

    res.json(inventario);
  } catch (error) {
    next(error);
  }
};

export const getInventarioBySucursal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventario = await inventarioRepository.find({
      where: { id_sucursal: parseInt(req.params.sucursalId) },
      relations: ['producto', 'sucursal']
    });
    res.json(inventario);
  } catch (error) {
    next(error);
  }
};

export const getInventarioByProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventario = await inventarioRepository.find({
      where: { id_producto: parseInt(req.params.productoId) },
      relations: ['producto', 'sucursal']
    });
    res.json(inventario);
  } catch (error) {
    next(error);
  }
};

export const createInventario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id_producto, id_sucursal, stock } = req.body;

    // Verificar si ya existe un registro para este producto en esta sucursal
    const existingInventario = await inventarioRepository.findOne({
      where: {
        id_producto,
        id_sucursal
      }
    });

    if (existingInventario) {
      throw new AppError('Ya existe un registro de inventario para este producto en esta sucursal', 400);
    }

    const inventario = inventarioRepository.create({
      id_producto,
      id_sucursal,
      stock
    });

    await inventarioRepository.save(inventario);
    res.status(201).json(inventario);
  } catch (error) {
    next(error);
  }
};

export const updateStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stock } = req.body;
    const inventario = await inventarioRepository.findOne({
      where: {
        id_producto: parseInt(req.params.productoId),
        id_sucursal: parseInt(req.params.sucursalId)
      }
    });

    if (!inventario) {
      throw new AppError('Registro de inventario no encontrado', 404);
    }

    inventario.stock = stock;
    const results = await inventarioRepository.save(inventario);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const ajustarStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cantidad } = req.body;
    const inventario = await inventarioRepository.findOne({
      where: {
        id_producto: parseInt(req.params.productoId),
        id_sucursal: parseInt(req.params.sucursalId)
      }
    });

    if (!inventario) {
      throw new AppError('Registro de inventario no encontrado', 404);
    }

    inventario.stock += cantidad;
    if (inventario.stock < 0) {
      throw new AppError('No hay suficiente stock disponible', 400);
    }

    const results = await inventarioRepository.save(inventario);
    res.json(results);
  } catch (error) {
    next(error);
  }
}; 