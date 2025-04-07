import React, { useState } from 'react';
import ProductosList from '../components/productos/ProductosList';
import ProductoForm from '../components/productos/ProductoForm';
import InventarioForm from '../components/productos/InventarioForm';
import { Producto } from '../services/productosService';

const ProductosPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showInventarioForm, setShowInventarioForm] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | undefined>();
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleEdit = (producto: Producto) => {
    setSelectedProducto(producto);
    setShowForm(true);
  };

  const handleInventario = (producto: Producto) => {
    setSelectedProducto(producto);
    setShowInventarioForm(true);
  };

  const handleSuccess = (text?: string) => {
    setShowForm(false);
    setShowInventarioForm(false);
    setSelectedProducto(undefined);
    setMessage({ type: 'success', text: text || 'Operación realizada exitosamente' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleMessage = (newMessage: { type: 'success' | 'error' | 'info'; text: string }) => {
    setMessage(newMessage);
    if (newMessage.type === 'success') {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowInventarioForm(false);
    setSelectedProducto(undefined);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        {!showForm && !showInventarioForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Nuevo Producto
          </button>
        )}
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : message.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-yellow-50 text-yellow-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {showForm ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {selectedProducto ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <ProductoForm
            producto={selectedProducto}
            onSuccess={() => handleSuccess(selectedProducto 
              ? `El producto "${selectedProducto.nombre}" ha sido actualizado exitosamente`
              : 'El producto ha sido creado exitosamente'
            )}
            onCancel={handleCancel}
          />
        </div>
      ) : showInventarioForm && selectedProducto ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Gestionar Inventario</h2>
          <InventarioForm
            producto={selectedProducto}
            onSuccess={() => handleSuccess(`El inventario de "${selectedProducto.nombre}" ha sido actualizado exitosamente`)}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <ProductosList 
            onEdit={handleEdit} 
            onInventario={handleInventario}
            onMessage={handleMessage}
          />
        </div>
      )}
    </div>
  );
};

export default ProductosPage; 