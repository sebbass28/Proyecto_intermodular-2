# 🖥️ EJEMPLO DE BACKEND COMPATIBLE

## 📌 Estructura recomendada para tu backend

Si estás usando **Node.js + Express**, aquí tienes un ejemplo de cómo debería verse tu backend para ser 100% compatible con el frontend.

---

## 🚀 Setup básico

### 1. **Instala las dependencias**

```bash
npm install express cors jsonwebtoken bcrypt dotenv
npm install --save-dev nodemon
```

### 2. **Estructura de archivos**

```
backend/
├── server.js              # Archivo principal
├── routes/
│   ├── auth.js            # Rutas de autenticación
│   ├── transactions.js    # Rutas de transacciones
│   ├── budgets.js         # Rutas de presupuestos
│   └── dashboard.js       # Rutas de dashboard
├── middleware/
│   └── auth.js            # Middleware de autenticación
├── .env                   # Variables de entorno
└── package.json
```

---

## 📄 Código de ejemplo

### **server.js** (Archivo principal)

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// ========================================
// MIDDLEWARES
// ========================================

// IMPORTANTE: Configurar CORS para permitir peticiones del frontend
app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend
  credentials: true
}));

// Parsear JSON en las peticiones
app.use(express.json());

// Logger simple
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ========================================
// RUTAS
// ========================================

// Importar rutas
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');
const dashboardRoutes = require('./routes/dashboard');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'FinanceFlow API funcionando ✅' });
});

// ========================================
// MANEJO DE ERRORES
// ========================================

app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    message: err.message || 'Error del servidor' 
  });
});

// ========================================
// INICIAR SERVIDOR
// ========================================

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
```

---

### **routes/auth.js** (Autenticación)

```javascript
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Simulamos una base de datos en memoria
// En producción, usarías MongoDB, PostgreSQL, etc.
const users = [];

// Clave secreta para JWT (en .env en producción)
const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-super-segura';

// ========================================
// POST /api/auth/register
// ========================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación básica
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Nombre, email y contraseña son requeridos' 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        message: 'El email ya está registrado' 
      });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = {
      id: String(users.length + 1),
      name,
      email,
      password: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };

    users.push(user);

    // Generar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Responder (NO enviamos la contraseña)
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      token
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// ========================================
// POST /api/auth/login
// ========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Responder
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// ========================================
// GET /api/auth/me
// ========================================
router.get('/me', (req, res) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Buscar usuario
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Responder
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    });

  } catch (error) {
    console.error('Error en /me:', error);
    res.status(401).json({ message: 'Token inválido' });
  }
});

module.exports = router;
```

---

### **middleware/auth.js** (Middleware de autenticación)

```javascript
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-super-segura';

// Middleware para verificar que el usuario está autenticado
function authenticateToken(req, res, next) {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No autorizado - Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Agregar userId al request para usarlo en las rutas
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

module.exports = authenticateToken;
```

---

### **routes/transactions.js** (Transacciones)

```javascript
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

// Base de datos en memoria
// En producción, usarías una BD real
const transactions = [
  { id: '1', userId: '1', type: 'income', category: 'Salario', amount: 3500, date: '2025-10-01', description: 'Pago mensual' },
  { id: '2', userId: '1', type: 'expense', category: 'Comida', amount: -85, date: '2025-10-03', description: 'Supermercado' },
];

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// ========================================
// GET /api/transactions
// ========================================
router.get('/', (req, res) => {
  // Filtrar solo las transacciones del usuario actual
  const userTransactions = transactions.filter(t => t.userId === req.userId);
  res.json(userTransactions);
});

// ========================================
// POST /api/transactions
// ========================================
router.post('/', (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;

    // Validación
    if (!type || !category || !amount || !description || !date) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos' 
      });
    }

    // Crear transacción
    const transaction = {
      id: String(transactions.length + 1),
      userId: req.userId,
      type,
      category,
      amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      description,
      date
    };

    transactions.push(transaction);
    res.status(201).json(transaction);

  } catch (error) {
    console.error('Error al crear transacción:', error);
    res.status(500).json({ message: 'Error al crear transacción' });
  }
});

