# Sistema de Gestión de Inventario y Ventas

Sistema backend para la gestión de inventario, ventas y créditos de una empresa de baterías.

## Tecnologías Utilizadas

- Node.js (v18 o superior)
- TypeScript
- Express
- TypeORM
- MySQL
- Docker

## Requisitos Previos

- Node.js (v18 o superior)
- MySQL (v8 o superior)
- Docker (opcional)

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd [NOMBRE_DEL_DIRECTORIO]
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```
Editar el archivo `.env` con los valores correspondientes:
```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contraseña
DB_DATABASE=baterias_db

# Configuración de JWT
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_IN=24h
```

4. Crear la base de datos:
```sql
CREATE DATABASE baterias_db;
```

5. Iniciar la base de datos (si usas Docker):
```bash
docker-compose up -d
```

6. Ejecutar las migraciones:
```bash
npm run typeorm migration:run
```

7. Iniciar el servidor:
```bash
npm run dev
```

## Estructura del Proyecto

```
src/
├── config/             # Configuraciones (base de datos, etc.)
├── controllers/        # Controladores de la aplicación
├── entities/          # Entidades de TypeORM
├── middleware/        # Middlewares (error handling, etc.)
├── migrations/        # Migraciones de la base de datos
├── routes/            # Rutas de la API
├── docs/             # Documentación de la API
└── app.ts            # Punto de entrada de la aplicación
```

## API Endpoints

### Categorías
- `GET /api/categorias` - Obtener todas las categorías
- `GET /api/categorias/:id` - Obtener una categoría por ID
- `POST /api/categorias` - Crear una nueva categoría
- `PUT /api/categorias/:id` - Actualizar una categoría
- `DELETE /api/categorias/:id` - Eliminar una categoría

### Unidades de Medida
- `GET /api/unidades-medida` - Obtener todas las unidades
- `GET /api/unidades-medida/:id` - Obtener una unidad por ID
- `POST /api/unidades-medida` - Crear una nueva unidad
- `PUT /api/unidades-medida/:id` - Actualizar una unidad
- `DELETE /api/unidades-medida/:id` - Eliminar una unidad

### Productos
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/activos` - Obtener productos activos
- `GET /api/productos/categoria/:categoriaId` - Obtener productos por categoría
- `GET /api/productos/:id` - Obtener un producto por ID
- `POST /api/productos` - Crear un nuevo producto
- `PUT /api/productos/:id` - Actualizar un producto
- `DELETE /api/productos/:id` - Eliminar un producto

### Inventario
- `GET /api/inventario` - Obtener todo el inventario
- `GET /api/inventario/sucursal/:sucursalId` - Obtener inventario por sucursal
- `GET /api/inventario/producto/:productoId` - Obtener inventario por producto
- `GET /api/inventario/:id` - Obtener un registro por ID
- `POST /api/inventario` - Crear un nuevo registro
- `PUT /api/inventario/:productoId/sucursal/:sucursalId/stock` - Actualizar stock
- `PUT /api/inventario/:productoId/sucursal/:sucursalId/ajuste` - Ajustar stock

### Ventas
- `GET /api/ventas` - Obtener todas las ventas
- `GET /api/ventas/cliente/:clienteId` - Obtener ventas por cliente
- `GET /api/ventas/sucursal/:sucursalId` - Obtener ventas por sucursal
- `GET /api/ventas/fecha` - Obtener ventas por fecha
- `GET /api/ventas/:id` - Obtener una venta por ID
- `POST /api/ventas` - Crear una nueva venta

### Tipos de Movimiento
- `GET /api/tipos-movimiento` - Obtener todos los tipos de movimiento
- `GET /api/tipos-movimiento/:id` - Obtener un tipo de movimiento por ID
- `POST /api/tipos-movimiento` - Crear un nuevo tipo de movimiento
- `PUT /api/tipos-movimiento/:id` - Actualizar un tipo de movimiento
- `DELETE /api/tipos-movimiento/:id` - Eliminar un tipo de movimiento

### Movimientos de Inventario
- `GET /api/movimientos-inventario` - Obtener todos los movimientos
- `GET /api/movimientos-inventario/sucursal/:sucursalId` - Obtener movimientos por sucursal
- `GET /api/movimientos-inventario/producto/:productoId` - Obtener movimientos por producto
- `GET /api/movimientos-inventario/fecha` - Obtener movimientos por fecha
- `GET /api/movimientos-inventario/:id` - Obtener un movimiento por ID
- `POST /api/movimientos-inventario` - Crear un nuevo movimiento

## Modelos de Datos

### Categoria
```typescript
{
  id_categoria: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  productos: Producto[];
}
```

### UnidadMedida
```typescript
{
  id_unidad: number;
  nombre: string;
  abreviatura: string;
  activo: boolean;
  productos: Producto[];
}
```

### Producto
```typescript
{
  id_producto: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  stock_minimo: number;
  activo: boolean;
  categoria: Categoria;
  unidad_medida: UnidadMedida;
  inventarios: Inventario[];
}
```

### Inventario
```typescript
{
  id_inventario: number;
  stock: number;
  producto: Producto;
  sucursal: Sucursal;
}
```

### Venta
```typescript
{
  id_venta: number;
  fecha: Date;
  total: number;
  cliente: Cliente;
  sucursal: Sucursal;
  tipo_pago: TipoPago;
  detalles: DetalleVenta[];
}
```

## Documentación Adicional

Para ejemplos detallados de uso de la API, consulta:
- [Ejemplos de Uso](docs/ejemplos.md)
- [Documentación Swagger](src/docs/swagger.yaml)

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm run build` - Compila el proyecto
- `npm start` - Inicia el servidor en modo producción
- `npm run typeorm` - Ejecuta comandos de TypeORM
- `npm run migration:generate` - Genera una nueva migración
- `npm run migration:run` - Ejecuta las migraciones pendientes
- `npm run migration:revert` - Revierte la última migración

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 