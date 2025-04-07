import React, { useEffect, useState } from 'react';
import { getProductos, deleteProducto, Producto } from '../../services/productosService';
import ActionButtons from '../common/ActionButtons';
import ConfirmDialog from '../common/ConfirmDialog';

interface ProductosListProps {
  onEdit: (producto: Producto) => void;
  onInventario: (producto: Producto) => void;
  onMessage?: (message: { type: 'success' | 'error' | 'info'; text: string }) => void;
}

const ProductosList: React.FC<ProductosListProps> = ({ onEdit, onInventario, onMessage }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState<Producto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const data = await getProductos();
      setProductos(data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar los productos';
      setError(errorMessage);
      onMessage?.({ type: 'error', text: errorMessage });
      console.error('Error fetching productos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleDelete = async (producto: Producto) => {
    setProductoToDelete(producto);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (productoToDelete?.id_producto) {
      try {
        setLoading(true);
        setError(null);
        await deleteProducto(productoToDelete.id_producto);
        await fetchProductos();
        setShowDeleteDialog(false);
        onMessage?.({ 
          type: 'success', 
          text: `El producto "${productoToDelete.nombre}" ha sido eliminado exitosamente` 
        });
      } catch (err: any) {
        const errorMessage = err.message || 'Error al eliminar el producto';
        setError(errorMessage);
        onMessage?.({ 
          type: 'error', 
          text: errorMessage
        });
        console.error('Error deleting producto:', err);
        
        // Si el error es por restricción de clave foránea, sugerir desactivar el producto
        if (errorMessage.includes('está siendo utilizado en otras operaciones')) {
          onMessage?.({
            type: 'info',
            text: 'Sugerencia: En lugar de eliminar, puede desactivar el producto marcándolo como inactivo.'
          });
        }
        
        // Mantener el diálogo abierto solo si es un error que requiere acción del usuario
        if (!err.message?.includes('Error interno del servidor')) {
          setShowDeleteDialog(false);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredProductos = productos.filter((producto) => {
    const matchesSearch = 
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.numero_factura?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || producto.categoria?.nombre_categoria === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(productos.map(p => p.categoria?.nombre_categoria).filter(Boolean))];

  if (loading) return <div className="flex justify-center items-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>;

  // Vista de tarjetas para móviles
  const renderMobileCards = () => (
    <div className="grid grid-cols-1 gap-4 sm:hidden">
      {filteredProductos.map((producto) => (
        <div key={producto.id_producto} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-gray-900">{producto.nombre}</h3>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              (producto.stock_total || 0) <= producto.stock_minimo ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              Stock: {producto.stock_total || 0}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div>
              <span className="text-gray-500">Precio:</span> ${producto.precio_venta}
            </div>
            <div>
              <span className="text-gray-500">Costo:</span> ${producto.costo}
            </div>
            <div>
              <span className="text-gray-500">Unidad:</span> {producto.unidadMedida?.unidad || '-'}
            </div>
            <div>
              <span className="text-gray-500">Categoría:</span> {producto.categoria?.nombre_categoria || '-'}
            </div>
            <div>
              <span className="text-gray-500">Sucursal:</span> {producto.sucursal?.nombre || '-'}
            </div>
            <div>
              <span className="text-gray-500">Factura:</span> {producto.numero_factura || '-'}
            </div>
            <div>
              <span className="text-gray-500">Stock Mínimo:</span> {producto.stock_minimo || 0}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 border-t pt-2">
            <button
              onClick={() => onEdit(producto)}
              className="p-1 text-indigo-600 hover:text-indigo-900"
              aria-label="Editar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => onInventario(producto)}
              className="p-1 text-blue-600 hover:text-blue-900"
              aria-label="Inventario"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </button>
            <button
              onClick={() => handleDelete(producto)}
              className="p-1 text-red-600 hover:text-red-900"
              aria-label="Eliminar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Buscar por nombre o número de factura..."
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Vista de tarjetas para móviles */}
      {renderMobileCards()}

      {/* Tabla de productos (visible solo en pantallas medianas y grandes) */}
      <div className="hidden sm:block">
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Stock Mín.
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Precio Venta
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Costo
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Unidad
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Categoría
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Sucursal
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Factura
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProductos.map((producto) => (
                      <tr key={producto.id_producto} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{producto.nombre}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            (producto.stock_total || 0) <= producto.stock_minimo ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {producto.stock_total || 0}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm hidden md:table-cell">{producto.stock_minimo || 0}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm hidden md:table-cell">${producto.precio_venta}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm hidden md:table-cell">${producto.costo}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm hidden md:table-cell">{producto.unidadMedida?.unidad}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm hidden md:table-cell">{producto.categoria?.nombre_categoria}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm hidden md:table-cell">{producto.sucursal?.nombre || '-'}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm hidden md:table-cell">{producto.numero_factura || '-'}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => onEdit(producto)}
                              className="text-indigo-600 hover:text-indigo-900"
                              aria-label="Editar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => onInventario(producto)}
                              className="text-blue-600 hover:text-blue-900"
                              aria-label="Inventario"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(producto)}
                              className="text-red-600 hover:text-red-900"
                              aria-label="Eliminar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Eliminar Producto"
        message={`¿Está seguro que desea eliminar el producto "${productoToDelete?.nombre}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default ProductosList; 