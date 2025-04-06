import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Producto, updateStock } from '../../services/productosService';

interface InventarioFormProps {
  producto: Producto;
  onSuccess: () => void;
  onCancel: () => void;
}

const schema = yup.object().shape({
  stock: yup.number().required('El stock es requerido').min(0, 'El stock no puede ser negativo'),
  id_sucursal: yup.number().required('La sucursal es requerida')
});

const InventarioForm: React.FC<InventarioFormProps> = ({ producto, onSuccess, onCancel }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      stock: 0,
      id_sucursal: 1 // Sucursal por defecto
    }
  });

  const onSubmit = async (data: { stock: number; id_sucursal: number }) => {
    try {
      setLoading(true);
      setError(null);

      await updateStock(producto.id_producto!, data.stock, data.id_sucursal);
      onSuccess();
    } catch (err) {
      setError('Error al actualizar el stock');
      console.error('Error updating stock:', err);
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

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Actualizar Inventario: {producto.nombre}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Stock actual: {producto.stock_total || 0} | Stock mínimo: {producto.stock_minimo}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          {...register('stock')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sucursal</label>
        <select
          {...register('id_sucursal')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value={1}>Sucursal Principal</option>
          {/* Aquí se podrían cargar las sucursales desde un servicio */}
        </select>
        {errors.id_sucursal && <p className="mt-1 text-sm text-red-500">{errors.id_sucursal.message}</p>}
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
          {loading ? 'Guardando...' : 'Actualizar Stock'}
        </button>
      </div>
    </form>
  );
};

export default InventarioForm; 