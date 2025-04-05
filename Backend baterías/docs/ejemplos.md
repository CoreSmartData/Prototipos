# Ejemplos de Uso de la API

## Categorías

### Crear una nueva categoría
```http
POST /api/categorias
Content-Type: application/json

{
  "nombre": "Baterías Automotrices",
  "descripcion": "Baterías para vehículos automotores",
  "activo": true
}
```

### Obtener todas las categorías
```http
GET /api/categorias
```

## Productos

### Crear un nuevo producto
```http
POST /api/productos
Content-Type: application/json

{
  "codigo": "BAT-001",
  "nombre": "Batería 12V 60AH",
  "descripcion": "Batería de plomo ácido para automóviles",
  "precio_compra": 1500.00,
  "precio_venta": 2000.00,
  "stock_minimo": 5,
  "activo": true,
  "categoria": {
    "id_categoria": 1
  },
  "unidad_medida": {
    "id_unidad": 1
  }
}
```

### Obtener productos por categoría
```http
GET /api/productos/categoria/1
```

## Inventario

### Crear un registro de inventario
```http
POST /api/inventario
Content-Type: application/json

{
  "stock": 10,
  "producto": {
    "id_producto": 1
  },
  "sucursal": {
    "id_sucursal": 1
  }
}
```

### Actualizar stock
```http
PUT /api/inventario/1/sucursal/1/stock
Content-Type: application/json

{
  "stock": 15
}
```

## Ventas

### Crear una nueva venta
```http
POST /api/ventas
Content-Type: application/json

{
  "fecha": "2024-03-20T10:00:00Z",
  "total": 4000.00,
  "cliente": {
    "id_cliente": 1
  },
  "sucursal": {
    "id_sucursal": 1
  },
  "tipo_pago": {
    "id_tipo_pago": 1
  },
  "detalles": [
    {
      "cantidad": 2,
      "precio_unitario": 2000.00,
      "producto": {
        "id_producto": 1
      }
    }
  ]
}
```

### Obtener ventas por cliente
```http
GET /api/ventas/cliente/1
```

## Movimientos de Inventario

### Crear un movimiento de inventario
```http
POST /api/movimientos-inventario
Content-Type: application/json

{
  "id_producto": 1,
  "id_sucursal": 1,
  "id_tipo_movimiento": 1,
  "cantidad": 5,
  "referencia": "Compra inicial",
  "observaciones": "Stock inicial"
}
```

### Obtener movimientos por sucursal
```http
GET /api/movimientos-inventario/sucursal/1
```

## Respuestas de Error

### Error 404 - Recurso no encontrado
```json
{
  "status": "error",
  "message": "Recurso no encontrado",
  "code": 404
}
```

### Error 400 - Datos inválidos
```json
{
  "status": "error",
  "message": "Datos de entrada inválidos",
  "code": 400,
  "errors": [
    {
      "field": "precio_venta",
      "message": "El precio de venta debe ser mayor que 0"
    }
  ]
}
```

### Error 500 - Error interno del servidor
```json
{
  "status": "error",
  "message": "Error interno del servidor",
  "code": 500
}
``` 