import { motion } from 'motion/react';
import { LiveMetrics } from "./LiveMetrics";
import { ExpenseChart } from "./ExpenseChart";
import { IncomeChart } from "./IncomeChart";
import { RecentTransactions } from "./RecentTransactions";
import { BudgetOverview } from "./BudgetOverview";

export function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Título de la página */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          💰 FinanceFlow Dashboard
        </h1>
        <p className="text-gray-700 text-lg">Tu centro de control financiero personal</p>
      </motion.div>

      {/* Métricas principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <LiveMetrics />
      </motion.div>

      {/* Gráficos principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <IncomeChart />
        <ExpenseChart />
      </motion.div>

      {/* Sección inferior con transacciones y presupuestos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <div>
          <BudgetOverview />
        </div>
      </motion.div>

      {/* Llamada a la acción mejorada */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 p-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white shadow-2xl"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              🚀 ¿Listo para optimizar tus finanzas?
            </h3>
            <p className="text-blue-100 text-lg opacity-90">
              Obtén insights personalizados y recomendaciones basadas en IA para mejorar tu salud financiera.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 font-semibold">
              📊 Ver Reportes
            </button>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold shadow-lg">
              🎯 Obtener Insights
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
