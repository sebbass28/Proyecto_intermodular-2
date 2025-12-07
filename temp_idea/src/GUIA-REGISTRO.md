# 🎯 Guía Rápida: Cómo Funciona el Registro

## 📱 Vista del Usuario

Cuando un usuario nuevo llega a FinanceFlow, verá esto:

1. **Página de Login** → Clic en "Regístrate aquí" 
2. **Formulario de Registro (Paso 1/2)**
   - ✅ Nombre completo
   - ✅ Email
   - ✅ Contraseña
   - ✅ Confirmar contraseña
   
3. **Formulario de Registro (Paso 2/2)**
   - Teléfono (opcional)
   - País (opcional)
   - Moneda preferida
   - Ingreso mensual (opcional)
   - ☑️ Recibir notificaciones
   - ☑️ Aceptar términos y condiciones

4. **Clic en "Crear Cuenta"** → ¡Listo! Ya está dentro de la app

---

## 🔄 Flujo Técnico Completo

```
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND (React)                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Usuario llena el formulario en RegisterPage.tsx            │
│     ↓                                                           │
│  2. Hace clic en "Crear Cuenta"                                │
│     ↓                                                           │
│  3. Se ejecuta handleSubmit()                                  │
│     ↓                                                           │
│  4. Se llama a login(email, password, name) del AuthContext    │
│     ↓                                                           │
│  5. AuthContext llama a api.register() en utils/api.ts         │
│                                                                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTP POST
                     │ http://localhost:4000/api/auth/register
                     │
                     │ Body: {
                     │   name: "Juan Pérez",
                     │   email: "juan@example.com",
                     │   password: "miPassword123",
                     │   phone: "+52 123...",
                     │   country: "MX",
                     │   currency: "MXN",
                     │   monthlyIncome: 5000,
                     │   receiveNotifications: true
                     │ }
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND (Node.js + Express)                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  6. Recibe POST en /api/auth/register                          │
│     ↓                                                           │
│  7. Valida que los campos obligatorios existan                 │
│     ↓                                                           │
│  8. Verifica que el email no esté ya registrado                │
│     ↓                                                           │
│  9. Hashea la contraseña con bcrypt                            │
│     "miPassword123" → "$2b$10$abc123..."                       │
│     ↓                                                           │
│  10. Guarda el usuario en la base de datos                     │
│     ↓                                                           │
│  11. Genera un JWT token                                       │
│     ↓                                                           │
│  12. Responde con:                                             │
│      {                                                          │
│        token: "eyJhbGc...",                                     │
│        user: {                                                  │
│          id: 1,                                                 │
│          name: "Juan Pérez",                                    │
│          email: "juan@example.com",                             │
│          ...otros datos                                         │
│        }                                                        │
│      }                                                          │
│                                                                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ Response
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND (React)                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  13. utils/api.ts recibe la respuesta                          │
│     ↓                                                           │
│  14. Guarda el token en localStorage:                          │
│      localStorage.setItem('auth_token', token)                 │
│     ↓                                                           │
│  15. AuthContext actualiza el estado del usuario               │
│      setUser(userData)                                         │
│     ↓                                                           │
│  16. La app detecta que user !== null                          │
│     ↓                                                           │
│  17. ¡Redirige automáticamente al Dashboard! 🎉                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎭 Modo DEMO (Backend no disponible)

Si tu backend en `localhost:4000` NO está corriendo:

```
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND intenta conectarse al backend...                     │
│     ↓                                                           │
│  ❌ Error: Backend no responde                                 │
│     ↓                                                           │
│  💡 Activa MODO DEMO automáticamente                           │
│     ↓                                                           │
│  Crea un usuario demo:                                         │
│  {                                                              │
│    id: '1',                                                     │
│    name: 'Usuario Demo',                                        │
│    email: email_que_ingresaste,                                 │
│    token: 'demo-token-123...'                                   │
│  }                                                              │
│     ↓                                                           │
│  Guarda en localStorage                                        │
│     ↓                                                           │
│  ¡Usuario entra a la app con datos de ejemplo! 🎨             │
│     ↓                                                           │
│  Banner azul arriba: "Modo DEMO - Backend no disponible"      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📂 Archivos Importantes

### `/components/RegisterPage.tsx`
- **Qué hace:** Muestra el formulario de registro en 2 pasos
- **Campos que recolecta:**
  - Paso 1: nombre, email, contraseña
  - Paso 2: teléfono, país, moneda, ingreso mensual, preferencias
