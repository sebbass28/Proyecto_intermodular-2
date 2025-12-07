import React, { useState, useEffect } from 'react';
import { Download, Filter, Calendar, TrendingUp, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as api from '../utils/api';
import { toast } from 'sonner@2.0.3';

export function ReportsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, budgetsData] = await Promise.all([
        api.getTransactions(),
        api.getBudgets(),
      ]);
      setTransactions(transactionsData);
      setBudgets(budgetsData);
    } catch (error: any) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0';

  // Category breakdown for expenses
  const categoryData = transactions
    .filter(t => t.amount < 0)
    .reduce((acc: any, t) => {
      const category = t.category || 'Sin categoría';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Math.abs(t.amount);
      return acc;
    }, {});

  const pieChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  // Income vs Expenses by month
  const monthlyData = transactions.reduce((acc: any, t) => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, income: 0, expenses: 0 };
    }
    
    if (t.amount > 0) {
      acc[monthKey].income += t.amount;
    } else {
      acc[monthKey].expenses += Math.abs(t.amount);
    }
    
    return acc;
  }, {});

  const barChartData = Object.values(monthlyData).sort((a: any, b: any) => 
    a.month.localeCompare(b.month)
  );

  // Budget vs Actual
  const budgetComparisonData = budgets.map(budget => ({
    category: budget.category,
    limit: budget.limit,
    spent: budget.spent || 0,
    remaining: budget.limit - (budget.spent || 0),
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      period,
      summary: {
        totalIncome,
        totalExpenses,
        netSavings,
        savingsRate: `${savingsRate}%`,
      },
      categoryBreakdown: categoryData,
      transactions,
      budgets,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financeflow-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Reporte exportado exitosamente');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Reportes y Análisis</h1>
          <p className="text-gray-600">Visualiza tus finanzas en profundidad</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
              <SelectItem value="all">Todo el Tiempo</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando reportes...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ingresos</p>
                  <p className="text-2xl text-green-600">${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Gastos</p>
                  <p className="text-2xl text-red-600">${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ahorro Neto</p>
                  <p className={`text-2xl ${netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(netSavings).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className={`w-12 h-12 ${netSavings >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
                  <PieChartIcon className={`w-6 h-6 ${netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tasa de Ahorro</p>
                  <p className={`text-2xl ${parseFloat(savingsRate) >= 20 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {savingsRate}%
                  </p>
                </div>
                <div className={`w-12 h-12 ${parseFloat(savingsRate) >= 20 ? 'bg-green-100' : 'bg-yellow-100'} rounded-full flex items-center justify-center`}>
                  <TrendingUp className={`w-6 h-6 ${parseFloat(savingsRate) >= 20 ? 'text-green-600' : 'text-yellow-600'}`} />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Category Breakdown */}
            <Card className="p-6">
              <h2 className="mb-6">Gastos por Categoría</h2>
              {pieChartData.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No hay datos de gastos</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>

            {/* Income vs Expenses */}
            <Card className="p-6">
              <h2 className="mb-6">Ingresos vs Gastos Mensuales</h2>
              {barChartData.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No hay datos mensuales</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
                    <Legend />
                    <Bar dataKey="income" fill="#10B981" name="Ingresos" />
                    <Bar dataKey="expenses" fill="#EF4444" name="Gastos" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            {/* Budget Comparison */}
            <Card className="p-6">
              <h2 className="mb-6">Presupuesto vs Real</h2>
              {budgetComparisonData.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No hay presupuestos configurados</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" width={150} />
                    <Tooltip formatter={(value: any) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
                    <Legend />
                    <Bar dataKey="limit" fill="#3B82F6" name="Límite" />
                    <Bar dataKey="spent" fill="#EF4444" name="Gastado" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>

          {/* Insights */}
          <Card className="p-6">
            <h2 className="mb-6">Perspectivas Financieras</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-sm">Categoría de Mayor Gasto</h3>
                </div>
                <p className="text-lg">
                  {pieChartData.length > 0
                    ? pieChartData.reduce((max, item) => (item.value > max.value ? item : max), pieChartData[0]).name
                    : 'N/A'}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-sm">Promedio Diario de Gastos</h3>
                </div>
                <p className="text-lg">
                  ${(totalExpenses / 30).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <PieChartIcon className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-sm">Total de Transacciones</h3>
                </div>
                <p className="text-lg">{transactions.length}</p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
