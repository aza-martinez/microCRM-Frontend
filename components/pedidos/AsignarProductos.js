import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import PedidoContext from './../../context/pedidos/PedidoContext';

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      precio
      existencia
    }
  }
`;

const AsignarProductos = () => {
  const [productos, setProductos] = useState([]);

  /// context de Pedidos
  const pedidoContext =  useContext(PedidoContext);
  const { agregarProductos } = pedidoContext;

  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  useEffect(() => {
    agregarProductos(productos)
  }, [productos]);

  const seleccionarProducto = ($productos) => {
      setProductos($productos)
  }

  if(loading) return null;

  const { obtenerProductos } = data;
  return (
    <React.Fragment>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        2.- Selecciona o busca los productos
      </p>
      <Select
        className="mt-3"
        options={obtenerProductos}
        isMulti
        placeholder="Seleccionar"
        onChange={(opcion) => seleccionarProducto(opcion)}
        noOptionsMessage={() => "No hay resultados"}
        getOptionValue={(opciones) => opciones.id}
        getOptionLabel={(opciones) =>`${opciones.nombre} - ${opciones.existencia} Disponibles`}
      />
    </React.Fragment>
  );
};

export default AsignarProductos;
