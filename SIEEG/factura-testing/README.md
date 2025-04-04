# SIEEG - Sistema de Consulta de Facturas

Sistema web para la consulta de facturas electrónicas a través de la API de Factura.com.

## Características

- Interfaz de usuario moderna y responsiva
- Validación de RFC
- Selección intuitiva de mes y año
- Paginación de resultados
- Manejo de errores robusto
- Diseño corporativo SIEEG

## Requisitos

- Node.js >= 14.x
- npm >= 6.x

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd factura-testing
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```env
PORT=3000
NODE_ENV=development
```

## Uso

1. Iniciar el servidor:
```bash
npm start
```

2. Abrir el navegador en `http://localhost:3000`

## Estructura del Proyecto

```
src/
├── config/         # Configuración de la aplicación
├── controllers/    # Controladores de la API
├── public/         # Archivos estáticos
│   ├── css/       # Estilos
│   ├── js/        # JavaScript del cliente
│   └── img/       # Imágenes
└── routes/         # Rutas de la API
```

## Tecnologías Utilizadas

- Express.js - Framework web
- Bootstrap 5 - Framework CSS
- Axios - Cliente HTTP
- dotenv - Manejo de variables de entorno

## Desarrollo

Para ejecutar en modo desarrollo con recarga automática:
```bash
npm run dev
```

## Licencia

Este proyecto es propiedad de SIEEG - Sistema Integral de Expedientes Electrónicos Gubernamentales. 