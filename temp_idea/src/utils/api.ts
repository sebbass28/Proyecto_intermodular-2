/**
 * 🌐 API Service - Conexión con el Backend
 * 
 * Este archivo es como un "mensajero" que habla con tu servidor en localhost:4000
 * Todas las funciones aquí hacen llamadas HTTP (GET, POST, PUT, DELETE) a tu backend
 * 
 * 🎯 MODO DEMO: Si el backend no está disponible, usa datos de ejemplo automáticamente
 */

import { publicAnonKey } from './supabase/info';

// 📍 Aquí pones la dirección de tu backend
const API_URL = 'https://dtajmblqdjcnfuxkukzi.supabase.co';
const API_PREFIX = '/functions/v1/make-server-5016f3b0';

// 🎭 Variable para controlar si está en modo demo
let isDemoMode = false;

// 🎨 Datos de ejemplo para modo demo
const demoTransactions = [
  { id: '1', type: 'income', category: '💼 Salario', amount: 3500, description: 'Pago mensual', date: '2025-10-01' },
  { id: '2', type: 'expense', category: '🍔 Comida', amount: -85, description: 'Supermercado', date: '2025-10-03' },
  { id: '3', type: 'expense', category: '🚗 Transporte', amount: -45, description: 'Gasolina', date: '2025-10-05' },
  { id: '4', type: 'income', category: '💰 Freelance', amount: 750, description: 'Proyecto web', date: '2025-10-07' },
  { id: '5', type: 'expense', category: '🎬 Entretenimiento', amount: -120, description: 'Netflix y cine', date: '2025-10-08' },
  { id: '6', type: 'expense', category: '🏠 Casa', amount: -800, description: 'Renta mensual', date: '2025-10-10' },
];

const demoBudgets = [
  { id: '1', category: '🍔 Comida', spent: 450, limit: 600 },
  { id: '2', category: '🚗 Transporte', spent: 180, limit: 200 },
  { id: '3', category: '🎬 Entretenimiento', spent: 120, limit: 300 },
  { id: '4', category: '🏠 Casa', spent: 800, limit: 1000 },
];

/**
 * Detecta si el backend está disponible
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 segundos timeout
    
    const response = await fetch(`${API_URL}${API_PREFIX}/health`, {
      method: 'GET',
      signal: controller.signal,
    }).catch(() => null);
    
    clearTimeout(timeoutId);
    
    if (response && response.ok) {
      isDemoMode = false;
      return true;
    }
    
    isDemoMode = true;
    return false;
  } catch (error) {
    isDemoMode = true;
    return false;
  }
}

/**
 * Verifica si está en modo demo
 */
export function isInDemoMode(): boolean {
  return isDemoMode;
}

