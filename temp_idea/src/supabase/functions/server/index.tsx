import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-User-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-5016f3b0/health", (c) => {
  return c.json({ status: "ok" });
});

// ========================================
// 🔐 AUTENTICACIÓN
// ========================================

// Login endpoint
app.post("/make-server-5016f3b0/api/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    // Verificar que los campos estén presentes
    if (!email || !password) {
      return c.json({ message: "Email y contraseña son requeridos" }, 400);
    }
    
    // Buscar usuario en KV store
    const userKey = `user:${email}`;
    const user = await kv.get(userKey);
    
    if (!user) {
      return c.json({ message: "Usuario no encontrado" }, 404);
    }
    
    // Verificar contraseña (en producción deberías usar bcrypt)
    if (user.password !== password) {
      return c.json({ message: "Contraseña incorrecta" }, 401);
    }
    
    // Generar token simple (en producción usar JWT)
    const token = `token-${email}-${Date.now()}`;
    
    // Guardar token
    await kv.set(`token:${token}`, { userId: user.id, email: user.email });
    
    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = user;
    
    return c.json({
      user: userWithoutPassword,
      token: token
    });
  } catch (error: any) {
    console.log("Error en login:", error);
    return c.json({ message: error.message || "Error en login" }, 500);
  }
});

// Register endpoint
app.post("/make-server-5016f3b0/api/auth/register", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, password, phone, country, currency, monthlyIncome, receiveNotifications } = body;
    
    // Validar campos requeridos
    if (!name || !email || !password) {
      return c.json({ message: "Nombre, email y contraseña son requeridos" }, 400);
    }
    
    // Verificar si el usuario ya existe
    const userKey = `user:${email}`;
    const existingUser = await kv.get(userKey);
    
    if (existingUser) {
      return c.json({ message: "El usuario ya existe" }, 409);
    }
    
    // Crear nuevo usuario
    const userId = `user-${Date.now()}`;
    const newUser = {
      id: userId,
      name,
      email,
      password, // En producción deberías hashear esto con bcrypt
      phone: phone || null,
      country: country || null,
      currency: currency || 'USD',
      monthlyIncome: monthlyIncome || 0,
      receiveNotifications: receiveNotifications !== false,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      createdAt: new Date().toISOString()
    };
    
    // Guardar usuario
    await kv.set(userKey, newUser);
    
    // Generar token
    const token = `token-${email}-${Date.now()}`;
    await kv.set(`token:${token}`, { userId: newUser.id, email: newUser.email });
    
    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = newUser;
    
    return c.json({
      user: userWithoutPassword,
      token: token
    }, 201);
  } catch (error: any) {
    console.log("Error en registro:", error);
    return c.json({ message: error.message || "Error en registro" }, 500);
  }
});

// Get current user endpoint
app.get("/make-server-5016f3b0/api/auth/me", async (c) => {
  try {
    // Leer el token del usuario desde el header X-User-Token
    const userToken = c.req.header("X-User-Token");
    
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    // Buscar usuario
    const userKey = `user:${tokenData.email}`;
    const user = await kv.get(userKey);
    
    if (!user) {
      return c.json({ message: "Usuario no encontrado" }, 404);
    }
    
    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = user;
    
    return c.json(userWithoutPassword);
  } catch (error: any) {
    console.log("Error obteniendo usuario:", error);
    return c.json({ message: error.message || "Error obteniendo usuario" }, 500);
  }
});

// ========================================
// 💳 TRANSACCIONES
// ========================================

// Get all transactions
app.get("/make-server-5016f3b0/api/transactions", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    // Obtener transacciones del usuario
    const transactions = await kv.getByPrefix(`transaction:${tokenData.userId}:`);
    
    return c.json(transactions || []);
  } catch (error: any) {
    console.log("Error obteniendo transacciones:", error);
    return c.json({ message: error.message || "Error obteniendo transacciones" }, 500);
  }
});

// Create transaction
app.post("/make-server-5016f3b0/api/transactions", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const body = await c.req.json();
    const { type, category, amount, description, date } = body;
    
    const transactionId = `${Date.now()}`;
    const transaction = {
      id: transactionId,
      userId: tokenData.userId,
      type,
      category,
      amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      description,
      date,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`transaction:${tokenData.userId}:${transactionId}`, transaction);
    
    return c.json(transaction, 201);
  } catch (error: any) {
    console.log("Error creando transacción:", error);
    return c.json({ message: error.message || "Error creando transacción" }, 500);
  }
});

