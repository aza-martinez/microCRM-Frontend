import {
  SELECCIONAR_CLIENTES,
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTOS,
  ACTUALIZAR_TOTAL,
} from "./../../types";

export default (state, action) => {
  switch (action.type) {
    case SELECCIONAR_CLIENTES:
      return { ...state, cliente: action.payload };
    case SELECCIONAR_PRODUCTO:
      return { ...state, productos: action.payload };
    case CANTIDAD_PRODUCTOS:
      return {
        ...state,
        productos: state.productos.map((producto) =>
          producto.id === action.payload.id
            ? (producto = action.payload)
            : producto
        ),
      };
    case ACTUALIZAR_TOTAL:
      return {
        ...state,
        total: state.productos ? state.productos.reduce(
          (nuevoTotal, { precio, cantidad }) =>
            (nuevoTotal += precio * cantidad),
          0
        ) : 0,
      };
    default:
      return state;
  }
};
