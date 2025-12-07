# 📊 RESUMEN VISUAL - Integración Frontend ↔ Backend

## 🎨 Vista general del proyecto

```
┌──────────────────────────────────────────────────────────────────┐
│                      FINANCEFLOW                                 │
│              Plataforma de Finanzas Personales                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
         ┌──────▼──────┐            ┌───────▼──────┐
         │  FRONTEND   │   HTTP     │   BACKEND    │
         │ React + TS  │ ◄─────────►│ localhost:   │
         │             │   (API)    │    4000      │
         └─────────────┘            └──────────────┘
```

---

## 🗂️ Estructura de archivos creados

```
📁 tu-proyecto/
│
├── 📄 README-CONEXION.md          👈 LEE ESTO PRIMERO
├── 📄 INICIO-RAPIDO.md            ⚡ Guía rápida (5 pasos)
├── 📄 GUIA-CONEXION-BACKEND.md    📚 Guía completa
├── 📄 EJEMPLO-BACKEND.md          💻 Código de backend compatible
├── 📄 EXPLICACION.md              📘 Explicación del frontend
│
├── 📁 utils/
│   └── 📄 api.ts                  🆕 FUNCIONES PARA LLAMAR AL BACKEND
│                                     - login()
│                                     - register()
│                                     - getTransactions()
│                                     - createTransaction()
│                                     - etc.
│
├── 📁 contexts/
│   └── 📄 AuthContext.tsx         ✏️ MODIFICADO - Usa backend real
│
├── 📁 components/
│   ├── 📄 LoginPage.tsx           ✏️ MODIFICADO - Maneja errores
│   ├── 📄 TransactionsPage.tsx    (Original con datos mock)
│   ├── 📄 TransactionsPage-BACKEND.tsx  📘 EJEMPLO con backend
│   ├── 📄 BudgetsPage.tsx         (Datos mock - pendiente actualizar)
│   ├── 📄 DashboardPage.tsx       (Datos mock - pendiente actualizar)
│   └── 📄 ProfilePage.tsx         (Datos mock - pendiente actualizar)
│
└── 📁 App.tsx                     (Ya integra AuthContext)
```

---

## 🔄 Flujo de datos completo

### 1️⃣ AUTENTICACIÓN

```
┌─────────────────────────────────────────────────────────────────┐
│ PASO 1: Usuario ingresa credenciales                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
    ┌──────────────────────────────────────────────┐
    │  LoginPage.tsx                               │
    │  - Formulario con email/password             │
    │  - handleSubmit() → login(email, password)   │
    └──────────────────┬───────────────────────────┘
                       ↓
    ┌──────────────────────────────────────────────┐
    │  AuthContext.tsx                             │
    │  - Recibe email/password                     │
    │  - Llama a api.login()                       │
    └──────────────────┬───────────────────────────┘
                       ↓
    ┌──────────────────────────────────────────────┐
    │  utils/api.ts                                │
    │  - fetch('http://localhost:4000/api/auth/...')│
    │  - Envía: { email, password }                │
    └──────────────────┬───────────────────────────┘
                       ↓
         ════════════════════════════
         ═══   HTTP REQUEST   ═══
         ════════════════════════════
                       ↓
    ┌──────────────────────────────────────────────┐
    │  TU BACKEND (localhost:4000)                 │
    │  POST /api/auth/login                        │
    │  - Verifica email/password                   │
    │  - Genera token JWT                          │
    │  - Devuelve: { user: {...}, token: "..." }  │
    └──────────────────┬───────────────────────────┘
                       ↓
         ════════════════════════════
         ═══  HTTP RESPONSE   ═══
         ════════════════════════════
                       ↓
    ┌──────────────────────────────────────────────┐
    │  utils/api.ts                                │
    │  - Guarda token en localStorage              │
    │  - Devuelve datos del usuario                │
    └──────────────────┬───────────────────────────┘
                       ↓
    ┌──────────────────────────────────────────────┐
    │  AuthContext.tsx                             │
    │  - setUser(userData)                         │
    │  - isAuthenticated = true                    │
    └──────────────────┬───────────────────────────┘
                       ↓
    ┌──────────────────────────────────────────────┐
    │  App.tsx                                     │
    │  - Detecta isAuthenticated = true            │
    │  - Muestra Dashboard en lugar de Login       │
    └──────────────────────────────────────────────┘
                       ↓
               ✅ USUARIO LOGUEADO
```