// Update transaction
app.put("/make-server-5016f3b0/api/transactions/:id", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const transactionKey = `transaction:${tokenData.userId}:${id}`;
    const existingTransaction = await kv.get(transactionKey);
    
    if (!existingTransaction) {
      return c.json({ message: "Transacción no encontrada" }, 404);
    }
    
    const updatedTransaction = {
      ...existingTransaction,
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(transactionKey, updatedTransaction);
    
    return c.json(updatedTransaction);
  } catch (error: any) {
    console.log("Error actualizando transacción:", error);
    return c.json({ message: error.message || "Error actualizando transacción" }, 500);
  }
});

// Delete transaction
app.delete("/make-server-5016f3b0/api/transactions/:id", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const id = c.req.param("id");
    const transactionKey = `transaction:${tokenData.userId}:${id}`;
    
    await kv.del(transactionKey);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.log("Error eliminando transacción:", error);
    return c.json({ message: error.message || "Error eliminando transacción" }, 500);
  }
});

// ========================================
// 🎯 PRESUPUESTOS
// ========================================

// Get all budgets
app.get("/make-server-5016f3b0/api/budgets", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const budgets = await kv.getByPrefix(`budget:${tokenData.userId}:`);
    
    return c.json(budgets || []);
  } catch (error: any) {
    console.log("Error obteniendo presupuestos:", error);
    return c.json({ message: error.message || "Error obteniendo presupuestos" }, 500);
  }
});

// Create budget
app.post("/make-server-5016f3b0/api/budgets", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const body = await c.req.json();
    const { category, limit } = body;
    
    const budgetId = `${Date.now()}`;
    const budget = {
      id: budgetId,
      userId: tokenData.userId,
      category,
      limit,
      spent: 0,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`budget:${tokenData.userId}:${budgetId}`, budget);
    
    return c.json(budget, 201);
  } catch (error: any) {
    console.log("Error creando presupuesto:", error);
    return c.json({ message: error.message || "Error creando presupuesto" }, 500);
  }
});

// Update budget
app.put("/make-server-5016f3b0/api/budgets/:id", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const budgetKey = `budget:${tokenData.userId}:${id}`;
    const existingBudget = await kv.get(budgetKey);
    
    if (!existingBudget) {
      return c.json({ message: "Presupuesto no encontrado" }, 404);
    }
    
    const updatedBudget = {
      ...existingBudget,
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(budgetKey, updatedBudget);
    
    return c.json(updatedBudget);
  } catch (error: any) {
    console.log("Error actualizando presupuesto:", error);
    return c.json({ message: error.message || "Error actualizando presupuesto" }, 500);
  }
});

// Delete budget
app.delete("/make-server-5016f3b0/api/budgets/:id", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const id = c.req.param("id");
    const budgetKey = `budget:${tokenData.userId}:${id}`;
    
    await kv.del(budgetKey);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.log("Error eliminando presupuesto:", error);
    return c.json({ message: error.message || "Error eliminando presupuesto" }, 500);
  }
});

// ========================================
// 📊 DASHBOARD / ESTADÍSTICAS
// ========================================

// Get dashboard stats
app.get("/make-server-5016f3b0/api/dashboard/stats", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    // Obtener todas las transacciones
    const transactions = await kv.getByPrefix(`transaction:${tokenData.userId}:`);
    
    // Calcular estadísticas
    let income = 0;
    let expenses = 0;
    
    if (transactions && transactions.length > 0) {
      transactions.forEach((t: any) => {
        if (t.amount > 0) {
          income += t.amount;
        } else {
          expenses += Math.abs(t.amount);
        }
      });
    }
    
    const balance = income - expenses;
    const savings = balance * 0.3; // 30% como ahorro estimado
    
    return c.json({
      balance,
      income,
      expenses,
      savings
    });
  } catch (error: any) {
    console.log("Error obteniendo estadísticas:", error);
    return c.json({ message: error.message || "Error obteniendo estadísticas" }, 500);
  }
});

