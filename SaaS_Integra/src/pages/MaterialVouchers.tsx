import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface Voucher {
  id: string;
  date: string;
  requester: string;
  department: string;
  materials: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes?: string;
}

interface VoucherFormData {
  requester: string;
  department: string;
  materials: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  notes?: string;
}

const schema = yup.object().shape({
  requester: yup.string().required('El solicitante es requerido'),
  department: yup.string().required('El departamento es requerido'),
  materials: yup.array().of(
    yup.object().shape({
      name: yup.string().required('El material es requerido'),
      quantity: yup.number().required('La cantidad es requerida').min(1, 'La cantidad debe ser mayor a 0'),
      unit: yup.string().required('La unidad es requerida'),
    })
  ).min(1, 'Debe agregar al menos un material'),
  notes: yup.string(),
});

// Datos de ejemplo
const initialVouchers: Voucher[] = [
  {
    id: '1',
    date: '2024-03-20',
    requester: 'Juan Pérez',
    department: 'Producción',
    materials: [
      { name: 'Tornillos M4', quantity: 100, unit: 'pzas' },
      { name: 'Cable Eléctrico', quantity: 5, unit: 'm' },
    ],
    status: 'approved',
    notes: 'Para mantenimiento preventivo',
  },
  {
    id: '2',
    date: '2024-03-19',
    requester: 'María García',
    department: 'Mantenimiento',
    materials: [
      { name: 'Pintura Industrial', quantity: 2, unit: 'L' },
    ],
    status: 'pending',
    notes: 'Para pintura de maquinaria',
  },
];

export default function MaterialVouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VoucherFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: VoucherFormData) => {
    const newVoucher: Voucher = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      ...data,
      status: 'pending',
    };
    setVouchers([newVoucher, ...vouchers]);
    setIsModalOpen(false);
    reset();
  };

  const updateVoucherStatus = (voucherId: string, newStatus: Voucher['status']) => {
    setVouchers(vouchers.map(voucher => 
      voucher.id === voucherId ? { ...voucher, status: newStatus } : voucher
    ));
  };

  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch = voucher.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || voucher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Voucher['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Voucher['status']) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'approved':
        return 'Aprobado';
      case 'pending':
        return 'Pendiente';
      case 'rejected':
        return 'Rechazado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vales de Material</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de solicitudes de materiales y seguimiento de entregas
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Nuevo Vale
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
            placeholder="Buscar por solicitante o departamento..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobados</option>
          <option value="rejected">Rechazados</option>
          <option value="completed">Completados</option>
        </select>
      </div>

      {/* Tabla de vales */}
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Número
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Departamento
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Material
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Cantidad
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
                  {filteredVouchers.map((voucher) => (
                    <tr key={voucher.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {voucher.number}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {voucher.department}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {voucher.material}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {voucher.quantity}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {voucher.date}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {voucher.status}
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

      {/* Modal de nuevo vale */}
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
                      Solicitante
                    </label>
                    <input
                      type="text"
                      {...register('requester')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    {errors.requester && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.requester.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Departamento
                    </label>
                    <input
                      type="text"
                      {...register('department')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    {errors.department && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.department.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Materiales
                    </label>
                    <div className="space-y-2">
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            {...register(`materials.${index - 1}.name`)}
                            placeholder="Nombre del material"
                            className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                          <input
                            type="number"
                            {...register(`materials.${index - 1}.quantity`)}
                            placeholder="Cantidad"
                            className="w-24 block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                          <input
                            type="text"
                            {...register(`materials.${index - 1}.unit`)}
                            placeholder="Unidad"
                            className="w-24 block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                      ))}
                    </div>
                    {errors.materials && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.materials.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Notas
                    </label>
                    <textarea
                      {...register('notes')}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    {errors.notes && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.notes.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Crear Vale
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