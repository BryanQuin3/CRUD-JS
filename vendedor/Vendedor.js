let vendorID = parseInt(localStorage.getItem("ultimoID")) || 1;
const facturas = JSON.parse(localStorage.getItem("facturas")) || [];

const Vendedor = (
  nombre,
  ruc,
  direccion,
  telefono,
  comision = 0,
  totalVendido = 0,
  totalComisionado = 0
) => {
  // la comision llega como un string.Ejemplo 10%, por eso se convierte a float
  comision = parseFloat(comision) / 100;

  const nuevoVendedor = {
    id: vendorID++,
    nombre: nombre,
    ruc: ruc,
    direccion: direccion,
    telefono: telefono,
    comision: comision,
    totalVendido: totalVendido,
    totalComisionado: totalComisionado,
  };
  localStorage.setItem("ultimoID", JSON.stringify(vendorID));
  return nuevoVendedor;
};

const calcularComision = (total, comision) => {
  return total * comision;
};
const calcularGananciasPorVendedor = (facturas, vendedor, desde, hasta) => {
  const { totalVendido, comision } = facturas
    .filter((factura) => {
      const fechaFactura = new Date(factura.fecha);
      return fechaFactura >= desde && fechaFactura <= hasta;
    })
    .filter((factura) => factura.vendedor.id == vendedor.id)
    .reduce(
      (total, factura) => {
        let totalVendido = total.totalVendido + factura.total;
        let comision = total.comision + factura.comisionVendedor;
        return { totalVendido, comision };
      },
      { totalVendido: 0, comision: 0 }
    );
  return { totalVendido, comision };
};

const buscarVendedor = (id) => {
  const vendedores = JSON.parse(localStorage.getItem("vendedores")) || [];
  return vendedores.find((vendedor) => vendedor.id == id);
};

export {
  Vendedor,
  calcularComision,
  calcularGananciasPorVendedor,
  buscarVendedor,
};
