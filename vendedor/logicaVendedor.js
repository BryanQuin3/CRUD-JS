import { Vendedor } from "./Vendedor.js";
let ventas = JSON.parse(localStorage.getItem("facturas")) || [];
let vendedores = JSON.parse(localStorage.getItem("vendedores")) || [];

const agregarVendedor = () => {
  const valores = leerValoresInputs();

  if (valores.length === 0) return;

  const vendedor = Vendedor(...valores);
  vendedores.push(vendedor);
  localStorage.setItem("vendedores", JSON.stringify(vendedores));
};

const vendedorBtn = document.getElementById("crear-vendedor");

vendedorBtn.addEventListener("click", () => {
  agregarVendedor();

  const alert = document.getElementById("alert");
  alert.classList.remove("d-none");
  setTimeout(() => {
    alert.classList.add("d-none");
  }, 2000);

  const campos = document.querySelectorAll("input");
  campos.forEach((campo) => {
    campo.value = "";
  });
});

const mostrarVendedores = (
  element,
  editar = true,
  borrar = true,
  totalVendido = false,
  comision = false
) => {
  const tabla = document.querySelector(`.${element}`);
  let container = "";

  vendedores.forEach((vendedor, index) => {
    const comisionVendedor = vendedor.comision * 100;
    container += `
        <tr>
          <th scope="row">${index + 1}</th>
          <td>${vendedor.nombre}</td>
          <td>${vendedor.ruc}</td>
          <td>${vendedor.direccion}</td>
          <td>${vendedor.telefono}</td>
          <td>${comisionVendedor}%</td>
          ${
            editar && borrar
              ? `<td><button type="button" id="${vendedor.id}-editar" class="btn btn-info editar-btn">Editar</button>
            <button type="button" id="${vendedor.id}-guardar" class="guardar-btn btn btn-primary d-none">
              Guardar
            </button>
            </td>
            <td><button data-bs-toggle="modal" href="#myModal" type="button" id="${vendedor.id}-eliminar" class="btn btn-danger eliminar-btn">Eliminar</button></td>`
              : `<td>${vendedor.totalVendido || 0}$</td><td>${
                  vendedor.totalComisionado || 0
                }$</td>`
          }
          
        </tr>
      `;
  });

  tabla.innerHTML = container;
};

const encontrarVendedor = (event) => {
  const id = event.target.id.split("-")[0];
  const row = event.target.closest("tr");
  const vendedor = vendedores.find((v) => v.id == id);
  return { vendedor, row };
};

const reemplazarCampos = (
  nombreCell,
  rucCell,
  direccionCell,
  telefonoCell,
  comisionCell,
  vendedor
) => {
  nombreCell.innerHTML = `<input class="form-control" type="text" id="nombre-edicion" value="${vendedor.nombre}" />`;
  rucCell.innerHTML = `<input class="form-control" type="text" id="ruc-edicion" value="${vendedor.ruc}" />`;
  direccionCell.innerHTML = `<input class="form-control" type="text" id="direccion-edicion" value="${vendedor.direccion}" />`;
  telefonoCell.innerHTML = `<input class="form-control" type="text" id="telefono-edicion" value="${vendedor.telefono}" />`;
  comisionCell.innerHTML = `<input class="form-control" type="text" id="comision-edicion" value="${
    vendedor.comision * 100
  }" />`;
};
const actualizarCampos = (vendedor, row) => {
  vendedor.nombre = row.querySelector("#nombre-edicion").value;
  vendedor.ruc = row.querySelector("#ruc-edicion").value;
  vendedor.direccion = row.querySelector("#direccion-edicion").value;
  vendedor.telefono = row.querySelector("#telefono-edicion").value;
  vendedor.comision =
    parseInt(row.querySelector("#comision-edicion").value) / 100;
};

const restaurarCampos = (row, vendedor) => {
  row.querySelector("td:nth-child(2)").textContent = vendedor.nombre;
  row.querySelector("td:nth-child(3)").textContent = vendedor.ruc;
  row.querySelector("td:nth-child(4)").textContent = vendedor.direccion;
  row.querySelector("td:nth-child(5)").textContent = vendedor.telefono;
  row.querySelector("td:nth-child(6)").textContent = (vendedor.comision * 100)
    .toFixed(0)
    .concat("%");
};

if (vendedores.length > 0) mostrarVendedores("sellers-table");

