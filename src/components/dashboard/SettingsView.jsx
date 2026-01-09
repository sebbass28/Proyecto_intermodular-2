import { useState, useEffect } from "react";
import {
  Settings,
  Shield,
  Smartphone,
  Monitor,
  Trash2,
  Lock,
  QrCode,
  XCircle,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const SettingsView = () => {
  const {
    changePassword,
    deleteAccount,
    user,
    setup2FA,
    confirm2FA,
    disable2FA,
    getSessions,
    revokeSession,
  } = useAuthStore();

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  // 2FA Logic
  const [is2FASetupMode, setIs2FASetupMode] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [tokenCode, setTokenCode] = useState("");
  const [msg2FA, setMsg2FA] = useState("");

  // Devices Logic
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoadingSessions(true);
    const data = await getSessions();
    setSessions(data);
    setLoadingSessions(false);
  };

  const handleToggle2FA = async () => {
    if (user.two_factor_enabled) {
      if (
        window.confirm(
          "¿Seguro que quieres desactivar la autenticación de dos factores? Tu cuenta será menos segura."
        )
      ) {
        const success = await disable2FA();
        if (success) {
          setMsg2FA("2FA Desactivado correctamente");
          setTimeout(() => setMsg2FA(""), 3000);
        }
      }
    } else {
      // Start setup
      try {
        const data = await setup2FA();
        setQrCode(data.qrCode);
        setIs2FASetupMode(true);
        setMsg2FA("");
      } catch (err) {
        setMsg2FA("Error al iniciar configuración 2FA");
      }
    }
  };

  const handleConfirm2FA = async () => {
    if (!tokenCode) return;
    try {
      await confirm2FA(tokenCode);
      setIs2FASetupMode(false);
      setQrCode(null);
      setTokenCode("");
      setMsg2FA("¡2FA Activado exitosamente!");
      setTimeout(() => setMsg2FA(""), 3000);
    } catch (err) {
      setMsg2FA("Código incorrecto, intenta de nuevo.");
    }
  };

  const handleCancel2FA = () => {
    setIs2FASetupMode(false);
    setQrCode(null);
    setTokenCode("");
    setMsg2FA("");
  };

  const handleRevokeSession = async (sessionId) => {
    if (window.confirm("¿Cerrar sesión en este dispositivo?")) {
      await revokeSession(sessionId);
      fetchSessions();
    }
  };

  const parseDeviceInfo = (jsonStr) => {
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return { browser: "Desconocido", os: "", device: "Dispositivo" };
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setStatus({
        type: "error",
        message: "Las nuevas contraseñas no coinciden",
      });
      return;
    }
    if (passwords.new.length < 6) {
      setStatus({
        type: "error",
        message: "La contraseña debe tener al menos 6 caracteres",
      });
      return;
    }
    setStatus({ type: "loading", message: "Actualizando..." });
    const result = await changePassword(passwords.current, passwords.new);
    if (result.success) {
      setStatus({
        type: "success",
        message: "Contraseña actualizada correctamente",
      });
      setPasswords({ current: "", new: "", confirm: "" });
      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
    } else {
      setStatus({ type: "error", message: result.error });
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "¿ESTÁ SEGURO? Esta acción eliminará permanentemente su cuenta y todos sus datos. No se puede deshacer."
      )
    ) {
      const success = await deleteAccount();
      if (!success) {
        alert("Error al eliminar la cuenta. Intente nuevamente.");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-2">
        <Settings className="w-8 h-8 text-emerald-500" />
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Configuración
        </h1>
      </div>

      {/* Security Section - 2FA */}
      <div className="card">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Seguridad
            </h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Protege tu cuenta con capas adicionales de seguridad.
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Autenticación de dos factores (2FA)
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Añade una capa extra de seguridad a tu cuenta.
              </p>
            </div>
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={user?.two_factor_enabled || false}
                onChange={handleToggle2FA}
                disabled={is2FASetupMode}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 dark:bg-gray-700 dark:peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {msg2FA && (
            <p
              className={`text-sm mb-4 ${
                msg2FA.includes("exitosamente") ||
                msg2FA.includes("Desactivado")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {msg2FA}
            </p>
          )}

          {is2FASetupMode && qrCode && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-600 animate-in fade-in slide-in-from-top-4">
              <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <QrCode className="w-5 h-5" /> Escanea este código QR
              </h4>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                </div>
                <div className="flex-1 space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    1. Abre tu aplicación de autenticación (Google
                    Authenticator, Authy, etc).
                    <br />
                    2. Escanea el código QR.
                    <br />
                    3. Ingresa el código de 6 dígitos que aparece en la app.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tokenCode}
                      onChange={(e) =>
                        setTokenCode(
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                      className="input text-center tracking-widest text-xl font-mono w-40"
                      placeholder="000 000"
                    />
                    <button
                      onClick={handleConfirm2FA}
                      className="btn btn-primary"
                    >
                      Verificar y Activar
                    </button>
                  </div>
                  <button
                    onClick={handleCancel2FA}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Section */}
      <div className="card">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Cambiar Contraseña
            </h2>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña Actual
              </label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
                className="input"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
                className="input"
                required
                minLength={6}
              />
            </div>

            {status.message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  status.type === "error"
                    ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    : status.type === "success"
                    ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={status.type === "loading"}
              className="btn btn-primary w-full md:w-auto"
            >
              {status.type === "loading"
                ? "Actualizando..."
                : "Actualizar Contraseña"}
            </button>
          </form>
        </div>
      </div>

      {/* Connected Devices */}
      <div className="card">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Monitor className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Dispositivos Conectados
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {loadingSessions ? (
            <p className="text-gray-500 text-sm">Cargando sesiones...</p>
          ) : sessions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron sesiones activas.
            </p>
          ) : (
            sessions.map((session) => {
              const info = parseDeviceInfo(session.device_info);
              const isCurrent = false; // Could check ID if backend returned current session ID match
              return (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg gap-4"
                >
                  <div className="flex items-center gap-4">
                    {info.device.type === "mobile" ? (
                      <Smartphone className="w-8 h-8 text-gray-400" />
                    ) : (
                      <Monitor className="w-8 h-8 text-gray-400" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {info.browser} en {info.os}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex flex-col gap-1">
                        <span>IP: {session.ip_address}</span>
                        <span>
                          Activo:{" "}
                          {new Date(session.last_active).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    className="text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 font-medium transition-colors border border-gray-200 dark:border-gray-600 px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Cerrar sesión
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/10 rounded-xl shadow-md border border-red-100 dark:border-red-900/30 overflow-hidden">
        <div className="p-6 border-b border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-3 mb-2">
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400">
              Zona de Peligro
            </h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Eliminar cuenta
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Acción irreversible. Borrará todos tus datos.
              </p>
            </div>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm w-full sm:w-auto"
              onClick={handleDeleteAccount}
            >
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