/**
 * Función helper para hacer peticiones HTTP
 * Es como un "asistente" que se encarga de los detalles técnicos
 */
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  // Obtenemos el token de autenticación si existe (lo guardamos en localStorage)
  const token = localStorage.getItem('auth_token');
  
  // Configuramos los headers (como "etiquetas" que le decimos al servidor)
  const headers: HeadersInit = {
    'Content-Type': 'application/json', // Le decimos que enviamos JSON
    'Authorization': `Bearer ${publicAnonKey}`, // API key de Supabase (siempre requerida)
    ...(token && { 'X-User-Token': token }), // Token del usuario (si existe)
    ...options.headers,
  };

  try {
    // Timeout de 5 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Hacemos la petición al servidor con el prefijo correcto
    const response = await fetch(`${API_URL}${API_PREFIX}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    // Si el servidor responde con error, lanzamos una excepción
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(error.message || `Error ${response.status}`);
    }

    // Si todo va bien, devolvemos los datos en formato JSON
    return await response.json();
  } catch (error: any) {
    // Si es un error de conexión, activar modo demo
    if (error.name === 'AbortError' || error.message.includes('fetch') || error.message.includes('Network')) {
      isDemoMode = true;
      // Solo mostrar mensaje si no estábamos ya en modo demo
      if (!isDemoMode) {
        console.log('💡 Backend no detectado - Modo DEMO activo');
      }
      throw new Error('BACKEND_UNAVAILABLE');
    }
    
    // Solo mostrar error si NO es de conexión
    console.error('❌ Error en API:', error);
    throw error;
  }
}

// ========================================
// 🔐 AUTENTICACIÓN
// ========================================

/**
 * Login - Iniciar sesión (con modo demo como fallback)
 * @param email - Tu correo
 * @param password - Tu contraseña
 * @returns Datos del usuario y token de autenticación
 */
export async function login(email: string, password: string) {
  try {
    const data = await fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Guardamos el token en localStorage para futuras peticiones
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    return data;
  } catch (error: any) {
    // Si el backend no está disponible, usar modo demo
    if (error.message === 'BACKEND_UNAVAILABLE') {
      // Silencioso en modo demo - el banner ya lo indica
      
      // Simular un delay como si fuera una llamada real
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Crear usuario demo
      const demoToken = 'demo-token-' + Date.now();
      const demoUser = {
        id: '1',
        name: email.split('@')[0] || 'Usuario Demo',
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random`
      };
      
      localStorage.setItem('auth_token', demoToken);
      localStorage.setItem('demo_mode', 'true');
      
      return { user: demoUser, token: demoToken };
    }
    throw error;
  }
}

/**
 * Register - Registrarse (con modo demo como fallback)
 * @param name - Tu nombre
 * @param email - Tu correo
 * @param password - Tu contraseña
 * @param additionalData - Datos adicionales opcionales (phone, country, currency, etc)
 */
export async function register(
  name: string, 
  email: string, 
  password: string,
  additionalData?: {
    phone?: string;
    country?: string;
    currency?: string;
    monthlyIncome?: number;
    receiveNotifications?: boolean;
  }
) {
  try {
    const data = await fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ 
        name, 
        email, 
        password,
        ...additionalData 
      }),
    });
  
    // Guardamos el token
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    return data;
  } catch (error: any) {
    // Si el backend no está disponible, usar modo demo
    if (error.message === 'BACKEND_UNAVAILABLE') {
      // Silencioso en modo demo - el banner ya lo indica
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const demoToken = 'demo-token-' + Date.now();
      const demoUser = {
        id: '1',
        name: name,
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      };
      
      localStorage.setItem('auth_token', demoToken);
      localStorage.setItem('demo_mode', 'true');
      
      return { user: demoUser, token: demoToken };
    }
    throw error;
  }
}

/**
 * Logout - Cerrar sesión
 */
export async function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('demo_mode');
  // Opcionalmente puedes llamar al backend si tiene un endpoint de logout
  // await fetchAPI('/api/auth/logout', { method: 'POST' });
}

/**
 * Obtener el perfil del usuario actual
 */
export async function getCurrentUser() {
  try {
    return await fetchAPI('/api/auth/me');
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      // En modo demo, devolver usuario desde localStorage
      const token = localStorage.getItem('auth_token');
      if (token && token.startsWith('demo-token')) {
        return {
          id: '1',
          name: 'Usuario Demo',
          email: 'demo@financeflow.com',
          avatar: 'https://ui-avatars.com/api/?name=Demo&background=random'
        };
      }
    }
    throw error;
  }
}

// ========================================
// 💳 TRANSACCIONES
// ========================================

/**
 * Obtener todas las transacciones
 */
export async function getTransactions() {
  try {
    return await fetchAPI('/api/transactions');
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return demoTransactions;
    }
    throw error;
  }
}

/**
 * Crear una nueva transacción
 */
export async function createTransaction(transaction: {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
}) {
  try {
    return await fetchAPI('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newTransaction = {
        id: String(demoTransactions.length + 1),
        ...transaction,
        amount: transaction.type === 'expense' ? -Math.abs(transaction.amount) : Math.abs(transaction.amount)
      };
      demoTransactions.push(newTransaction);
      return newTransaction;
    }
    throw error;
  }
}

