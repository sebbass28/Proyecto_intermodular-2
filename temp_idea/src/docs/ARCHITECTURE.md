# FinanceFlow - Arquitectura Técnica

## 🏗️ ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                     React + TypeScript                          │
│                      Tailwind CSS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Pages      │  │  Components  │  │   Contexts   │         │
│  │              │  │              │  │              │         │
│  │ - Dashboard  │  │ - Header     │  │ - Auth       │         │
│  │ - Transac.   │  │ - Sidebar    │  │ - Demo       │         │
│  │ - Budgets    │  │ - Cards      │  │              │         │
│  │ - Wallets    │  │ - Modals     │  │              │         │
│  │ - etc.       │  │ - Charts     │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                      API LAYER (utils/api.ts)                   │
│                    Fetch API + Error Handling                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                      BACKEND (Supabase)                         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Edge Function│  │  Auth Service│  │   Database   │         │
│  │              │  │              │  │              │         │
│  │ Hono Server  │  │ - Sign Up    │  │ Key-Value    │         │
│  │              │  │ - Sign In    │  │ Store        │         │
│  │ /make-server │  │ - Sessions   │  │              │         │
│  │ -5016f3b0/   │  │ - OAuth      │  │ kv_store_    │         │
│  │              │  │              │  │ 5016f3b0     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 ESTRUCTURA DE CARPETAS

```
/
├── App.tsx                    # Componente principal
├── docs/                      # Documentación
│   ├── WIREFRAME.md          # Wireframes
│   ├── MOCKUP.md             # Mockups visuales
│   └── ARCHITECTURE.md       # Este archivo
├── components/
│   ├── ui/                   # Componentes base (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   ├── Header.tsx            # Barra superior
│   ├── Sidebar.tsx           # Menú lateral
│   ├── DemoModeBanner.tsx    # Banner modo demo
│   ├── NewTransactionModal.tsx  # Modal transacciones
│   ├── LoginPage.tsx         # Página login
│   ├── RegisterPage.tsx      # Página registro
│   ├── DashboardPage.tsx     # Dashboard principal
│   ├── TransactionsPage.tsx  # Gestión transacciones
│   ├── BudgetsPage.tsx       # Presupuestos
│   ├── WalletsPage.tsx       # Carteras
│   ├── InvestmentsPage.tsx   # Inversiones
│   ├── GoalsPage.tsx         # Metas
│   ├── ReportsPage.tsx       # Reportes
│   ├── ProfilePage.tsx       # Perfil
│   └── SettingsPage.tsx      # Configuración
├── contexts/
│   ├── AuthContext.tsx       # Contexto autenticación
│   └── DemoContext.tsx       # Contexto modo demo
├── utils/
│   ├── api.ts                # Cliente API
│   └── supabase/
│       └── info.tsx          # Config Supabase
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx     # Servidor Hono
│           └── kv_store.tsx  # Utilidades KV (protegido)
└── styles/
    └── globals.css           # Estilos globales + Tailwind
```

---

## 🔄 FLUJO DE DATOS

### 1. Autenticación
```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  Login   │ ───> │   API    │ ───> │ Supabase │ ───> │   Auth   │
│  Form    │      │  Layer   │      │  Server  │      │ Context  │
└──────────┘      └──────────┘      └──────────┘      └──────────┘
                                          │
                                          ├─> Session Token
                                          └─> User Data
```

### 2. CRUD de Transacciones
```
┌──────────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│ Transaction  │ ───> │   API    │ ───> │  Server  │ ───> │    KV    │
│    Modal     │      │  Layer   │      │   Hono   │      │  Store   │
└──────────────┘      └──────────┘      └──────────┘      └──────────┘
      ↑                                                          │
      │                                                          │
      └──────────────────── Response ─────────────────────────┘
```

### 3. Modo Demo (Fallback)
```
┌──────────┐      ┌──────────┐      ❌ Network Error
│   Page   │ ───> │   API    │ ───> 
└──────────┘      └──────────┘      
      │                 │
      │                 └─> Catch Error
      │                       │
      │                       ├─> Enable Demo Mode
      │                       └─> Return Mock Data
      │
      └────────────> Use Mock Data
                    Show Demo Banner
```

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### Flujo de Login
```javascript
1. Usuario ingresa email y password
2. Frontend llama a: supabase.auth.signInWithPassword()
3. Supabase devuelve:
   - access_token
   - refresh_token
   - user data
4. AuthContext almacena:
   - isAuthenticated: true
   - user: { name, email, avatar }
5. Redirect a Dashboard
```

