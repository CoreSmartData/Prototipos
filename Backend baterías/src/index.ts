import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import { sucursalesRouter } from './routes/sucursales.routes';
import { productosRouter } from './routes/productos.routes';
import { clientesRouter } from './routes/clientes.routes';
import { ventasRouter } from './routes/ventas.routes';
import { inventarioRouter } from './routes/inventario.routes';
import { errorHandler } from './middleware/error.middleware';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/sucursales', sucursalesRouter);
app.use('/api/productos', productosRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/ventas', ventasRouter);
app.use('/api/inventario', inventarioRouter);

// Manejador de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Conexión a la base de datos
    await createConnection();
    console.log('Conexión a la base de datos establecida');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer(); 