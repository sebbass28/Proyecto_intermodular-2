import React, { useState, useEffect } from 'react';
import { Plus, Wallet, CreditCard, PiggyBank, Trash2, Edit2, TrendingUp, TrendingDown } from 'lucide-react';
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

interface WalletItem {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  color: string;
  icon: string;
}

export function WalletsPage() {
  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<WalletItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank',
    balance: '',
    currency: 'USD',
    color: '#3B82F6',
    icon: '🏦',
  });

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      setLoading(true);
      const data = await api.getWallets();
      setWallets(data);
    } catch (error: any) {
      console.error('Error cargando carteras:', error);
      toast.error('Error al cargar carteras');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.balance) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const walletData = {
        name: formData.name,
        type: formData.type,
        balance: parseFloat(formData.balance),
        currency: formData.currency,
        color: formData.color,
        icon: formData.icon,
      };

      if (editingWallet) {
        await api.updateWallet(editingWallet.id, walletData);
        toast.success('Cartera actualizada exitosamente');
      } else {
        await api.createWallet(walletData);
        toast.success('Cartera creada exitosamente');
      }

      loadWallets();
      closeDialog();
    } catch (error: any) {
      console.error('Error guardando cartera:', error);
      toast.error(error.message || 'Error al guardar la cartera');
    }
  };

  const handleEdit = (wallet: WalletItem) => {
    setEditingWallet(wallet);
    setFormData({
      name: wallet.name,
      type: wallet.type,
      balance: wallet.balance.toString(),
      currency: wallet.currency,
      color: wallet.color,
      icon: wallet.icon,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta cartera?')) return;

    try {
      await api.deleteWallet(id);
      toast.success('Cartera eliminada exitosamente');
      loadWallets();
    } catch (error: any) {
      console.error('Error eliminando cartera:', error);
      toast.error('Error al eliminar la cartera');
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingWallet(null);
    setFormData({
      name: '',
      type: 'bank',
      balance: '',
      currency: 'USD',
      color: '#3B82F6',
      icon: '🏦',
    });
  };

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const positiveBalance = wallets.reduce((sum, wallet) => sum + (wallet.balance > 0 ? wallet.balance : 0), 0);
  const negativeBalance = wallets.reduce((sum, wallet) => sum + (wallet.balance < 0 ? wallet.balance : 0), 0);

  const walletIcons: { [key: string]: string } = {
    bank: '🏦',
    savings: '💰',
    credit: '💳',
    cash: '💵',
    investment: '📈',
    other: '👛',
  };

  const walletColors: { [key: string]: string } = {
    bank: '#3B82F6',
    savings: '#10B981',
    credit: '#EF4444',
    cash: '#F59E0B',
    investment: '#8B5CF6',
    other: '#6B7280',
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Carteras y Cuentas</h1>
          <p className="text-gray-600">Gestiona todas tus cuentas y carteras</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Cartera
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Balance Total</p>
              <p className={`text-2xl ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(totalBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`w-12 h-12 ${totalBalance >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
              <Wallet className={`w-6 h-6 ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Activos</p>
              <p className="text-2xl text-green-600">${positiveBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Deudas</p>
              <p className="text-2xl text-red-600">${Math.abs(negativeBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Wallets List */}
      <Card className="p-6">
        <h2 className="mb-6">Mis Carteras</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando carteras...</p>
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💳</div>
            <p className="text-gray-600 mb-4">No tienes carteras aún</p>
            <Button onClick={() => setIsDialogOpen(true)} variant="outline">
              Agregar Primera Cartera
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wallets.map((wallet) => (
              <Card
                key={wallet.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden"
                style={{ borderLeft: `4px solid ${wallet.color}` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${wallet.color}20` }}
                    >
                      {wallet.icon}
                    </div>
                    <div>
                      <h3 className="text-base mb-1">{wallet.name}</h3>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 capitalize">
                        {wallet.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Balance</p>
                  <p className={`text-2xl ${wallet.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                    ${Math.abs(wallet.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500">{wallet.currency}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(wallet)}
                    className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(wallet.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingWallet ? 'Editar Cartera' : 'Nueva Cartera'}
            </DialogTitle>
            <DialogDescription>
              {editingWallet
                ? 'Actualiza los detalles de tu cartera'
                : 'Agrega una nueva cartera o cuenta'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ej: Cuenta Principal, Ahorros"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => {
                  setFormData({ 
                    ...formData, 
                    type: value,
                    icon: walletIcons[value] || '💳',
                    color: walletColors[value] || '#3B82F6'
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">🏦 Cuenta Bancaria</SelectItem>
                  <SelectItem value="savings">💰 Ahorros</SelectItem>
                  <SelectItem value="credit">💳 Tarjeta de Crédito</SelectItem>
                  <SelectItem value="cash">💵 Efectivo</SelectItem>
                  <SelectItem value="investment">📈 Inversión</SelectItem>
                  <SelectItem value="other">👛 Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="balance">Balance Inicial *</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="currency">Moneda *</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - Dólar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - Libra</SelectItem>
                    <SelectItem value="MXN">MXN - Peso</SelectItem>
                    <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                    <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon">Icono</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🏦"
                  maxLength={2}
                />
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
                {editingWallet ? 'Actualizar' : 'Crear'} Cartera
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
