# 🔌 Conexión Frontend ↔ Backend

## 📦 Resumen ejecutivo

Has creado un **frontend completo** con datos mock. Ahora quieres conectarlo con tu **backend real en `localhost:4000`**.

**🎉 ACTUALIZACIÓN:** El error de conexión está **RESUELTO**. La app ahora incluye un **modo DEMO automático** que usa datos de ejemplo cuando el backend no está disponible.

**Buenas noticias:** 
- ✅ La app funciona **inmediatamente** sin necesidad de backend (modo DEMO)
- ✅ Cuando conectes el backend, cambiará automáticamente a datos reales
- ✅ Sin errores frustrantes de "Network Error"

---

## 🗂️ Archivos creados para ti

| Archivo | Qué hace | ¿Debes modificarlo? |
|---------|----------|---------------------|
| `/utils/api.ts` | Funciones para llamar al backend + modo DEMO | ⚠️ Sí - Ajusta API_URL si tu puerto no es 4000 |
| `/contexts/AuthContext.tsx` | Login/logout con backend real | ✅ Ya está listo |
| `/components/LoginPage.tsx` | Muestra errores del servidor | ✅ Ya está listo |
| `/components/DemoModeBanner.tsx` | Banner que indica modo DEMO | ✅ Ya está listo |
| `/components/TransactionsPage-BACKEND.tsx` | Ejemplo con datos reales | 📘 Úsalo como referencia |
| `/MODO-DEMO.md` | Explicación del modo DEMO | ⚡ **LEE ESTO PRIMERO** |
| `/GUIA-CONEXION-BACKEND.md` | Guía completa paso a paso | 📖 Léelo cuando tengas dudas |
| `/EJEMPLO-BACKEND.md` | Código de ejemplo para tu backend | 📖 Léelo si necesitas adaptar tu backend |
| `/INICIO-RAPIDO.md` | Guía rápida en 5 pasos | ⚡ Para conectar backend real |

---

## ⚡ Quick Start (3 pasos)

### 1. Configura la URL
```typescript
// /utils/api.ts línea 10
const API_URL = 'http://localhost:4000';  // 👈 Cambia si tu puerto es diferente
```

### 2. Habilita CORS en tu backend
```javascript
// En tu backend (Express)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### 3. Prueba el login
- Abre tu app
- Intenta hacer login
- Abre DevTools (F12) y revisa la consola

---

## 🎯 Cómo funciona

```
┌─────────────────────────────────────────────────────────────┐
│                     TU APLICACIÓN                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Usuario hace login en LoginPage                        │
│     ↓                                                       │
│  2. LoginPage llama a AuthContext.login()                  │
│     ↓                                                       │
│  3. AuthContext llama a api.login()                        │
│     ↓                                                       │
│  4. api.login() hace:                                      │
│     fetch('http://localhost:4000/api/auth/login', {        │
│       method: 'POST',                                      │
│       body: { email, password }                            │
│     })                                                      │
│     ↓                                                       │
├─────────────────────────────────────────────────────────────┤
│                    ⬇️  HTTP REQUEST  ⬇️                     │
├─────────────────────────────────────────────────────────────┤
│                     TU BACKEND                              │
│                   localhost:4000                            │
│                                                             │
│  5. Backend recibe POST /api/auth/login                    │
│     ↓                                                       │
│  6. Valida email y password                                │
│     ↓                                                       │
│  7. Genera un token JWT                                    │
│     ↓                                                       │
│  8. Responde:                                              │
│     {                                                       │
│       user: { id, name, email, avatar },                   │
│       token: "eyJhbGc..."                                   │
│     }                                                       │
│     ↓                                                       │
├─────────────────────────────────────────────────────────────┤
│                    ⬆️  HTTP RESPONSE  ⬆️                    │
├─────────────────────────────────────────────────────────────┤
│                     TU APLICACIÓN                           │
│                                                             │
│  9. api.login() guarda el token:                           │
│     localStorage.setItem('auth_token', token)              │
│     ↓                                                       │
│  10. AuthContext guarda el usuario:                        │
│      setUser(data.user)                                    │
│      ↓                                                       │
│  11. App detecta isAuthenticated = true                    │
│      ↓                                                       │
│  12. Muestra el Dashboard en lugar del Login               │
│                                                             │
│  ✅ ¡Usuario logueado!                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 Endpoints necesarios

Tu backend debe tener estos endpoints:

### Autenticación
```
POST   /api/auth/login      → { user, token }
POST   /api/auth/register   → { user, token }
GET    /api/auth/me         → { id, name, email, avatar }
```

### Transacciones
```
GET    /api/transactions              → [{...}, {...}]
POST   /api/transactions              → {...}
DELETE /api/transactions/:id          → { success: true }
```

### Presupuestos
```
GET    /api/budgets                   → [{...}, {...}]
POST   /api/budgets                   → {...}
```

### Dashboard
```
GET    /api/dashboard/stats           → { balance, income, expenses, savings }
```

---

## 🔑 Sistema de autenticación

### Flujo del token

```
REGISTRO/LOGIN
     ↓
Backend genera token JWT
     ↓
Frontend guarda en localStorage
     ↓
Frontend incluye token en TODAS las peticiones:
     ↓
Authorization: Bearer eyJhbGc...
     ↓
Backend verifica token
     ↓
Backend identifica al usuario
     ↓
Backend devuelve SOLO los datos de ESE usuario
```

