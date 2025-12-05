import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore"; 
import {
  Home,
  DollarSign,
  TrendingUp,
  CreditCard,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Wallet
} from 'lucide-react';

// Datos de ejemplo para las tarjetas
const mockDashboardData = {
  currentBalance: 5245.75,
  totalIncome: 7500.00,
  monthlyExpenses: 2254.25,
  savingsGoal: 10000.00,
};

// Configuración de los ítems del menú de navegación
const navigationItems = [
  { name: 'Inicio', path: '/dashboard', icon: Home, current: true, description: 'Resumen y saldo general' },
  { name: 'Transacciones', path: '/transactions', icon: DollarSign, current: false, description: 'Ver y registrar movimientos' },
  { name: 'Presupuestos', path: '/budgets', icon: TrendingUp, current: false, description: 'Control de gastos mensuales' },
  { name: 'Cuentas', path: '/accounts', icon: CreditCard, current: false, description: 'Gestión de tarjetas y bancos' },
  { name: 'Perfil', path: '/profile', icon: User, current: false, description: 'Configuración personal y datos' },
];

// Componente para las tarjetas de resumen
// Aseguramos que 'Icon' se use como un componente React <Icon />
const StatCard = ({ title, value, icon: Icon, colorClass, currency = '€' }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {/* Usamos Icon como componente JSX */}
      <Icon className={`w-5 h-5 ${colorClass}`} />
    </div>
    <p className="mt-1 text-3xl font-bold text-gray-900">
      {currency} {value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </p>
  </div>
);

// Componente principal del Dashboard
const DashboardHome = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Inicio'); // Simulación de la página activa

  const handleNavigation = (path, name) => {
    // Si la ruta es a registrarse o a la raíz, usamos window.location.href para simular
    // la navegación fuera del componente actual, ya que 'useNavigate' no funciona aquí.
    if (path === '/register' || path === '/') {
      console.log(`Redirigiendo a: ${path}`);
      // Nota: En un entorno de producción, es preferible usar un <Router> y 'useNavigate'
      window.location.href = path;
      return;
    }

    // Para la navegación interna del Dashboard, solo simulamos el cambio de página
    setCurrentPage(name);
    setIsSidebarOpen(false); // Cierra el menú en móvil
    console.log(`Navegando internamente a: ${path}`);
  };

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    logout(); // Limpia el token y el usuario del store
    navigate('/'); // Redirigir al login
  };

  return (
    <div className="flex h-screen bg-gray-50 font-inter">
      {/* Sidebar - Menú de Navegación */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 transition duration-300 ease-in-out z-30 w-64 bg-emerald-700 shadow-xl flex flex-col`}
      >
        {/* Logo/Título */}
        <div className="flex items-center justify-center h-20 bg-emerald-800 text-white p-4 shadow-md">
          <Wallet className="w-6 h-6 mr-2" />
          <span className="text-xl font-extrabold tracking-wider">
            FinanceFlow
          </span>
        </div>

        {/* Links de Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href="#"
              onClick={() => handleNavigation(item.path, item.name)}
              className={`flex items-center p-3 rounded-lg group transition duration-150 ease-in-out ${
                currentPage === item.name
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-100 hover:bg-emerald-600/70 hover:text-white'
              }`}
            >
              {/* Usamos item.icon como componente JSX */}
              <item.icon className="w-5 h-5 mr-3" /> 
              <span className="font-semibold text-sm">{item.name}</span>
            </a>
          ))}
          {/* Ítem Adicional para Registrarse, basado en tu petición */}
          <a
              href="#"
              onClick={() => handleNavigation('/register', 'Registrarse')}
              className="flex items-center p-3 rounded-lg group transition duration-150 ease-in-out text-emerald-100 hover:bg-emerald-600/70 hover:text-white mt-4 border-t border-emerald-600/50 pt-4"
            >
              <User className="w-5 h-5 mr-3" />
              <span className="font-semibold text-sm">Registrarse (Demo)</span>
          </a>
        </nav>

        {/* Pie de página/Logout */}
        <div className="p-4 border-t border-emerald-600">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg text-emerald-100 hover:bg-emerald-600 hover:text-white transition duration-150 ease-in-out"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-semibold text-sm">Cerrar Sesión</span>
          </button>
          <div className="mt-2 text-xs text-emerald-300 text-center">
            FinanceFlow v1.0
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra Superior para Móviles */}
        <header className="flex items-center justify-between lg:hidden h-16 bg-white shadow-md p-4">
          <div className="flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-emerald-600" />
            <span className="text-lg font-bold text-gray-900">Dashboard</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Área de Contenido Scrollable */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
            Resumen Financiero ({currentPage})
          </h1>

          {/* Cuadros de Indicadores (Dashboard Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Saldo Actual"
              value={mockDashboardData.currentBalance}
              icon={Wallet}
              colorClass="text-emerald-500"
              currency="€"
            />
            <StatCard
              title="Ingresos Totales"
              value={mockDashboardData.totalIncome}
              icon={DollarSign}
              colorClass="text-blue-500"
              currency="€"
            />
            <StatCard
              title="Gastos del Mes"
              value={mockDashboardData.monthlyExpenses}
              icon={TrendingUp}
              colorClass="text-red-500"
              currency="€"
            />
            <StatCard
              title="Meta de Ahorro"
              value={mockDashboardData.savingsGoal}
              icon={Settings}
              colorClass="text-yellow-500"
              currency="€"
            />
          </div>

          {/* Sección de Gráfico (Placeholder) */}
          <div className="bg-white p-6 rounded-xl shadow-lg h-96 flex items-center justify-center">
            <p className="text-gray-400 text-lg">
              [Gráfico de Flujo de Efectivo Mensual - Placeholder]
            </p>
          </div>

          {/* Sección de Transacciones Recientes (Placeholder) */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Transacciones Recientes
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border-b border-gray-100 last:border-b-0">
                <span className="font-medium">Compra en el supermercado</span>
                <span className="text-red-500 font-semibold">-€45.90</span>
              </div>
              <div className="flex justify-between items-center p-3 border-b border-gray-100 last:border-b-0">
                <span className="font-medium">Salario (Ingreso)</span>
                <span className="text-blue-500 font-semibold">+€2,500.00</span>
              </div>
              <div className="flex justify-between items-center p-3 border-b border-gray-100 last:border-b-0">
                <span className="font-medium">Suscripción de streaming</span>
                <span className="text-red-500 font-semibold">-€15.99</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardHome;