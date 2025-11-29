<<<<<<< Updated upstream
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

function Register() {
  const navigate = useNavigate();
  const [count, setCount] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");

=======
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const { register, loading, error, user } = useAuthStore();
  const [count, setCount] = useState(1);
>>>>>>> Stashed changes
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
<<<<<<< Updated upstream
    birthDay: "",
    location: "",
    numberPhone: "",
    preferCoin: "",
    mensualIngres: "",
    receiveNotifications: false,
    acceptTerms: false,
  });

  const { register, loading, error } = useAuthStore();

  // Lista de países predefinida
  const countryOptions = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
    "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
    "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde",
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
    "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia",
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
    "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
    "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "North Korea", "South Korea", "Kosovo", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
    "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
    "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
    "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
    "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland",
    "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago",
    "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
    "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
    "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];
=======
    creditCard: "",
    location: "",
    numberPhone: "",
    birthDay: "",
    address: "",
  });

  const [countryOptions, setCountryOptions] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) throw new Error("No se pudieron cargar los países");
        const data = await response.json();
        const countryNames = data.map((country) => country.name.common);
        countryNames.sort((a, b) =>
          a.localeCompare(b, "es", { sensitivity: "base" })
        );
        setCountryOptions(countryNames);
      } catch (error) {
        console.error("Error al cargar países:", error);
      } finally {
        setIsLoadingCountries(false);
      }
    }
    fetchCountries();
  }, []);
>>>>>>> Stashed changes

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }

<<<<<<< Updated upstream
=======
    if (e.target.name === "location" && errors.location) {
      setErrors({ ...errors, location: null });
    }
>>>>>>> Stashed changes
  };

  const siguiente = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.name) newErrors.name = "El nombre es obligatorio.";
    if (!form.email) newErrors.email = "El email es obligatorio.";
    if (!form.password) newErrors.password = "La contraseña es obligatoria.";
    if (form.password.length < 6)
      newErrors.password = "Debe tener al menos 6 caracteres.";
    if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setCount(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validar campos del paso 1
    if (!form.name) newErrors.name = "El nombre es obligatorio.";
    if (!form.email) newErrors.email = "El email es obligatorio.";
    if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = "Las contraseñas no coinciden";
    }

    // Validar campos del paso 2
<<<<<<< Updated upstream

    if (!form.birthDay)
      newErrors.birthDay = "La fecha de nacimiento es obligatoria.";

    if (!form.location) newErrors.location = "El país es obligatorio.";

    if (!form.numberPhone)
      newErrors.numberPhone = "El teléfono es obligatorio.";

    if (!form.preferCoin)
      newErrors.preferCoin = "La moneda preferida es obligatoria.";

    if (!form.mensualIngres)
      newErrors.mensualIngres = "El ingreso mensual es obligatorio.";

    if (!form.acceptTerms)
      newErrors.acceptTerms = "Debes aceptar los términos y condiciones.";
=======
    if (!form.creditCard) newErrors.creditCard = "La tarjeta es obligatoria.";
    if (!form.location) newErrors.location = "El país es obligatorio.";
    if (!form.numberPhone) newErrors.numberPhone = "El teléfono es obligatorio.";
    if (!form.birthDay) newErrors.birthDay = "La fecha de nacimiento es obligatoria.";
    if (!form.address) newErrors.address = "La dirección es obligatoria.";
>>>>>>> Stashed changes

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name || newErrors.email || newErrors.passwordConfirm) {
        setCount(1);
      }
      return;
    }

<<<<<<< Updated upstream
    try {
      await register(form.email, form.password, form.name);

      // Si el registro es exitoso, mostrar mensaje y redirigir al login
      console.log("Usuario registrado exitosamente!");
      setSuccessMessage("¡Registro exitoso! Redirigiendo al login...");

      // Esperar un momento para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Error al registrar:", err);
      // El error ya se muestra en el componente vía useAuthStore
    }
=======
    await register({
      name: form.name,
      email: form.email,
      password: form.password,
      creditCard: form.creditCard,
      location: form.location,
      numberPhone: form.numberPhone,
      birthDay: form.birthDay,
      address: form.address,
    });
