import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  Target, 
  BarChart3, 
  CreditCard, 
  Settings, 
  HelpCircle,
  PlusCircle,
  User
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { useState } from "react";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string, options?: { tab?: string }) => void;
  onNewTransaction?: () => void;
  onUpgradePlan?: () => void;
}

const menuItems = [
  { 
    name: "Dashboard", 
    icon: LayoutDashboard, 
    id: "dashboard",
    badge: null
  },
  { 
    name: "Transacciones", 
    icon: CreditCard, 
    id: "transactions",
    badge: null
  },
  { 
    name: "Presupuestos", 
    icon: Target, 
    id: "budgets",
    badge: null
  },
  { 
    name: "Carteras", 
    icon: Wallet, 
    id: "wallets",
    badge: null
  },
  { 
    name: "Inversiones", 
    icon: TrendingUp, 
    id: "investments",
    badge: null
  },
  { 
    name: "Metas", 
    icon: Target, 
    id: "goals",
    badge: null
  },
  { 
    name: "Reportes", 
    icon: BarChart3, 
    id: "reports",
    badge: null
  }
];

export function Sidebar({ currentPage, onNavigate, onNewTransaction, onUpgradePlan }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-4rem)]">
      {/* Acción principal */}
      <div className="p-6 border-b border-gray-100">
        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={onNewTransaction}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nueva Transacción
        </Button>
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = currentPage === item.id;
            return (
              <motion.li 
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Sección inferior */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-600 hover:text-gray-900"
          onClick={() => onNavigate("profile")}
        >
          <User className="h-4 w-4 mr-3" />
          Mi Perfil
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-600 hover:text-gray-900"
          onClick={() => onNavigate("settings")}
        >
          <Settings className="h-4 w-4 mr-3" />
          Configuración
        </Button>
        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900">
          <HelpCircle className="h-4 w-4 mr-3" />
          Ayuda y Soporte
        </Button>
      </div>

      {/* Widget de upgrade */}
      <motion.div 
        className="p-4 mx-4 mb-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={onUpgradePlan}
      >
        <div className="text-center">
          <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <h4 className="font-medium text-gray-900 mb-1">Upgrade a Pro</h4>
          <p className="text-xs text-gray-600 mb-3">Obtén análisis avanzados y reportes personalizados</p>
          <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            Actualizar Plan
          </Button>
        </div>
      </motion.div>
    </div>
  );
}