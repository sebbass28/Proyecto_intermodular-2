import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useEffect } from "react";

function App() {
  const [count, setCount] = useState(0);
  const {
    userName,
    email,
    password,
    creditCard,
    location,
    numberPhone,
    birthDay,
    address,
  } = useAuthStore();
  useEffect(() => {
    tryAutoLogin();
  }, []);

  return (
    <div class="flex items-center justify-center p-12">
      <div class="mx-auto w-full max-w-[550px] bg-white">
        <form>
          <div class="mb-5">
            <label
              for="name"
              class="mb-3 block text-base font-medium text-[#07074D]"
            >
              Nombre Completo
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Full Name"
              class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>
          <div class="mb-5">
            <label
              for="phone"
              class="mb-3 block text-base font-medium text-[#07074D]"
            >
              Telefono
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              placeholder="Enter your phone number"
              class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>
          <div class="mb-5">
            <label
              for="email"
              class="mb-3 block text-base font-medium text-[#07074D]"
            >
              Correo
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>
          <div class="-mx-3 flex flex-wrap">
            <div class="w-full px-3 sm:w-1/2">
              <div class="mb-5">
                <label
                  for="date"
                  class="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Fecha
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div>
          </div>

          <div class="mb-5 pt-3">
            <label class="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
              Dirección
            </label>
            <div class="-mx-3 flex flex-wrap">
              <div class="w-full px-3 sm:w-1/2">
                <div class="mb-5">
                  <input
                    type="text"
                    name="area"
                    id="area"
                    placeholder="Enter area"
                    class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
              <div class="w-full px-3 sm:w-1/2">
                <div class="mb-5">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    placeholder="Enter city"
                    class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
              <div class="w-full px-3 sm:w-1/2">
                <div class="mb-5">
                  <input
                    type="text"
                    name="state"
                    id="state"
                    placeholder="Enter state"
                    class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
              <div class="w-full px-3 sm:w-1/2">
                <div class="mb-5">
                  <input
                    type="text"
                    name="post-code"
                    id="post-code"
                    placeholder="Post Code"
                    class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <button class="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
