import { calcularComision, buscarVendedor } from "../vendedor/Vendedor.js";
let itemID = parseInt(localStorage.getItem("ultimoItemID")) || 1;
let facturaID = parseInt(localStorage.getItem("ultimoFacturaID")) || 1;

const calcularTotal = (itemsFactura) => {
  return itemsFactura.reduce((total, item) => total + item.subTotal, 0);
};

const calcularSubTotal = (cantidad, precio) => {
  return cantidad * precio;
};

const fechaActual = () => {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${año}-${mes}-${dia}`;
};

const FACTURA = (cliente, vendedorID, tipoDeVenta, itemsFactura) => {
  const total = calcularTotal(itemsFactura);
  const Vendedor = buscarVendedor(vendedorID);
  const comisionVendedor =
    tipoDeVenta == TIPO_DE_VENTA.CONTADO
      ? calcularComision(total, Vendedor.comision)
      : 0;
  const factura = {
    id: facturaID++,
    fecha: fechaActual(),
    cliente: cliente,
    vendedor: Vendedor,
    tipoDeVenta: tipoDeVenta,
    items: itemsFactura,
    total: total,
    comisionVendedor: comisionVendedor.toFixed(2),
  };
  localStorage.setItem("ultimoFacturaID", JSON.stringify(facturaID));
  return factura;
};

const ITEM_FACTURA = (cantidad, descripcion, precio) => {
  const Item = {
    id: itemID++,
    cantidad: cantidad,
    descripcion: descripcion,
    precio: precio,
    subTotal: calcularSubTotal(cantidad, precio),
  };
  localStorage.setItem("ultimoItemID", JSON.stringify(itemID));
  return Item;
};

const TIPO_DE_VENTA = {
  CONTADO: "Contado",
  CREDITO: "Credito",
};

export { FACTURA, ITEM_FACTURA, TIPO_DE_VENTA };