---

### 2️⃣ CARGAR DATOS (Ejemplo: Transacciones)

```
┌─────────────────────────────────────────────────────────────────┐
│ PASO 2: Componente se monta                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
    ┌──────────────────────────────────────────────┐
    │  TransactionsPage.tsx                        │
    │  useEffect(() => {                           │
    │    loadTransactions();  ◄─ Se ejecuta 1 vez │
    │  }, []);                                     │
    └──────────────────┬───────────────────────────┘
                       ↓
    ┌──────────────────────────────────────────────┐
    │  const data = await api.getTransactions()    │
    └──────────────────┬───────────────────────────┘
                       ↓
    ┌──────────────────────────────────────────────┐
    │  utils/api.ts                                │
    │  - Lee token de localStorage                 │
    │  - fetch() con header:                       │
    │    Authorization: Bearer <token>             │
    └──────────────────┬───────────────────────────┘
                       ↓
         ════════════════════════════
         ═══   HTTP REQUEST   ═══
         ════════════════════════════
                       ↓
    ┌──────────────────────────────────────────────┐
    │  TU BACKEND                                  │
    │  GET /api/transactions                       │
    │  - Verifica token                            │
    │  - Identifica usuario                        │
    │  - Filtra transacciones del usuario          │
    │  - Devuelve: [{...}, {...}, ...]            │
    └──────────────────┬───────────────────────────┘
                       ↓
         ════════════════════════════
         ═══  HTTP RESPONSE   ═══
         ════════════════════════════
                       ↓
    ┌──────────────────────────────────────────────┐
    │  TransactionsPage.tsx                        │
    │  setTransactions(data)  ◄─ Guarda en estado │
    └──────────────────┬───────────────────────────┘
                       ↓
    ┌──────────────────────────────────────────────┐
    │  React re-renderiza                          │
    │  - Muestra las transacciones en la UI        │
    └──────────────────────────────────────────────┘
                       ↓
               ✅ DATOS MOSTRADOS
```

---

## 🔑 Conceptos clave (explicados simple)

### localStorage
```javascript
// Es como un "almacén" en el navegador
localStorage.setItem('auth_token', 'abc123');  // Guardar
const token = localStorage.getItem('auth_token');  // Leer
localStorage.removeItem('auth_token');  // Eliminar
```

### fetch()
```javascript
// Es la función para hacer peticiones HTTP
// Como "enviar una carta" al servidor
const response = await fetch('http://localhost:4000/api/login', {
  method: 'POST',  // Tipo de petición
  headers: { 'Content-Type': 'application/json' },  // Etiquetas
  body: JSON.stringify({ email, password })  // Contenido
});
const data = await response.json();  // Convertir respuesta a JSON
```

### useState
```javascript
// Es una "variable con superpoderes"
// Cuando cambia, React actualiza la pantalla
const [transactions, setTransactions] = useState([]);
// transactions = valor actual
// setTransactions = función para cambiarlo
```

### useEffect
```javascript
// Se ejecuta cuando el componente aparece en pantalla
useEffect(() => {
  loadData();  // Código a ejecutar
}, []);  // [] = solo una vez al inicio
```

### async/await
```javascript
// Para esperar respuestas del servidor
async function loadData() {
  const data = await api.getTransactions();  // Espera la respuesta
  setTransactions(data);  // Luego hace esto
}
```

---

## 🎯 Archivos modificados vs. creados

