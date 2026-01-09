import { useState, useEffect } from "react";
import {
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  Trash2,
  Edit2,
} from "lucide-react";
import api from "../../api/api";

export default function WalletsView() {
  const [wallets, setWallets] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    type: "bank",
    balance: "",
    currency: "USD",
    color: "#3B82F6",
    icon: "🏦",
  });

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      setLoading(true);
      const response = await api.get("/wallets");
      setWallets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error cargando carteras:", error);
      setWallets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.balance) {
      alert("Por favor completa todos los campos requeridos");
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
        await api.put(`/wallets/${editingWallet.id}`, walletData);
        alert("Cartera actualizada exitosamente");
      } else {
        await api.post("/wallets", walletData);
        alert("Cartera creada exitosamente");
      }

      loadWallets();
      closeDialog();
    } catch (error) {
      console.error("Error guardando cartera:", error);
      alert(error.response?.data?.message || "Error al guardar la cartera");
    }
  };

  const handleEdit = (wallet) => {
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

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar esta cartera?")) return;

    try {
      await api.delete(`/wallets/${id}`);
      alert("Cartera eliminada exitosamente");
      loadWallets();
    } catch (error) {
      console.error("Error eliminando cartera:", error);
      alert("Error al eliminar la cartera");
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingWallet(null);
    setFormData({
      name: "",
      type: "bank",
      balance: "",
      currency: "USD",
      color: "#3B82F6",
      icon: "🏦",
    });
  };

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const positiveBalance = wallets.reduce(
    (sum, wallet) => sum + (wallet.balance > 0 ? wallet.balance : 0),
    0
  );
  const negativeBalance = wallets.reduce(
    (sum, wallet) => sum + (wallet.balance < 0 ? wallet.balance : 0),
    0
  );

  const walletIcons = {
    bank: "🏦",
    savings: "💰",
    credit: "💳",
    cash: "💵",
    investment: "📈",
    other: "👛",
  };

  const walletColors = {
    bank: "#3B82F6",
    savings: "#10B981",
    credit: "#EF4444",
    cash: "#F59E0B",
    investment: "#8B5CF6",
    other: "#6B7280",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Carteras y Cuentas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona todas tus cuentas y carteras
          </p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Nueva Cartera
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Balance Total
              </p>
              <p
                className={`text-2xl font-bold ${
                  totalBalance >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                $
                {Math.abs(totalBalance).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div
              className={`w-12 h-12 ${
                totalBalance >= 0
                  ? "bg-green-100 dark:bg-green-900/30"
                  : "bg-red-100 dark:bg-red-900/30"
              } rounded-full flex items-center justify-center`}
            >
              <Wallet
                className={`w-6 h-6 ${
                  totalBalance >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Activos
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                $
                {positiveBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Deudas
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                $
                {Math.abs(negativeBalance).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          Mis Carteras
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Cargando carteras...
            </p>
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💳</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No tienes carteras aún
            </p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Agregar Primera Cartera
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="p-6 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800/50"
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
                      <h3 className="text-base font-semibold mb-1 text-gray-900 dark:text-white">
                        {wallet.name}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 capitalize">
                        {wallet.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Balance
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      wallet.balance >= 0
                        ? "text-gray-900 dark:text-white"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    $
                    {Math.abs(wallet.balance).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {wallet.currency}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(wallet)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm border border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400 rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(wallet.id)}
                    className="px-3 py-2 text-sm border border-red-600 text-red-600 dark:text-red-400 dark:border-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-100 dark:border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {editingWallet ? "Editar Cartera" : "Nueva Cartera"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {editingWallet
                ? "Actualiza los detalles de tu cartera"
                : "Agrega una nueva cartera o cuenta"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="ej: Cuenta Principal, Ahorros"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Tipo *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      type: value,
                      icon: walletIcons[value] || "💳",
                      color: walletColors[value] || "#3B82F6",
                    });
                  }}
                  className="input"
                >
                  <option value="bank">🏦 Cuenta Bancaria</option>
                  <option value="savings">💰 Ahorros</option>
                  <option value="credit">💳 Tarjeta de Crédito</option>
                  <option value="cash">💵 Efectivo</option>
                  <option value="investment">📈 Inversión</option>
                  <option value="other">👛 Otro</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Balance Inicial *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) =>
                      setFormData({ ...formData, balance: e.target.value })
                    }
                    placeholder="0.00"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Moneda *
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="input"
                  >
                    <option value="USD">USD - Dólar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - Libra</option>
                    <option value="MXN">MXN - Peso</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Icono
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    placeholder="🏦"
                    maxLength={2}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Color
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-full h-10 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  {editingWallet ? "Actualizar" : "Crear"} Cartera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
