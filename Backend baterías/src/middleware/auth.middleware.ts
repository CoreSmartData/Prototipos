import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import { RolUsuario } from '../entities/Usuario';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Clave secreta para JWT - Debe ser la misma que en el controlador de usuarios
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura';

// Extender la interfaz Request de Express para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      usuario?: {
        id: number;
        email: string;
        rol: RolUsuario;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError('No se proporcionó token de autenticación', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('Token inválido', 401);
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: number;
        email: string;
        rol: RolUsuario;
      };
      req.usuario = decoded;
      next();
    } catch (error) {
      throw new AppError('Token inválido o expirado', 401);
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: RolUsuario[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.usuario) {
        throw new AppError('No autorizado', 401);
      }

      if (!roles.includes(req.usuario.rol)) {
        throw new AppError('No tiene permisos para realizar esta acción', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 