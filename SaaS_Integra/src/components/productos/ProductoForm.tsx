import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  getUnidadesMedida,
  getCategorias,
  createProducto,
  updateProducto,
  Producto,
  UnidadMedida,
  Categoria
} from '../../services/productosService';

interface ProductoFormProps {
  producto?: Producto;
  onSuccess: () => void;
  onCancel: () => void;
}

const schema = yup.object().shape({
  nombre: yup.string().required('El nombre es requerido'),
  descripcion: yup.string().required('La descripción es requerida'),
  precio_venta: yup.number().required('El precio de venta es requerido').min(0, 'El precio debe ser mayor a 0'),
  costo: yup.number().required('El costo es requerido').min(0, 'El costo debe ser mayor a 0'),
  id_unidad: yup.number().required('La unidad es requerida'),
  id_categoria: yup.number().required('La categoría es requerida'),
  activo: yup.boolean().default(true),
  sku: yup.string().required('El SKU es requerido'),
  stock_minimo: yup.number().required('El stock mínimo es requerido').min(0, 'El stock mínimo no puede ser negativo'),
  numero_factura: yup.string()
});

const ProductoForm: React.FC<ProductoFormProps> = ({ producto, onSuccess, onCancel }) => {
  const [unidades, setUnidades] = useState<UnidadMedida[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: producto || {
      nombre: '',
      descripcion: '',
      precio_venta: 0,
      costo: 0,
      id_unidad: undefined,
      id_categoria: undefined,
      activo: true,
      sku: '',
      stock_minimo: 0,
      numero_factura: ''
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [unidadesData, categoriasData] = await Promise.all([
          getUnidadesMedida(),
          getCategorias()
        ]);
        
        console.log('Datos de unidades obtenidos del servidor:', unidadesData);
        setUnidades(unidadesData);
        setCategorias(categoriasData);
        
      } catch (err) {
        console.error('Error detallado al obtener unidades:', err);
        setError('No se pudo conectar con el servidor. Por favor, verifica que el servidor backend esté corriendo en http://localhost:3000');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: Omit<Producto, 'id_producto'>) => {
    try {
      setLoading(true);
      setError(null);

      if (producto?.id_producto) {
        await updateProducto(producto.id_producto, data);
      } else {
        await createProducto(data);
      }

      onSuccess();
    } catch (err) {
      setError('Error al guardar el producto');
      console.error('Error saving producto:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">Cargando datos...</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            {...register('nombre')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            {...register('sku')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          {errors.sku && <p className="mt-1 text-sm text-red-500">{errors.sku.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          {...register('descripcion')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.descripcion && <p className="mt-1 text-sm text-red-500">{errors.descripcion.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio de Venta</label>
          <input
            type="number"
            step="0.01"
            {...register('precio_venta')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          {errors.precio_venta && <p className="mt-1 text-sm text-red-500">{errors.precio_venta.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Costo</label>
          <input
            type="number"
            step="0.01"
            {...register('costo')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          {errors.costo && <p className="mt-1 text-sm text-red-500">{errors.costo.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Stock Mínimo</label>
        <input
          type="number"
          {...register('stock_minimo')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.stock_minimo && <p className="mt-1 text-sm text-red-500">{errors.stock_minimo.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Unidad de Medida</label>
          <select
            {...register('id_unidad')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">Seleccione una unidad</option>
            {unidades.map((unidad) => (
              <option key={unidad.id_unidad} value={unidad.id_unidad}>
                {unidad.unidad}
              </option>
            ))}
          </select>
          {errors.id_unidad && <p className="mt-1 text-sm text-red-500">{errors.id_unidad.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            {...register('id_categoria')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.nombre_categoria}
              </option>
            ))}
          </select>
          {errors.id_categoria && <p className="mt-1 text-sm text-red-500">{errors.id_categoria.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Número de Factura</label>
        <input
          type="text"
          {...register('numero_factura')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.numero_factura && <p className="mt-1 text-sm text-red-500">{errors.numero_factura.message}</p>}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('activo')}
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label className="ml-2 block text-sm text-gray-900">Activo</label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : producto ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default ProductoForm; 