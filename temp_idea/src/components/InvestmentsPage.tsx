import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Trash2, Edit2, DollarSign } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import * as api from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface Investment {
  id: string;
  name: string;
  type: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
}

export function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'stock',
    symbol: '',
    quantity: '',
    purchasePrice: '',
    currentPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = async () => {
    try {
      setLoading(true);
      const data = await api.getInvestments();
      setInvestments(data);
    } catch (error: any) {
      console.error('Error cargando inversiones:', error);
      toast.error('Error al cargar inversiones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.symbol || !formData.quantity || !formData.purchasePrice) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const investmentData = {
        name: formData.name,
        type: formData.type,
        symbol: formData.symbol.toUpperCase(),
        quantity: parseFloat(formData.quantity),
        purchasePrice: parseFloat(formData.purchasePrice),
        currentPrice: formData.currentPrice ? parseFloat(formData.currentPrice) : parseFloat(formData.purchasePrice),
        purchaseDate: formData.purchaseDate,
      };

      if (editingInvestment) {
        await api.updateInvestment(editingInvestment.id, investmentData);
        toast.success('Inversión actualizada exitosamente');
      } else {
        await api.createInvestment(investmentData);
        toast.success('Inversión creada exitosamente');
      }

      loadInvestments();
      closeDialog();
    } catch (error: any) {
      console.error('Error guardando inversión:', error);
      toast.error(error.message || 'Error al guardar la inversión');
    }
  };

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment);
    setFormData({
      name: investment.name,
      type: investment.type,
      symbol: investment.symbol,
      quantity: investment.quantity.toString(),
      purchasePrice: investment.purchasePrice.toString(),
      currentPrice: investment.currentPrice.toString(),
      purchaseDate: investment.purchaseDate.split('T')[0],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta inversión?')) return;

    try {
      await api.deleteInvestment(id);
      toast.success('Inversión eliminada exitosamente');
      loadInvestments();
    } catch (error: any) {
      console.error('Error eliminando inversión:', error);
      toast.error('Error al eliminar la inversión');
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingInvestment(null);
    setFormData({
      name: '',
      type: 'stock',
      symbol: '',
      quantity: '',
      purchasePrice: '',
      currentPrice: '',
      purchaseDate: new Date().toISOString().split('T')[0],
    });
  };

  const calculateReturn = (investment: Investment) => {
    const totalCost = investment.quantity * investment.purchasePrice;
    const currentValue = investment.quantity * investment.currentPrice;
    const returnAmount = currentValue - totalCost;
    const returnPercent = ((returnAmount / totalCost) * 100).toFixed(2);
    return { returnAmount, returnPercent };
  };

  const totalInvested = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.purchasePrice,
    0
  );
  
  const currentValue = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.currentPrice,
    0
  );

  const totalReturn = currentValue - totalInvested;
  const totalReturnPercent = totalInvested > 0 ? ((totalReturn / totalInvested) * 100).toFixed(2) : '0.00';

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stock':
        return '📈';
      case 'crypto':
        return '₿';
      case 'bond':
        return '📊';
      case 'fund':
        return '💼';
      default:
        return '💰';
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Inversiones</h1>
          <p className="text-gray-600">Gestiona tu portafolio de inversiones</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Inversión
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Invertido</p>
              <p className="text-2xl">${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Valor Actual</p>
              <p className="text-2xl">${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rendimiento Total</p>
              <p className={`text-2xl ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(totalReturn).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className={`text-sm ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalReturn >= 0 ? '+' : '-'}{Math.abs(parseFloat(totalReturnPercent))}%
              </p>
            </div>
            <div className={`w-12 h-12 ${totalReturn >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
              {totalReturn >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600" />
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Investments List */}
      <Card className="p-6">
        <h2 className="mb-6">Mis Inversiones</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando inversiones...</p>
          </div>
        ) : investments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📈</div>
            <p className="text-gray-600 mb-4">No tienes inversiones aún</p>
            <Button onClick={() => setIsDialogOpen(true)} variant="outline">
              Agregar Primera Inversión
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {investments.map((investment) => {
              const { returnAmount, returnPercent } = calculateReturn(investment);
              const isPositive = returnAmount >= 0;

              return (
                <div
                  key={investment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-3xl">{getTypeIcon(investment.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base">{investment.name}</h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          {investment.symbol}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>{investment.quantity} unidades</span>
                        <span>•</span>
                        <span>Compra: ${investment.purchasePrice.toLocaleString()}</span>
                        <span>•</span>
                        <span>Actual: ${investment.currentPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className={`text-base ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : '-'}${Math.abs(returnAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : '-'}{Math.abs(parseFloat(returnPercent))}%
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(investment)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(investment.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
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
              {editingInvestment ? 'Editar Inversión' : 'Nueva Inversión'}
            </DialogTitle>
            <DialogDescription>
              {editingInvestment
                ? 'Actualiza los detalles de tu inversión'
                : 'Agrega una nueva inversión a tu portafolio'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ej: Apple Inc., Bitcoin"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">📈 Acción</SelectItem>
                  <SelectItem value="crypto">₿ Criptomoneda</SelectItem>
                  <SelectItem value="bond">📊 Bono</SelectItem>
                  <SelectItem value="fund">💼 Fondo</SelectItem>
                  <SelectItem value="other">💰 Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="symbol">Símbolo/Ticker *</Label>
              <Input
                id="symbol"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                placeholder="ej: AAPL, BTC"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Cantidad *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.00000001"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="10"
                  required
                />
              </div>

              <div>
                <Label htmlFor="purchasePrice">Precio Compra *</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  placeholder="150.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentPrice">Precio Actual</Label>
                <Input
                  id="currentPrice"
                  type="number"
                  step="0.01"
                  value={formData.currentPrice}
                  onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                  placeholder="175.00"
                />
              </div>

              <div>
                <Label htmlFor="purchaseDate">Fecha Compra *</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingInvestment ? 'Actualizar' : 'Crear'} Inversión
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