### Código en el frontend

```typescript
// El token se envía automáticamente (ver /utils/api.ts)
const token = localStorage.getItem('auth_token');
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`  // 👈 Se incluye en cada petición
};
```

### Código en el backend

```javascript
// En cada ruta protegida
const token = req.headers.authorization?.split(' ')[1];
const decoded = jwt.verify(token, JWT_SECRET);
const userId = decoded.userId;

// Ahora puedes filtrar por usuario
const transactions = db.transactions.filter(t => t.userId === userId);
```

---

## 🔄 Actualizar componentes para usar datos reales

### Ejemplo: TransactionsPage

**ANTES (datos mock):**
```typescript
const transactions = [
  { id: 1, type: 'income', amount: 100 },
  // ... hardcoded
];
```

**DESPUÉS (datos del backend):**
```typescript
import { useEffect, useState } from 'react';
import * as api from '../utils/api';

const [transactions, setTransactions] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  async function load() {
    try {
      const data = await api.getTransactions();  // 👈 Llamada al backend
      setTransactions(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }
  load();
}, []);
```

**Ver archivo completo:** `/components/TransactionsPage-BACKEND.tsx`

---

## 🛠️ Herramientas de debug

### 1. Console del navegador (F12)
```javascript
// Verás los errores aquí
console.error('Error en login:', error);
```

### 2. Network tab (F12 > Network)
```
Name: login
Status: 200 (✅) o 401/500 (❌)
Response: Ver qué devolvió el backend
```

### 3. Application tab (F12 > Application)
```
Local Storage > http://localhost:5173
  ↓
  auth_token: "eyJhbGc..."  ← ¿Está guardado?
```

### 4. Console del backend
```bash
# En la terminal donde corre tu backend
POST /api/auth/login
GET /api/transactions
```

---

## ⚠️ Problemas comunes

| Problema | Causa | Solución |
|----------|-------|----------|
| CORS error | Backend no permite peticiones | Agrega `app.use(cors())` |
| 404 Not Found | Endpoint no existe | Verifica la ruta en tu backend |
| 401 Unauthorized | Token no válido/ausente | Verifica que se guarde y envíe |
| Failed to fetch | Backend no corre | Inicia tu backend |
| Datos vacíos | Backend devuelve formato diferente | Compara respuesta con código |

---

## 📖 Guías disponibles

1. **`INICIO-RAPIDO.md`** ⚡
   - 5 pasos rápidos
   - Checklist
   - Para empezar YA

2. **`GUIA-CONEXION-BACKEND.md`** 📚
   - Guía completa paso a paso
   - Todos los endpoints
   - Solución de problemas
   - Ejemplos de código

3. **`EJEMPLO-BACKEND.md`** 💻
   - Código completo de un backend compatible
   - Express + JWT + bcrypt
   - Listo para copiar y pegar

4. **`EXPLICACION.md`** 📘
   - Explicación del frontend
   - Conceptos en lenguaje simple

---

## ✅ Checklist de integración

Marca cada paso:

### Preparación
- [ ] Backend corriendo en localhost:4000
- [ ] CORS configurado
- [ ] Endpoints existen y funcionan

### Configuración
- [ ] API_URL correcta en `/utils/api.ts`
- [ ] DevTools abierto (F12)

### Pruebas
- [ ] Login funciona
- [ ] Token se guarda en localStorage
- [ ] Transacciones se cargan desde el backend
- [ ] Crear/eliminar transacciones funciona

### Siguientes pasos
- [ ] Actualizar BudgetsPage para usar backend
- [ ] Actualizar DashboardPage para usar backend
- [ ] Actualizar ProfilePage para usar backend

---

## 🎯 Orden recomendado de implementación

1. ✅ **Login** (ya está listo)
2. ✅ **Transacciones** (usa el ejemplo en `TransactionsPage-BACKEND.tsx`)
3. **Presupuestos** (mismo patrón que Transacciones)
4. **Dashboard** (carga estadísticas con `api.getDashboardStats()`)
5. **Perfil** (actualiza datos con `api.updateProfile()`)

---

## 💡 Tips

### Tip 1: Empieza simple
No actualices todo a la vez. Empieza con el login, luego transacciones, etc.

### Tip 2: Mantén la versión mock
Renombra los archivos originales a `-OLD.tsx` como backup.

### Tip 3: Console.log es tu amigo
```typescript
const data = await api.getTransactions();
console.log('Datos recibidos:', data);  // 👈 Verifica qué llega
setTransactions(data);
```

### Tip 4: Verifica el formato de respuesta
```typescript
// Si tu backend devuelve { data: [...] } en lugar de [...]
const response = await api.getTransactions();
setTransactions(response.data);  // 👈 Ajusta según tu backend
```

---

## 🚀 Siguiente paso

**Lee:** `/INICIO-RAPIDO.md` y sigue los 5 pasos.

En menos de 10 minutos tendrás el login funcionando con tu backend real.

---

¿Dudas? Todos los archivos de guía tienen ejemplos detallados y explicaciones paso a paso. 🎉
