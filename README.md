# 💰 FinanceFlow Frontend

Sistema de gestión financiera personal construido con **React 18 + Vite 6 + Tailwind CSS 3**.

> **Nota:** Si es tu primera vez configurando el proyecto, lee la **[Guía de Instalación Completa](GUIA_INSTALACION_COMPLETA.md)** para un tutorial paso a paso detallado.

---

## 📚 Documentación Disponible

| Documento | Descripción |
|-----------|-------------|
| [GUIA_INSTALACION_COMPLETA.md](GUIA_INSTALACION_COMPLETA.md) | 📖 Guía detallada paso a paso de toda la instalación |
| [RESUMEN_RAPIDO.md](RESUMEN_RAPIDO.md) | ⚡ Resumen visual rápido de lo que se hizo |
| [TAILWIND_EXAMPLES.md](TAILWIND_EXAMPLES.md) | 🎨 10 componentes de ejemplo listos para usar |
| README.md (este archivo) | 📝 Guía de uso rápida |

---

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 16 o superior
- npm (viene con Node.js)

### Instalación

```bash
# Instalar todas las dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en **[http://localhost:3000](http://localhost:3000)**

> Si el puerto 3000 está ocupado, Vite automáticamente usará 3001, 3002, etc.

### Build para Producción

```bash
npm run build
```

### Preview de Producción

```bash
npm run preview
```

## 🎨 Uso de Tailwind CSS

### Clases Personalizadas Creadas

#### Tarjetas (Cards)
```jsx
<div className="card">
  Contenido de la tarjeta
</div>
```

#### Botones
```jsx
{/* Botón primario (azul) */}
<button className="btn btn-primary">Guardar</button>

{/* Botón secundario (gris) */}
<button className="btn btn-secondary">Cancelar</button>

{/* Botón de éxito (verde) */}
<button className="btn btn-success">Confirmar</button>

{/* Botón de peligro (rojo) */}
<button className="btn btn-danger">Eliminar</button>
```

#### Inputs
```jsx
<input
  type="text"
  className="input"
  placeholder="Ingresa un valor"
/>
```

#### Badges (Etiquetas)
```jsx
{/* Badge para ingresos */}
<span className="badge badge-income">+$1,000</span>

{/* Badge para gastos */}
<span className="badge badge-expense">-$500</span>
```

### Colores Personalizados

```jsx
{/* Colores primarios (azul) */}
<div className="bg-primary-500 text-white">Azul principal</div>
<div className="bg-primary-600 text-white">Azul más oscuro</div>

{/* Colores para finanzas */}
<div className="text-income">Ingresos (verde)</div>
<div className="text-expense">Gastos (rojo)</div>
<div className="text-savings">Ahorros (amarillo)</div>
```

### Sombras Personalizadas

```jsx
{/* Sombra de tarjeta normal */}
<div className="shadow-card">Tarjeta</div>

{/* Sombra de tarjeta al hover */}
<div className="shadow-card-hover">Tarjeta con hover</div>
```

### Animaciones Personalizadas

```jsx
{/* Animación de entrada lateral */}
<div className="animate-slide-in">Aparece desde la izquierda</div>

{/* Animación de fade in */}
<div className="animate-fade-in">Aparece gradualmente</div>
```

### Modo Oscuro (Dark Mode)

```jsx
{/* Fondo que cambia según el tema */}
<div className="bg-white dark:bg-gray-800">
  Contenido
</div>

{/* Texto que cambia según el tema */}
<p className="text-gray-900 dark:text-gray-100">
  Texto adaptable
</p>
```

Para activar el modo oscuro, agrega la clase `dark` al elemento `<html>`:

```javascript
// Activar modo oscuro
document.documentElement.classList.add('dark')

// Desactivar modo oscuro
document.documentElement.classList.remove('dark')
```

### Clases Útiles de Tailwind

```jsx
{/* Espaciado */}
<div className="p-4">Padding de 1rem (16px)</div>
<div className="m-6">Margin de 1.5rem (24px)</div>
<div className="px-4 py-2">Padding horizontal y vertical</div>

{/* Tamaños de texto */}
<p className="text-sm">Texto pequeño</p>
<p className="text-base">Texto normal</p>
<p className="text-lg">Texto grande</p>
<p className="text-xl">Texto extra grande</p>

{/* Flexbox */}
<div className="flex items-center justify-between">
  Flexbox con centrado vertical y espacio entre elementos
</div>

{/* Grid */}
<div className="grid grid-cols-3 gap-4">
  Grid de 3 columnas con espacio de 1rem
</div>

{/* Bordes redondeados */}
<div className="rounded">Bordes ligeramente redondeados</div>
<div className="rounded-lg">Bordes muy redondeados</div>
<div className="rounded-full">Totalmente redondeado (círculo/píldora)</div>

{/* Transiciones */}
<button className="transition-all duration-300 hover:scale-105">
  Botón con transición suave
</button>
```

## 📁 Estructura del Proyecto

```
financeflow-frontend/
├── src/
│   ├── api/                    # Configuración de axios y endpoints
│   ├── components/             # Componentes reutilizables
│   │   ├── common/            # Botones, cards, inputs, etc.
│   │   ├── charts/            # Gráficas con Recharts
│   │   ├── dashboard/         # Componentes del dashboard
│   │   ├── transactions/      # Componentes de transacciones
│   │   └── layout/            # Navbar, Sidebar, Layout
│   ├── pages/                 # Páginas completas
│   ├── stores/                # Zustand stores (estado global)
│   ├── hooks/                 # Custom hooks
│   ├── utils/                 # Funciones utilitarias
│   ├── App.jsx               # Componente principal
│   ├── main.jsx              # Punto de entrada
│   └── index.css             # Estilos globales con Tailwind
├── index.html                # HTML principal
├── tailwind.config.js        # Configuración de Tailwind
├── postcss.config.js         # Configuración de PostCSS
├── vite.config.js            # Configuración de Vite
└── package.json              # Dependencias
```

## 🌐 Variables de Entorno

Crea un archivo `.env` en la raíz con:

```env
VITE_API_URL=http://localhost:4000
```

## 📚 Recursos

- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Guía completa del proyecto](../financeflow-backend/REACT_FRONTEND_GUIDE_EXPLICADO.md)

## 💡 Tips

1. **Usa las clases personalizadas** cuando sea posible (`card`, `btn`, `input`) en lugar de repetir las mismas clases de Tailwind
2. **Utiliza el modo oscuro** con el prefijo `dark:` para una mejor experiencia de usuario
3. **Aprovecha las animaciones personalizadas** para hacer la UI más fluida
4. **Mantén la consistencia** usando los colores personalizados del tema (primary, income, expense, savings)
# Proyecto_intermodular-2
