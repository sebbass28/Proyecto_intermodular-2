import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  Palette,
  LogOut,
  Camera,
  Save
} from 'lucide-react';

export function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          👤 Mi Perfil
        </h1>
        <p className="text-gray-600 mt-1">Administra tu cuenta y preferencias</p>
      </motion.div>

      {/* Foto de perfil */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-green-600 mt-1">✓ Cuenta verificada</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Información personal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Información Personal</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre completo</Label>
                <Input id="name" defaultValue={user?.name} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} disabled />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" type="tel" placeholder="+34 600 000 000" />
              </div>
              <div>
                <Label htmlFor="country">País</Label>
                <Input id="country" placeholder="España" />
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Notificaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Notificaciones</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertas de presupuesto</p>
                <p className="text-sm text-gray-600">Recibe avisos cuando te acerques al límite</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Resumen mensual</p>
                <p className="text-sm text-gray-600">Reporte de tus finanzas cada mes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Consejos de ahorro</p>
                <p className="text-sm text-gray-600">Recomendaciones personalizadas</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Recordatorios de pago</p>
                <p className="text-sm text-gray-600">No olvides tus facturas</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Seguridad */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Seguridad</h3>
          </div>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Cambiar contraseña
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Autenticación de dos factores
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Dispositivos conectados
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Preferencias */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-5 h-5 text-pink-600" />
            <h3 className="text-lg font-semibold">Preferencias</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Modo oscuro</p>
                <p className="text-sm text-gray-600">Cambia la apariencia de la app</p>
              </div>
              <Switch />
            </div>
            <div>
              <Label htmlFor="currency">Moneda</Label>
              <Input id="currency" defaultValue="USD ($)" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="language">Idioma</Label>
              <Input id="language" defaultValue="Español" className="mt-1" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Cerrar sesión */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-red-900">Cerrar sesión</h3>
              <p className="text-sm text-red-700 mt-1">
                Salir de tu cuenta en este dispositivo
              </p>
            </div>
            <Button 
              variant="destructive"
              onClick={logout}
              className="w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
