import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Producto } from '../entities/Producto';
import { Inventario } from '../entities/Inventario';
import { AppError } from '../middleware/error.middleware';

const productoRepository = AppDataSource.getRepository(Producto);
const inventarioRepository = AppDataSource.getRepository(Inventario);

// Función auxiliar para obtener el stock total de un producto
const getStockTotal = async (id_producto: number): Promise<number> => {
  const result = await inventarioRepository
    .createQueryBuilder('inventario')
    .select('SUM(inventario.stock)', 'total')
    .where('inventario.id_producto = :id_producto', { id_producto })
    .getRawOne();
  
  return result?.total || 0;
};

export const getProductos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productos = await productoRepository.find({
      relations: ['categoria', 'unidadMedida', 'inventarios', 'inventarios.sucursal'],
      select: {
        id_producto: true,
        nombre: true,
        descripcion: true,
        precio_venta: true,
        costo: true,
        id_unidad: true,
        id_categoria: true,
        activo: true,
        stock_minimo: true
      }
    });

    // Agregar el stock total a cada producto
    const productosConStock = await Promise.all(
      productos.map(async (producto) => {
        const stockTotal = await getStockTotal(producto.id_producto);
        return {
          ...producto,
          stock_total: stockTotal,
          stock_minimo: producto.stock_minimo || 0,
          inventarios: producto.inventarios.map(inv => ({
            ...inv,
            sucursal: inv.sucursal
          }))
        };
      })
    );

    res.json(productosConStock);
  } catch (error) {
    next(error);
  }
};

export const getProductoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const producto = await productoRepository.findOne({
      where: { id_producto: parseInt(req.params.id) },
      relations: ['categoria', 'unidadMedida', 'inventarios', 'inventarios.sucursal'],
      select: {
        id_producto: true,
        nombre: true,
        descripcion: true,
        precio_venta: true,
        costo: true,
        id_unidad: true,
        id_categoria: true,
        activo: true,
        stock_minimo: true
      }
    });
    
    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    const stockTotal = await getStockTotal(producto.id_producto);
    const productoConStock = {
      ...producto,
      stock_total: stockTotal,
      stock_minimo: producto.stock_minimo || 0
    };

    res.json(productoConStock);
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
      id_categoria,
      stock_minimo
    } = req.body;

    const producto = productoRepository.create({
      nombre,
      descripcion,
      precio_venta,
      costo,
      id_unidad,
      id_categoria,
      stock_minimo: stock_minimo || 0
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
      activo,
      stock_minimo
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
      activo,
      stock_minimo
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

export const updateStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stock, id_sucursal } = req.body;
    const id_producto = parseInt(req.params.id);

    // Verificar que el producto existe
    const producto = await productoRepository.findOne({
      where: { id_producto },
      relations: ['categoria', 'unidadMedida']
    });

    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    // Buscar el inventario existente
    let inventario = await inventarioRepository.findOne({
      where: {
        id_producto,
        id_sucursal
      }
    });

    if (!inventario) {
      // Si no existe, crear uno nuevo
      inventario = inventarioRepository.create({
        id_producto,
        id_sucursal,
        stock
      });
    } else {
      // Si existe, actualizar el stock
      inventario.stock = stock;
    }

    await inventarioRepository.save(inventario);

    // Obtener el producto actualizado con sus relaciones
    const productoActualizado = await productoRepository.findOne({
      where: { id_producto },
      relations: ['categoria', 'unidadMedida', 'inventarios']
    });

    res.json(productoActualizado);
  } catch (error) {
    next(error);
  }
}; 