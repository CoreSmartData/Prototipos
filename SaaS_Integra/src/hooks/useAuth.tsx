import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../config/api';

interface User {
  id: number;
  email: string;
  nombre: string;
  rol: 'admin' | 'vendedor' | 'inventario';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verificar el token y obtener la información del usuario
      api.get('/usuarios/me')
        .then(response => {
          console.log('Usuario autenticado:', response.data);
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Error al verificar token:', error);
          // Si hay error, limpiar el token
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Enviando solicitud de login a:', `${api.defaults.baseURL}/usuarios/login`);
      const response = await api.post('/usuarios/login', { email, password });
      console.log('Respuesta del servidor:', response.data);
      
      const { usuario, token } = response.data;
      
      // Guardar el token en localStorage
      localStorage.setItem('token', token);
      
      // Configurar el token en los headers de axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(usuario);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
} 