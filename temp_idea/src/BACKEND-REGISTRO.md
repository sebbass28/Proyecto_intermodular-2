# 📝 Guía de Implementación del Backend - Registro de Usuarios

Esta guía te explica **exactamente** qué datos se envían desde el frontend y cómo deberías estructurar tu backend para recibirlos.

## 🎯 Endpoint de Registro

**Ruta:** `POST http://localhost:4000/api/auth/register`

**Contenido enviado desde el frontend:**
```json
{
  "name": "Juan Pérez García",
  "email": "juan@example.com",
  "password": "miPassword123",
  "phone": "+52 123 456 7890",
  "country": "MX",
  "currency": "MXN",
  "monthlyIncome": 5000,
  "receiveNotifications": true
}
```

---

## 📊 Estructura de la Tabla de Usuarios

Así es como debería verse tu tabla `users` en la base de datos:

| Campo | Tipo | Obligatorio | Descripción | Ejemplo |
|-------|------|-------------|-------------|---------|
| **id** | UUID/INT | ✅ Sí | Identificador único (auto-generado) | `"550e8400-e29b-41d4-a716-446655440000"` |
| **name** | VARCHAR(255) | ✅ Sí | Nombre completo del usuario | `"Juan Pérez García"` |
| **email** | VARCHAR(255) | ✅ Sí | Email único (usado para login) | `"juan@example.com"` |
| **password** | VARCHAR(255) | ✅ Sí | **Hash** de la contraseña (NUNCA guardar en texto plano) | `"$2b$10$abc123..."` |
| **phone** | VARCHAR(50) | ❌ No | Teléfono del usuario | `"+52 123 456 7890"` |
| **country** | VARCHAR(2) | ❌ No | Código de país ISO 3166-1 alpha-2 | `"MX"` |
| **currency** | VARCHAR(3) | ❌ No | Código de moneda ISO 4217 | `"MXN"` |
| **monthlyIncome** | DECIMAL(10,2) | ❌ No | Ingreso mensual del usuario | `5000.00` |
| **receiveNotifications** | BOOLEAN | ❌ No | Si acepta notificaciones | `true` |
| **avatar** | VARCHAR(500) | ❌ No | URL del avatar del usuario | `"https://..."` |
| **emailVerified** | BOOLEAN | ❌ No | Si ha verificado su email | `false` |
| **isActive** | BOOLEAN | ❌ No | Si la cuenta está activa | `true` |
| **createdAt** | TIMESTAMP | ✅ Sí | Fecha de creación (auto-generado) | `"2025-10-25T12:00:00Z"` |
| **updatedAt** | TIMESTAMP | ✅ Sí | Última actualización (auto-generado) | `"2025-10-25T12:00:00Z"` |

---

## 🔧 Ejemplo de Implementación en Node.js + Express

### 1. Instalar dependencias necesarias

```bash
npm install bcrypt jsonwebtoken express
```

### 2. Código del endpoint de registro

```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Tu configuración de base de datos (ejemplo con PostgreSQL)
// const db = require('./database');

/**
 * POST /api/auth/register
 * Registro de nuevos usuarios
 */
router.post('/api/auth/register', async (req, res) => {
  try {
    // 1️⃣ Obtener los datos del body
    const {
      name,
      email,
      password,
      phone,
      country,
      currency,
      monthlyIncome,
      receiveNotifications
    } = req.body;

    // 2️⃣ Validar campos obligatorios
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Nombre, email y contraseña son obligatorios' 
      });
    }

    // 3️⃣ Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Email inválido' 
      });
    }

    // 4️⃣ Verificar que el email no esté registrado
    // const existingUser = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    // if (existingUser.length > 0) {
    //   return res.status(400).json({ 
    //     message: 'Este email ya está registrado' 
    //   });
    // }

    // 5️⃣ Hashear la contraseña (IMPORTANTE: nunca guardes contraseñas en texto plano)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 6️⃣ Generar avatar automático (opcional)
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`;

    // 7️⃣ Insertar el usuario en la base de datos
    const newUser = {
      // id: generado automáticamente por la DB
      name,
      email,
      password: hashedPassword, // ⚠️ HASH, no la contraseña original
      phone: phone || null,
      country: country || null,
      currency: currency || 'USD',
      monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : null,
      receiveNotifications: receiveNotifications ?? true,
      avatar: avatarUrl,
      emailVerified: false,
      isActive: true,
      // createdAt: generado automáticamente por la DB
      // updatedAt: generado automáticamente por la DB
    };

    // Ejemplo de INSERT (ajusta según tu ORM o librería de DB)
    // const result = await db.query('INSERT INTO users SET ?', [newUser]);
    // const userId = result.insertId;

    // Por ahora, simulamos que el ID es 1
    const userId = 1;

    // 8️⃣ Generar token JWT para autenticación
    const token = jwt.sign(
      { 
        id: userId, 
        email: email 
      },
      process.env.JWT_SECRET || 'tu-secreto-super-seguro', // ⚠️ Usa variables de entorno
      { expiresIn: '7d' } // El token expira en 7 días
    );

    // 9️⃣ Responder con los datos del usuario (sin la contraseña)
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      token,
      user: {
        id: userId,
        name,
        email,
        phone,
        country,
        currency,
        monthlyIncome,
        receiveNotifications,
        avatar: avatarUrl
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      message: 'Error en el servidor al crear el usuario' 
    });
  }
});

module.exports = router;
```

---

## 🔐 IMPORTANTE: Seguridad de Contraseñas

### ❌ NUNCA hagas esto:
```javascript
// MAL - Guardando contraseña en texto plano
const newUser = {
  password: password  // ❌ ¡MUY PELIGROSO!
};
```

### ✅ SIEMPRE haz esto:
```javascript
// BIEN - Hasheando la contraseña
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);