// ========================================
// DELETE /api/transactions/:id
// ========================================
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar índice
    const index = transactions.findIndex(
      t => t.id === id && t.userId === req.userId
    );

    if (index === -1) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }

    // Eliminar
    transactions.splice(index, 1);
    res.json({ success: true, message: 'Transacción eliminada' });

  } catch (error) {
    console.error('Error al eliminar transacción:', error);
    res.status(500).json({ message: 'Error al eliminar transacción' });
  }
});

module.exports = router;
```

---

### **routes/budgets.js** (Presupuestos)

```javascript
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

const budgets = [
  { id: '1', userId: '1', category: '🍔 Comida', spent: 450, limit: 600 },
  { id: '2', userId: '1', category: '🚗 Transporte', spent: 180, limit: 200 },
];

router.use(authenticateToken);

// GET /api/budgets
router.get('/', (req, res) => {
  const userBudgets = budgets.filter(b => b.userId === req.userId);
  res.json(userBudgets);
});

// POST /api/budgets
router.post('/', (req, res) => {
  const { category, limit } = req.body;
  
  if (!category || !limit) {
    return res.status(400).json({ message: 'Categoría y límite son requeridos' });
  }

  const budget = {
    id: String(budgets.length + 1),
    userId: req.userId,
    category,
    limit,
    spent: 0
  };

  budgets.push(budget);
  res.status(201).json(budget);
});

module.exports = router;
```

---

### **routes/dashboard.js** (Dashboard)

```javascript
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/dashboard/stats
router.get('/stats', (req, res) => {
  // En producción, calcularías esto desde la BD
  res.json({
    balance: 12450,
    income: 4250,
    expenses: 1380,
    savings: 2870
  });
});

module.exports = router;
```

---

## 🚀 Cómo ejecutar

### 1. **Crea el archivo `.env`**

```
PORT=4000
JWT_SECRET=mi-clave-super-secreta-cambiar-en-produccion
NODE_ENV=development
```

### 2. **Instala dependencias**

```bash
npm install
```

### 3. **Ejecuta el servidor**

```bash
# Desarrollo (con auto-reload)
npm run dev

# O directamente
node server.js
```

### 4. **Verifica que funciona**

```bash
# Prueba la ruta principal
curl http://localhost:4000

# Debería responder:
# {"message":"FinanceFlow API funcionando ✅"}
```

---

## 🧪 Probar con Postman o curl

### **Registrar usuario**

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "contraseña123"
  }'
```

### **Login**

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "contraseña123"
  }'
```

### **Obtener transacciones (requiere token)**

```bash
curl http://localhost:4000/api/transactions \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 📝 package.json

```json
{
  "name": "financeflow-backend",
  "version": "1.0.0",
  "description": "Backend para FinanceFlow",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## ✅ Checklist de compatibilidad

Tu backend debe:
- [ ] Correr en `localhost:4000` (o el puerto configurado)
- [ ] Tener CORS habilitado para el frontend
- [ ] Endpoints `/api/auth/login`, `/api/auth/register`, `/api/auth/me`
- [ ] Devolver `{ user, token }` en login/register
- [ ] Aceptar `Authorization: Bearer <token>` en headers
- [ ] Endpoints `/api/transactions`, `/api/budgets`, `/api/dashboard/stats`
- [ ] Respuestas en formato JSON

---

## 🔐 Seguridad (para producción)

- ✅ Usar variables de entorno para JWT_SECRET
- ✅ Hashear contraseñas con bcrypt
- ✅ Validar todos los inputs
- ✅ Rate limiting para prevenir ataques
- ✅ HTTPS en producción
- ✅ Usar una base de datos real (no arrays en memoria)

---

💡 **Este es solo un ejemplo básico.** Adapta el código a tu backend existente, manteniendo la misma estructura de endpoints y respuestas.
