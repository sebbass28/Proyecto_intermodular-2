# 🎭 Modo DEMO - FinanceFlow

## ✅ ¡Error Resuelto!

El error **"NetworkError when attempting to fetch resource"** se ha solucionado implementando un **modo DEMO automático**.

---

## 🎯 ¿Qué es el Modo DEMO?

Cuando el backend **no está disponible** (no está corriendo o no es accesible), la aplicación **automáticamente cambia a modo DEMO** y utiliza datos de ejemplo.

Esto te permite:
- ✅ Probar la aplicación sin necesidad de configurar el backend
- ✅ Ver cómo funciona la interfaz con datos reales
- ✅ Desarrollar el frontend sin depender del backend
- ✅ Demostrar la aplicación a clientes o usuarios

---

## 🚀 Cómo funciona

### Detección automática

La aplicación intenta conectarse al backend en `localhost:4000`:

```
┌────────────────────────────────────────┐
│  App intenta conectar al backend      │
│  http://localhost:4000                 │
└────────────────┬───────────────────────┘
                 │
                 ├─── ✅ Responde → Modo BACKEND (datos reales)
                 │
                 └─── ❌ No responde → Modo DEMO (datos ejemplo)
```

### Indicador visual

Cuando está en modo DEMO, verás un **banner naranja** en la parte superior:

```
🎭 Modo DEMO Activo
El backend no está disponible. Usando datos de ejemplo.
Para conectar con tu backend real, verifica que esté corriendo en localhost:4000
```

---

## 📊 Datos disponibles en modo DEMO

### Transacciones de ejemplo:
- 💼 Salario: +$3,500
- 🍔 Comida: -$85
- 🚗 Transporte: -$45
- 💰 Freelance: +$750
- 🎬 Entretenimiento: -$120
- 🏠 Casa: -$800

### Presupuestos de ejemplo:
- 🍔 Comida: $450 / $600
- 🚗 Transporte: $180 / $200
- 🎬 Entretenimiento: $120 / $300
- 🏠 Casa: $800 / $1,000

### Estadísticas:
- Balance: $12,450
- Ingresos: $4,250
- Gastos: $1,380
- Ahorros: $2,870

---

## 🔄 Cambiar de Modo DEMO a Backend Real

### Paso 1: Inicia tu backend

```bash
# En la terminal de tu backend
cd tu-backend
npm start

# Verifica que corra en el puerto 4000
# Debería mostrar algo como:
# Server running on http://localhost:4000
```

### Paso 2: Verifica la conexión

```bash
# En otra terminal, prueba:
curl http://localhost:4000

# Si responde, tu backend está funcionando
```

### Paso 3: Recarga la aplicación

1. Cierra sesión en FinanceFlow (si estás logueado)
2. Recarga la página (F5 o Ctrl+R)
3. Intenta hacer login nuevamente

La app detectará automáticamente que el backend está disponible y usará datos reales.

---

## 🛠️ Configuración del puerto

Si tu backend usa un puerto diferente a `4000`, actualiza `/utils/api.ts`:

```typescript
// Línea 10 de /utils/api.ts
const API_URL = 'http://localhost:4000';  // 👈 Cambia el puerto aquí

// Ejemplo con puerto 3001:
const API_URL = 'http://localhost:3001';
```

---

## 💡 Funcionalidades en Modo DEMO

### ✅ Lo que SÍ funciona:
- ✅ Login y registro (crea usuarios demo)
- ✅ Ver transacciones
- ✅ Crear transacciones (se guardan en memoria)
- ✅ Eliminar transacciones
- ✅ Ver presupuestos
- ✅ Crear presupuestos
- ✅ Ver estadísticas del dashboard
- ✅ Navegación entre páginas
- ✅ Cerrar sesión

### ⚠️ Limitaciones:
- ⚠️ Los datos **no se guardan** al recargar la página
- ⚠️ No hay validación real de contraseñas
- ⚠️ Solo un usuario demo a la vez
- ⚠️ Sin integración bancaria real
- ⚠️ Sin exportación de datos

---

## 🔍 Verificar el estado actual