### Flujo de Registro
```javascript
1. Usuario completa formulario
2. Frontend llama a: POST /make-server-5016f3b0/signup
3. Server crea usuario con supabase.auth.admin.createUser()
4. Auto-confirma email (email_confirm: true)
5. Devuelve user data
6. Frontend hace auto-login
```

### Protected Routes
```javascript
// En cada API call
headers: {
  'Authorization': `Bearer ${access_token}`,
  'Content-Type': 'application/json'
}

// En el servidor
const accessToken = request.headers.get('Authorization')?.split(' ')[1];
const { data: { user } } = await supabase.auth.getUser(accessToken);
if (!user?.id) return new Response('Unauthorized', { status: 401 });
```

---

## 💾 BASE DE DATOS (Key-Value Store)

### Estructura de Datos

#### Transacciones
```typescript
Key: `transactions:${userId}`
Value: [
  {
    id: string,
    type: 'income' | 'expense',
    amount: number,
    category: string,
    description: string,
    date: string,
    createdAt: string
  }
]
```

#### Presupuestos
```typescript
Key: `budgets:${userId}`
Value: [
  {
    id: string,
    category: string,
    limit: number,
    spent: number,
    period: 'monthly',
    startDate: string,
    endDate: string
  }
]
```

#### Carteras
```typescript
Key: `wallets:${userId}`
Value: [
  {
    id: string,
    name: string,
    type: 'bank' | 'cash' | 'credit' | 'investment',
    balance: number,
    currency: string,
    icon: string
  }
]
```

#### Inversiones
```typescript
Key: `investments:${userId}`
Value: [
  {
    id: string,
    asset: string,
    type: 'stock' | 'crypto' | 'bond' | 'real_estate',
    quantity: number,
    purchasePrice: number,
    currentPrice: number,
    purchaseDate: string
  }
]
```

#### Metas
```typescript
Key: `goals:${userId}`
Value: [
  {
    id: string,
    name: string,
    targetAmount: number,
    currentAmount: number,
    deadline: string,
    icon: string,
    status: 'active' | 'completed'
  }
]
```

#### Usuario
```typescript
Key: `user:${userId}`
Value: {
  name: string,
  email: string,
  phone: string,
  avatar: string,
  plan: 'free' | 'premium' | 'pro',
  settings: {
    language: string,
    currency: string,
    timezone: string,
    notifications: {
      email: boolean,
      budget: boolean,
      goals: boolean,
      newsletter: boolean
    }
  }
}
```

---

## 🌐 API ENDPOINTS

### Base URL
```
https://${projectId}.supabase.co/functions/v1/make-server-5016f3b0
```

### Endpoints

#### Autenticación
```
POST /signup
Body: { email, password, name }
Response: { user, access_token }

POST /signin
Body: { email, password }
Response: { access_token, user }

POST /signout
Headers: { Authorization: Bearer <token> }
Response: { success: true }
```

#### Transacciones
```
GET /transactions
Headers: { Authorization: Bearer <token> }
Response: { transactions: [...] }

POST /transactions
Headers: { Authorization: Bearer <token> }
Body: { type, amount, category, description, date }
Response: { transaction: {...} }

PUT /transactions/:id
Headers: { Authorization: Bearer <token> }
Body: { type, amount, category, description, date }
Response: { transaction: {...} }

DELETE /transactions/:id
Headers: { Authorization: Bearer <token> }
Response: { success: true }
```

#### Presupuestos
```
GET /budgets
POST /budgets
PUT /budgets/:id
DELETE /budgets/:id
```

#### Carteras
```
GET /wallets
POST /wallets
PUT /wallets/:id
DELETE /wallets/:id
```

#### Inversiones
```
GET /investments
POST /investments
PUT /investments/:id
DELETE /investments/:id
```

#### Metas
```
GET /goals
POST /goals
PUT /goals/:id
DELETE /goals/:id
POST /goals/:id/add-funds
```

#### Reportes
```
GET /reports
Query: { period: 'monthly' | 'quarterly' | 'yearly', date }
Response: { income, expenses, balance, categories, trends }
```

#### Usuario
```
GET /user
PUT /user
```

---

## 🎯 MODO DEMO

### Activación Automática
```javascript
// En utils/api.ts
try {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error();
  return await response.json();
} catch (error) {
  // Si hay error de red, activa modo demo
  if (error.name === 'NetworkError' || !navigator.onLine) {
    setDemoMode(true);
    return getMockData(endpoint);
  }
  throw error;
}
```

