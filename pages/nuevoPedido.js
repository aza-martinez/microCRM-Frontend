import React, { useContext, useState } from "react";
import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import PedidoContext from "./../context/pedidos/PedidoContext";
import AsignarProductos from "../components/pedidos/AsignarProductos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from "../components/pedidos/Total";
import { gql, useMutation } from "@apollo/client";
import Swal from 'sweetalert2';
import { useRouter } from "next/router";

const NUEVO_PEDIDO = gql`
  mutation nuevoPedido($input: PedidoInput) {
    nuevoPedido(input: $input) {
      id
    }
  }
`;

const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
    }
  }
`;


const NuevoPedido = () => {
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  // utlizar context y utilizar sus funciones y valores
  const pedidoContext = useContext(PedidoContext);
  const { cliente, productos, total } = pedidoContext;

  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    update(cache, { data: { nuevoPedido } }) {
      const { obtenerPedidosVendedor} = cache.readQuery({ query:  OBTENER_PEDIDOS });

      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data: {
          obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido]
        }
      })

    }
  });

  const validarPedido = () => {
    return !productos.every(({ cantidad }) => cantidad > 0) ||
      total === 0 ||
      Object.keys(cliente).length === 0
      ? " opacity-50 cursor-not-allowed"
      : "";
  };

  const crearNuevoPedido = async () => {
    const idCliente = cliente.id;

    console.log('PRODUCTOS', productos);
    // Remover lo no deseado de productos
    const pedido = productos.map(({existencia, __typename, ...producto}) => producto);
    console.log(pedido)
    try {
      const { data } = await nuevoPedido({
        variables: {
          input: {
            cliente: idCliente,
            total,
            pedido
          }
         }
      })
      Swal.fire('Correcto', 'El pedido se registró correctamente', 'success');
      router.push('/pedidos')
    } catch (error) {
     setMensaje(error.message.replace('GraphQL error: ', ''));
    }
  }

  const mostrarMensaje = () => (
    <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
      <p>{mensaje}</p>
    </div>
  )

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Crear nuevo pedido</h1>
      { mensaje && mostrarMensaje() }
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <AsignarCliente />
          <AsignarProductos />
          <ResumenPedido />
          <Total />

          <button
            type="button"
            onClick={crearNuevoPedido}
            className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
          >
            Registrar Pedido
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoPedido;