// Get chart data
app.get("/make-server-5016f3b0/api/dashboard/charts", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    // Por ahora devolver array vacío, se puede implementar lógica más compleja
    return c.json([]);
  } catch (error: any) {
    console.log("Error obteniendo datos de gráficos:", error);
    return c.json({ message: error.message || "Error obteniendo datos de gráficos" }, 500);
  }
});

// ========================================
// 👤 PERFIL DE USUARIO
// ========================================

// Update profile
app.put("/make-server-5016f3b0/api/user/profile", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const body = await c.req.json();
    
    // Obtener usuario actual
    const userKey = `user:${tokenData.email}`;
    const user = await kv.get(userKey);
    
    if (!user) {
      return c.json({ message: "Usuario no encontrado" }, 404);
    }
    
    // Actualizar usuario
    const updatedUser = {
      ...user,
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(userKey, updatedUser);
    
    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    return c.json({ success: true, user: userWithoutPassword });
  } catch (error: any) {
    console.log("Error actualizando perfil:", error);
    return c.json({ message: error.message || "Error actualizando perfil" }, 500);
  }
});

// Change password
app.put("/make-server-5016f3b0/api/user/password", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const { oldPassword, newPassword } = await c.req.json();
    
    // Obtener usuario actual
    const userKey = `user:${tokenData.email}`;
    const user = await kv.get(userKey);
    
    if (!user) {
      return c.json({ message: "Usuario no encontrado" }, 404);
    }
    
    // Verificar contraseña antigua
    if (user.password !== oldPassword) {
      return c.json({ message: "Contraseña antigua incorrecta" }, 401);
    }
    
    // Actualizar contraseña
    const updatedUser = {
      ...user,
      password: newPassword,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(userKey, updatedUser);
    
    return c.json({ success: true, message: "Contraseña actualizada correctamente" });
  } catch (error: any) {
    console.log("Error cambiando contraseña:", error);
    return c.json({ message: error.message || "Error cambiando contraseña" }, 500);
  }
});

// ========================================
// 💰 CARTERAS / CUENTAS
// ========================================

// Get all wallets
app.get("/make-server-5016f3b0/api/wallets", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const wallets = await kv.getByPrefix(`wallet:${tokenData.userId}:`);
    return c.json(wallets || []);
  } catch (error: any) {
    console.log("Error obteniendo carteras:", error);
    return c.json({ message: error.message || "Error obteniendo carteras" }, 500);
  }
});

// Create wallet
app.post("/make-server-5016f3b0/api/wallets", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const body = await c.req.json();
    const { name, type, balance, currency, color, icon } = body;
    
    const walletId = `${Date.now()}`;
    const wallet = {
      id: walletId,
      userId: tokenData.userId,
      name,
      type,
      balance: balance || 0,
      currency: currency || 'USD',
      color: color || '#3B82F6',
      icon: icon || '💳',
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`wallet:${tokenData.userId}:${walletId}`, wallet);
    return c.json(wallet, 201);
  } catch (error: any) {
    console.log("Error creando cartera:", error);
    return c.json({ message: error.message || "Error creando cartera" }, 500);
  }
});

// Update wallet
app.put("/make-server-5016f3b0/api/wallets/:id", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const walletKey = `wallet:${tokenData.userId}:${id}`;
    const existingWallet = await kv.get(walletKey);
    
    if (!existingWallet) {
      return c.json({ message: "Cartera no encontrada" }, 404);
    }
    
    const updatedWallet = {
      ...existingWallet,
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(walletKey, updatedWallet);
    return c.json(updatedWallet);
  } catch (error: any) {
    console.log("Error actualizando cartera:", error);
    return c.json({ message: error.message || "Error actualizando cartera" }, 500);
  }
});

// Delete wallet
app.delete("/make-server-5016f3b0/api/wallets/:id", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const id = c.req.param("id");
    const walletKey = `wallet:${tokenData.userId}:${id}`;
    
    await kv.del(walletKey);
    return c.json({ success: true });
  } catch (error: any) {
    console.log("Error eliminando cartera:", error);
    return c.json({ message: error.message || "Error eliminando cartera" }, 500);
  }
});

// ========================================
// 📈 INVERSIONES
// ========================================

// Get all investments
app.get("/make-server-5016f3b0/api/investments", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const investments = await kv.getByPrefix(`investment:${tokenData.userId}:`);
    return c.json(investments || []);
  } catch (error: any) {
    console.log("Error obteniendo inversiones:", error);
    return c.json({ message: error.message || "Error obteniendo inversiones" }, 500);
  }
});

