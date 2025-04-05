import { AppDataSource } from './config/database';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function testConnection() {
  try {
    // Verificar variables de entorno antes de conectar
    console.log('Variables de entorno cargadas:');
    console.log(`- Host: ${process.env.DB_HOST}`);
    console.log(`- Puerto: ${process.env.DB_PORT}`);
    console.log(`- Base de datos: ${process.env.DB_NAME}`);
    console.log(`- Usuario: ${process.env.DB_USER}`);
    console.log(`- Contraseña configurada: ${process.env.DB_PASSWORD ? 'Sí' : 'No'}`);

    console.log('\nIntentando conectar a la base de datos...');
    await AppDataSource.initialize();
    console.log('¡Conexión exitosa a la base de datos!');
    
    // Obtener información de la conexión
    console.log('Información de la conexión:');
    console.log(`- Host: ${process.env.DB_HOST}`);
    console.log(`- Puerto: ${process.env.DB_PORT}`);
    console.log(`- Base de datos: ${process.env.DB_NAME}`);
    console.log(`- Usuario: ${process.env.DB_USER}`);
    
    // Cerrar la conexión
    await AppDataSource.destroy();
    console.log('Conexión cerrada.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

testConnection(); 