import React, { useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import { useMutation, gql } from "@apollo/client";
import * as Yup from "yup";
import { useRouter } from "next/router";

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarUsuarioInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;
const Login = () => {
  // MUTATION PARA CREAR NUEVOS USUARIOS
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);
  const [mensaje, setMensaje] = useState(null);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email no valido")
        .required("El email es obligatorio"),
      password: Yup.string().required("El password es obligatorio"),
    }),
    onSubmit: async ({ email, password }) => {
      try {
        const { data } = await autenticarUsuario({
          variables: { input: { email, password } },
        });
        setMensaje("autenticando...");

        //guardar tokem en LocalStorage
        setTimeout(() => {
          const { token } = data.autenticarUsuario;
          localStorage.setItem("token", token);
        }, 1000);

        // redrigir a la pagina principal
        setTimeout(() => {
          setMensaje(null);
          router.push("/");
        }, 2000);
      } catch (error) {
        setMensaje(error.message.replace("GraphQL error: ", ""));
      }
    },
  });

  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    );
  };

  return (
    <Layout>
      {mensaje && mostrarMensaje()}
      <h1 className="text-center text-2xl text-white font-light">Login</h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                type="email"
                id="email"
                type="email"
                placeholder="Email Usuario"
                className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.email}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                type="password"
                id="password"
                type="password"
                placeholder="Password Usuario"
                className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.password}</p>
              </div>
            ) : null}

            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
              value="Iniciar Sesión"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