// Create investment
app.post("/make-server-5016f3b0/api/investments", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const body = await c.req.json();
    const { name, type, symbol, quantity, purchasePrice, currentPrice, purchaseDate } = body;
    
    const investmentId = `${Date.now()}`;
    const investment = {
      id: investmentId,
      userId: tokenData.userId,
      name,
      type,
      symbol,
      quantity: quantity || 0,
      purchasePrice: purchasePrice || 0,
      currentPrice: currentPrice || purchasePrice || 0,
      purchaseDate: purchaseDate || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`investment:${tokenData.userId}:${investmentId}`, investment);
    return c.json(investment, 201);
  } catch (error: any) {
    console.log("Error creando inversión:", error);
    return c.json({ message: error.message || "Error creando inversión" }, 500);
  }
});

// Update investment
app.put("/make-server-5016f3b0/api/investments/:id", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const investmentKey = `investment:${tokenData.userId}:${id}`;
    const existingInvestment = await kv.get(investmentKey);
    
    if (!existingInvestment) {
      return c.json({ message: "Inversión no encontrada" }, 404);
    }
    
    const updatedInvestment = {
      ...existingInvestment,
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(investmentKey, updatedInvestment);
    return c.json(updatedInvestment);
  } catch (error: any) {
    console.log("Error actualizando inversión:", error);
    return c.json({ message: error.message || "Error actualizando inversión" }, 500);
  }
});

// Delete investment
app.delete("/make-server-5016f3b0/api/investments/:id", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const id = c.req.param("id");
    const investmentKey = `investment:${tokenData.userId}:${id}`;
    
    await kv.del(investmentKey);
    return c.json({ success: true });
  } catch (error: any) {
    console.log("Error eliminando inversión:", error);
    return c.json({ message: error.message || "Error eliminando inversión" }, 500);
  }
});

// ========================================
// 📊 METAS/OBJETIVOS
// ========================================

// Get all goals
app.get("/make-server-5016f3b0/api/goals", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const goals = await kv.getByPrefix(`goal:${tokenData.userId}:`);
    return c.json(goals || []);
  } catch (error: any) {
    console.log("Error obteniendo metas:", error);
    return c.json({ message: error.message || "Error obteniendo metas" }, 500);
  }
});

// Create goal
app.post("/make-server-5016f3b0/api/goals", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const body = await c.req.json();
    const { name, targetAmount, currentAmount, deadline, icon, color } = body;
    
    const goalId = `${Date.now()}`;
    const goal = {
      id: goalId,
      userId: tokenData.userId,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      icon: icon || '🎯',
      color: color || '#3B82F6',
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`goal:${tokenData.userId}:${goalId}`, goal);
    return c.json(goal, 201);
  } catch (error: any) {
    console.log("Error creando meta:", error);
    return c.json({ message: error.message || "Error creando meta" }, 500);
  }
});

// Update goal
app.put("/make-server-5016f3b0/api/goals/:id", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const goalKey = `goal:${tokenData.userId}:${id}`;
    const existingGoal = await kv.get(goalKey);
    
    if (!existingGoal) {
      return c.json({ message: "Meta no encontrada" }, 404);
    }
    
    const updatedGoal = {
      ...existingGoal,
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(goalKey, updatedGoal);
    return c.json(updatedGoal);
  } catch (error: any) {
    console.log("Error actualizando meta:", error);
    return c.json({ message: error.message || "Error actualizando meta" }, 500);
  }
});

// Delete goal
app.delete("/make-server-5016f3b0/api/goals/:id", async (c) => {
  try {
    const userToken = c.req.header("X-User-Token");
    if (!userToken) {
      return c.json({ message: "No autorizado" }, 401);
    }
    
    const tokenData = await kv.get(`token:${userToken}`);
    if (!tokenData) {
      return c.json({ message: "Token inválido" }, 401);
    }
    
    const id = c.req.param("id");
    const goalKey = `goal:${tokenData.userId}:${id}`;
    
    await kv.del(goalKey);
    return c.json({ success: true });
  } catch (error: any) {
    console.log("Error eliminando meta:", error);
    return c.json({ message: error.message || "Error eliminando meta" }, 500);
  }
});

Deno.serve(app.fetch);