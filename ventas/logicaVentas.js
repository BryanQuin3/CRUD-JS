import { FACTURA, ITEM_FACTURA, TIPO_DE_VENTA } from "./Ventas.js";
let ventas = JSON.parse(localStorage.getItem("facturas")) || [];
let productos = JSON.parse(localStorage.getItem("facturaItems")) || [];
const vendedores = JSON.parse(localStorage.getItem("vendedores")) || [];

const mostrarVendedores = () => {
  const select = document.getElementById("vendedor");
  let container = "";
  vendedores.forEach((vendedor) => {
    container += `<option id="${vendedor.id}" class="vendedor">${vendedor.nombre}</option>`;
  });
  select.innerHTML += container;
};

mostrarVendedores();

const leerValoresCampos = () => {
  const valores = [];
  document.querySelectorAll(".campo").forEach((campo) => {
    // si el campo es select entonces obtiene el valor del option seleccionado
    if (campo.tagName === "SELECT") {
      const index = campo.selectedIndex;
      if (campo.options[index].id) valores.push(campo.options[index].id);
      else {
        valores.push(campo.options[index].text);
      }
    } else {
      valores.push(campo.value);
    }
  });
  valores.push(productos);
  return valores || null;
};
const agregarFactura = () => {
  const valores = leerValoresCampos();
  if (valores.length === 0) return;
  const venta = FACTURA(...valores);
  console.log(venta);
  ventas.push(venta);
  localStorage.setItem("facturas", JSON.stringify(ventas));
  const alert = document.getElementById("alert");
  alert.classList.remove("d-none");
  setTimeout(() => {
    alert.classList.add("d-none");
  }, 2000);
};

const leerValoresInputsProducto = () => {
  const descripcion = document.getElementById("nombreProducto").value;
  const precio = document.getElementById("precio").value;
  const cantidad = document.getElementById("cantidad").value;
  if (descripcion === "" || precio === "" || cantidad === "") return null;
  return [cantidad, descripcion, precio];
};

const agregarProducto = () => {
  const valores = leerValoresInputsProducto();
  if (valores == null) return null;
  const producto = ITEM_FACTURA(...valores);
  productos.push(producto);
  localStorage.setItem("facturaItems", JSON.stringify(productos));
  return producto;
};

const agregarProductosTabla = (element) => {
  const tabla = document.querySelector(`.${element}`);
  let container = "";

  productos.forEach((producto, index) => {
    container += `
              <tr>
              <td>${producto.cantidad}</td>
              <td>${producto.descripcion}</td>
              <td>${producto.precio}$</td>
              <td class="${index}subTotal">${producto.subTotal}$</td>
              <td class="${index}eliminar"><button type="button" id="${producto.id}-eliminar" class="btn btn-danger eliminar-btn">Eliminar</button></td>
              </tr>
          `;
  });

  tabla.innerHTML = container;
};

const agregarFacturasTabla = (element, editar = false, borrar = false) => {
  const tabla = document.querySelector(`.${element}`);
  let container = "";
  ventas.forEach((venta, index) => {
    container += `
              <tr>
              <td>${index + 1}</td>
              <td>${venta.fecha}</td>
              <td>${venta.cliente}</td>
              <td>${venta.vendedor.nombre}</td>
              <td>${venta.tipoDeVenta}</td>
              <td>${venta.total}$</td>
              <td>${venta.comisionVendedor}$</td>
              ${
                editar && borrar
                  ? `<td><button type="button" id="${venta.id}-editar" class="btn btn-info editar-btn">Editar</button>
                <button type="button" id="${venta.id}-guardar" class="guardar-btn btn btn-primary d-none">
                  Guardar
                </button>
                </td>
                <td><button type="button" id="${venta.id}-eliminar" class="btn btn-danger eliminar-btn">Eliminar</button></td>`
                  : ``
              }
              </tr>
          `;
  });

  tabla.innerHTML = container;
};

const calcularTotal = (itemsFactura) => {
  return itemsFactura.reduce((total, item) => total + item.subTotal, 0);
};

const mostrarTotal = () => {
  const totalCampo = document.getElementById("total");
  const total = calcularTotal(productos);
  totalCampo.value = total + "$";
};

const mostrarTabla = () => {
  agregarProductosTabla("tablaProductos");
  mostrarTotal();
};

const agregarItemBtn = document.getElementById("cargarProducto");

if (productos.length > 0) mostrarTabla();

agregarItemBtn.addEventListener("click", () => {
  if (agregarProducto() == null) return alert("Ingrese todos los campos");
  agregarProductosTabla("tablaProductos");
  const totalCampo = document.getElementById("total");
  const total = calcularTotal(productos);
  totalCampo.value = total + "$";
  const campos = document.querySelectorAll(".item");
  campos.forEach((campo) => {
    campo.value = "";
  });
});

document.querySelector(".tablaProductos").addEventListener("click", (e) => {
  if (e.target.classList.contains("eliminar-btn")) {
    const id = e.target.id.split("-")[0];
    console.log(e.target.id);
    productos = productos.filter((producto) => producto.id != id);
    localStorage.setItem("facturaItems", JSON.stringify(productos));
    agregarProductosTabla("tablaProductos");
  }
});

const cargarFacturaBtn = document.getElementById("cargarFactura");

cargarFacturaBtn.addEventListener("click", () => {
  console.log("click");
  agregarFactura();
  localStorage.removeItem("facturaItems");
  productos = [];
  agregarProductosTabla("tablaProductos");
  document.querySelectorAll(".form-control").forEach((campo) => {
    campo.value = "";
  });
});

