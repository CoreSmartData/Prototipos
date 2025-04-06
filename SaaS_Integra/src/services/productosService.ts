import api from '../config/api';

export interface Producto {
  id_producto?: number;
  nombre: string;
  descripcion: string;
  precio_venta: number;
  costo: number;
  id_unidad: number;
  id_categoria: number;
  activo: boolean;
  sku: string;
  stock_minimo: number;
  stock_total?: number;
  numero_factura?: string;
  unidadMedida?: {
    id_unidad: number;
    unidad: string;
  };
  categoria?: {
    id_categoria: number;
    nombre_categoria: string;
  };
}

export interface UnidadMedida {
  id_unidad: number;
  unidad: string;
}

export interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

// Obtener todas las unidades de medida
export const getUnidadesMedida = async (): Promise<UnidadMedida[]> => {
  try {
    console.log('Llamando a /unidades-medida...');
    const response = await api.get('/unidades-medida');
    console.log('Respuesta del servidor para unidades:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error detallado al obtener unidades de medida:', error);
    throw new Error('No se pudieron cargar las unidades de medida. Por favor, verifica la conexión con el servidor.');
  }
};

// Obtener todas las categorías
export const getCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await api.get('/categorias');
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw new Error('No se pudieron cargar las categorías. Por favor, verifica la conexión con el servidor.');
  }
};

// Obtener todos los productos
export const getProductos = async (): Promise<Producto[]> => {
  try {
    const response = await api.get('/productos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw new Error('No se pudieron cargar los productos. Por favor, verifica la conexión con el servidor.');
  }
};

// Obtener un producto por ID
export const getProductoById = async (id: number): Promise<Producto> => {
  try {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    throw new Error('No se pudo cargar el producto. Por favor, verifica la conexión con el servidor.');
  }
};

// Crear un nuevo producto
export const createProducto = async (producto: Omit<Producto, 'id_producto'>): Promise<Producto> => {
  try {
    const response = await api.post('/productos', producto);
    return response.data;
  } catch (error) {
    console.error('Error al crear el producto:', error);
    throw new Error('No se pudo crear el producto. Por favor, verifica los datos e intenta nuevamente.');
  }
};

// Actualizar un producto existente
export const updateProducto = async (id: number, producto: Partial<Producto>): Promise<Producto> => {
  try {
    const response = await api.put(`/productos/${id}`, producto);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    throw new Error('No se pudo actualizar el producto. Por favor, verifica los datos e intenta nuevamente.');
  }
};

// Eliminar un producto
export const deleteProducto = async (id: number): Promise<void> => {
  try {
    await api.delete(`/productos/${id}`);
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    throw new Error('No se pudo eliminar el producto. Por favor, intenta nuevamente.');
  }
};

// Actualizar el stock de un producto
export const updateStock = async (id: number, stock: number, id_sucursal: number): Promise<Producto> => {
  try {
    const response = await api.patch(`/productos/${id}/stock`, { stock, id_sucursal });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el stock:', error);
    throw new Error('No se pudo actualizar el stock. Por favor, intenta nuevamente.');
  }
}; 