/**
 * Actualizar una transacción
 */
export async function updateTransaction(id: string, transaction: any) {
  try {
    return await fetchAPI(`/api/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    throw error;
  }
}

/**
 * Eliminar una transacción
 */
export async function deleteTransaction(id: string) {
  try {
    return await fetchAPI(`/api/transactions/${id}`, {
      method: 'DELETE',
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = demoTransactions.findIndex(t => t.id === id);
      if (index > -1) {
        demoTransactions.splice(index, 1);
      }
      return { success: true };
    }
    throw error;
  }
}

// ========================================
// 🎯 PRESUPUESTOS
// ========================================

/**
 * Obtener todos los presupuestos
 */
export async function getBudgets() {
  try {
    return await fetchAPI('/api/budgets');
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return demoBudgets;
    }
    throw error;
  }
}

/**
 * Crear un nuevo presupuesto
 */
export async function createBudget(budget: {
  category: string;
  limit: number;
}) {
  try {
    return await fetchAPI('/api/budgets', {
      method: 'POST',
      body: JSON.stringify(budget),
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newBudget = {
        id: String(demoBudgets.length + 1),
        ...budget,
        spent: 0
      };
      demoBudgets.push(newBudget);
      return newBudget;
    }
    throw error;
  }
}

/**
 * Actualizar un presupuesto
 */
export async function updateBudget(id: string, budget: any) {
  try {
    return await fetchAPI(`/api/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budget),
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    throw error;
  }
}

/**
 * Eliminar un presupuesto
 */
export async function deleteBudget(id: string) {
  try {
    return await fetchAPI(`/api/budgets/${id}`, {
      method: 'DELETE',
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = demoBudgets.findIndex(b => b.id === id);
      if (index > -1) {
        demoBudgets.splice(index, 1);
      }
      return { success: true };
    }
    throw error;
  }
}

// ========================================
// 📊 DASHBOARD / ESTADÍSTICAS
// ========================================

/**
 * Obtener estadísticas del dashboard
 */
export async function getDashboardStats() {
  try {
    return await fetchAPI('/api/dashboard/stats');
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        balance: 12450,
        income: 4250,
        expenses: 1380,
        savings: 2870
      };
    }
    throw error;
  }
}

/**
 * Obtener datos para gráficos
 */
export async function getChartData(type: 'income' | 'expense', period: 'month' | 'year' = 'month') {
  try {
    return await fetchAPI(`/api/dashboard/charts?type=${type}&period=${period}`);
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [];
    }
    throw error;
  }
}

// ========================================
// 👤 PERFIL DE USUARIO
// ========================================

/**
 * Actualizar perfil de usuario
 */
export async function updateProfile(data: {
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
}) {
  try {
    return await fetchAPI('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, message: 'Perfil actualizado (modo demo)' };
    }
    throw error;
  }
}

/**
 * Cambiar contraseña
 */
export async function changePassword(oldPassword: string, newPassword: string) {
  try {
    return await fetchAPI('/api/user/password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, message: 'Contraseña actualizada (modo demo)' };
    }
    throw error;
  }
}

// ========================================
// 💰 CARTERAS / CUENTAS
// ========================================

/**
 * Obtener todas las carteras
 */
export async function getWallets() {
  try {
    return await fetchAPI('/api/wallets');
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        { id: '1', name: 'Cuenta Principal', type: 'bank', balance: 5420, currency: 'USD', icon: '🏦', color: '#3B82F6' },
        { id: '2', name: 'Ahorros', type: 'savings', balance: 12000, currency: 'USD', icon: '💰', color: '#10B981' },
        { id: '3', name: 'Tarjeta de Crédito', type: 'credit', balance: -850, currency: 'USD', icon: '💳', color: '#EF4444' },
      ];
    }
    throw error;
  }
}

/**
 * Crear una nueva cartera
 */