### ✅ Archivos LISTOS (no tocar)
- ✅ `/utils/api.ts` - Funciones API
- ✅ `/contexts/AuthContext.tsx` - Login real
- ✅ `/components/LoginPage.tsx` - Maneja errores

### 📘 Archivos de REFERENCIA
- 📘 `/components/TransactionsPage-BACKEND.tsx` - Ejemplo completo
- 📘 `/GUIA-CONEXION-BACKEND.md` - Guía paso a paso
- 📘 `/EJEMPLO-BACKEND.md` - Código de backend

### ⚠️ Archivos a ACTUALIZAR (cuando quieras)
- ⚠️ `/components/TransactionsPage.tsx` - Aún usa datos mock
- ⚠️ `/components/BudgetsPage.tsx` - Aún usa datos mock
- ⚠️ `/components/DashboardPage.tsx` - Aún usa datos mock
- ⚠️ `/components/ProfilePage.tsx` - Aún usa datos mock

---

## 🚦 Estado de integración

```
COMPONENTE           ESTADO          ACCIÓN REQUERIDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LoginPage            ✅ LISTO         Ninguna
AuthContext          ✅ LISTO         Ninguna
api.ts               ✅ LISTO         Ajustar API_URL si es necesario

TransactionsPage     🟡 MOCK          Copiar patrón de -BACKEND.tsx
BudgetsPage          🟡 MOCK          Similar a TransactionsPage
DashboardPage        🟡 MOCK          Llamar api.getDashboardStats()
ProfilePage          🟡 MOCK          Llamar api.updateProfile()
```

**Leyenda:**
- ✅ LISTO = Ya usa backend real
- 🟡 MOCK = Usa datos de ejemplo, funciona pero no persiste

---

## 📋 Checklist de implementación

### Fase 1: Preparación (5 min)
- [ ] Backend corriendo en localhost:4000
- [ ] CORS configurado en el backend
- [ ] API_URL correcta en `/utils/api.ts`

### Fase 2: Autenticación (10 min)
- [ ] Probar registro de usuario
- [ ] Probar login
- [ ] Verificar token en localStorage
- [ ] Probar cerrar sesión

### Fase 3: Datos (30 min)
- [ ] Actualizar TransactionsPage
- [ ] Probar listar transacciones
- [ ] Probar crear transacción
- [ ] Probar eliminar transacción

### Fase 4: Resto de páginas (1 hora)
- [ ] Actualizar BudgetsPage
- [ ] Actualizar DashboardPage
- [ ] Actualizar ProfilePage

---

## 🔧 Configuración rápida

### En el frontend (`/utils/api.ts`)
```typescript
const API_URL = 'http://localhost:4000';  // 👈 TU PUERTO AQUÍ
```

### En el backend
```javascript
// Express
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',  // 👈 URL DE TU FRONTEND
  credentials: true
}));
```

---

## 🎓 Orden de lectura recomendado

```
PRINCIPIANTE                INTERMEDIO              AVANZADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. README-CONEXION.md    →  2. GUIA-CONEXION-     →  3. Código fuente
   (Este archivo)           BACKEND.md               en /utils/api.ts
   Resumen general          Guía completa

         ↓                          ↓                        ↓

4. INICIO-RAPIDO.md      →  5. EJEMPLO-BACKEND    →  6. Adaptar
   5 pasos prácticos        Código de servidor       componentes
```

---

## 📞 Endpoints del backend

```
🔐 AUTENTICACIÓN
POST   /api/auth/register     { name, email, password }  →  { user, token }
POST   /api/auth/login        { email, password }        →  { user, token }
GET    /api/auth/me           [Auth Required]            →  { user }

💳 TRANSACCIONES
GET    /api/transactions      [Auth Required]            →  [{...}]
POST   /api/transactions      [Auth Required] {...}      →  {...}
DELETE /api/transactions/:id  [Auth Required]            →  {success}

🎯 PRESUPUESTOS
GET    /api/budgets           [Auth Required]            →  [{...}]
POST   /api/budgets           [Auth Required] {...}      →  {...}

📊 DASHBOARD
GET    /api/dashboard/stats   [Auth Required]            →  {balance, income, ...}
```