>>>>>>> Stashed changes
  };

  return (
    <div className="flex items-center justify-center p-6 md:p-12 bg-gradient-to-r from-green-50 to-emerald-100 min-h-screen">
      <div className="mx-auto w-full max-w-[550px] bg-white p-8 rounded-xl shadow-lg">
<<<<<<< Updated upstream
        <img
          alt="FinanceFlow"
          src="/finance-flow-logo-gradient.svg"
          className="mx-auto h-28 w-auto hover:drop-shadow-[0_0_10px_theme(colors.emerald.400)] transition-all duration-300;"
        />

        {/* Indicador de Paso */}

=======
>>>>>>> Stashed changes
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center text-[#07074D]">
            Registro - Paso {count} de 2
          </h2>
          <div className="mt-2 flex">
            <div
              className={`w-1/2 h-2 rounded-l-full ${
                count === 1 ? "bg-emerald-600" : "bg-emerald-600"
              }`}
            ></div>
            <div
              className={`w-1/2 h-2 rounded-r-full ${
                count === 2 ? "bg-emerald-600" : "bg-gray-200"
              }`}
            ></div>
          </div>
        </div>

<<<<<<< Updated upstream
        {/* Mensajes de error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {typeof error === "string" ? error : JSON.stringify(error)}
=======
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {typeof error === "string" ? error : "Error al registrarse"}
>>>>>>> Stashed changes
          </div>
        )}

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
            {successMessage}
          </div>
        )}

        {/* PASO 1 */}
        {count === 1 && (
          <form onSubmit={siguiente}>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Juan Pérez García"
                value={form.name}
                onChange={handleChange}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                  errors.name ? "outline-red-500" : "outline-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Email *
              </label>
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                  errors.email ? "outline-red-500" : "outline-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="flex -mx-3 mb-5">
              <div className="w-1/2 px-3">
                <label className="mb-3 block text-base font-medium text-[#07074D]">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  value={form.password}
                  onChange={handleChange}
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                    errors.password ? "outline-red-500" : "outline-gray-300"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="w-1/2 px-3">
                <label className="mb-3 block text-base font-medium text-[#07074D]">
                  Confirmar *
                </label>
                <input
                  type="password"
                  name="passwordConfirm"
                  placeholder="********"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                    errors.passwordConfirm
                      ? "outline-red-500"
                      : "outline-gray-300"
                  }`}
                />
                {errors.passwordConfirm && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.passwordConfirm}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Siguiente
            </button>
<<<<<<< Updated upstream

            <Link
              to="/"
              className="mt-4 flex w-full justify-center text-sm/6 font-semibold text-gray-800 hover:text-emerald-500"
            >
              ¿Tienes cuenta? Volver al login
            </Link>
=======
            
            <p className="mt-4 text-center text-sm text-gray-500">
              ¿Ya tienes cuenta?{" "}
              <Link to="/" className="font-semibold text-emerald-600 hover:text-emerald-500">
                Inicia sesión
              </Link>
            </p>
>>>>>>> Stashed changes
          </form>
        )}

        {count === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                name="birthDay"
                value={form.birthDay}
                onChange={handleChange}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                  errors.birthDay ? "outline-red-500" : "outline-gray-300"
                }`}
              />
<<<<<<< Updated upstream

              {errors.birthDay && (
                <p className="text-red-500 text-xs mt-1">{errors.birthDay}</p>
=======
              {errors.creditCard && (
                <p className="text-red-500 text-xs mt-1">{errors.creditCard}</p>
>>>>>>> Stashed changes
              )}
            </div>

            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                País *
              </label>
<<<<<<< Updated upstream

              <select
                name="location"
                value={form.location}
                onChange={handleChange}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                  errors.location ? "outline-red-500" : "outline-gray-300"
                }`}
              >
                <option value="">Selecciona tu país</option>
                {countryOptions.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

=======
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                list="lista-paises"
                placeholder={
                  isLoadingCountries
                    ? "Cargando países..."
                    : "Escribe tu país..."
                }
                disabled={isLoadingCountries}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                  errors.location ? "outline-red-500" : "outline-gray-300"
                }`}
              />
              <datalist id="lista-paises">
                {countryOptions.map((pais) => (
                  <option key={pais} value={pais} />
                ))}
              </datalist>
>>>>>>> Stashed changes
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>

            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Número de telefono *
              </label>
              <input
                type="tel"
                name="numberPhone"
                value={form.numberPhone}
                onChange={handleChange}
                placeholder="+1 234 567 890"
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                  errors.numberPhone ? "outline-red-500" : "outline-gray-300"
                }`}
              />
              {errors.numberPhone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.numberPhone}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Moneda Preferida *
              </label>
<<<<<<< Updated upstream

              <select
                name="preferCoin"
                value={form.preferCoin}
=======
              <input
                type="date"
                name="birthDay"
                value={form.birthDay}
>>>>>>> Stashed changes
                onChange={handleChange}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                  errors.preferCoin ? "outline-red-500" : "outline-gray-300"
                }`}