export async function createWallet(wallet: {
  name: string;
  type: string;
  balance?: number;
  currency?: string;
  color?: string;
  icon?: string;
}) {
  try {
    return await fetchAPI('/api/wallets', {
      method: 'POST',
      body: JSON.stringify(wallet),
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { id: String(Date.now()), ...wallet };
    }
    throw error;
  }
}

/**
 * Actualizar una cartera
 */
export async function updateWallet(id: string, wallet: any) {
  try {
    return await fetchAPI(`/api/wallets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(wallet),
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    throw error;
  }
}

/**
 * Eliminar una cartera
 */
export async function deleteWallet(id: string) {
  try {
    return await fetchAPI(`/api/wallets/${id}`, {
      method: 'DELETE',
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    throw error;
  }
}

// ========================================
// 📈 INVERSIONES
// ========================================

/**
 * Obtener todas las inversiones
 */
export async function getInvestments() {
  try {
    return await fetchAPI('/api/investments');
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        { id: '1', name: 'Apple Inc.', type: 'stock', symbol: 'AAPL', quantity: 10, purchasePrice: 150, currentPrice: 175, purchaseDate: '2024-01-15' },
        { id: '2', name: 'Bitcoin', type: 'crypto', symbol: 'BTC', quantity: 0.5, purchasePrice: 45000, currentPrice: 52000, purchaseDate: '2024-02-01' },
        { id: '3', name: 'Ethereum', type: 'crypto', symbol: 'ETH', quantity: 2, purchasePrice: 2800, currentPrice: 3200, purchaseDate: '2024-03-10' },
      ];
    }
    throw error;
  }
}

/**
 * Crear una nueva inversión
 */
export async function createInvestment(investment: {
  name: string;
  type: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice?: number;
  purchaseDate?: string;
}) {
  try {
    return await fetchAPI('/api/investments', {
      method: 'POST',
      body: JSON.stringify(investment),
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { id: String(Date.now()), ...investment };
    }
    throw error;
  }
}

/**
 * Actualizar una inversión
 */
export async function updateInvestment(id: string, investment: any) {
  try {
    return await fetchAPI(`/api/investments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(investment),
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    throw error;
  }
}

/**
 * Eliminar una inversión
 */
export async function deleteInvestment(id: string) {
  try {
    return await fetchAPI(`/api/investments/${id}`, {
      method: 'DELETE',
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    throw error;
  }
}

// ========================================
// 🎯 METAS/OBJETIVOS
// ========================================

/**
 * Obtener todas las metas
 */
export async function getGoals() {
  try {
    return await fetchAPI('/api/goals');
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        { id: '1', name: 'Casa Nueva', targetAmount: 50000, currentAmount: 15000, deadline: '2025-12-31', icon: '🏠', color: '#3B82F6' },
        { id: '2', name: 'Vacaciones', targetAmount: 5000, currentAmount: 2800, deadline: '2025-07-01', icon: '✈️', color: '#10B981' },
        { id: '3', name: 'Fondo de Emergencia', targetAmount: 10000, currentAmount: 6500, deadline: '2025-06-30', icon: '🛡️', color: '#F59E0B' },
      ];
    }
    throw error;
  }
}

/**
 * Crear una nueva meta
 */
export async function createGoal(goal: {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  deadline: string;
  icon?: string;
  color?: string;
}) {
  try {
    return await fetchAPI('/api/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { id: String(Date.now()), ...goal };
    }
    throw error;
  }
}

/**
 * Actualizar una meta
 */
export async function updateGoal(id: string, goal: any) {
  try {
    return await fetchAPI(`/api/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goal),
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    throw error;
  }
}

/**
 * Eliminar una meta
 */
export async function deleteGoal(id: string) {
  try {
    return await fetchAPI(`/api/goals/${id}`, {
      method: 'DELETE',
    });
  } catch (error: any) {
    if (error.message === 'BACKEND_UNAVAILABLE') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    throw error;
  }
}