import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Cliente } from '../entities/Cliente';

export const getClientes = async (req: Request, res: Response) => {
  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const clientes = await clienteRepository.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes', error });
  }
};

export const getClienteById = async (req: Request, res: Response) => {
  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const cliente = await clienteRepository.findOne({ where: { id_cliente: parseInt(req.params.id) } });
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente', error });
  }
};

export const createCliente = async (req: Request, res: Response) => {
  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const nuevoCliente = clienteRepository.create(req.body);
    const clienteGuardado = await clienteRepository.save(nuevoCliente);
    res.status(201).json(clienteGuardado);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el cliente', error });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const cliente = await clienteRepository.findOne({ where: { id_cliente: parseInt(req.params.id) } });
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    clienteRepository.merge(cliente, req.body);
    const clienteActualizado = await clienteRepository.save(cliente);
    res.json(clienteActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el cliente', error });
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const cliente = await clienteRepository.findOne({ where: { id_cliente: parseInt(req.params.id) } });
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    await clienteRepository.remove(cliente);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cliente', error });
  }
}; 