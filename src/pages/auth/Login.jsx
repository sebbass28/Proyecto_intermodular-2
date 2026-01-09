import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/finance-flow-logo-gradient.svg";
import { ShieldCheck } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const {
    user,
    loading,
    error,
    login,
    tryAutoLogin,
    is2FARequired,
    verifyLogin2FA,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");

  useEffect(() => {
    tryAutoLogin();
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    await verifyLogin2FA(twoFactorCode);
  };

  if (is2FARequired) {
    return (
      <div className="flex items-center justify-center p-6 md:p-12 bg-gradient-to-r from-green-50 to-emerald-100 min-h-screen">
        <div className="mx-auto w-full max-w-[450px] bg-white p-8 rounded-xl shadow-lg border border-emerald-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Verificación 2FA
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Ingresa el código de 6 dígitos desde tu aplicación de
              autenticación para continuar.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-md text-sm text-center">
              {typeof error === "string" ? error : "Código incorrecto"}
            </div>
          )}

          <form onSubmit={handleVerify2FA} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Código de autenticación
              </label>
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) =>
                  setTwoFactorCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                placeholder="000 000"
                className="block w-full text-center text-3xl tracking-[0.5em] font-mono rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-3"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || twoFactorCode.length < 6}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Verificar"}
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full text-sm text-gray-500 hover:text-gray-700 text-center"
            >
              Volver al inicio de sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6 md:p-12 bg-gradient-to-r from-green-50 to-emerald-100 min-h-screen">
      <div className="mx-auto w-full max-w-[550px] bg-white p-8 rounded-xl shadow-lg">
        <img
          alt="FinanceFlow"
          src={logo}
          className="mx-auto h-28 w-auto hover:drop-shadow-[0_0_10px_theme(colors.emerald.400)] transition-all duration-300;"
        />

        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Bienvenido a FinanceFlow
        </h2>

        <p className="mt-2 text-center text-sm/6 text-gray-500">
          Tu flujo financiero en control
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </div>
        )}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>

              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="ejemplo@email.com"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>

                <div className="text-sm">
                  <Link
                    to="/forgotPassword"
                    className="font-semibold text-gray-800 hover:text-emerald-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Ingresando..." : "Sign in"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="font-semibold text-gray-800 hover:text-emerald-500"
            >
              Regístrarse aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Login;
