import { useState } from "react";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);
  const { user, token, loading, error, register, login, logout, tryAutoLogin } =
    useAuthStore();
  useEffect(() => {
    tryAutoLogin();
  }, []);

  return (
    <div className="bg-primary-50 dark:bg-primary-900 rounded-lg p-6 mb-6">
      {user ? (
        <>
          <p className="text-2xl font-bold text-primary-700 dark:text-primary-300 mb-2">
            Hola, {user.name}
          </p>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            className="btn btn-primary mb-2"
            onClick={() =>
              register("usuario1@ejemplo.com", "123456", "Usuario Test")
            }
          >
            Register
          </button>
          <button
            className="btn btn-primary"
            onClick={() => login("usuario1@ejemplo.com", "123456")}
          >
            Login
          </button>
        </>
      )}
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{JSON.stringify(error)}</p>}
    </div>
  );
}

export default App;
