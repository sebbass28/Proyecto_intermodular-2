import React, { useState } from 'react';
import { User, Bell, Lock, CreditCard, Check, Crown } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface SettingsPageProps {
  defaultTab?: string;
}

export function SettingsPage({ defaultTab }: SettingsPageProps) {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState('free');
  
  // Profile form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    country: '',
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notifications
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    budgetAlerts: true,
    monthlyReports: true,
    transactionAlerts: false,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await api.updateProfile(profileData);
      toast.success('Perfil actualizado exitosamente');
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      toast.error(error.message || 'Error al actualizar el perfil');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await api.changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Contraseña actualizada exitosamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('Error cambiando contraseña:', error);
      toast.error(error.message || 'Error al cambiar la contraseña');
    }
  };

  const handleUpgradePlan = (plan: string) => {
    setCurrentPlan(plan);
    toast.success(`¡Plan ${plan === 'premium' ? 'Premium' : 'Pro'} activado!`);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2">Configuración</h1>
        <p className="text-gray-600">Gestiona tu cuenta y preferencias</p>
      </div>

      <Tabs defaultValue={defaultTab || "profile"} className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="w-4 h-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Plan y Facturación
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="p-6">
            <h2 className="mb-6">Información Personal</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="juan@ejemplo.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  value={profileData.country}
                  onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                  placeholder="México"
                />
              </div>

              <Button type="submit">Guardar Cambios</Button>
            </form>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="p-6">
            <h2 className="mb-6">Cambiar Contraseña</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
              <div>
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit">Cambiar Contraseña</Button>
            </form>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="p-6">
            <h2 className="mb-6">Preferencias de Notificaciones</h2>
            <div className="space-y-6 max-w-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p>Notificaciones por Email</p>
                  <p className="text-sm text-gray-600">Recibe actualizaciones en tu correo</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p>Notificaciones Push</p>
                  <p className="text-sm text-gray-600">Recibe alertas en tiempo real</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p>Alertas de Presupuesto</p>
                  <p className="text-sm text-gray-600">Te avisamos cuando te acerques al límite</p>
                </div>
                <Switch
                  checked={notifications.budgetAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, budgetAlerts: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p>Reportes Mensuales</p>
                  <p className="text-sm text-gray-600">Resumen mensual de tus finanzas</p>
                </div>
                <Switch
                  checked={notifications.monthlyReports}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, monthlyReports: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p>Alertas de Transacciones</p>
                  <p className="text-sm text-gray-600">Notificación por cada transacción</p>
                </div>
                <Switch
                  checked={notifications.transactionAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, transactionAlerts: checked })}
                />
              </div>

              <Button onClick={() => toast.success('Preferencias guardadas')}>
                Guardar Preferencias
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-2">Plan Actual</h2>
              <p className="text-gray-600 mb-6">
                Estás en el plan <span className="font-semibold capitalize">{currentPlan}</span>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Free Plan */}
                <Card className={`p-6 ${currentPlan === 'free' ? 'border-2 border-blue-500' : 'border border-gray-200'}`}>
                  <div className="text-center mb-4">
                    <h3 className="text-xl mb-2">Gratis</h3>
                    <div className="text-3xl mb-2">$0</div>
                    <p className="text-sm text-gray-600">por mes</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Hasta 50 transacciones/mes</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>3 presupuestos</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Reportes básicos</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>1 cartera</span>
                    </li>
                  </ul>

                  {currentPlan === 'free' ? (
                    <Button className="w-full" disabled>Plan Actual</Button>
                  ) : (
                    <Button className="w-full" variant="outline" onClick={() => handleUpgradePlan('free')}>
                      Cambiar a Gratis
                    </Button>
                  )}
                </Card>

                {/* Premium Plan */}
                <Card className={`p-6 ${currentPlan === 'premium' ? 'border-2 border-blue-500' : 'border border-gray-200'} relative`}>
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    Popular
                  </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="text-xl mb-2">Premium</h3>
                    <div className="text-3xl mb-2">$9.99</div>
                    <p className="text-sm text-gray-600">por mes</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Transacciones ilimitadas</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Presupuestos ilimitados</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Reportes avanzados</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Hasta 5 carteras</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Inversiones básicas</span>
                    </li>
                  </ul>

                  {currentPlan === 'premium' ? (
                    <Button className="w-full" disabled>Plan Actual</Button>
                  ) : (
                    <Button className="w-full" onClick={() => handleUpgradePlan('premium')}>
                      Actualizar a Premium
                    </Button>
                  )}
                </Card>

                {/* Pro Plan */}
                <Card className={`p-6 ${currentPlan === 'pro' ? 'border-2 border-blue-500' : 'border border-gray-200'} relative`}>
                  <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Pro
                  </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="text-xl mb-2">Pro</h3>
                    <div className="text-3xl mb-2">$19.99</div>
                    <p className="text-sm text-gray-600">por mes</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Todo de Premium +</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Carteras ilimitadas</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Portfolio de inversiones completo</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Metas financieras ilimitadas</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Soporte prioritario</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Exportación de datos</span>
                    </li>
                  </ul>

                  {currentPlan === 'pro' ? (
                    <Button className="w-full" disabled>Plan Actual</Button>
                  ) : (
                    <Button className="w-full" variant="default" onClick={() => handleUpgradePlan('pro')}>
                      Actualizar a Pro
                    </Button>
                  )}
                </Card>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}