- **Validaciones:**
  - Email válido
  - Contraseñas coinciden
  - Mínimo 6 caracteres
  - Términos aceptados

### `/contexts/AuthContext.tsx`
- **Qué hace:** Maneja el estado de autenticación en toda la app
- **Funciones principales:**
  - `login(email, password, name)` - Si hay name = registro, si no = login
  - `logout()` - Cerrar sesión
  - `checkAuth()` - Verificar si hay sesión activa al cargar la app

### `/utils/api.ts`
- **Qué hace:** Todas las llamadas HTTP al backend
- **Función de registro:**
  ```javascript
  export async function register(name, email, password) {
    const data = await fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, ... })
    });
    
    localStorage.setItem('auth_token', data.token);
    return data;
  }
  ```

---

## 🔑 Datos que se Guardan

### En el Frontend (localStorage)
```javascript
localStorage.setItem('auth_token', 'eyJhbGciOiJIUzI1...');
// Este token se envía en cada petición al backend
```

### En el Backend (Base de Datos)
```sql
INSERT INTO users (
  name, 
  email, 
  password,          -- ⚠️ HASH, no la contraseña real
  phone, 
  country, 
  currency,
  monthly_income,
  receive_notifications,
  created_at
) VALUES (
  'Juan Pérez',
  'juan@example.com',
  '$2b$10$abc123...',  -- Hash generado con bcrypt
  '+52 123 456 7890',
  'MX',
  'MXN',
  5000.00,
  true,
  NOW()
);
```

---

## 🛠️ Para Probar el Registro

### 1. **CON backend corriendo** (localhost:4000)

1. Asegúrate de que tu backend esté corriendo
2. Ve a la app de FinanceFlow
3. Clic en "Regístrate aquí"
4. Llena el formulario
5. Clic en "Crear Cuenta"
6. Abre la consola (F12) y verás:
   ```
   📝 Datos que se deberían enviar al backend: { ... }
   ```
7. El backend debe responder con el token
8. ¡Entras automáticamente al Dashboard!

### 2. **SIN backend** (Modo DEMO)

1. No ejecutes tu backend
2. Ve a la app de FinanceFlow
3. Clic en "Regístrate aquí"
4. Llena el formulario
5. Clic en "Crear Cuenta"
6. Verás un banner azul: "Modo DEMO activado"
7. ¡Entras al Dashboard con datos de ejemplo!

---

## 🎯 Puntos Clave para Recordar

### ✅ Seguridad
- ⚠️ **NUNCA** guardes contraseñas en texto plano
- ✅ Siempre usa `bcrypt.hash()` antes de guardar
- ✅ Usa JWT para autenticación
- ✅ Guarda JWT_SECRET en variables de entorno

### ✅ Validaciones
- Email válido (regex)
- Contraseña mínimo 6 caracteres
- Email único en la base de datos
- Términos y condiciones aceptados

### ✅ Experiencia de Usuario
- Formulario en 2 pasos para no abrumar
- Indicador de progreso visual
- Mensajes de error claros
- Modo DEMO automático si backend falla
- Animaciones suaves

---

## 📚 Recursos Adicionales

- **Documento completo del backend:** Ver `BACKEND-REGISTRO.md`
- **Código del formulario:** Ver `components/RegisterPage.tsx`
- **API calls:** Ver `utils/api.ts`
- **Contexto de autenticación:** Ver `contexts/AuthContext.tsx`

---

## 🐛 Debugging

Si algo no funciona, revisa:

1. **Consola del navegador (F12)**
   - Busca errores de JavaScript
   - Busca el log: "📝 Datos que se deberían enviar al backend"

2. **Network tab (F12 → Network)**
   - ¿Se está enviando la petición POST?
   - ¿Qué responde el backend?
   - Status code: 200 = OK, 400 = error de validación, 500 = error del servidor

3. **Backend console**
   - ¿Está recibiendo la petición?
   - ¿Hay algún error al guardar en la DB?

4. **Base de datos**
   - ¿Se creó el registro del usuario?
   - ¿La contraseña está hasheada?

---

## ✨ ¡Y eso es todo!

Ahora tienes un sistema completo de registro que:
- ✅ Funciona con backend real
- ✅ Funciona en modo DEMO sin backend
- ✅ Recolecta todos los datos necesarios
- ✅ Es seguro (hashea contraseñas)
- ✅ Tiene buena UX (2 pasos, validaciones, animaciones)

**Siguiente paso:** Implementa el backend siguiendo `BACKEND-REGISTRO.md` 🚀