### Datos Mock
```javascript
// Datos de ejemplo completos
const MOCK_DATA = {
  transactions: [...],  // 50+ transacciones de ejemplo
  budgets: [...],       // 5 presupuestos
  wallets: [...],       // 4 carteras
  investments: [...],   // 8 inversiones
  goals: [...],         // 5 metas
  user: {...}          // Usuario demo
};
```

### Limitaciones en Modo Demo
- ✅ Ver todos los datos
- ✅ Navegar entre páginas
- ✅ Ver gráficos y reportes
- ❌ Crear nuevas transacciones
- ❌ Editar presupuestos
- ❌ Guardar configuración
- ⚠️ Banner visible en todas las páginas

---

## 🎨 SISTEMA DE DISEÑO

### Tokens de Color (globals.css)
```css
@theme {
  --color-primary: #2563eb;
  --color-secondary: #9333ea;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

### Componentes UI Base
- Todos importados de `./components/ui/`
- Basados en shadcn/ui
- Estilizados con Tailwind CSS
- Accesibles (ARIA)
- Responsive

---

## 📊 BIBLIOTECAS PRINCIPALES

```json
{
  "dependencies": {
    "react": "^18.x",
    "motion": "^latest",           // Animaciones
    "recharts": "^latest",         // Gráficos
    "lucide-react": "^latest",     // Iconos
    "sonner": "2.0.3",            // Notificaciones toast
    "react-hook-form": "7.55.0",  // Formularios
    "@supabase/supabase-js": "^latest"  // Cliente Supabase
  }
}
```

---

## 🔒 SEGURIDAD

### Variables de Entorno
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...        # Frontend (público)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx... # Backend (privado)
```

### Reglas de Seguridad
1. ❌ NUNCA exponer SERVICE_ROLE_KEY al frontend
2. ✅ Validar usuario en cada endpoint protegido
3. ✅ Usar HTTPS para todas las peticiones
4. ✅ Tokens JWT con expiración
5. ✅ Rate limiting en el servidor

---

## 🚀 OPTIMIZACIONES

### Performance
- Lazy loading de páginas
- Memoización con React.memo
- Debounce en búsquedas
- Paginación de transacciones
- Virtual scrolling para listas largas
- Code splitting por ruta

### SEO (si aplica)
- Meta tags dinámicos
- Open Graph tags
- Sitemap
- robots.txt

### Accesibilidad
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Contraste de colores WCAG AA
- Screen reader friendly

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
```css
/* Mobile First */
/* xs: 0px - 639px */
/* sm: 640px */
/* md: 768px */
/* lg: 1024px */
/* xl: 1280px */
/* 2xl: 1536px */
```

### Estrategia
1. Mobile First: Diseño base para móvil
2. Progressive Enhancement: Mejoras para pantallas grandes
3. Touch-friendly: Botones mínimo 44x44px
4. Responsive images: srcset y sizes

---

## 🧪 TESTING (Futuro)

### Sugerencias
```
Unit Tests:
- Components con React Testing Library
- Utilidades con Jest
- Hooks personalizados

Integration Tests:
- Flujos de usuario
- API mocking

E2E Tests:
- Playwright o Cypress
- Flujos críticos (login, crear transacción)
```

---

## 🔧 MANTENIMIENTO

### Logs
- Console.log para desarrollo
- Error tracking (Sentry sugerido)
- Performance monitoring

### Actualizaciones
- Dependencias: Revisar semanalmente
- Seguridad: Aplicar patches inmediatamente
- Features: Versionado semántico

---

## 📈 ESCALABILIDAD

### Futuras Mejoras
1. **Cache Layer**: Redis para datos frecuentes
2. **CDN**: Para assets estáticos
3. **WebSockets**: Notificaciones en tiempo real
4. **Micro-frontends**: Si crece mucho
5. **GraphQL**: API más flexible
6. **PWA**: Funcionalidad offline
7. **Migración a PostgreSQL**: Para queries complejas

---

## 🎯 MÉTRICAS Y KPIs

### Performance
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse Score > 90

### Negocio
- Tasa de conversión Free → Premium
- Transacciones creadas por usuario
- Retención a 30 días
- NPS (Net Promoter Score)

---

## 📚 RECURSOS

### Documentación
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Supabase: https://supabase.com/docs
- Motion: https://motion.dev
- Recharts: https://recharts.org

### Herramientas
- Figma: Diseño
- VS Code: Editor
- Git: Control de versiones
- Postman: Testing API

---

**Arquitectura:** Three-Tier (Frontend → Server → Database)  
**Patrón:** MVC adaptado para React  
**Escalabilidad:** Horizontal (Serverless)  
**Versión:** 1.0
