import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { TipoPago } from '../entities/TipoPago';
import { AppError } from '../middleware/error.middleware';

const tipoPagoRepository = AppDataSource.getRepository(TipoPago);

export const getTiposPago = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tiposPago = await tipoPagoRepository.find();
    res.json(tiposPago);
  } catch (error) {
    next(error);
  }
};

export const getTipoPagoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tipoPago = await tipoPagoRepository.findOneBy({ id_tipo_pago: parseInt(req.params.id) });
    
    if (!tipoPago) {
      throw new AppError('Tipo de pago no encontrado', 404);
    }

    res.json(tipoPago);
  } catch (error) {
    next(error);
  }
};

export const createTipoPago = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tipo_pago } = req.body;

    const tipoPago = tipoPagoRepository.create({
      tipo_pago
    });

    await tipoPagoRepository.save(tipoPago);
    res.status(201).json(tipoPago);
  } catch (error) {
    next(error);
  }
};

export const updateTipoPago = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tipo_pago } = req.body;
    const tipoPago = await tipoPagoRepository.findOneBy({ id_tipo_pago: parseInt(req.params.id) });

    if (!tipoPago) {
      throw new AppError('Tipo de pago no encontrado', 404);
    }

    tipoPagoRepository.merge(tipoPago, {
      tipo_pago
    });

    const results = await tipoPagoRepository.save(tipoPago);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const deleteTipoPago = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tipoPago = await tipoPagoRepository.findOneBy({ id_tipo_pago: parseInt(req.params.id) });

    if (!tipoPago) {
      throw new AppError('Tipo de pago no encontrado', 404);
    }

    await tipoPagoRepository.remove(tipoPago);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}; 