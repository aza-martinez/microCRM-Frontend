import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const OBTENER_PRODUCTO = gql`
  query obtenerProducto($id: ID!) {
    obtenerProducto(id: $id) {
      nombre
      precio
      existencia
    }
  }
`;

const ACTUALIZAR_PRODUCTO = gql`
  mutation actualizarProducto($id: ID!, $input: ProductoInput) {
    actualizarProducto(id: $id, input: $input) {
      id
    }
  }
`;

const EditarProducto = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
    variables: { id },
  });

  const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);

  // SCHEMA DE VALIDACION
  const schemaValidacion = Yup.object({
    nombre: Yup.string().required("El nombre del producto es obligatorio"),
    existencia: Yup.number()
      .required("Agrega la cantidad disponible")
      .positive("No se aceptan numeros negativos")
      .integer("La existencia deben ser números enteros"),
    precio: Yup.number()
      .required("El precio es obligatorio")
      .positive("No se aceptan numeros negativos"),
  });

  if (loading) return "Cargando...";

  if (!data) return "Acción no permitida";

  const { obtenerProducto } = data;

  const handleSubmit = async (valores, funciones) => {
    try {
      const { nombre, existencia, precio } = valores;
      const { data } = await actualizarProducto({
        variables: {
          id,
          input: { nombre, existencia, precio },
        },
      });

      router.push("/productos");

      Swal.fire(
        "Correcto",
        "El producto se actualizó correctamente",
        "success"
      );
    } catch (error) {
      Swal.fire("Correcto", "No se pudo actualizar el producto", "warning");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            enableReinitialize
            initialValues={obtenerProducto}
            validationSchema={schemaValidacion}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <form
                className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                onSubmit={props.handleSubmit}
              >
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="nombre"
                  >
                    Nombre
                  </label>
                  <input
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.nombre}
                    type="text"
                    id="nombre"
                    placeholder="Nombre Producto"
                    className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                {/* {formik.touched.nombre && formik.errors.nombre ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.nombre}</p>
              </div>
            ) : null} */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="existencia"
                  >
                    Cantidad Disponible
                  </label>
                  <input
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.existencia}
                    type="number"
                    id="existencia"
                    placeholder="Cantidad disponible del Producto"
                    className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                {/* {formik.touched.existencia && formik.errors.existencia ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.existencia}</p>
              </div>
            ) : null} */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="precio"
                  >
                    Precio
                  </label>
                  <input
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.precio}
                    type="number"
                    id="precio"
                    placeholder="Precio Producto"
                    className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                {/* {formik.touched.precio && formik.errors.precio ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.precio}</p>
              </div>
            ) : null} */}

                <input
                  type="submit"
                  className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                  value="ACTUALIZAR PRODUCTO"
                />
              </form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default EditarProducto;