document.querySelector(".sellers-table").addEventListener("click", (event) => {
  if (event.target.classList.contains("editar-btn")) {
    const { vendedor, row } = encontrarVendedor(event);
    const { nombreCel, rucCel, direccionCel, telefonoCel, comisionCel } =
      obtenerCeldas(row);
    reemplazarCampos(
      nombreCel,
      rucCel,
      direccionCel,
      telefonoCel,
      comisionCel,
      vendedor
    );
    ocultarBtn(row, "editar-btn", "guardar-btn");
  } else if (event.target.classList.contains("guardar-btn")) {
    const { vendedor, row } = encontrarVendedor(event);
    actualizarCampos(vendedor, row);
    restaurarCampos(row, vendedor);
    // Ocultar el botón "Guardar" y mostrar el botón "Editar"
    ocultarBtn(row, "guardar-btn", "editar-btn");
    // Actualizar el array de vendedores
    localStorage.setItem("vendedores", JSON.stringify(vendedores));
  } else if (event.target.classList.contains("eliminar-btn")) {
    const id = event.target.id.split("-")[0];
    const confirmBtn = document.querySelector("#confirmar-eliminar");
    confirmBtn.addEventListener("click", () => {
      eliminarVendedor(id);
      mostrarVendedores("sellers-table");
    });
  }
});

const eliminarVendedor = (id) => {
  const vendedoresFiltrados = vendedores.filter(
    (vendedor) => vendedor.id != id
  );

  if (vendedoresFiltrados.length === 0) {
    localStorage.clear();
    vendedores = vendedoresFiltrados;
  } else {
    localStorage.setItem("vendedores", JSON.stringify(vendedoresFiltrados));
    vendedores = vendedoresFiltrados;
  }
};

export const obtenerCeldas = (row) => {
  const nombreCel = row.querySelector("td:nth-child(2)");
  const rucCel = row.querySelector("td:nth-child(3)");
  const direccionCel = row.querySelector("td:nth-child(4)");
  const telefonoCel = row.querySelector("td:nth-child(5)");
  const comisionCel = row.querySelector("td:nth-child(6)");
  return { nombreCel, rucCel, direccionCel, telefonoCel, comisionCel };
};

export const ocultarBtn = (row, btn1, btn2) => {
  const editarButton = row.querySelector(`.${btn1}`);
  const guardarButton = row.querySelector(`.${btn2}`);
  editarButton.classList.add("d-none");
  guardarButton.classList.remove("d-none");
};

export const leerValoresInputs = () => {
  const campos = document.querySelectorAll(".form-control");
  const valores = Array.from(campos).map((campo) => campo.value);

  if (valores.some((valor) => valor === "")) {
    alert("Todos los campos son obligatorios");
    return [];
  }

  return valores;
};

const btnCrear = document.getElementById("btnradio1");
const btnEditar = document.getElementById("btnradio2");
const btnGanancias = document.getElementById("btnradio3");

const seccionCrear = document.querySelector(".create-section");
const seccionEditar = document.querySelector(".edit-section");
const seccionGanancias = document.querySelector(".seccionGanancias");

function mostrarSeccion(seccion) {
  seccionCrear.classList.add("d-none");
  seccionEditar.classList.add("d-none");
  seccionGanancias.classList.add("d-none");
  seccion.classList.remove("d-none");
}

btnCrear.addEventListener("click", () => {
  mostrarSeccion(seccionCrear);
});

btnEditar.addEventListener("click", () => {
  mostrarSeccion(seccionEditar);
  mostrarVendedores("sellers-table");
});

btnGanancias.addEventListener("click", () => {
  mostrarSeccion(seccionGanancias);
  mostrarVendedores("sellers-table-profits", false, false);
});

mostrarSeccion(seccionCrear);

function obtenerFechaSeleccionada(selectId) {
  const select = document.getElementById(selectId);
  const mesSeleccionado = select.value;
  if (mesSeleccionado) {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(mesSeleccionado).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  }
  return null;
}

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
        let comision =
          Number(total.comision) + Number(factura.comisionVendedor);
        return { totalVendido, comision };
      },
      { totalVendido: 0, comision: 0 }
    );
  return { totalVendido, comision };
};

const btnFiltrar = document.getElementById("btnFiltrar");
btnFiltrar.addEventListener("click", function () {
  const fechaDesde = obtenerFechaSeleccionada("filtroDesde");
  const fechaHasta = obtenerFechaSeleccionada("filtroHasta");
  const desde = new Date(fechaDesde);
  const hasta = new Date(fechaHasta);
  vendedores.forEach((vendedor) => {
    const { totalVendido, comision } = calcularGananciasPorVendedor(
      ventas,
      vendedor,
      desde,
      hasta
    );
    vendedor.totalVendido = totalVendido;
    vendedor.totalComisionado = comision;
  });
  mostrarVendedores("sellers-table-profits", false, false, true, true);
});
