import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  ClipboardDocumentListIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  // ... existing code ...

  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ... existing cards ... */}
      </div>

      {/* Gráfica de Ventas por Categoría */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Categoría</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ventas" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfica de Ventas por Mes y Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica de Ventas por Mes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Mes</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ventas" stroke="#4F46E5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <ClockIcon className="h-4 w-4 text-primary-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 