const btnCrear = document.getElementById("btnradio1");
const btnVer = document.getElementById("btnradio2");
const btnGanancias = document.getElementById("btnradio3");

const seccionCrear = document.querySelector(".seccion-crear-factura");
const seccionEditar = document.querySelector(".section-verfacturas");

function mostrarSeccion(seccion) {
  seccionCrear.classList.add("d-none");
  seccionEditar.classList.add("d-none");
  seccion.classList.remove("d-none");
}

btnCrear.addEventListener("click", () => {
  mostrarSeccion(seccionCrear);
});

btnVer.addEventListener("click", () => {
  mostrarSeccion(seccionEditar);
  agregarFacturasTabla("tablaFacturas", true, true);
});

mostrarSeccion(seccionCrear);

const encontrarFactura = (event) => {
  const id = event.target.id.split("-")[0];
  const row = event.target.closest("tr");
  const venta = ventas.find((v) => v.id == id);
  return { venta, row };
};

const reemplazarCampos = (
  fechaCell,
  clienteCell,
  vendedorCell,
  tipoDeVentaCell,
  totalCell,
  comisionCell,
  venta
) => {
  fechaCell.innerHTML = `<input class="form-control" type="text" id="fecha-edicion" value="${venta.fecha}" />`;
  clienteCell.innerHTML = `<input class="form-control" type="text" id="cliente-edicion" value="${venta.cliente}" />`;
  vendedorCell.innerHTML = `<input class="form-control" type="text" id="vendedor-edicion" value="${venta.vendedor.nombre}" />`;
  tipoDeVentaCell.innerHTML = `<input class="form-control" type="text" id="tipo-edicion" value="${venta.tipoDeVenta}" />`;
  totalCell.innerHTML = `<input class="form-control" type="text" id="total-edicion" value="${venta.total}" />`;
  comisionCell.innerHTML = `<input class="form-control" type="text" id="comision-edicion" value="${venta.comisionVendedor}" />`;
};
const actualizarCampos = (venta, row) => {
  venta.fecha = row.querySelector("#fecha-edicion").value;
  venta.cliente = row.querySelector("#cliente-edicion").value;
  venta.vendedor.nombre = row.querySelector("#vendedor-edicion").value;
  venta.tipoDeVenta = row.querySelector("#tipo-edicion").value;
  venta.total = parseInt(row.querySelector("#total-edicion").value);
  venta.comisionVendedor = parseFloat(
    row.querySelector("#comision-edicion").value + "$"
  );
};

const restaurarCampos = (row, venta) => {
  row.querySelector("td:nth-child(2)").textContent = venta.fecha;
  row.querySelector("td:nth-child(3)").textContent = venta.cliente;
  row.querySelector("td:nth-child(4)").textContent = venta.vendedor.nombre;
  row.querySelector("td:nth-child(5)").textContent = venta.tipoDeVenta;
  row.querySelector("td:nth-child(6)").textContent = venta.total + "$";
  row.querySelector("td:nth-child(7)").textContent =
    venta.comisionVendedor + "$";
};

export const obtenerCeldas = (row) => {
  const fechaCel = row.querySelector("td:nth-child(2)");
  const clienteCel = row.querySelector("td:nth-child(3)");
  const vendedorCel = row.querySelector("td:nth-child(4)");
  const tipoCel = row.querySelector("td:nth-child(5)");
  const totalCel = row.querySelector("td:nth-child(6)");
  const comisionCel = row.querySelector("td:nth-child(7)");
  return { fechaCel, clienteCel, vendedorCel, tipoCel, totalCel, comisionCel };
};

const ocultarBtn = (row, btn1, btn2) => {
  const editarButton = row.querySelector(`.${btn1}`);
  const guardarButton = row.querySelector(`.${btn2}`);
  editarButton.classList.add("d-none");
  guardarButton.classList.remove("d-none");
};

const eliminarFactura = (id) => {
  const ventasFiltradas = ventas.filter((venta) => venta.id != id);
  if (ventas.length === 0) {
    localStorage.removeItem("facturas");
    ventas = [];
  } else {
    ventas = ventasFiltradas;
    localStorage.setItem("facturas", JSON.stringify(ventas));
  }
};

if (ventas.length > 0) agregarFacturasTabla("tablaFacturas", true, true);

document.querySelector(".tablaFacturas").addEventListener("click", (event) => {
  if (event.target.classList.contains("editar-btn")) {
    const { venta, row } = encontrarFactura(event);
    const {
      fechaCel,
      clienteCel,
      vendedorCel,
      tipoCel,
      totalCel,
      comisionCel,
    } = obtenerCeldas(row);
    reemplazarCampos(
      fechaCel,
      clienteCel,
      vendedorCel,
      tipoCel,
      totalCel,
      comisionCel,
      venta
    );
    ocultarBtn(row, "editar-btn", "guardar-btn");
  } else if (event.target.classList.contains("guardar-btn")) {
    const { venta, row } = encontrarFactura(event);
    actualizarCampos(venta, row);
    restaurarCampos(row, venta);
    // Ocultar el botón "Guardar" y mostrar el botón "Editar"
    ocultarBtn(row, "guardar-btn", "editar-btn");
    // Actualizar el array de ventas
    localStorage.setItem("facturas", JSON.stringify(ventas));
  } else if (event.target.classList.contains("eliminar-btn")) {
    const id = event.target.id.split("-")[0];
    eliminarFactura(id);
    agregarFacturasTabla("tablaFacturas", true, true);
  }
});
