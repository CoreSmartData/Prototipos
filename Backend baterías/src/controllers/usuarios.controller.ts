import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Usuario, RolUsuario } from '../entities/Usuario';
import { AppError } from '../middleware/error.middleware';
import * as jwt from 'jsonwebtoken';

const usuarioRepository = AppDataSource.getRepository(Usuario);

// Clave secreta para JWT - En producción, esto debería estar en variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await usuarioRepository.findOneBy({ email });
    if (usuarioExistente) {
      throw new AppError('El email ya está registrado', 400);
    }

    // Crear nuevo usuario
    const usuario = usuarioRepository.create({
      nombre,
      email,
      password,
      rol: rol || RolUsuario.VENDEDOR
    });

    await usuarioRepository.save(usuario);

    // Generar token
    const token = jwt.sign(
      { 
        id: usuario.id_usuario,
        email: usuario.email,
        rol: usuario.rol
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // No enviar la contraseña en la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    res.status(201).json({
      usuario: usuarioSinPassword,
      token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await usuarioRepository.findOneBy({ email });
    if (!usuario) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Verificar contraseña
    const passwordValida = await usuario.validatePassword(password);
    if (!passwordValida) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      throw new AppError('Usuario inactivo', 401);
    }

    // Generar token
    const token = jwt.sign(
      { 
        id: usuario.id_usuario,
        email: usuario.email,
        rol: usuario.rol
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // No enviar la contraseña en la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    res.json({
      usuario: usuarioSinPassword,
      token
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuario = await usuarioRepository.findOne({
      where: { id_usuario: req.usuario?.id },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        fecha_creacion: true,
        fecha_actualizacion: true
      }
    });
    
    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

export const getUsuarios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuarios = await usuarioRepository.find({
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        fecha_creacion: true,
        fecha_actualizacion: true
      }
    });
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};

export const getUsuarioById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuario = await usuarioRepository.findOne({
      where: { id_usuario: parseInt(req.params.id) },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        fecha_creacion: true,
        fecha_actualizacion: true
      }
    });
    
    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

export const updateUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, email, password, rol, activo } = req.body;
    const usuario = await usuarioRepository.findOneBy({ id_usuario: parseInt(req.params.id) });

    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }

    // Actualizar campos
    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (password) usuario.password = password;
    if (rol) usuario.rol = rol;
    if (typeof activo === 'boolean') usuario.activo = activo;

    await usuarioRepository.save(usuario);

    // No enviar la contraseña en la respuesta
    const { password: _, ...usuarioActualizado } = usuario;

    res.json(usuarioActualizado);
  } catch (error) {
    next(error);
  }
};

export const deleteUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuario = await usuarioRepository.findOneBy({ id_usuario: parseInt(req.params.id) });

    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }

    // En lugar de eliminar, marcamos como inactivo
    usuario.activo = false;
    await usuarioRepository.save(usuario);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}; 