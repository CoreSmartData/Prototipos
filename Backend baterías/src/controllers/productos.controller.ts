import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Producto } from '../entities/Producto';
import { AppError } from '../middleware/error.middleware';

const productoRepository = AppDataSource.getRepository(Producto);

export const getProductos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productos = await productoRepository.find({
      relations: ['categoria', 'unidadMedida']
    });
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

export const getProductoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const producto = await productoRepository.findOne({
      where: { id_producto: parseInt(req.params.id) },
      relations: ['categoria', 'unidadMedida']
    });
    
    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    res.json(producto);
  } catch (error) {
    next(error);
  }
};

export const createProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      nombre,
      descripcion,
      precio_venta,
      costo,
      id_unidad,
      id_categoria
    } = req.body;

    const producto = productoRepository.create({
      nombre,
      descripcion,
      precio_venta,
      costo,
      id_unidad,
      id_categoria
    });

    await productoRepository.save(producto);
    res.status(201).json(producto);
  } catch (error) {
    next(error);
  }
};

export const updateProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      nombre,
      descripcion,
      precio_venta,
      costo,
      id_unidad,
      id_categoria,
      activo
    } = req.body;

    const producto = await productoRepository.findOneBy({ id_producto: parseInt(req.params.id) });

    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    productoRepository.merge(producto, {
      nombre,
      descripcion,
      precio_venta,
      costo,
      id_unidad,
      id_categoria,
      activo
    });

    const results = await productoRepository.save(producto);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const deleteProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const producto = await productoRepository.findOneBy({ id_producto: parseInt(req.params.id) });

    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    await productoRepository.remove(producto);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getProductosByCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productos = await productoRepository.find({
      where: { id_categoria: parseInt(req.params.categoriaId) },
      relations: ['categoria', 'unidadMedida']
    });
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

export const getProductosActivos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productos = await productoRepository.find({
      where: { activo: true },
      relations: ['categoria', 'unidadMedida']
    });
    res.json(productos);
  } catch (error) {
    next(error);
  }
}; 