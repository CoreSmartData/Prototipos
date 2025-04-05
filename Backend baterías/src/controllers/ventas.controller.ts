import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Venta } from '../entities/Venta';
import { DetalleVenta } from '../entities/DetalleVenta';
import { Inventario } from '../entities/Inventario';
import { AppError } from '../middleware/error.middleware';
import { Between } from 'typeorm';

const ventaRepository = AppDataSource.getRepository(Venta);
const detalleVentaRepository = AppDataSource.getRepository(DetalleVenta);
const inventarioRepository = AppDataSource.getRepository(Inventario);

export const getVentas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ventas = await ventaRepository.find({
      relations: ['cliente', 'sucursal', 'tipoPago', 'detalles', 'detalles.producto']
    });
    res.json(ventas);
  } catch (error) {
    next(error);
  }
};

export const getVentaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const venta = await ventaRepository.findOne({
      where: { id_venta: parseInt(req.params.id) },
      relations: ['cliente', 'sucursal', 'tipoPago', 'detalles', 'detalles.producto']
    });
    
    if (!venta) {
      throw new AppError('Venta no encontrada', 404);
    }

    res.json(venta);
  } catch (error) {
    next(error);
  }
};

export const createVenta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      id_cliente,
      id_sucursal,
      id_tipo_pago,
      observaciones,
      detalles
    } = req.body;

    // Calcular el total de la venta
    let total = 0;
    for (const detalle of detalles) {
      total += detalle.cantidad * detalle.precio_unitario;
    }

    // Crear la venta
    const venta = ventaRepository.create({
      id_cliente,
      id_sucursal,
      id_tipo_pago,
      total,
      observaciones
    });

    await ventaRepository.save(venta);

    // Crear los detalles de la venta
    for (const detalle of detalles) {
      const detalleVenta = detalleVentaRepository.create({
        id_venta: venta.id_venta,
        id_producto: detalle.id_producto,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario,
        subtotal: detalle.cantidad * detalle.precio_unitario
      });

      await detalleVentaRepository.save(detalleVenta);

      // Actualizar el inventario
      const inventario = await inventarioRepository.findOne({
        where: {
          id_producto: detalle.id_producto,
          id_sucursal
        }
      });

      if (!inventario) {
        throw new AppError(`No hay inventario para el producto ${detalle.id_producto} en la sucursal ${id_sucursal}`, 400);
      }

      if (inventario.stock < detalle.cantidad) {
        throw new AppError(`No hay suficiente stock para el producto ${detalle.id_producto}`, 400);
      }

      inventario.stock -= detalle.cantidad;
      await inventarioRepository.save(inventario);
    }

    // Obtener la venta completa con sus relaciones
    const ventaCompleta = await ventaRepository.findOne({
      where: { id_venta: venta.id_venta },
      relations: ['cliente', 'sucursal', 'tipoPago', 'detalles', 'detalles.producto']
    });

    res.status(201).json(ventaCompleta);
  } catch (error) {
    next(error);
  }
};

export const getVentasByCliente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ventas = await ventaRepository.find({
      where: { id_cliente: parseInt(req.params.clienteId) },
      relations: ['cliente', 'sucursal', 'tipoPago', 'detalles', 'detalles.producto']
    });
    res.json(ventas);
  } catch (error) {
    next(error);
  }
};

export const getVentasBySucursal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ventas = await ventaRepository.find({
      where: { id_sucursal: parseInt(req.params.sucursalId) },
      relations: ['cliente', 'sucursal', 'tipoPago', 'detalles', 'detalles.producto']
    });
    res.json(ventas);
  } catch (error) {
    next(error);
  }
};

export const getVentasByFecha = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    const ventas = await ventaRepository.find({
      where: {
        fecha: Between(new Date(fechaInicio as string), new Date(fechaFin as string))
      },
      relations: ['cliente', 'sucursal', 'tipoPago', 'detalles', 'detalles.producto']
    });
    
    res.json(ventas);
  } catch (error) {
    next(error);
  }
}; 