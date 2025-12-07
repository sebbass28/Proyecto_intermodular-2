# 🔌 GUÍA DE CONEXIÓN CON TU BACKEND

## 📋 Índice
1. [¿Qué hemos hecho?](#qué-hemos-hecho)
2. [Estructura de archivos](#estructura-de-archivos)
3. [Cómo funciona](#cómo-funciona)
4. [Endpoints que necesita tu backend](#endpoints-que-necesita-tu-backend)
5. [Cómo adaptar el código](#cómo-adaptar-el-código)
6. [Solución de problemas comunes](#solución-de-problemas-comunes)

---

## 🎯 ¿Qué hemos hecho?

Hemos creado la **infraestructura para conectar tu frontend con el backend**, específicamente:

✅ **`/utils/api.ts`** - Todas las funciones para llamar a tu backend
✅ **`/contexts/AuthContext.tsx`** - Actualizado para usar autenticación real
✅ **`/components/LoginPage.tsx`** - Maneja errores del backend
✅ **`/components/TransactionsPage-BACKEND.tsx`** - Ejemplo de cómo cargar datos reales

---

## 📂 Estructura de archivos

```
tu-proyecto/
├── utils/
│   └── api.ts                          👈 NUEVO: Funciones para llamar al backend
├── contexts/
│   └── AuthContext.tsx                 ✏️ MODIFICADO: Usa backend real
├── components/
│   ├── LoginPage.tsx                   ✏️ MODIFICADO: Maneja errores
│   ├── TransactionsPage.tsx            (Original con datos mock)
│   └── TransactionsPage-BACKEND.tsx    👈 NUEVO: Ejemplo con backend real
```

---

## ⚙️ Cómo funciona

### 1. **Flujo de Autenticación**

```
Usuario escribe email/password
        ↓
LoginPage llama a login()
        ↓
AuthContext.login() llama a api.login()
        ↓
api.login() hace fetch a http://localhost:4000/api/auth/login
        ↓
Backend responde con { user, token }
        ↓
Token se guarda en localStorage
        ↓
Usuario se guarda en el estado
        ↓
¡Usuario logueado! App muestra el Dashboard
```

### 2. **Flujo de datos (ejemplo: Transacciones)**

```
Componente se monta (useEffect)
        ↓
Llama a api.getTransactions()
        ↓
fetch a http://localhost:4000/api/transactions
        ↓
Backend responde con array de transacciones
        ↓
Se guardan en el estado con setTransactions()
        ↓
React re-renderiza mostrando los datos
```

---

## 🛣️ Endpoints que necesita tu backend

Tu backend en `localhost:4000` debe tener estos endpoints:

### 🔐 **Autenticación**

#### `POST /api/auth/login`
```json
// Request
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}

// Response
{
  "user": {
    "id": "1",
    "name": "Juan Pérez",
    "email": "usuario@example.com",
    "avatar": "https://..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `POST /api/auth/register`
```json
// Request
{
  "name": "Juan Pérez",
  "email": "usuario@example.com",
  "password": "contraseña123"
}

// Response (igual que login)
{
  "user": { ... },
  "token": "..."
}
```

#### `GET /api/auth/me`
```json
// Request Headers
Authorization: Bearer <token>

// Response
{
  "id": "1",
  "name": "Juan Pérez",
  "email": "usuario@example.com",
  "avatar": "https://..."
}
```

---

### 💳 **Transacciones**

#### `GET /api/transactions`
```json
// Request Headers
Authorization: Bearer <token>

// Response
[
  {
    "id": "1",
    "type": "income",
    "category": "Salario",
    "amount": 3500,
    "description": "Pago mensual",
    "date": "2025-10-01"
  },
  {
    "id": "2",
    "type": "expense",
    "category": "Comida",
    "amount": -85,
    "description": "Supermercado",
    "date": "2025-10-03"
  }
]
```

#### `POST /api/transactions`
```json
// Request
{
  "type": "expense",
  "category": "Comida",
  "amount": 50,
  "description": "Restaurante",
  "date": "2025-10-11"
}

// Response
{
  "id": "11",
  "type": "expense",
  "category": "Comida",
  "amount": -50,
  "description": "Restaurante",
  "date": "2025-10-11"
}
```

#### `DELETE /api/transactions/:id`
```json
// Request Headers
Authorization: Bearer <token>

// Response
{
  "success": true,
  "message": "Transacción eliminada"
}
```

---

### 🎯 **Presupuestos**

#### `GET /api/budgets`
```json
[
  {
    "id": "1",
    "category": "Comida",
    "limit": 600,
    "spent": 450
  }
]
```

#### `POST /api/budgets`
```json
// Request
{
  "category": "Entretenimiento",
  "limit": 200
}

// Response
{
  "id": "5",
  "category": "Entretenimiento",
  "limit": 200,
  "spent": 0
}
```

---

### 📊 **Dashboard**

#### `GET /api/dashboard/stats`
```json
{
  "balance": 12450,
  "income": 4250,
  "expenses": 1380,
  "savings": 2870
}
```

---

## 🔧 Cómo adaptar el código

### **Paso 1: Verifica la URL del backend**

En `/utils/api.ts`, línea 10:
```typescript
const API_URL = 'http://localhost:4000';  // 👈 Cambia esto si tu puerto es diferente
```

Si tu backend está en otro puerto (ej: `3001`):
```typescript
const API_URL = 'http://localhost:3001';
```

---

### **Paso 2: Adapta los endpoints**

Si tus endpoints son diferentes, modifica las funciones en `/utils/api.ts`.

Por ejemplo, si tu backend usa `/auth/signin` en lugar de `/api/auth/login`:

```typescript
// ANTES
export async function login(email: string, password: string) {
  return await fetchAPI('/api/auth/login', { ... });
}

// DESPUÉS
export async function login(email: string, password: string) {
  return await fetchAPI('/auth/signin', { ... });
}
```

---

### **Paso 3: Adapta la estructura de respuesta**

Si tu backend devuelve datos en formato diferente, ajusta en `AuthContext.tsx`:

```typescript
// Si tu backend devuelve solo el usuario (sin campo "user"):
const login = async (email: string, password: string, name?: string) => {
  const userData = await api.login(email, password);
  
  // ANTES
  setUser(userData.user || userData);
  
  // DESPUÉS (si tu backend devuelve directamente el usuario)
  setUser(userData);
};
```

---

### **Paso 4: Actualiza los componentes para usar datos reales**

Tienes un archivo de ejemplo: `/components/TransactionsPage-BACKEND.tsx`

**Para actualizar TransactionsPage:**

1. Abre `TransactionsPage.tsx`
2. Compáralo con `TransactionsPage-BACKEND.tsx`
3. Copia los cambios clave:
   - Agrega el import de `api`
   - Agrega estados `isLoading` y efecto `useEffect`
   - Reemplaza datos hardcoded con llamadas a la API

**Cambios clave:**

```typescript
// ANTES (datos mock)
const allTransactions = [
  { id: 1, type: 'income', ... },
  // ...
];

// DESPUÉS (datos del backend)
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

## 🐛 Solución de problemas comunes

### **Error: CORS (Access-Control-Allow-Origin)**

**Síntoma:** Error en consola del navegador tipo:
```
Access to fetch at 'http://localhost:4000/api/auth/login' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solución:** En tu backend (Node.js/Express), agrega:

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend
  credentials: true
}));
```

---

### **Error: Network request failed / Failed to fetch**

**Posibles causas:**
1. ❌ El backend no está corriendo
2. ❌ Puerto incorrecto en `API_URL`
3. ❌ Endpoint no existe en el backend

**Solución:**
```bash
# 1. Verifica que el backend está corriendo
curl http://localhost:4000/api/auth/login

# 2. Revisa la consola del navegador (F12 > Network)
# 3. Compara la URL que se está llamando con tus endpoints
```

---

### **Error: 401 Unauthorized**

**Causa:** El token no se está enviando correctamente

**Solución:** Verifica en `api.ts` que el token se envía:

```typescript
const token = localStorage.getItem('auth_token');
const headers = {
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),  // 👈 Importante
};
```

En tu backend, verifica que lees el header:
```javascript
const token = req.headers.authorization?.split(' ')[1];
```

---

### **Los datos no se actualizan**

**Causa:** No estás recargando los datos después de crear/editar/eliminar

**Solución:** Llama a la función de carga después de cada operación:

```typescript
const handleDelete = async (id: string) => {
  await api.deleteTransaction(id);
  loadTransactions();  // 👈 Recargar
};
```

---

## 🎯 Checklist de integración

Sigue estos pasos en orden:

- [ ] 1. **Backend corriendo** - Verifica con `curl http://localhost:4000`
- [ ] 2. **CORS configurado** - Permite peticiones desde tu frontend
- [ ] 3. **URL correcta** - Revisa `API_URL` en `/utils/api.ts`
- [ ] 4. **Prueba login** - Intenta hacer login, revisa la consola
- [ ] 5. **Token guardado** - Abre DevTools > Application > LocalStorage
- [ ] 6. **Adapta endpoints** - Ajusta las rutas en `api.ts` si difieren
- [ ] 7. **Actualiza componentes** - Usa `TransactionsPage-BACKEND.tsx` como guía
- [ ] 8. **Prueba cada función** - Login, cargar datos, crear, eliminar

---

## 📝 Ejemplo completo de conversión

### ANTES (con datos mock):
```typescript
export function TransactionsPage() {
  const transactions = [
    { id: 1, type: 'income', amount: 100 },
    // ... datos hardcoded
  ];

  return <div>{transactions.map(...)}</div>;
}
```

### DESPUÉS (con backend):
```typescript
import { useEffect, useState } from 'react';
import * as api from '../utils/api';

export function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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

  if (isLoading) return <div>Cargando...</div>;

  return <div>{transactions.map(...)}</div>;
}
```

---

## 🚀 Próximos pasos

1. **Prueba el login** primero
2. **Verifica que el token se guarda** en localStorage
3. **Actualiza TransactionsPage** usando el ejemplo
4. **Repite el proceso** para BudgetsPage, DashboardPage, etc.

---

## ❓ ¿Necesitas ayuda?

Si algo no funciona, revisa:
1. **Consola del navegador** (F12) - Errores de JavaScript
2. **Pestaña Network** - Qué peticiones se están haciendo
3. **Consola del backend** - Qué errores muestra tu servidor

**Puntos clave a verificar:**
- ¿La URL es correcta?
- ¿El endpoint existe en el backend?
- ¿El formato de respuesta coincide?
- ¿CORS está configurado?
- ¿El token se envía correctamente?

---

💡 **¡Listo!** Ahora tienes todo para conectar tu frontend con el backend en `localhost:4000`
