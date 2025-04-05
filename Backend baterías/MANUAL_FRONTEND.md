# Manual de Integración Frontend - Sistema de Gestión de Baterías

## Índice

1. [Introducción](#introducción)
2. [Configuración del Proyecto](#configuración-del-proyecto)
3. [Estructura de la API](#estructura-de-la-api)
4. [Modelos de Datos](#modelos-de-datos)
5. [Endpoints Disponibles](#endpoints-disponibles)
6. [Ejemplos de Integración](#ejemplos-de-integración)
7. [Consideraciones de Diseño](#consideraciones-de-diseño)
8. [Solución de Problemas Comunes](#solución-de-problemas-comunes)

## Introducción

Este manual proporciona información detallada para integrar un frontend con el backend del Sistema de Gestión de Baterías. El backend está desarrollado con Node.js, Express y TypeScript, utilizando TypeORM para la gestión de la base de datos MySQL.

## Configuración del Proyecto

### Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Conocimientos básicos de React, Angular o Vue.js (dependiendo del framework que utilices)

### Configuración del Cliente HTTP

Para consumir los endpoints, se recomienda utilizar una biblioteca como Axios:

```javascript
// Instalación
npm install axios

// Configuración básica
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    // Manejo de errores
    console.error('Error en la petición:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
```

## Estructura de la API

La API sigue una estructura RESTful con los siguientes patrones:

- **Base URL**: `http://localhost:3000/api`
- **Formato de Respuesta**: JSON
- **Métodos HTTP**: GET, POST, PUT, DELETE
- **Autenticación**: No implementada en esta versión (se puede agregar posteriormente)

## Modelos de Datos

### Cliente

```typescript
interface Cliente {
  id_cliente: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  rfc: string;
  tipo_cliente: 'normal' | 'credito';
  limite_credito: number;
  saldo_actual: number;
  activo: boolean;
}
```

### Producto

```typescript
interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio_venta: number;
  costo: number;
  id_unidad: number;
  id_categoria: number;
  activo: boolean;
  unidadMedida?: UnidadMedida;
  categoria?: Categoria;
}
```

### Venta

```typescript
interface Venta {
  id_venta: number;
  id_cliente: number;
  id_sucursal: number;
  fecha: Date;
  total: number;
  id_tipo_pago: number;
  observaciones?: string;
  cliente?: Cliente;
  sucursal?: Sucursal;
  tipoPago?: TipoPago;
  detalles?: DetalleVenta[];
}
```

### Inventario

```typescript
interface Inventario {
  id_inventario: number;
  id_producto: number;
  id_sucursal: number;
  stock: number;
  producto?: Producto;
  sucursal?: Sucursal;
}
```

### Unidad de Medida

```typescript
interface UnidadMedida {
  id_unidad: number;
  unidad: string;
}
```

### Categoría

```typescript
interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}
```

### Tipo de Pago

```typescript
interface TipoPago {
  id_tipo_pago: number;
  tipo_pago: string;
}
```

### Tipo de Movimiento

```typescript
interface TipoMovimiento {
  id_tipo_movimiento: number;
  tipo: 'entrada' | 'salida';
}
```

### Detalle de Venta

```typescript
interface DetalleVenta {
  id_detalle: number;
  id_venta: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  venta?: Venta;
  producto?: Producto;
}
```

### Detalle de Traspaso

```typescript
interface DetalleTraspaso {
  id_detalle: number;
  id_traspaso: number;
  id_producto: number;
  cantidad: number;
  traspaso?: Traspaso;
  producto?: Producto;
}
```

### Traspaso

```typescript
interface Traspaso {
  id_traspaso: number;
  fecha: Date;
  id_sucursal_origen: number;
  id_sucursal_destino: number;
  observaciones?: string;
  estado: 'pendiente' | 'completado' | 'cancelado';
  sucursalOrigen?: Sucursal;
  sucursalDestino?: Sucursal;
  detalles?: DetalleTraspaso[];
}
```

### Movimiento de Inventario

```typescript
interface MovimientoInventario {
  id_movimiento: number;
  id_producto: number;
  id_sucursal: number;
  fecha: Date;
  id_tipo_movimiento: number;
  cantidad: number;
  referencia?: string;
  observaciones?: string;
  producto?: Producto;
  sucursal?: Sucursal;
  tipoMovimiento?: TipoMovimiento;
}
```

### Crédito

```typescript
interface Credito {
  id_credito: number;
  id_cliente: number;
  id_venta: number;
  monto_total: number;
  saldo_pendiente: number;
  fecha_inicio: Date;
  fecha_vencimiento: Date;
  cliente?: Cliente;
  venta?: Venta;
  pagos?: PagoCredito[];
}
```

### Pago de Crédito

```typescript
interface PagoCredito {
  id_pago: number;
  id_credito: number;
  fecha_pago: Date;
  monto_pagado: number;
  metodo_pago: string;
  observaciones?: string;
  credito?: Credito;
}
```

## Endpoints Disponibles

### Clientes

- **GET /clientes**: Obtener todos los clientes
- **GET /clientes/:id**: Obtener un cliente por ID
- **POST /clientes**: Crear un nuevo cliente
- **PUT /clientes/:id**: Actualizar un cliente existente
- **DELETE /clientes/:id**: Eliminar un cliente

### Productos

- **GET /productos**: Obtener todos los productos
- **GET /productos/:id**: Obtener un producto por ID
- **POST /productos**: Crear un nuevo producto
- **PUT /productos/:id**: Actualizar un producto existente
- **DELETE /productos/:id**: Eliminar un producto

### Ventas

- **GET /ventas**: Obtener todas las ventas
- **GET /ventas/:id**: Obtener una venta por ID
- **POST /ventas**: Crear una nueva venta
- **PUT /ventas/:id**: Actualizar una venta existente
- **DELETE /ventas/:id**: Eliminar una venta

### Inventario

- **GET /inventario**: Obtener todo el inventario
- **GET /inventario/:id**: Obtener un registro de inventario por ID
- **POST /inventario**: Crear un nuevo registro de inventario
- **PUT /inventario/:id**: Actualizar un registro de inventario existente
- **DELETE /inventario/:id**: Eliminar un registro de inventario

### Sucursales

- **GET /sucursales**: Obtener todas las sucursales
- **GET /sucursales/:id**: Obtener una sucursal por ID
- **POST /sucursales**: Crear una nueva sucursal
- **PUT /sucursales/:id**: Actualizar una sucursal existente
- **DELETE /sucursales/:id**: Eliminar una sucursal

### Créditos

- **GET /creditos**: Obtener todos los créditos
- **GET /creditos/:id**: Obtener un crédito por ID
- **POST /creditos**: Crear un nuevo crédito
- **PUT /creditos/:id**: Actualizar un crédito existente
- **DELETE /creditos/:id**: Eliminar un crédito

### Pagos de Crédito

- **GET /pagos-credito**: Obtener todos los pagos de crédito
- **GET /pagos-credito/:id**: Obtener un pago de crédito por ID
- **POST /pagos-credito**: Crear un nuevo pago de crédito
- **PUT /pagos-credito/:id**: Actualizar un pago de crédito existente
- **DELETE /pagos-credito/:id**: Eliminar un pago de crédito

### Traspasos

- **GET /traspasos**: Obtener todos los traspasos
- **GET /traspasos/:id**: Obtener un traspaso por ID
- **POST /traspasos**: Crear un nuevo traspaso
- **PUT /traspasos/:id**: Actualizar un traspaso existente
- **DELETE /traspasos/:id**: Eliminar un traspaso

### Movimientos de Inventario

- **GET /movimientos-inventario**: Obtener todos los movimientos de inventario
- **GET /movimientos-inventario/:id**: Obtener un movimiento de inventario por ID
- **POST /movimientos-inventario**: Crear un nuevo movimiento de inventario
- **PUT /movimientos-inventario/:id**: Actualizar un movimiento de inventario existente
- **DELETE /movimientos-inventario/:id**: Eliminar un movimiento de inventario

### Unidades de Medida

- **GET /unidades-medida**: Obtener todas las unidades de medida
- **GET /unidades-medida/:id**: Obtener una unidad de medida por ID
- **POST /unidades-medida**: Crear una nueva unidad de medida
- **PUT /unidades-medida/:id**: Actualizar una unidad de medida existente
- **DELETE /unidades-medida/:id**: Eliminar una unidad de medida

### Categorías

- **GET /categorias**: Obtener todas las categorías
- **GET /categorias/:id**: Obtener una categoría por ID
- **POST /categorias**: Crear una nueva categoría
- **PUT /categorias/:id**: Actualizar una categoría existente
- **DELETE /categorias/:id**: Eliminar una categoría

### Tipos de Pago

- **GET /tipos-pago**: Obtener todos los tipos de pago
- **GET /tipos-pago/:id**: Obtener un tipo de pago por ID
- **POST /tipos-pago**: Crear un nuevo tipo de pago
- **PUT /tipos-pago/:id**: Actualizar un tipo de pago existente
- **DELETE /tipos-pago/:id**: Eliminar un tipo de pago

### Tipos de Movimiento

- **GET /tipos-movimiento**: Obtener todos los tipos de movimiento
- **GET /tipos-movimiento/:id**: Obtener un tipo de movimiento por ID
- **POST /tipos-movimiento**: Crear un nuevo tipo de movimiento
- **PUT /tipos-movimiento/:id**: Actualizar un tipo de movimiento existente
- **DELETE /tipos-movimiento/:id**: Eliminar un tipo de movimiento

### Detalles de Venta

- **GET /detalle-ventas**: Obtener todos los detalles de venta
- **GET /detalle-ventas/:id**: Obtener un detalle de venta por ID
- **POST /detalle-ventas**: Crear un nuevo detalle de venta
- **PUT /detalle-ventas/:id**: Actualizar un detalle de venta existente
- **DELETE /detalle-ventas/:id**: Eliminar un detalle de venta

### Detalles de Traspaso

- **GET /detalle-traspaso**: Obtener todos los detalles de traspaso
- **GET /detalle-traspaso/:id**: Obtener un detalle de traspaso por ID
- **POST /detalle-traspaso**: Crear un nuevo detalle de traspaso
- **PUT /detalle-traspaso/:id**: Actualizar un detalle de traspaso existente
- **DELETE /detalle-traspaso/:id**: Eliminar un detalle de traspaso

## Ejemplos de Integración

### Ejemplo 1: Obtener y mostrar productos

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductosList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/productos');
        setProductos(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los productos: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Lista de Productos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.id_producto}>
              <td>{producto.id_producto}</td>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td>${producto.precio_venta.toFixed(2)}</td>
              <td>{producto.stock || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductosList;
```

### Ejemplo 2: Crear una nueva venta

```javascript
import React, { useState } from 'react';
import axios from 'axios';

const NuevaVenta = () => {
  const [formData, setFormData] = useState({
    id_cliente: '',
    id_sucursal: '',
    id_tipo_pago: '',
    observaciones: '',
    detalles: [
      {
        id_producto: '',
        cantidad: 1,
        precio_unitario: 0
      }
    ]
  });
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Cargar datos necesarios al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, productosRes, sucursalesRes, tiposPagoRes] = await Promise.all([
          axios.get('http://localhost:3000/api/clientes'),
          axios.get('http://localhost:3000/api/productos'),
          axios.get('http://localhost:3000/api/sucursales'),
          axios.get('http://localhost:3000/api/tipos-pago')
        ]);

        setClientes(clientesRes.data);
        setProductos(productosRes.data);
        setSucursales(sucursalesRes.data);
        setTiposPago(tiposPagoRes.data);
      } catch (err) {
        setError('Error al cargar los datos: ' + (err.response?.data?.message || err.message));
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDetalleChange = (index, field, value) => {
    const nuevosDetalles = [...formData.detalles];
    nuevosDetalles[index] = {
      ...nuevosDetalles[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      detalles: nuevosDetalles
    }));
  };

  const addDetalle = () => {
    setFormData(prev => ({
      ...prev,
      detalles: [
        ...prev.detalles,
        {
          id_producto: '',
          cantidad: 1,
          precio_unitario: 0
        }
      ]
    }));
  };

  const removeDetalle = (index) => {
    setFormData(prev => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Calcular subtotales y total
      const detallesConSubtotal = formData.detalles.map(detalle => ({
        ...detalle,
        subtotal: detalle.cantidad * detalle.precio_unitario
      }));

      const total = detallesConSubtotal.reduce((sum, detalle) => sum + detalle.subtotal, 0);

      const ventaData = {
        ...formData,
        fecha: new Date(),
        total,
        detalles: detallesConSubtotal
      };

      await axios.post('http://localhost:3000/api/ventas', ventaData);
      setSuccess(true);
      // Limpiar formulario
      setFormData({
        id_cliente: '',
        id_sucursal: '',
        id_tipo_pago: '',
        observaciones: '',
        detalles: [
          {
            id_producto: '',
            cantidad: 1,
            precio_unitario: 0
          }
        ]
      });
    } catch (err) {
      setError('Error al crear la venta: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Nueva Venta</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Venta creada exitosamente</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cliente:</label>
          <select 
            name="id_cliente" 
            value={formData.id_cliente} 
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Sucursal:</label>
          <select 
            name="id_sucursal" 
            value={formData.id_sucursal} 
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una sucursal</option>
            {sucursales.map(sucursal => (
              <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                {sucursal.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Tipo de Pago:</label>
          <select 
            name="id_tipo_pago" 
            value={formData.id_tipo_pago} 
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un tipo de pago</option>
            {tiposPago.map(tipo => (
              <option key={tipo.id_tipo_pago} value={tipo.id_tipo_pago}>
                {tipo.tipo_pago}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Observaciones:</label>
          <textarea 
            name="observaciones" 
            value={formData.observaciones} 
            onChange={handleChange}
          />
        </div>

        <h3>Detalles de la Venta</h3>
        {formData.detalles.map((detalle, index) => (
          <div key={index} className="detalle-venta">
            <div>
              <label>Producto:</label>
              <select 
                value={detalle.id_producto} 
                onChange={(e) => handleDetalleChange(index, 'id_producto', e.target.value)}
                required
              >
                <option value="">Seleccione un producto</option>
                {productos.map(producto => (
                  <option key={producto.id_producto} value={producto.id_producto}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Cantidad:</label>
              <input 
                type="number" 
                min="1" 
                value={detalle.cantidad} 
                onChange={(e) => handleDetalleChange(index, 'cantidad', parseInt(e.target.value))}
                required
              />
            </div>

            <div>
              <label>Precio Unitario:</label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                value={detalle.precio_unitario} 
                onChange={(e) => handleDetalleChange(index, 'precio_unitario', parseFloat(e.target.value))}
                required
              />
            </div>

            <button type="button" onClick={() => removeDetalle(index)}>Eliminar</button>
          </div>
        ))}

        <button type="button" onClick={addDetalle}>Agregar Producto</button>
        <button type="submit" disabled={loading}>
          {loading ? 'Procesando...' : 'Crear Venta'}
        </button>
      </form>
    </div>
  );
};

export default NuevaVenta;
```

## Consideraciones de Diseño

### Estructura de Carpetas Recomendada

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── clientes.js
│   │   ├── productos.js
│   │   ├── ventas.js
│   │   └── ...
│   ├── components/
│   │   ├── common/
│   │   ├── clientes/
│   │   ├── productos/
│   │   ├── ventas/
│   │   └── ...
│   ├── contexts/
│   ├── hooks/
│   ├── pages/
│   ├── utils/
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

### Organización de Componentes

Para cada entidad principal, se recomienda crear los siguientes componentes:

1. **Lista**: Para mostrar todos los registros
2. **Detalle**: Para mostrar un registro específico
3. **Formulario**: Para crear y editar registros
4. **Modal**: Para confirmaciones y acciones rápidas

### Manejo de Estado

Se recomienda utilizar un sistema de gestión de estado como Redux, Context API o Zustand para manejar el estado global de la aplicación, especialmente para:

- Datos de sesión
- Datos compartidos entre componentes
- Estado de carga y errores

## Solución de Problemas Comunes

### Error CORS

Si encuentras errores de CORS al consumir la API, asegúrate de que el backend tenga configurado correctamente el middleware de CORS:

```javascript
// En el backend
app.use(cors({
  origin: 'http://localhost:3001', // URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Errores de Validación

Para manejar errores de validación del backend, implementa un sistema de notificación en el frontend:

```javascript
const handleError = (error) => {
  if (error.response?.data?.errors) {
    // Errores de validación
    const validationErrors = error.response.data.errors;
    Object.keys(validationErrors).forEach(field => {
      setFieldError(field, validationErrors[field]);
    });
  } else {
    // Error general
    setGeneralError(error.response?.data?.message || 'Ha ocurrido un error');
  }
};
```

### Optimización de Rendimiento

Para mejorar el rendimiento de la aplicación:

1. Implementa paginación en las listas
2. Utiliza lazy loading para componentes pesados
3. Implementa caché para datos que no cambian frecuentemente
4. Utiliza memoización para evitar renderizados innecesarios

---

Este manual proporciona una guía general para integrar el frontend con el backend. Ajusta las recomendaciones según las necesidades específicas de tu proyecto y el framework que estés utilizando. 