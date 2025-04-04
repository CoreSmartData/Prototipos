import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface Purchase {
  id: string;
  date: string;
  supplier: string;
  products: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'ordered' | 'in_transit' | 'received' | 'cancelled';
  expectedDeliveryDate?: string;
  trackingNumber?: string;
}

interface PurchaseFormData {
  supplier: string;
  products: {
    name: string;
    quantity: number;
    price: number;
  }[];
  expectedDeliveryDate?: string;
  trackingNumber?: string;
}

const schema = yup.object().shape({
  supplier: yup.string().required('El proveedor es requerido'),
  products: yup.array().of(
    yup.object().shape({
      name: yup.string().required('El producto es requerido'),
      quantity: yup.number().required('La cantidad es requerida').min(1, 'La cantidad debe ser mayor a 0'),
      price: yup.number().required('El precio es requerido').min(0, 'El precio no puede ser negativo'),
    })
  ).min(1, 'Debe agregar al menos un producto'),
  expectedDeliveryDate: yup.date(),
  trackingNumber: yup.string(),
});

// Datos de ejemplo
const initialPurchases: Purchase[] = [
  {
    id: '1',
    date: '2024-03-20',
    supplier: 'Proveedor 1',
    products: [
      { name: 'Producto 1', quantity: 10, price: 99.99 },
      { name: 'Producto 2', quantity: 5, price: 149.99 },
    ],
    total: 1749.85,
    status: 'in_transit',
    expectedDeliveryDate: '2024-03-25',
    trackingNumber: 'TRK123456',
  },
  {
    id: '2',
    date: '2024-03-19',
    supplier: 'Proveedor 2',
    products: [
      { name: 'Producto 3', quantity: 15, price: 79.99 },
    ],
    total: 1199.85,
    status: 'pending',
    expectedDeliveryDate: '2024-03-24',
  },
];

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: PurchaseFormData) => {
    const newPurchase: Purchase = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      ...data,
      total: data.products.reduce((sum, product) => sum + (product.quantity * product.price), 0),
      status: 'pending',
    };
    setPurchases([newPurchase, ...purchases]);
    setIsModalOpen(false);
    reset();
  };

  const updatePurchaseStatus = (purchaseId: string, newStatus: Purchase['status']) => {
    setPurchases(purchases.map(purchase => 
      purchase.id === purchaseId ? { ...purchase, status: newStatus } : purchase
    ));
  };

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch = purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Purchase['status']) => {
    switch (status) {
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'ordered':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Purchase['status']) => {
    switch (status) {
      case 'received':
        return 'Recibido';
      case 'in_transit':
        return 'En Tránsito';
      case 'ordered':
        return 'Ordenado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Compras</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de órdenes de compra y seguimiento de entregas
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Nueva Orden de Compra
        </button>
      </div>

      {/* Filtros */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Buscar por proveedor o número de seguimiento..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="ordered">Ordenados</option>
          <option value="in_transit">En Tránsito</option>
          <option value="received">Recibidos</option>
          <option value="cancelled">Cancelados</option>
        </select>
      </div>

      {/* Tabla de compras */}
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Proveedor
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Producto
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Cantidad
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Costo
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Factura
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Fecha
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Estado
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredPurchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {purchase.supplier}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {purchase.products.map((product) => product.name).join(', ')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {purchase.products.map((product) => product.quantity).join(', ')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${purchase.total.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {purchase.trackingNumber || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {purchase.date}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(purchase.status)}`}>
                          {getStatusText(purchase.status)}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-primary-600 hover:text-primary-900 mr-3">
                          Editar
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de nueva orden de compra */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Proveedor
                    </label>
                    <input
                      type="text"
                      {...register('supplier')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    {errors.supplier && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.supplier.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Productos
                    </label>
                    <div className="space-y-2">
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            {...register(`products.${index - 1}.name`)}
                            placeholder="Nombre del producto"
                            className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                          <input
                            type="number"
                            {...register(`products.${index - 1}.quantity`)}
                            placeholder="Cantidad"
                            className="w-24 block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                          <input
                            type="number"
                            step="0.01"
                            {...register(`products.${index - 1}.price`)}
                            placeholder="Precio"
                            className="w-32 block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                      ))}
                    </div>
                    {errors.products && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.products.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Fecha de Entrega Esperada
                    </label>
                    <input
                      type="date"
                      {...register('expectedDeliveryDate')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    {errors.expectedDeliveryDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.expectedDeliveryDate.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Número de Seguimiento
                    </label>
                    <input
                      type="text"
                      {...register('trackingNumber')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    {errors.trackingNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.trackingNumber.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Crear Orden de Compra
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 