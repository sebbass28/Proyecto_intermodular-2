import { Bell, Search, Settings, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Card } from "./ui/card";

interface HeaderProps {
  onNavigate: (page: string, options?: { tab?: string }) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const { user } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Notificaciones de ejemplo
  const notifications = [
    { id: 1, title: "Presupuesto casi excedido", message: "Has gastado el 90% de tu presupuesto de Comida", time: "Hace 2 horas", type: "warning", unread: true },
    { id: 2, title: "Nueva transacción", message: "Se registró un ingreso de $500", time: "Hace 5 horas", type: "success", unread: true },
    { id: 3, title: "Meta alcanzada", message: "¡Felicidades! Completaste tu meta de Vacaciones", time: "Hace 1 día", type: "success", unread: true },
    { id: 4, title: "Recordatorio", message: "No olvides registrar tus gastos del día", time: "Hace 2 días", type: "info", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo y título */}
        <motion.div 
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">FinanceFlow</h1>
          </div>
        </motion.div>

        {/* Barra de búsqueda */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar transacciones, categorías..."
              className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearch(true)}
            />
            
            {/* Resultados de búsqueda */}
            <AnimatePresence>
              {showSearch && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-h-96 overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Resultados de búsqueda</h3>
                    <Button variant="ghost" size="sm" onClick={() => { setShowSearch(false); setSearchQuery(""); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 py-4 text-center">
                      Escribe para buscar transacciones, categorías y más...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Acciones del usuario */}
        <div className="flex items-center space-x-3">
          {/* Notificaciones */}
          <div className="relative">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 hover:bg-red-500">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </motion.div>

            {/* Panel de notificaciones */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Notificaciones</h3>
                        <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            notification.unread ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              notification.type === 'warning' ? 'bg-yellow-500' :
                              notification.type === 'success' ? 'bg-green-500' :
                              'bg-blue-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200 text-center">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        Ver todas las notificaciones
                      </Button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          
          {/* Configuración */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('settings')}>
              <Settings className="h-5 w-5" />
            </Button>
          </motion.div>

          {/* Avatar y perfil */}
          <motion.div 
            className="flex items-center space-x-3 pl-3 border-l border-gray-200 cursor-pointer"
            onClick={() => onNavigate('profile')}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuario'}</p>
              <p className="text-xs text-gray-500">Premium Plan</p>
            </div>
            <Avatar className="h-9 w-9">
              {user?.avatar && <AvatarImage src={user.avatar} />}
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </div>
      </div>
    </header>
  );
}