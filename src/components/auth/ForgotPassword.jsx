import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Llamar a tu backend
      const response = await api.post("/auth/forgot-password", { email });
      
      setMessage(" Email enviado! Revisa tu bandeja de entrada");
      setEmail(""); // Limpiar el formulario
    } catch (error) {
      setError(" Error: " + (error.response?.data?.message || "No se pudo enviar el email"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-6 md:p-12 bg-gray-100 min-h-screen">
      <div className="mx-auto w-full max-w-[550px] bg-white p-8 rounded-xl shadow-lg">
        <img
          alt="FinanceFlow"
          src="/finance-flow-logo-gradient.svg"
          className="mx-auto h-28 w-auto hover:drop-shadow-[0_0_10px_theme(colors.emerald.400)] transition-all duration-300;"
        />

        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Recuperar Contraseña
        </h2>

        <p className="mt-2 text-center text-sm/6 text-gray-500">
          Ingresa tu correo electrónico para restablecer tu contraseña
        </p>

        {/* Mensajes de éxito/error */}
        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Enviando..." : "Reset Password"}
              </button>

              <Link
                to="/"
                className="mt-4 flex w-full justify-center text-sm/6 font-semibold text-gray-800 hover:text-emerald-500"
              >
                Volver al login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;