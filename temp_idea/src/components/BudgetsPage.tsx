import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Plus, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

const budgets = [
  { id: 1, category: '🍔 Comida', spent: 450, limit: 600, color: 'blue' },
  { id: 2, category: '🚗 Transporte', spent: 180, limit: 200, color: 'purple' },
  { id: 3, category: '🎬 Entretenimiento', spent: 280, limit: 250, color: 'pink' },
  { id: 4, category: '🏥 Salud', spent: 120, limit: 300, color: 'green' },
  { id: 5, category: '🛍️ Compras', spent: 350, limit: 400, color: 'orange' },
];

export function BudgetsPage() {
  const [selectedBudget, setSelectedBudget] = useState<number | null>(null);

  const getPercentage = (spent: number, limit: number) => (spent / limit) * 100;
  
  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 80) return 'text-orange-600';
    return 'text-green-600';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const overallPercentage = (totalSpent / totalLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎯 Presupuestos
          </h1>
          <p className="text-gray-600 mt-1">Gestiona tus límites de gastos</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Presupuesto
        </Button>
      </motion.div>

      {/* Resumen general */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Presupuesto Total</p>
              <p className="text-3xl font-bold">
                ${totalSpent.toLocaleString()} 
                <span className="text-lg text-gray-500"> / ${totalLimit.toLocaleString()}</span>
              </p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${getStatusColor(overallPercentage)}`}>
                {overallPercentage.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">usado</p>
            </div>
          </div>
          <Progress value={overallPercentage} className="h-3" />
          <div className="flex items-center gap-2 mt-4">
            {overallPercentage < 80 ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-700">¡Vas muy bien! Estás dentro del presupuesto</p>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <p className="text-sm text-orange-700">Atención: Cerca del límite de presupuesto</p>
              </>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Lista de presupuestos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget, index) => {
          const percentage = getPercentage(budget.spent, budget.limit);
          const isSelected = selectedBudget === budget.id;

          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedBudget(isSelected ? null : budget.id)}
            >
              <Card className={`p-6 cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-purple-500 shadow-lg' 
                  : 'hover:shadow-md'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{budget.category}</h3>
                  <span className={`text-sm font-medium ${getStatusColor(percentage)}`}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gastado</span>
                    <span className="font-medium">${budget.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Límite</span>
                    <span className="font-medium">${budget.limit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Disponible</span>
                    <span className={`font-medium ${
                      budget.limit - budget.spent > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${Math.abs(budget.limit - budget.spent).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <Progress 
                    value={percentage} 
                    className="h-2"
                  />
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Ver detalles
                      </Button>
                    </div>
                  </motion.div>
                )}

                {percentage >= 100 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-2 bg-red-50 rounded-lg flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-xs text-red-700">
                      ¡Límite excedido! Revisa tus gastos
                    </p>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Consejos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 mb-2">💡 Consejo de ahorro</h3>
              <p className="text-sm text-green-800">
                Podrías ahorrar ${((totalLimit - totalSpent) * 0.5).toLocaleString()} este mes 
                reduciendo gastos en entretenimiento y compras. ¡Sigue así!
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
