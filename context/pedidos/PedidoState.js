import React, { useReducer } from "react";
import PedidoContext from "./PedidoContext";
import PedidoReducer from "./PedidoReducer";

import {
  SELECCIONAR_CLIENTES,
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTOS,
  ACTUALIZAR_TOTAL,
} from "./../../types";

const PedidoState = ({ children }) => {
  const initialState = {
    cliente: {},
    productos: [],
    total: 0,
  };

  const [state, dispatch] = useReducer(PedidoReducer, initialState);

  // agregamos cliente al pedido
  const agregarCliente = (cliente) => {
    dispatch({
      type: SELECCIONAR_CLIENTES,
      payload: cliente,
    });
  };

  // agregamos productos al pedido
  const agregarProductos = (productosSeleccionados) => {
    let nuevoState = [];
    if (productosSeleccionados && state.productos.length > 0) {
      // tomar del segundo arreglo, una copia para asignarlo al primero
      nuevoState = productosSeleccionados.map((producto) => {
        const nuevoObjeto = state.productos.find(
          (productoState) => productoState.id === producto.id
        );

        return { ...producto, ...nuevoObjeto };
      });
    } else {
      nuevoState = productosSeleccionados || [];
    }

    dispatch({
      type: SELECCIONAR_PRODUCTO,
      payload: nuevoState,
    });

    if(nuevoState.length < 1) actualizarTotal();
  };

  // modifica las cantidades de los productos
  const cantidadProductos = (nuevoProducto) => {
    dispatch({
      type: CANTIDAD_PRODUCTOS,
      payload: nuevoProducto,
    });
  };

  const actualizarTotal = () => {
    dispatch({
      type: ACTUALIZAR_TOTAL,
    });
  };

  return (
    <PedidoContext.Provider
      value={{
        cliente: state.cliente,
        productos: state.productos,
        total: state.total,
        agregarCliente,
        agregarProductos,
        cantidadProductos,
        actualizarTotal,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};

export default PedidoState;
