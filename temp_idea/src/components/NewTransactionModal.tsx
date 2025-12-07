import React, { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { motion, AnimatePresence } from 'motion/react';
import * as api from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewTransactionModal({ isOpen, onClose }: NewTransactionModalProps) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.category) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      
      const transactionData = {
        type: formData.type,
        amount: formData.type === 'expense' 
          ? -Math.abs(parseFloat(formData.amount)) 
          : Math.abs(parseFloat(formData.amount)),
        category: formData.category,
        description: formData.description,
        date: formData.date,
      };

      await api.createTransaction(transactionData);
      toast.success('Transacción creada exitosamente');
      onClose();
    } catch (error: any) {
      console.error('Error creando transacción:', error);
      toast.error(error.message || 'Error al crear la transacción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl">Nueva Transacción</h2>
                    <p className="text-sm text-gray-600">Registra un nuevo ingreso o gasto</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Type */}
                <div>
                  <Label htmlFor="type">Tipo de Transacción *</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'expense' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.type === 'expense'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">💸</div>
                        <p className="font-medium">Gasto</p>
                        <p className="text-xs text-gray-500">Salida de dinero</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'income' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.type === 'income'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">💰</div>
                        <p className="font-medium">Ingreso</p>
                        <p className="text-xs text-gray-500">Entrada de dinero</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <Label htmlFor="amount">Monto *</Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                      className="pl-8 text-lg"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.type === 'expense' ? (
                        <>
                          <SelectItem value="Comida">🍔 Comida</SelectItem>
                          <SelectItem value="Transporte">🚗 Transporte</SelectItem>
                          <SelectItem value="Entretenimiento">🎬 Entretenimiento</SelectItem>
                          <SelectItem value="Servicios">💡 Servicios</SelectItem>
                          <SelectItem value="Salud">🏥 Salud</SelectItem>
                          <SelectItem value="Educación">📚 Educación</SelectItem>
                          <SelectItem value="Compras">🛍️ Compras</SelectItem>
                          <SelectItem value="Otros">📦 Otros</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Salario">💼 Salario</SelectItem>
                          <SelectItem value="Freelance">💻 Freelance</SelectItem>
                          <SelectItem value="Inversiones">📈 Inversiones</SelectItem>
                          <SelectItem value="Ventas">🏪 Ventas</SelectItem>
                          <SelectItem value="Bonos">🎁 Bonos</SelectItem>
                          <SelectItem value="Otros">💰 Otros</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Agrega detalles sobre esta transacción..."
                    className="mt-2 resize-none"
                    rows={3}
                  />
                </div>

                {/* Date */}
                <div>
                  <Label htmlFor="date">Fecha *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Crear Transacción'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