const newUser = {
  password: hashedPassword  // ✅ Seguro
};
```

### ¿Por qué?
- Si alguien hackea tu base de datos, NO podrá ver las contraseñas reales
- Bcrypt genera un "hash" único e irreversible
- Cuando el usuario hace login, comparas hashes, no contraseñas

---

## 🔑 Flujo de Autenticación Completo

### 1. Registro (lo que acabamos de hacer)
```
Usuario → Formulario de registro → Frontend → POST /api/auth/register → Backend
                                                                            ↓
                                                              Guardar en base de datos
                                                                            ↓
                                                              Generar token JWT
                                                                            ↓
Frontend ← Respuesta con token y datos de usuario ← Backend
    ↓
Guardar token en localStorage
```

### 2. Login (endpoint que también necesitas)
```javascript
router.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // 1. Buscar usuario por email
  // const user = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  
  // 2. Verificar que existe
  // if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });
  
  // 3. Comparar contraseña hasheada
  // const isValidPassword = await bcrypt.compare(password, user.password);
  // if (!isValidPassword) return res.status(401).json({ message: 'Credenciales inválidas' });
  
  // 4. Generar token
  // const token = jwt.sign({ id: user.id, email: user.email }, 'secreto', { expiresIn: '7d' });
  
  // 5. Responder
  // res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});
```

### 3. Obtener usuario actual (para verificar sesión)
```javascript
router.get('/api/auth/me', authenticateToken, async (req, res) => {
  // El middleware authenticateToken verifica el token y añade req.user
  res.json(req.user);
});

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });
  
  jwt.verify(token, 'secreto', (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}
```

---

## 📋 SQL para crear la tabla (ejemplo PostgreSQL)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  country VARCHAR(2),
  currency VARCHAR(3) DEFAULT 'USD',
  monthly_income DECIMAL(10,2),
  receive_notifications BOOLEAN DEFAULT true,
  avatar VARCHAR(500),
  email_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índice para búsquedas rápidas por email
CREATE INDEX idx_users_email ON users(email);
```

---

## 📋 SQL para crear la tabla (ejemplo MySQL)

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  country VARCHAR(2),
  currency VARCHAR(3) DEFAULT 'USD',
  monthly_income DECIMAL(10,2),
  receive_notifications BOOLEAN DEFAULT true,
  avatar VARCHAR(500),
  email_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_users_email ON users(email);
```

---

## 🧪 Pruebas con Postman / cURL

### Probar el registro:
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@test.com",
    "password": "123456",
    "phone": "+52 123 456 7890",
    "country": "MX",
    "currency": "MXN",
    "monthlyIncome": 5000,
    "receiveNotifications": true
  }'
```

### Respuesta esperada:
```json
{
  "message": "Usuario creado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@test.com",
    "phone": "+52 123 456 7890",
    "country": "MX",
    "currency": "MXN",
    "monthlyIncome": 5000,
    "receiveNotifications": true,
    "avatar": "https://ui-avatars.com/api/?name=Juan+P%C3%A9rez&background=random&size=200"
  }
}
```

---

## ✅ Checklist de Implementación

- [ ] Crear tabla `users` en la base de datos
- [ ] Instalar dependencias: `bcrypt`, `jsonwebtoken`
- [ ] Implementar endpoint `POST /api/auth/register`
- [ ] Hashear contraseñas con bcrypt (NUNCA guardar en texto plano)
- [ ] Validar que el email sea único
- [ ] Generar token JWT al registrar
- [ ] Implementar endpoint `POST /api/auth/login`
- [ ] Implementar endpoint `GET /api/auth/me`
- [ ] Crear middleware de autenticación
- [ ] Probar con Postman o cURL
- [ ] Configurar CORS para permitir requests desde el frontend
- [ ] Agregar variables de entorno para JWT_SECRET

---

## 🎓 Conceptos Importantes Explicados Sencillamente

### ¿Qué es un Hash?
- Es como "triturar" la contraseña en una sopa de letras irreversible
- `"miPassword123"` → `"$2b$10$abc123xyz..."`
- No puedes "destriturar" para obtener la contraseña original
- Pero puedes verificar si una contraseña coincide con el hash

### ¿Qué es JWT (JSON Web Token)?
- Es como un "ticket" que prueba que iniciaste sesión
- El backend te lo da cuando haces login
- El frontend lo guarda en `localStorage`
- Lo envías en cada petición para probar tu identidad

### ¿Qué es bcrypt?
- Una librería que convierte contraseñas en hashes seguros
- Usa "salt" (sal aleatoria) para que cada hash sea único
- Es muy lento a propósito para dificultar ataques de fuerza bruta

---

## 🚀 Próximos Pasos

1. **Implementa el backend** usando el código de ejemplo
2. **Prueba el registro** desde el frontend de FinanceFlow
3. **Verifica en la consola** del navegador los datos que se envían
4. **Revisa la base de datos** para confirmar que se guardó el usuario
5. **Implementa el login** siguiendo el mismo patrón
6. **Agrega validaciones adicionales** según tus necesidades

---

## 💡 Tip Final

El formulario de registro ya está funcionando en el frontend. Cuando presionas "Crear Cuenta", verás en la consola del navegador (F12) exactamente qué datos se están enviando:

```javascript
console.log('📝 Datos que se deberían enviar al backend:', {
  name: "Juan Pérez",
  email: "juan@test.com",
  password: "123456", // Recuerda hashear esto en el backend
  phone: "+52 123 456 7890",
  country: "MX",
  currency: "MXN",
  monthlyIncome: 5000,
  receiveNotifications: true
});
```

¡Éxito con tu implementación! 🎉