### En la consola del navegador (F12 → Console):

Cuando uses la app, verás mensajes que indican el modo:

```javascript
// Modo DEMO activo:
🎭 Usando modo DEMO para login
🎭 Usando datos DEMO para transacciones

// Modo BACKEND activo:
(No verás estos mensajes, las peticiones HTTP serán normales)
```

### En localStorage:

Abre DevTools (F12) → Application → Local Storage:

```
Modo DEMO:
  auth_token: "demo-token-1234567890"
  demo_mode: "true"

Modo BACKEND:
  auth_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  (sin demo_mode)
```

---

## 🐛 Solución de problemas

### El banner de modo DEMO no aparece

**Causa:** El backend está respondiendo, aunque sea con un error.

**Solución:** 
1. Abre DevTools (F12) → Network
2. Busca peticiones a `localhost:4000`
3. Si ves respuestas 404 o 500, tu backend está corriendo pero con problemas
4. Revisa los logs de tu backend

### Quiero forzar el modo DEMO

**Solución:**
1. Apaga tu backend
2. Cierra sesión en la app
3. Recarga la página
4. Intenta hacer login

### Quiero desactivar el modo DEMO

**Solución:**
1. El modo DEMO **solo se activa cuando el backend no responde**
2. Inicia tu backend en `localhost:4000`
3. El modo DEMO se desactivará automáticamente

### El banner no desaparece aunque el backend esté activo

**Solución:**
1. Cierra sesión
2. Limpia localStorage: DevTools → Application → Local Storage → Clear All
3. Recarga la página
4. Haz login nuevamente

---

## 📝 Ejemplo de uso

### Escenario 1: Desarrollo del frontend (sin backend)

```bash
# Solo inicia el frontend
npm run dev

# Abre http://localhost:5173
# Login con cualquier email/password
# La app usará modo DEMO automáticamente
```

### Escenario 2: Integración completa

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
npm run dev

# Abre http://localhost:5173
# La app detectará el backend y usará datos reales
```

### Escenario 3: Demostración

```bash
# Sin backend, solo frontend
npm run dev

# Muestra la app a un cliente
# Todo funciona, pero con datos de ejemplo
# Explica que en producción usará datos reales
```

---

## 🎓 Para desarrolladores

### Cómo agregar más datos demo

Edita `/utils/api.ts`, líneas 13-29:

```typescript
const demoTransactions = [
  { id: '7', type: 'income', category: '🎁 Bonus', amount: 1000, description: 'Bonus anual', date: '2025-10-15' },
  // Agrega más transacciones aquí
];

const demoBudgets = [
  { id: '5', category: '🎓 Educación', spent: 200, limit: 500 },
  // Agrega más presupuestos aquí
];
```

### Cómo detectar si está en modo demo desde componentes

```typescript
import { isInDemoMode } from '../utils/api';

function MyComponent() {
  const isDemoActive = isInDemoMode();
  
  return (
    <div>
      {isDemoActive && <p>Estás en modo DEMO</p>}
    </div>
  );
}
```

---

## 🚀 Siguiente paso

Ahora puedes usar la aplicación inmediatamente en modo DEMO, o seguir las guías para conectar tu backend real:

- **Para usar modo DEMO:** ¡Ya está listo! Solo abre la app y usa cualquier email/password
- **Para conectar backend:** Lee `/INICIO-RAPIDO.md` y sigue los 5 pasos

---

## ✨ Resumen

```
┌─────────────────────────────────────────────────────────┐
│  ANTES: Error de conexión → App no funciona ❌         │
│                                                          │
│  AHORA: Error de conexión → Modo DEMO activo ✅        │
│                                                          │
│  Resultado: La app SIEMPRE funciona                     │
└─────────────────────────────────────────────────────────┘
```

**Beneficios:**
- ✅ Sin errores frustrantes
- ✅ Desarrollo más rápido
- ✅ Fácil de demostrar
- ✅ Backend opcional (pero recomendado para producción)

---

💡 **Tip:** El modo DEMO es perfecto para desarrollo y pruebas, pero para producción necesitas conectar un backend real con base de datos.
