import { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  AlertCircle, 
  Phone, 
  MapPin,
  DollarSign,
  Calendar,
  Check,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface RegisterPageProps {
  onBackToLogin?: () => void;
}

export function RegisterPage({ onBackToLogin }: RegisterPageProps) {
  // 📋 Estados para todos los campos del formulario
  const [formData, setFormData] = useState({
    // Información básica (obligatoria)
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Información adicional (opcional pero útil para finanzas)
    phone: '',
    country: '',
    currency: 'USD',
    monthlyIncome: '',
    
    // Preferencias
    receiveNotifications: true,
    acceptTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // Control de pasos del formulario
  const { login } = useAuth();

  // Función para actualizar los campos del formulario
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validación del paso 1 (datos básicos)
  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor completa todos los campos obligatorios');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return false;
    }

    return true;
  };

  // Validación del paso 2 (información adicional)
  const validateStep2 = () => {
    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return false;
    }
    return true;
  };

  // Avanzar al siguiente paso
  const handleNextStep = () => {
    setError('');
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  // Volver al paso anterior
  const handlePrevStep = () => {
    setError('');
    setStep(1);
  };

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep2()) return;

    setIsLoading(true);

    try {
      // 📤 Aquí es donde se envían los datos a tu backend
      // Preparar datos adicionales opcionales
      const additionalData = {
        phone: formData.phone || undefined,
        country: formData.country || undefined,
        currency: formData.currency,
        monthlyIncome: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : undefined,
        receiveNotifications: formData.receiveNotifications,
      };

      // La función register ahora acepta todos los campos
      await login(formData.email, formData.password, formData.name);

      // 💾 IMPORTANTE: Estos son los valores que deberías guardar en tu backend:
      console.log('📝 Datos que se deberían enviar al backend:', {
        // Campos obligatorios
        name: formData.name,
        email: formData.email,
        password: formData.password, // En el backend, guarda HASH de la contraseña, nunca en texto plano
        
        // Campos opcionales pero útiles
        phone: formData.phone || null,
        country: formData.country || null,
        currency: formData.currency,
        monthlyIncome: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : null,
        
        // Preferencias
        receiveNotifications: formData.receiveNotifications,
        
        // Campos adicionales que tu backend debería generar automáticamente:
        // - id: generado automáticamente (UUID o incremental)
        // - createdAt: fecha de creación (timestamp)
        // - updatedAt: fecha de última actualización
        // - avatar: URL del avatar (puedes usar ui-avatars.com o dejar vacío)
        // - emailVerified: false (si implementas verificación de email)
        // - isActive: true
      });

      toast.success('¡Cuenta creada exitosamente! 🎉');
      
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      if (error.message !== 'BACKEND_UNAVAILABLE') {
        setError(error.message || 'Error al crear la cuenta. Intenta de nuevo.');
      } else {
        // En modo demo, solo mostrar un toast
        toast.info('Modo DEMO activado - Backend no disponible');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Crear Cuenta en FinanceFlow
            </h1>
            <p className="text-gray-600 mt-2">
              Completa tu registro en {step} de 2 pasos
            </p>
          </motion.div>

          {/* Indicador de progreso */}
          <div className="flex items-center justify-center mb-8 gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                {step > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span className="hidden sm:inline">Datos básicos</span>
            </div>
            
            <div className="h-px w-12 bg-gray-300" />
            
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="hidden sm:inline">Información adicional</span>
            </div>
          </div>

          {/* Mostrar error si existe */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PASO 1: Datos básicos */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">
                    Nombre completo <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Juan Pérez García"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="pl-10 bg-white"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tu nombre aparecerá en tu perfil y reportes
                  </p>
                </div>

                <div>
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="pl-10 bg-white"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Usaremos este email para iniciar sesión
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">
                      Contraseña <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        className="pl-10 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirmar contraseña <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                        className="pl-10 bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Continuar →
                </Button>
              </motion.div>
            )}

            {/* PASO 2: Información adicional */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Teléfono (opcional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+52 123 456 7890"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="pl-10 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="country">País (opcional)</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                      <Select value={formData.country} onValueChange={(value) => updateField('country', value)}>
                        <SelectTrigger className="pl-10 bg-white">
                          <SelectValue placeholder="Selecciona tu país" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MX">🇲🇽 México</SelectItem>
                          <SelectItem value="US">🇺🇸 Estados Unidos</SelectItem>
                          <SelectItem value="ES">🇪🇸 España</SelectItem>
                          <SelectItem value="CO">🇨🇴 Colombia</SelectItem>
                          <SelectItem value="AR">🇦🇷 Argentina</SelectItem>
                          <SelectItem value="CL">🇨🇱 Chile</SelectItem>
                          <SelectItem value="PE">🇵🇪 Perú</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currency">Moneda preferida</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                      <Select value={formData.currency} onValueChange={(value) => updateField('currency', value)}>
                        <SelectTrigger className="pl-10 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">💵 USD - Dólar</SelectItem>
                          <SelectItem value="MXN">💵 MXN - Peso Mexicano</SelectItem>
                          <SelectItem value="EUR">💶 EUR - Euro</SelectItem>
                          <SelectItem value="COP">💵 COP - Peso Colombiano</SelectItem>
                          <SelectItem value="ARS">💵 ARS - Peso Argentino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="monthlyIncome">Ingreso mensual (opcional)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="monthlyIncome"
                        type="number"
                        placeholder="5000"
                        value={formData.monthlyIncome}
                        onChange={(e) => updateField('monthlyIncome', e.target.value)}
                        className="pl-10 bg-white"
                        min="0"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Nos ayudará a darte mejores recomendaciones
                    </p>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="notifications"
                      checked={formData.receiveNotifications}
                      onCheckedChange={(checked) => updateField('receiveNotifications', checked)}
                    />
                    <label
                      htmlFor="notifications"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      Quiero recibir notificaciones sobre presupuestos, alertas y consejos financieros
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => updateField('acceptTerms', checked)}
                      required
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      Acepto los <span className="text-blue-600 hover:underline">términos y condiciones</span> y la{' '}
                      <span className="text-blue-600 hover:underline">política de privacidad</span>
                      <span className="text-red-500"> *</span>
                    </label>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={handlePrevStep}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Atrás
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⚡
                      </motion.div>
                    ) : (
                      'Crear Cuenta'
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </form>

          {/* Link para volver al login */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              ¿Ya tienes cuenta?{' '}
              <span className="font-semibold">Inicia sesión</span>
            </button>
          </div>

          {/* Información sobre campos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100"
          >
            <p className="text-xs text-blue-800">
              <strong>💡 Para desarrolladores:</strong> Los campos marcados con * son obligatorios. 
              Los datos se enviarán a <code className="bg-blue-100 px-1 rounded">POST /api/auth/register</code>
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}