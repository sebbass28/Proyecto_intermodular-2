# 📊 Valores Exactos que Debes Guardar en tu Base de Datos

## 📋 Tabla Rápida de Campos

| Campo | Tipo | Requerido | Ejemplo | Notas |
|-------|------|-----------|---------|-------|
| **id** | INT/UUID | ✅ | `1` o `"550e8400..."` | Auto-generado por la DB |
| **name** | VARCHAR(255) | ✅ | `"Juan Pérez García"` | Nombre completo |
| **email** | VARCHAR(255) | ✅ | `"juan@example.com"` | Debe ser único |
| **password** | VARCHAR(255) | ✅ | `"$2b$10$abc..."` | ⚠️ Guardar HASH, no texto plano |
| **phone** | VARCHAR(50) | ❌ | `"+52 123 456 7890"` | Puede ser NULL |
| **country** | VARCHAR(2) | ❌ | `"MX"` | Código ISO (MX, US, ES, etc) |
| **currency** | VARCHAR(3) | ❌ | `"MXN"` | Código ISO (USD, MXN, EUR, etc) |
| **monthlyIncome** | DECIMAL(10,2) | ❌ | `5000.00` | Ingreso mensual |
| **receiveNotifications** | BOOLEAN | ❌ | `true` | Default: true |
| **avatar** | VARCHAR(500) | ❌ | `"https://..."` | URL del avatar |
| **emailVerified** | BOOLEAN | ❌ | `false` | Para verificación de email |
| **isActive** | BOOLEAN | ❌ | `true` | Default: true |
| **createdAt** | TIMESTAMP | ✅ | `2025-10-25 12:00:00` | Auto-generado |
| **updatedAt** | TIMESTAMP | ✅ | `2025-10-25 12:00:00` | Auto-actualizado |

---

## 📤 JSON que Recibes del Frontend

Cuando un usuario se registra, tu endpoint recibirá esto:

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

## 💾 Lo que Debes Guardar en la DB

```javascript
// ⚠️ IMPORTANTE: Nunca guardes la contraseña en texto plano
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);

const userToSave = {
  // Del frontend (campos enviados por el usuario)
  name: "Juan Pérez García",
  email: "juan@example.com",
  password: hashedPassword,  // ✅ HASH: "$2b$10$abc123..."
  phone: "+52 123 456 7890" || null,
  country: "MX" || null,
  currency: "MXN" || "USD",
  monthlyIncome: 5000.00 || null,
  receiveNotifications: true,
  
  // Generados automáticamente por el backend/DB
  id: 1,  // Auto-increment o UUID
  avatar: "https://ui-avatars.com/api/?name=Juan+P%C3%A9rez&background=random",
  emailVerified: false,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};
```

---

## 🗄️ SQL de Ejemplo

### Crear la Tabla:

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
);
```

### Insertar un Usuario:

```sql
INSERT INTO users (
  name, 
  email, 
  password, 
  phone, 
  country, 
  currency, 
  monthly_income, 
  receive_notifications
) VALUES (
  'Juan Pérez García',
  'juan@example.com',
  '$2b$10$hashed_password_here',  -- Hash de bcrypt
  '+52 123 456 7890',
  'MX',
  'MXN',
  5000.00,
  true
);
```

---

## 🔑 Validaciones Importantes

### En el Backend:

```javascript
// 1. Campos obligatorios
if (!name || !email || !password) {
  return res.status(400).json({ 
    message: 'Nombre, email y contraseña son obligatorios' 
  });
}

// 2. Email válido
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({ 
    message: 'Email inválido' 
  });
}

// 3. Email único
const existingUser = await db.query(
  'SELECT * FROM users WHERE email = ?', 
  [email]
);
if (existingUser.length > 0) {
  return res.status(400).json({ 
    message: 'Este email ya está registrado' 
  });
}

// 4. Hashear contraseña
const hashedPassword = await bcrypt.hash(password, 10);
```

---

## 📬 Respuesta que Debes Enviar al Frontend

Después de guardar el usuario en la DB:

```json
{
  "message": "Usuario creado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juan Pérez García",
    "email": "juan@example.com",
    "phone": "+52 123 456 7890",
    "country": "MX",
    "currency": "MXN",
    "monthlyIncome": 5000,
    "receiveNotifications": true,
    "avatar": "https://ui-avatars.com/api/?name=Juan+P%C3%A9rez&background=random"
    // ⚠️ NUNCA envíes el password, ni siquiera el hash
  }
}
```

---

## ⚠️ Errores Comunes a Evitar

| ❌ Error | ✅ Correcto |
|---------|-----------|
| Guardar `password: "123456"` | Guardar `password: "$2b$10$..."` (hash) |
| No validar email único | Verificar antes de insertar |
| Devolver password en la respuesta | Nunca incluir password |
| No manejar campos opcionales NULL | Usar `valor \|\| null` |
| Guardar sin validaciones | Validar antes de guardar |

---

## 🎯 Checklist Rápido

Antes de dar por terminado el endpoint de registro, verifica:

- [ ] ✅ Recibo todos los campos del frontend
- [ ] ✅ Valido que name, email y password existan
- [ ] ✅ Valido formato de email con regex
- [ ] ✅ Verifico que el email no esté ya registrado
- [ ] ✅ Hasheo la contraseña con bcrypt (NUNCA texto plano)
- [ ] ✅ Guardo en la base de datos
- [ ] ✅ Genero un JWT token
- [ ] ✅ Respondo con token y datos del usuario (sin password)
- [ ] ✅ Manejo errores correctamente
- [ ] ✅ Tengo CORS configurado para permitir requests del frontend

---

## 🧪 Probar con curl

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123456",
    "phone": "+52 123 456 7890",
    "country": "MX",
    "currency": "MXN",
    "monthlyIncome": 5000,
    "receiveNotifications": true
  }'
```

---

## 📖 Ver Más Información

- **Implementación completa del backend:** `BACKEND-REGISTRO.md`
- **Flujo completo explicado:** `GUIA-REGISTRO.md`
- **Código del formulario:** `components/RegisterPage.tsx`

---

**¡Éxito! 🚀**
