import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Categoria } from '../entities/Categoria';
import { AppError } from '../middleware/error.middleware';

const categoriaRepository = AppDataSource.getRepository(Categoria);

export const getCategorias = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categorias = await categoriaRepository.find();
    res.json(categorias);
  } catch (error) {
    next(error);
  }
};

export const getCategoriaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoria = await categoriaRepository.findOneBy({ id_categoria: parseInt(req.params.id) });
    
    if (!categoria) {
      throw new AppError('Categoría no encontrada', 404);
    }

    res.json(categoria);
  } catch (error) {
    next(error);
  }
};

export const createCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre_categoria } = req.body;

    const categoria = categoriaRepository.create({
      nombre: nombre_categoria
    });

    await categoriaRepository.save(categoria);
    res.status(201).json(categoria);
  } catch (error) {
    next(error);
  }
};

export const updateCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre_categoria } = req.body;
    const categoria = await categoriaRepository.findOneBy({ id_categoria: parseInt(req.params.id) });

    if (!categoria) {
      throw new AppError('Categoría no encontrada', 404);
    }

    categoriaRepository.merge(categoria, {
      nombre: nombre_categoria
    });

    const results = await categoriaRepository.save(categoria);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const deleteCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoria = await categoriaRepository.findOneBy({ id_categoria: parseInt(req.params.id) });

    if (!categoria) {
      throw new AppError('Categoría no encontrada', 404);
    }

    await categoriaRepository.remove(categoria);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}; 