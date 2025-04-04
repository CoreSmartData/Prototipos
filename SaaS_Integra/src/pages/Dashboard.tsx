import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Datos de ejemplo para los KPIs
const kpis = [
  { name: 'Ventas Totales', value: '$45,231', change: '+20.1%' },
  { name: 'Pedidos Pendientes', value: '12', change: '-2.3%' },
  { name: 'Stock Bajo', value: '5', change: '+3.2%' },
  { name: 'Clientes Activos', value: '234', change: '+12.5%' },
];

// Datos de ejemplo para el gráfico de ventas
const salesData = [
  { name: 'Ene', ventas: 4000 },
  { name: 'Feb', ventas: 3000 },
  { name: 'Mar', ventas: 5000 },
  { name: 'Abr', ventas: 4500 },
  { name: 'May', ventas: 6000 },
  { name: 'Jun', ventas: 5500 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vista general de las operaciones de la empresa
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-500 p-3">
                <div className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {kpi.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{kpi.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  kpi.change.startsWith('+')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {kpi.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Gráfico de Ventas */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Ventas por Mes
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventas" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">
            Actividad Reciente
          </h2>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((item) => (
              <li key={item} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-primary-600 truncate">
                    Nueva venta registrada
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completado
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Cliente: Cliente {item}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      Monto: ${Math.floor(Math.random() * 1000)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Hace {Math.floor(Math.random() * 24)} horas
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 