"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Register() {
  const { data: session } = useSession();

  //-Falta hacer que el session haga el post al back end, y vamos a utilizar como Passsword el EMAIL --//

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const validate = () => {
    let validateErrors = {
      name: "",
      surname: "",
      email: "",
      password: "",
    };

    if (!formData.name) {
      validateErrors.name = "El nombre es requerido";
    }

    if (!formData.surname) {
      validateErrors.surname = "El apellido es requerido";
    }

    if (
      !formData.email &&
      !formData.email.includes(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test)
    ) {
      validateErrors.email =
        "El correo electrónico es requerido o no es válido";
    }

    if (!formData.password || formData.password.length <= 8) {
      validateErrors.password =
        "La contraseña es requerida o debe tener más de 8 caracteres";
    }

    setFormError(validateErrors);
  };
  useEffect(() => {
    validate();
  }, [formData]);

  const isFormValid = !Object.values(formError).some((error) => error);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validate();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/client/form/login/api/email?email=${formData.email}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      console.log(data);

      if (data.client.length > 0) {
        alert("Cuenta ya existente");
        location.replace("/client/form/login");
      } else {
        try {
          fetch("/client/form/signIn/api", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              surname: formData.surname,
              email: formData.email,
              password: formData.password,
            }),
          });
          location.replace("/client/form/login");
        } catch (error) {
          // Maneja errores de red o del servidor
          console.error("Error al iniciar sesión:", error);
        }

        validate();

        if (isFormValid && response.ok) {
          alert("formulario valido");
        } else {
          alert("formulario invalido");
        }
      }
    } catch (error) {
      // Maneja errores de red o del servidor
      console.error("Error al iniciar sesión:", error);
    }
  };

  //------------------------- cosas para registro por google---------------------------/

  const handelSubmitGoogle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/client/form/login/api/email?email=${formData.email}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      if (data.client.length > 0) {
        signIn(undefined, { callbackUrl: "/" });
      } else {
        try {
          await fetch("/client/form/signIn/api", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: session?.user?.name,
              surname: session?.user?.name,
              email: session.user.email,
              password: session.user.email,
            }),
          });
        } catch (error) {
          // Maneja errores de red o del servidor
          console.error("Error al iniciar sesión:", error);
        }
      }
    } catch (error) {
      // Maneja errores de red o del servidor
      console.error("Error al iniciar sesión:", error);
    }
  };

  //------------------------------------- hasta aca-----------------------------------/

  return (
    <form className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Registro</h1>

      <div>
        <label htmlFor="name" className="block font-semibold">
          Nombre de usuario:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full border-2 bg-white border-blue-Nav rounded-xl p-4 bg-transparent"
        />
        <p className="text-red-font">{formError.name}</p>
      </div>

      <div>
        <label htmlFor="surname" className="block font-semibold">
          Apellido:
        </label>
        <input
          type="text"
          id="surname"
          name="surname"
          value={formData.surname}
          onChange={handleInputChange}
          className="w-full border-2 bg-white border-blue-Nav rounded-xl p-4 bg-transparent"
        />
        <p className="text-red-font">{formError.surname}</p>
      </div>

      <div>
        <label htmlFor="email" className="block font-semibold">
          Correo electrónico:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full border-2 bg-white border-blue-Nav rounded-xl p-4 bg-transparent"
        />
        <p className="text-red-font">{formError.email}</p>
      </div>

      <div>
        <label htmlFor="password" className="block font-semibold">
          Contraseña:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full border-2 bg-white border-blue-Nav rounded-xl p-4 bg-transparent"
        />
        <p className="text-red-font">{formError.password}</p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isFormValid}
        className="w-full bg-blue-Nav hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Registrarse
      </button>

      <button
        onClick={handelSubmitGoogle}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Google
      </button>
    </form>
  );
}
