# ⚡ INICIO RÁPIDO - Conectar Frontend con Backend

## 🎯 Lo que necesitas saber en 2 minutos

Ya tienes **TODO el código listo** para conectar con tu backend en `localhost:4000`. Solo necesitas seguir estos pasos:

---

## 📋 Pasos rápidos

### 1️⃣ **Verifica tu backend** (30 segundos)

```bash
# Abre una terminal y ejecuta:
curl http://localhost:4000

# ¿Funciona? ✅ Continúa al paso 2
# ¿No funciona? ❌ Inicia tu backend primero
```

---

### 2️⃣ **Configura la URL** (10 segundos)

Abre `/utils/api.ts` línea 10:

```typescript
const API_URL = 'http://localhost:4000';  // 👈 ¿Es tu puerto? Si no, cámbialo
```

---

### 3️⃣ **Asegura CORS en tu backend** (1 minuto)

En tu backend, necesitas esto:

```javascript
// Si usas Express:
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',  // URL de tu frontend
  credentials: true
}));
```

**Sin CORS = errores de conexión** ⚠️

---

### 4️⃣ **Prueba el login** (30 segundos)

1. Abre tu app
2. Intenta hacer login
3. Abre **DevTools** (F12) > Pestaña **Console**
4. ¿Ves errores? Lee el mensaje y ajusta

---

### 5️⃣ **Verifica el token** (20 segundos)

Después de login exitoso:

1. Abre **DevTools** (F12)
2. Ve a **Application** > **Local Storage**
3. Busca la clave `auth_token`
4. ¿Está ahí? ✅ Perfecto, continúa

---

## 🗺️ Mapa mental de la conexión

```
TU APP (Frontend)                    TU SERVIDOR (Backend)
━━━━━━━━━━━━━━━━━━━━                ━━━━━━━━━━━━━━━━━━━━━━━━

LoginPage.tsx                        
    ↓
AuthContext.login()
    ↓
api.login()                          ➜  POST /api/auth/login
    ↓                                    ↓
localStorage.setItem('token')        ←  { user, token }
    ↓
✅ Usuario logueado


TransactionsPage.tsx
    ↓
useEffect(() => loadData())
    ↓
api.getTransactions()                ➜  GET /api/transactions
    ↓                                    (Header: Bearer token)
setTransactions(data)                ←  [ {...}, {...} ]
    ↓
✅ Datos mostrados
```

---

## 📂 Archivos que ya están listos

✅ **`/utils/api.ts`** - Todas las funciones para llamar al backend
✅ **`/contexts/AuthContext.tsx`** - Maneja login/logout con backend real
✅ **`/components/LoginPage.tsx`** - Muestra errores del servidor

---

## 🔧 Archivos que necesitas adaptar

### Opción A: Copiar y pegar (Más fácil)

```bash
# 1. Renombra el original (backup)
mv components/TransactionsPage.tsx components/TransactionsPage-OLD.tsx

# 2. Usa la versión con backend
mv components/TransactionsPage-BACKEND.tsx components/TransactionsPage.tsx
```

### Opción B: Modificar manualmente

Abre `TransactionsPage.tsx` y agrega:

```typescript
// Al inicio del archivo
import { useEffect, useState } from 'react';
import * as api from '../utils/api';

// Dentro del componente
const [transactions, setTransactions] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  loadTransactions();
}, []);

const loadTransactions = async () => {
  setIsLoading(true);
  try {
    const data = await api.getTransactions();
    setTransactions(data);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🎯 Endpoints que tu backend DEBE tener

| Método | Endpoint | Qué hace | Qué devuelve |
|--------|----------|----------|--------------|
| POST | `/api/auth/login` | Login | `{ user, token }` |
| POST | `/api/auth/register` | Registro | `{ user, token }` |
| GET | `/api/auth/me` | Usuario actual | `{ id, name, email, avatar }` |
| GET | `/api/transactions` | Listar | `[{...}, {...}]` |
| POST | `/api/transactions` | Crear | `{...}` |
| DELETE | `/api/transactions/:id` | Eliminar | `{ success: true }` |
| GET | `/api/budgets` | Listar | `[{...}, {...}]` |
| GET | `/api/dashboard/stats` | Estadísticas | `{ balance, income, expenses, savings }` |

**¿No tienes estos endpoints?** Lee `/EJEMPLO-BACKEND.md` para ver código de ejemplo.

---

## 🐛 Errores comunes y soluciones

### Error: "CORS policy"
```
❌ Access-Control-Allow-Origin blocked
✅ Agrega CORS en tu backend (ver paso 3)
```

### Error: "Failed to fetch"
```
❌ Network request failed
✅ Verifica:
   1. Backend corriendo en puerto correcto
   2. API_URL correcto en /utils/api.ts
   3. Endpoint existe
```

### Error: "401 Unauthorized"
```
❌ Token no válido
✅ Verifica:
   1. Token se guarda en localStorage
   2. Backend acepta "Authorization: Bearer <token>"
```

### No se ven datos
```
❌ Pantalla vacía
✅ Abre DevTools > Console y Network
   Busca errores o respuestas incorrectas
```

---

## 📚 Guías completas disponibles

- **`GUIA-CONEXION-BACKEND.md`** - Guía completa paso a paso
- **`EJEMPLO-BACKEND.md`** - Código completo de backend compatible
- **`EXPLICACION.md`** - Explicación del frontend

---

## ✅ Checklist antes de empezar

Marca cada item:

- [ ] Mi backend está corriendo en `localhost:4000`
- [ ] CORS está configurado
- [ ] He leído qué endpoints necesito
- [ ] Tengo acceso a las herramientas de desarrollo (F12)
- [ ] Sé dónde está la consola de mi backend

---

## 🚀 Flujo completo de prueba

```bash
# 1. Inicia tu backend
cd tu-backend
npm start

# 2. En otra terminal, inicia el frontend
npm run dev

# 3. Abre el navegador
# http://localhost:5173

# 4. Abre DevTools (F12)

# 5. Intenta registrarte
# - Email: test@test.com
# - Password: 123456
# - Nombre: Test User

# 6. Revisa la consola
# ¿Ves "POST http://localhost:4000/api/auth/register"?
# ¿Qué status code devuelve? (200 = bien, 4xx/5xx = error)

# 7. Si funciona el login, verás el Dashboard
# Si no, lee el error en la consola
```

---

## 💡 Tip Pro

**Usa 2 terminales lado a lado:**

```
┌─────────────────────────┬─────────────────────────┐
│  TERMINAL 1: Backend    │  TERMINAL 2: Frontend   │
│  npm start              │  npm run dev            │
│  (Puerto 4000)          │  (Puerto 5173)          │
│                         │                         │
│  Logs del servidor →    │  ← Errores aquí        │
└─────────────────────────┴─────────────────────────┘
```

Y el **navegador con DevTools abierto** para ver errores en tiempo real.

---

## 🎯 Objetivo final

Cuando todo funcione, deberías poder:

✅ Registrarte con email/password
✅ Hacer login
✅ Ver el token en localStorage
✅ Ver transacciones cargadas desde el backend
✅ Crear/eliminar transacciones
✅ Cerrar sesión

---

## ❓ ¿Algo no funciona?

1. **Lee el error** en la consola (F12)
2. **Verifica la pestaña Network** - ¿Qué petición falla?
3. **Revisa el backend** - ¿Qué responde?
4. **Compara con los ejemplos** en `EJEMPLO-BACKEND.md`

---

🎉 **¡Listo para empezar!** Sigue los 5 pasos y tendrás todo conectado en minutos.
