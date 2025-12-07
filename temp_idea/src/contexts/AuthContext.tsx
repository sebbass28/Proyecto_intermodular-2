import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '../utils/api';

// Este es un contexto (como una caja mágica) que guarda información del usuario
// en toda la aplicación sin tener que pasarla manualmente a cada componente

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 Cuando la app carga, verificamos si hay una sesión activa
  useEffect(() => {
    checkAuth();
  }, []);

  // Función para verificar si el usuario ya está logueado
  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      try {
        // Intentamos obtener los datos del usuario del backend
        const userData = await api.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        // Si falla, limpiamos el token
        localStorage.removeItem('auth_token');
      }
    }
    
    setIsLoading(false);
  };

  // Función para hacer login (AHORA LLAMA AL BACKEND REAL)
  const login = async (email: string, password: string, name?: string) => {
    try {
      let userData;
      
      // Si viene un "name", significa que es un registro, si no es login
      if (name) {
        userData = await api.register(name, email, password);
      } else {
        userData = await api.login(email, password);
      }
      
      setUser(userData.user || userData);
      return userData;
    } catch (error) {
      console.error('Error en login/registro:', error);
      throw error;
    }
  };

  // Función para hacer logout (AHORA LLAMA AL BACKEND REAL)
  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  // Mientras carga, puedes mostrar un spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}