**[Auth Required]** = Necesita header: `Authorization: Bearer <token>`

---

## 💡 Tips finales

### 1. Usa dos terminales
```
┌─────────────────┬─────────────────┐
│  BACKEND        │  FRONTEND       │
│  puerto 4000    │  puerto 5173    │
├─────────────────┼─────────────────┤
│ npm start       │ npm run dev     │
│ Ver logs aquí → │ ← Ver errores   │
└─────────────────┴─────────────────┘
```

### 2. Usa DevTools siempre
```
F12 → Console    (ver errores de JavaScript)
F12 → Network    (ver peticiones HTTP)
F12 → Application (ver localStorage)
```

### 3. Mantén backup de los archivos
```bash
# Antes de modificar TransactionsPage.tsx
cp TransactionsPage.tsx TransactionsPage-OLD.tsx
```

### 4. Prueba incrementalmente
```
✅ Login funciona     →  ✅ Token se guarda  →  ✅ Transacciones
                                                  se cargan
```

---

## 🚀 ¡Empieza ahora!

```bash
# 1. Lee esto primero
cat INICIO-RAPIDO.md

# 2. Verifica tu backend
curl http://localhost:4000

# 3. Configura CORS
# (en tu backend)

# 4. Ajusta API_URL
# (en /utils/api.ts)

# 5. Prueba el login
# (abre la app y prueba)
```

---

## 📊 Diagrama de arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVEGADOR                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  REACT APP                          │   │
│  │                                                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │   │
│  │  │LoginPage │  │Dashboard │  │Transact. │  ...    │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘         │   │
│  │       │             │             │                │   │
│  │       └─────────────┴─────────────┘                │   │
│  │                     │                               │   │
│  │              ┌──────▼────────┐                     │   │
│  │              │ AuthContext   │                     │   │
│  │              └──────┬────────┘                     │   │
│  │                     │                               │   │
│  │              ┌──────▼────────┐                     │   │
│  │              │  utils/api.ts │                     │   │
│  │              │  - login()    │                     │   │
│  │              │  - getTrans() │                     │   │
│  │              └──────┬────────┘                     │   │
│  └──────────────────────┼────────────────────────────┘   │
│                         │                                 │
│  ┌──────────────────────▼────────────────────────────┐   │
│  │           localStorage                            │   │
│  │           auth_token: "eyJhbG..."                 │   │
│  └────────────────────────────────────────────────────   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ HTTP (fetch)
                       │
┌──────────────────────▼──────────────────────────────────┐
│               SERVIDOR (localhost:4000)                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │                  BACKEND API                       │ │
│  │                                                     │ │
│  │  /api/auth/login  ─────┐                          │ │
│  │  /api/auth/register ───┼── JWT Auth              │ │
│  │  /api/auth/me  ────────┘                          │ │
│  │                                                     │ │
│  │  /api/transactions ────┐                          │ │
│  │  /api/budgets ─────────┼── Protected Routes      │ │
│  │  /api/dashboard/stats ─┘   (require token)       │ │
│  │                                                     │ │
│  └─────────────────┬───────────────────────────────── │ │
│                    │                                    │ │
│  ┌─────────────────▼───────────────────────────────┐  │ │
│  │              BASE DE DATOS                      │  │ │
│  │         (MongoDB / PostgreSQL / etc)            │  │ │
│  │  - users                                        │  │ │
│  │  - transactions                                 │  │ │
│  │  - budgets                                      │  │ │
│  └──────────────────────────────────────────────────  │ │
└──────────────────────────────────────────────────────────┘
```

---

✨ **¡Todo listo!** Ahora tienes una guía visual completa de cómo conectar tu frontend con el backend.

🎯 **Siguiente paso:** Abre `/INICIO-RAPIDO.md` y sigue los 5 pasos.
