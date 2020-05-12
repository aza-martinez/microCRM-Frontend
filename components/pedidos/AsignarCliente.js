import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import PedidoContext from "../../context/pedidos/PedidoContext";

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      nombre
      apellido
      id
      empresa
      email
    }
  }
`;

const AsignarCliente = () => {
  const [cliente, setCliente] = useState({});

  // context de pedidos
  const pedidoContext = useContext(PedidoContext);
  const { agregarCliente } = pedidoContext;

  // consultar la bd
  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

  useEffect(() => {
    agregarCliente(cliente);
  }, [cliente]);

  const seleccionarCliente = ($cliente) => setCliente($cliente);

  if (loading) return null;

  const { obtenerClientesVendedor } = data;

  return (
    <React.Fragment>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        1.- Asigna un cliente al pedido
      </p>
      <Select
        className="mt-3"
        options={obtenerClientesVendedor}
        placeholder="Seleccionar"
        onChange={(opcion) => seleccionarCliente(opcion)}
        noOptionsMessage={() => "No hay resultados"}
        getOptionValue={(opciones) => opciones.id}
        getOptionLabel={(opciones) => opciones.nombre}
      />
    </React.Fragment>
  );
};

export default AsignarCliente;