<<<<<<< Updated upstream
              >
                <option value="">Selecciona una moneda</option>
                <option value="USD">🇺🇸 Dólar Estadounidense (USD)</option>
                <option value="EUR">🇪🇺 Euro (EUR)</option>
                <option value="GBP">🇬🇧 Libra Esterlina (GBP)</option>
                <option value="JPY">🇯🇵 Yen Japonés (JPY)</option>
                <option value="CNY">🇨🇳 Yuan Chino (CNY)</option>
                <option value="ARS">🇦🇷 Peso Argentino (ARS)</option>
                <option value="MXN">🇲🇽 Peso Mexicano (MXN)</option>
                <option value="CLP">🇨🇱 Peso Chileno (CLP)</option>
                <option value="COP">🇨🇴 Peso Colombiano (COP)</option>
                <option value="PEN">🇵🇪 Sol Peruano (PEN)</option>
                <option value="BRL">🇧🇷 Real Brasileño (BRL)</option>
                <option value="UYU">🇺🇾 Peso Uruguayo (UYU)</option>
                <option value="VES">🇻🇪 Bolívar Venezolano (VES)</option>
                <option value="CAD">🇨🇦 Dólar Canadiense (CAD)</option>
                <option value="AUD">🇦🇺 Dólar Australiano (AUD)</option>
                <option value="CHF">🇨🇭 Franco Suizo (CHF)</option>
                <option value="SEK">🇸🇪 Corona Sueca (SEK)</option>
                <option value="NOK">🇳🇴 Corona Noruega (NOK)</option>
                <option value="DKK">🇩🇰 Corona Danesa (DKK)</option>
                <option value="INR">🇮🇳 Rupia India (INR)</option>
              </select>

              {errors.preferCoin && (
                <p className="text-red-500 text-xs mt-1">{errors.preferCoin}</p>
=======
              />
              {errors.birthDay && (
                <p className="text-red-500 text-xs mt-1">{errors.birthDay}</p>
>>>>>>> Stashed changes
              )}
            </div>

            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Ingreso Mensual *
              </label>
              <input
                type="number"
                name="mensualIngres"
                value={form.mensualIngres}
                onChange={handleChange}
                placeholder="$1000"
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                  errors.mensualIngres ? "outline-red-500" : "outline-gray-300"
                }`}
              />
<<<<<<< Updated upstream
              {/* Checkboxes */}
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="notifications"
                    name="receiveNotifications"
                    checked={form.receiveNotifications}
                    onChange={(e) =>
                      setForm({ ...form, receiveNotifications: e.target.checked })
                    }
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label
                    htmlFor="notifications"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Quiero recibir notificaciones sobre presupuestos, alertas y
                    consejos financieros
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    name="acceptTerms"
                    checked={form.acceptTerms}
                    onChange={(e) =>
                      setForm({ ...form, acceptTerms: e.target.checked })
                    }
                    required
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Acepto los{" "}
                    <span className="text-blue-600 hover:underline">
                      términos y condiciones
                    </span>{" "}
                    y la{" "}
                    <span className="text-blue-600 hover:underline">
                      política de privacidad
                    </span>
                    <span className="text-red-500"> *</span>
                  </label>
                </div>
              </div>

              {errors.mensualIngres && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mensualIngres}
                </p>
=======
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
>>>>>>> Stashed changes
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setCount(1);
                }}
                className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                Atrás
              </button>
              <button
                type="submit"
                disabled={loading}
<<<<<<< Updated upstream
                className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
=======
                className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50"
>>>>>>> Stashed changes
              >
                {loading ? "Registrando..." : "Registrarse"}
              </button>
            </div>
            <Link
              to="/"
              className="mt-4 flex w-full justify-center text-sm/6 font-semibold text-gray-800 hover:text-emerald-500"
            >
              ¿Tienes cuenta? Volver al login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;
