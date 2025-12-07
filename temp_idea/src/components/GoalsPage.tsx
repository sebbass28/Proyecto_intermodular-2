import React, { useState, useEffect } from 'react';
import { Plus, Target, Trash2, Edit2, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import * as api from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
}

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    icon: '🎯',
    color: '#3B82F6',
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await api.getGoals();
      setGoals(data);
    } catch (error: any) {
      console.error('Error cargando metas:', error);
      toast.error('Error al cargar metas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const goalData = {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: formData.currentAmount ? parseFloat(formData.currentAmount) : 0,
        deadline: formData.deadline,
        icon: formData.icon,
        color: formData.color,
      };

      if (editingGoal) {
        await api.updateGoal(editingGoal.id, goalData);
        toast.success('Meta actualizada exitosamente');
      } else {
        await api.createGoal(goalData);
        toast.success('Meta creada exitosamente');
      }

      loadGoals();
      closeDialog();
    } catch (error: any) {
      console.error('Error guardando meta:', error);
      toast.error(error.message || 'Error al guardar la meta');
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline.split('T')[0],
      icon: goal.icon,
      color: goal.color,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta meta?')) return;

    try {
      await api.deleteGoal(id);
      toast.success('Meta eliminada exitosamente');
      loadGoals();
    } catch (error: any) {
      console.error('Error eliminando meta:', error);
      toast.error('Error al eliminar la meta');
    }
  };

  const handleAddFunds = async (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    try {
      await api.updateGoal(goalId, {
        currentAmount: goal.currentAmount + amount,
      });
      toast.success(`$${amount} agregados a ${goal.name}`);
      loadGoals();
    } catch (error: any) {
      console.error('Error agregando fondos:', error);
      toast.error('Error al agregar fondos');
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingGoal(null);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      icon: '🎯',
      color: '#3B82F6',
    });
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Metas Financieras</h1>
          <p className="text-gray-600">Define y alcanza tus objetivos financieros</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Meta
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Meta Total</p>
              <p className="text-2xl">${totalTargetAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ahorrado</p>
              <p className="text-2xl text-green-600">${totalCurrentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Progreso General</p>
              <p className="text-2xl">{overallProgress.toFixed(1)}%</p>
              <Progress value={overallProgress} className="mt-2" />
            </div>
          </div>
        </Card>
      </div>

      {/* Goals List */}
      <Card className="p-6">
        <h2 className="mb-6">Mis Metas</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando metas...</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-600 mb-4">No tienes metas aún</p>
            <Button onClick={() => setIsDialogOpen(true)} variant="outline">
              Agregar Primera Meta
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
              const daysRemaining = calculateDaysRemaining(goal.deadline);
              const isCompleted = progress >= 100;

              return (
                <Card
                  key={goal.id}
                  className="p-6 hover:shadow-md transition-shadow"
                  style={{ borderLeft: `4px solid ${goal.color}` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
                        style={{ backgroundColor: `${goal.color}20` }}
                      >
                        {goal.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg">{goal.name}</h3>
                          {isCompleted && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                              ✓ Completada
                            </span>
                          )}
                        </div>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>
                            ${goal.currentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} / ${goal.targetAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                          <span>•</span>
                          <span>
                            {daysRemaining > 0 
                              ? `${daysRemaining} días restantes`
                              : daysRemaining === 0
                              ? 'Vence hoy'
                              : `Venció hace ${Math.abs(daysRemaining)} días`
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(goal)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(goal.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progreso</span>
                      <span style={{ color: goal.color }}>{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-3" style={{ backgroundColor: `${goal.color}20` }} />
                  </div>

                  {!isCompleted && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddFunds(goal.id, 100)}
                        className="flex-1"
                      >
                        + $100
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddFunds(goal.id, 500)}
                        className="flex-1"
                      >
                        + $500
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const amount = prompt('¿Cuánto quieres agregar?');
                          if (amount && !isNaN(parseFloat(amount))) {
                            handleAddFunds(goal.id, parseFloat(amount));
                          }
                        }}
                        className="flex-1"
                      >
                        + Personalizado
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? 'Editar Meta' : 'Nueva Meta'}
            </DialogTitle>
            <DialogDescription>
              {editingGoal
                ? 'Actualiza los detalles de tu meta financiera'
                : 'Define una nueva meta financiera'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre de la Meta *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ej: Casa Nueva, Vacaciones"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetAmount">Meta ($) *</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="50000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="currentAmount">Ahorrado ($)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  step="0.01"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  placeholder="5000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="deadline">Fecha Límite *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon">Icono</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🎯"
                  maxLength={2}
                />
                <p className="text-xs text-gray-500 mt-1">Sugeridos: 🏠 ✈️ 🚗 💍 🎓 🛡️</p>
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingGoal ? 'Actualizar' : 'Crear'} Meta
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
