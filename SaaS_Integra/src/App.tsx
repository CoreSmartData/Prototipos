import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Orders from './pages/Orders';
import Purchases from './pages/Purchases';
import MaterialVouchers from './pages/MaterialVouchers';
import ProductosPage from './pages/ProductosPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './hooks/useAuth';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';

const queryClient = new QueryClient();

// Configuración del router con la bandera v7_startTransition habilitada
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="sales" element={<Sales />} />
        <Route path="orders" element={<Orders />} />
        <Route path="purchases" element={<Purchases />} />
        <Route path="material-vouchers" element={<MaterialVouchers />} />
      </Route>
    </>
  ),
  {
    future: {
      v7_startTransition: true
    }
  }
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App; 