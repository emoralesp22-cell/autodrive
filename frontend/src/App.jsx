import { useEffect, useMemo, useState } from "react";

import logo from "./assets/autodrive-logo.jpeg";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Vehiculos from "./components/Vehiculos";
import Clientes from "./components/Clientes";
import Alquileres from "./components/Alquileres";
import Pagos from "./components/Pagos";
import Usuarios from "./components/Usuarios";
import Perfiles from "./components/Perfiles";

import ModalVehiculo from "./components/ModalVehiculo";
import ModalCliente from "./components/ModalCliente";
import ModalAlquiler from "./components/ModalAlquiler";
import ModalPago from "./components/ModalPago";
import ModalUsuario from "./components/ModalUsuario";
import ModalPerfil from "./components/ModalPerfil";
import ModalConfirmacion from "./components/ModalConfirmacion";

const API = "https://autodrive-production-0e44.up.railway.app/api";

function App() {
  // =========================================================
  // NAVEGACIÓN
  // =========================================================

  const [seccion, setSeccion] = useState("inicio");

  // =========================================================
  // DATOS
  // =========================================================

  const [datos, setDatos] = useState({
    vehiculos: [],
    clientes: [],
    alquileres: [],
    pagos: [],
    usuarios: [],
    perfiles: [],
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // MODALES
  // =========================================================

  const [modalVehiculo, setModalVehiculo] = useState(false);
  const [modalCliente, setModalCliente] = useState(false);
  const [modalAlquiler, setModalAlquiler] = useState(false);
  const [modalPago, setModalPago] = useState(false);
  const [modalUsuario, setModalUsuario] = useState(false);
  const [modalPerfil, setModalPerfil] = useState(false);

  // =========================================================
  // MODAL DE CONFIRMACIÓN
  // =========================================================

  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [confirmacionTitulo, setConfirmacionTitulo] = useState("");
  const [confirmacionMensaje, setConfirmacionMensaje] = useState("");
  const [confirmacionAccion, setConfirmacionAccion] = useState(null);

  // =========================================================
  // ELEMENTOS EN EDICIÓN
  // =========================================================

  const [vehiculoEditando, setVehiculoEditando] = useState(null);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [alquilerEditando, setAlquilerEditando] = useState(null);
  const [pagoEditando, setPagoEditando] = useState(null);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [perfilEditando, setPerfilEditando] = useState(null);

  // =========================================================
  // FORMULARIOS
  // =========================================================

  const [formVehiculo, setFormVehiculo] = useState({
    placa: "",
    marca: "",
    modelo: "",
    color: "",
    tipo: "",
    precioDia: "",
  });

  const [formCliente, setFormCliente] = useState({
    nombre: "",
    dpi: "",
    telefono: "",
  });

  const [formAlquiler, setFormAlquiler] = useState({
    idCliente: "",
    idVehiculo: "",
    idUsuario: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [formPago, setFormPago] = useState({
    idAlquiler: "",
    fechaPago: "",
    monto: "",
    formaPago: "",
  });

  const [formUsuario, setFormUsuario] = useState({
    idPerfil: "",
    nombre: "",
    usuario: "",
    contrasena: "",
    correo: "",
  });

  const [formPerfil, setFormPerfil] = useState({
    nombre: "",
  });

  // =========================================================
  // FILTROS DE VEHÍCULOS
  // =========================================================

  const [busquedaVehiculos, setBusquedaVehiculos] = useState("");
  const [filtroVehiculos, setFiltroVehiculos] = useState("todos");

  // =========================================================
  // CARGAR DATOS
  // =========================================================

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    setError("");

    try {
      const endpoints = [
        "vehiculos",
        "clientes",
        "alquileres",
        "pagos",
        "usuarios",
        "perfiles",
      ];

      const respuestas = await Promise.all(
        endpoints.map((endpoint) =>
          fetch(`${API}/${endpoint}`)
        )
      );

      for (const respuesta of respuestas) {
        if (!respuesta.ok) {
          throw new Error(
            "No se pudieron cargar los datos del servidor."
          );
        }
      }

      const resultados = await Promise.all(
        respuestas.map((respuesta) => respuesta.json())
      );

      setDatos({
        vehiculos: resultados[0],
        clientes: resultados[1],
        alquileres: resultados[2],
        pagos: resultados[3],
        usuarios: resultados[4],
        perfiles: resultados[5],
      });
    } catch (err) {
      console.error(err);

      setError(
        "No se pudo conectar con el backend. Verifica que Spring Boot esté ejecutándose."
      );
    } finally {
      setCargando(false);
    }
  };

  // =========================================================
  // PETICIONES
  // =========================================================

  const realizarPeticion = async (url, opciones = {}) => {
    const respuesta = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(opciones.headers || {}),
      },
      ...opciones,
    });

    if (!respuesta.ok) {
      let mensajeError = "Ocurrió un error en la operación.";

      try {
        const texto = await respuesta.text();

        if (texto) {
          mensajeError = texto;
        }
      } catch {
        // Mensaje predeterminado
      }

      throw new Error(mensajeError);
    }

    if (respuesta.status === 204) {
      return null;
    }

    const texto = await respuesta.text();

    return texto ? JSON.parse(texto) : null;
  };

  // =========================================================
  // MENSAJES
  // =========================================================

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setError("");

    setTimeout(() => {
      setMensaje("");
    }, 3000);
  };

  const mostrarError = (texto) => {
    setError(texto);
    setMensaje("");

    setTimeout(() => {
      setError("");
    }, 5000);
  };

  // =========================================================
  // VEHÍCULOS
  // =========================================================

  const abrirNuevoVehiculo = () => {
    setVehiculoEditando(null);

    setFormVehiculo({
      placa: "",
      marca: "",
      modelo: "",
      color: "",
      tipo: "",
      precioDia: "",
    });

    setModalVehiculo(true);
  };

  const abrirEditarVehiculo = (vehiculo) => {
    setVehiculoEditando(vehiculo);

    setFormVehiculo({
      placa: vehiculo.placa || "",
      marca: vehiculo.marca || "",
      modelo: vehiculo.modelo || "",
      color: vehiculo.color || "",
      tipo: vehiculo.tipo || "",
      precioDia: vehiculo.precioDia ?? "",
    });

    setModalVehiculo(true);
  };

  const guardarVehiculo = async (e) => {
    e.preventDefault();

    try {
      const datosEnviar = {
        placa: formVehiculo.placa.trim(),
        marca: formVehiculo.marca.trim(),
        modelo: formVehiculo.modelo.trim(),
        color: formVehiculo.color.trim(),
        tipo: formVehiculo.tipo.trim(),
        precioDia: Number(formVehiculo.precioDia),
      };

      if (
        !datosEnviar.placa ||
        !datosEnviar.marca ||
        !datosEnviar.modelo ||
        !datosEnviar.color ||
        !datosEnviar.tipo
      ) {
        throw new Error(
          "Completa todos los campos del vehículo."
        );
      }

      if (datosEnviar.precioDia <= 0) {
        throw new Error(
          "El precio por día debe ser mayor que cero."
        );
      }

      if (vehiculoEditando) {
        await realizarPeticion(
          `${API}/vehiculos/${vehiculoEditando.idVehiculo}`,
          {
            method: "PUT",
            body: JSON.stringify(datosEnviar),
          }
        );

        mostrarMensaje(
          "Vehículo actualizado correctamente."
        );
      } else {
        await realizarPeticion(`${API}/vehiculos`, {
          method: "POST",
          body: JSON.stringify(datosEnviar),
        });

        mostrarMensaje(
          "Vehículo agregado correctamente."
        );
      }

      setModalVehiculo(false);
      await cargarDatos();
    } catch (err) {
      mostrarError(err.message);
    }
  };

  const solicitarEliminarVehiculo = (id) => {
    setConfirmacionTitulo("¿Anular vehículo?");
    setConfirmacionMensaje(
      "El vehículo será marcado como inactivo. ¿Deseas continuar?"
    );

    setConfirmacionAccion(() => async () => {
      try {
        await realizarPeticion(
          `${API}/vehiculos/${id}`,
          {
            method: "DELETE",
          }
        );

        mostrarMensaje(
          "Vehículo anulado correctamente."
        );

        await cargarDatos();
      } catch (err) {
        mostrarError(err.message);
      }
    });

    setModalConfirmacion(true);
  };

  // =========================================================
  // CLIENTES
  // =========================================================

  const abrirNuevoCliente = () => {
    setClienteEditando(null);

    setFormCliente({
      nombre: "",
      dpi: "",
      telefono: "",
    });

    setModalCliente(true);
  };

  const abrirEditarCliente = (cliente) => {
    setClienteEditando(cliente);

    setFormCliente({
      nombre: cliente.nombre || "",
      dpi: cliente.dpi || "",
      telefono: cliente.telefono || "",
    });

    setModalCliente(true);
  };

  const guardarCliente = async (e) => {
    e.preventDefault();

    try {
      const datosEnviar = {
        nombre: formCliente.nombre.trim(),
        dpi: formCliente.dpi.trim(),
        telefono: formCliente.telefono.trim(),
      };

      if (
        !datosEnviar.nombre ||
        !datosEnviar.dpi ||
        !datosEnviar.telefono
      ) {
        throw new Error(
          "Completa todos los campos del cliente."
        );
      }

      if (clienteEditando) {
        await realizarPeticion(
          `${API}/clientes/${clienteEditando.idCliente}`,
          {
            method: "PUT",
            body: JSON.stringify(datosEnviar),
          }
        );

        mostrarMensaje(
          "Cliente actualizado correctamente."
        );
      } else {
        await realizarPeticion(`${API}/clientes`, {
          method: "POST",
          body: JSON.stringify(datosEnviar),
        });

        mostrarMensaje(
          "Cliente agregado correctamente."
        );
      }

      setModalCliente(false);
      await cargarDatos();
    } catch (err) {
      mostrarError(err.message);
    }
  };

  const solicitarEliminarCliente = (id) => {
    setConfirmacionTitulo("¿Anular cliente?");
    setConfirmacionMensaje(
      "El cliente será marcado como inactivo. ¿Deseas continuar?"
    );

    setConfirmacionAccion(() => async () => {
      try {
        await realizarPeticion(
          `${API}/clientes/${id}`,
          {
            method: "DELETE",
          }
        );

        mostrarMensaje(
          "Cliente anulado correctamente."
        );

        await cargarDatos();
      } catch (err) {
        mostrarError(err.message);
      }
    });

    setModalConfirmacion(true);
  };

  // =========================================================
  // ALQUILERES
  // =========================================================

  const abrirNuevoAlquiler = () => {
    setAlquilerEditando(null);

    setFormAlquiler({
      idCliente: "",
      idVehiculo: "",
      idUsuario: "",
      fechaInicio: "",
      fechaFin: "",
    });

    setModalAlquiler(true);
  };

  const abrirEditarAlquiler = (alquiler) => {
    setAlquilerEditando(alquiler);

    setFormAlquiler({
      idCliente: alquiler.idCliente ?? "",
      idVehiculo: alquiler.idVehiculo ?? "",
      idUsuario: alquiler.idUsuario ?? "",
      fechaInicio: alquiler.fechaInicio || "",
      fechaFin: alquiler.fechaFin || "",
    });

    setModalAlquiler(true);
  };

  const guardarAlquiler = async (e) => {
    console.log("GUARDAR ALQUILER FUE LLAMMADO");
    e.preventDefault();

    try {
      if (
        !formAlquiler.idCliente ||
        !formAlquiler.idVehiculo ||
        !formAlquiler.idUsuario ||
        !formAlquiler.fechaInicio ||
        !formAlquiler.fechaFin
      ) {
        throw new Error(
          "Completa todos los campos del alquiler."
        );
      }

      if (
        formAlquiler.fechaFin <=
        formAlquiler.fechaInicio
      ) {
        throw new Error(
          "La fecha de fin debe ser posterior a la fecha de inicio."
        );
      }

      const datosEnviar = {
        idCliente: Number(formAlquiler.idCliente),
        idVehiculo: Number(formAlquiler.idVehiculo),
        idUsuario: Number(formAlquiler.idUsuario),
        fechaInicio: formAlquiler.fechaInicio,
        fechaFin: formAlquiler.fechaFin,
      };

      if (alquilerEditando) {
        await realizarPeticion(
          `${API}/alquileres/${alquilerEditando.idAlquiler}`,
          {
            method: "PUT",
            body: JSON.stringify(datosEnviar),
          }
        );

        mostrarMensaje(
          "Alquiler actualizado correctamente."
        );
      } else {
        await realizarPeticion(`${API}/alquileres`, {
          method: "POST",
          body: JSON.stringify(datosEnviar),
        });

        mostrarMensaje(
          "Alquiler registrado correctamente."
        );
      }

      setModalAlquiler(false);
      await cargarDatos();
    } catch (err) {
      mostrarError(err.message);
    }
  };

  const solicitarEliminarAlquiler = (id) => {
    setConfirmacionTitulo("¿Anular alquiler?");
    setConfirmacionMensaje(
      "El alquiler será marcado como inactivo. ¿Deseas continuar?"
    );

    setConfirmacionAccion(() => async () => {
      try {
        await realizarPeticion(
          `${API}/alquileres/${id}`,
          {
            method: "DELETE",
          }
        );

        mostrarMensaje(
          "Alquiler anulado correctamente."
        );

        await cargarDatos();
      } catch (err) {
        mostrarError(err.message);
      }
    });

    setModalConfirmacion(true);
  };

  // =========================================================
  // PAGOS
  // =========================================================

  const abrirNuevoPago = () => {
    setPagoEditando(null);

    setFormPago({
      idAlquiler: "",
      fechaPago: new Date()
        .toISOString()
        .split("T")[0],
      monto: "",
      formaPago: "",
    });

    setModalPago(true);
  };

  const abrirEditarPago = (pago) => {
    setPagoEditando(pago);

    setFormPago({
      idAlquiler: pago.idAlquiler ?? "",
      fechaPago: pago.fechaPago || "",
      monto: pago.monto ?? "",
      formaPago: pago.formaPago || "",
    });

    setModalPago(true);
  };

  const guardarPago = async (e) => {
    e.preventDefault();

    try {
      const monto = Number(formPago.monto);

      if (
        !formPago.idAlquiler ||
        !formPago.fechaPago ||
        !formPago.formaPago
      ) {
        throw new Error(
          "Completa todos los campos del pago."
        );
      }

      if (!monto || monto <= 0) {
        throw new Error(
          "El monto debe ser mayor que cero."
        );
      }

      const datosEnviar = {
        idAlquiler: Number(formPago.idAlquiler),
        fechaPago: formPago.fechaPago,
        monto,
        formaPago: formPago.formaPago,
      };

      if (pagoEditando) {
        await realizarPeticion(
          `${API}/pagos/${pagoEditando.idPago}`,
          {
            method: "PUT",
            body: JSON.stringify(datosEnviar),
          }
        );

        mostrarMensaje(
          "Pago actualizado correctamente."
        );
      } else {
        await realizarPeticion(`${API}/pagos`, {
          method: "POST",
          body: JSON.stringify(datosEnviar),
        });

        mostrarMensaje(
          "Pago registrado correctamente."
        );
      }

      setModalPago(false);
      await cargarDatos();
    } catch (err) {
      mostrarError(err.message);
    }
  };

  const solicitarEliminarPago = (id) => {
    setConfirmacionTitulo("¿Anular pago?");
    setConfirmacionMensaje(
      "El pago será marcado como inactivo. ¿Deseas continuar?"
    );

    setConfirmacionAccion(() => async () => {
      try {
        await realizarPeticion(
          `${API}/pagos/${id}`,
          {
            method: "DELETE",
          }
        );

        mostrarMensaje(
          "Pago anulado correctamente."
        );

        await cargarDatos();
      } catch (err) {
        mostrarError(err.message);
      }
    });

    setModalConfirmacion(true);
  };

  // =========================================================
  // USUARIOS
  // =========================================================

  const abrirNuevoUsuario = () => {
    setUsuarioEditando(null);

    setFormUsuario({
      idPerfil: "",
      nombre: "",
      usuario: "",
      contrasena: "",
      correo: "",
    });

    setModalUsuario(true);
  };

  const abrirEditarUsuario = (usuario) => {
    setUsuarioEditando(usuario);

    setFormUsuario({
      idPerfil: usuario.idPerfil ?? "",
      nombre: usuario.nombre || "",
      usuario: usuario.usuario || "",
      contrasena: usuario.contrasena || "",
      correo: usuario.correo || "",
    });

    setModalUsuario(true);
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    try {
      if (
        !formUsuario.idPerfil ||
        !formUsuario.nombre ||
        !formUsuario.usuario ||
        !formUsuario.contrasena ||
        !formUsuario.correo
      ) {
        throw new Error(
          "Completa todos los campos del usuario."
        );
      }

      const datosEnviar = {
        idPerfil: Number(formUsuario.idPerfil),
        nombre: formUsuario.nombre.trim(),
        usuario: formUsuario.usuario.trim(),
        contrasena: formUsuario.contrasena,
        correo: formUsuario.correo.trim(),
      };

      if (usuarioEditando) {
        await realizarPeticion(
          `${API}/usuarios/${usuarioEditando.idUsuario}`,
          {
            method: "PUT",
            body: JSON.stringify(datosEnviar),
          }
        );

        mostrarMensaje(
          "Usuario actualizado correctamente."
        );
      } else {
        await realizarPeticion(`${API}/usuarios`, {
          method: "POST",
          body: JSON.stringify(datosEnviar),
        });

        mostrarMensaje(
          "Usuario agregado correctamente."
        );
      }

      setModalUsuario(false);
      await cargarDatos();
    } catch (err) {
      mostrarError(err.message);
    }
  };

  const solicitarEliminarUsuario = (id) => {
    setConfirmacionTitulo("¿Anular usuario?");
    setConfirmacionMensaje(
      "El usuario será marcado como inactivo. ¿Deseas continuar?"
    );

    setConfirmacionAccion(() => async () => {
      try {
        await realizarPeticion(
          `${API}/usuarios/${id}`,
          {
            method: "DELETE",
          }
        );

        mostrarMensaje(
          "Usuario anulado correctamente."
        );

        await cargarDatos();
      } catch (err) {
        mostrarError(err.message);
      }
    });

    setModalConfirmacion(true);
  };

 // =========================================================
// PERFILES
// =========================================================

const abrirNuevoPerfil = () => {
  setPerfilEditando(null);

  setFormPerfil({
    nombre: "",
  });

  setModalPerfil(true);
};

const abrirEditarPerfil = (perfil) => {
  setPerfilEditando(perfil);

  setFormPerfil({
    nombre: perfil.nombre || "",
  });

  setModalPerfil(true);
};

const guardarPerfil = async (e) => {
  e.preventDefault();

  try {
    if (!formPerfil.nombre.trim()) {
      throw new Error(
        "Ingresa el nombre del perfil."
      );
    }

    const datosEnviar = {
      nombre: formPerfil.nombre.trim(),
    };

    if (perfilEditando) {
      await realizarPeticion(
        `${API}/perfiles/${perfilEditando.idPerfil}`,
        {
          method: "PUT",
          body: JSON.stringify(datosEnviar),
        }
      );

      mostrarMensaje(
        "Perfil actualizado correctamente."
      );
    } else {
      await realizarPeticion(
        `${API}/perfiles`,
        {
          method: "POST",
          body: JSON.stringify(datosEnviar),
        }
      );

      mostrarMensaje(
        "Perfil agregado correctamente."
      );
    }

    setModalPerfil(false);

    await cargarDatos();

  } catch (err) {
    mostrarError(err.message);
  }
};

const solicitarEliminarPerfil = (id) => {
  setConfirmacionTitulo(
    "¿Anular perfil?"
  );

  setConfirmacionMensaje(
    "El perfil será marcado como inactivo. ¿Deseas continuar?"
  );

  setConfirmacionAccion(() => async () => {
    try {
      await realizarPeticion(
        `${API}/perfiles/${id}`,
        {
          method: "DELETE",
        }
      );

      mostrarMensaje(
        "Perfil anulado correctamente."
      );

      await cargarDatos();

    } catch (err) {
      mostrarError(err.message);
    }
  });

  setModalConfirmacion(true);
};


// =========================================================
// FUNCIONES AUXILIARES
// =========================================================

const obtenerCliente = (id) => {
  return datos.clientes.find(
    (cliente) =>
      Number(cliente.idCliente) === Number(id)
  );
};

const obtenerVehiculo = (id) => {
  return datos.vehiculos.find(
    (vehiculo) =>
      Number(vehiculo.idVehiculo) === Number(id)
  );
};

const obtenerUsuario = (id) => {
  return datos.usuarios.find(
    (usuario) =>
      Number(usuario.idUsuario) === Number(id)
  );
};

const obtenerPerfil = (id) => {
  return datos.perfiles.find(
    (perfil) =>
      Number(perfil.idPerfil) === Number(id)
  );
};

const obtenerAlquiler = (id) => {
  return datos.alquileres.find(
    (alquiler) =>
      Number(alquiler.idAlquiler) === Number(id)
  );
};

const formatearMoneda = (valor) => {
  const numero = Number(valor || 0);

  return numero.toLocaleString(
    "es-GT",
    {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2,
    }
  );
};

const calcularDias = (
  fechaInicio,
  fechaFin
) => {

  if (
    !fechaInicio ||
    !fechaFin
  ) {
    return 0;
  }

  const inicio = new Date(
    `${fechaInicio}T00:00:00`
  );

  const fin = new Date(
    `${fechaFin}T00:00:00`
  );

  const diferencia =
    fin - inicio;

  const dias = Math.round(
    diferencia /
      (1000 * 60 * 60 * 24)
  );

  return dias > 0
    ? dias
    : 0;
};

const vehiculoSeleccionado =
  useMemo(() => {

    return obtenerVehiculo(
      formAlquiler.idVehiculo
    );

  }, [
    formAlquiler.idVehiculo,
    datos.vehiculos,
  ]);

const diasAlquiler =
  calcularDias(
    formAlquiler.fechaInicio,
    formAlquiler.fechaFin
  );

const totalEstimado =
  vehiculoSeleccionado &&
  diasAlquiler > 0
    ? Number(
        vehiculoSeleccionado.precioDia
      ) * diasAlquiler
    : 0;

const obtenerNombreCliente = (id) => {

  const cliente =
    obtenerCliente(id);

  return cliente
    ? cliente.nombre
    : `ID: ${id}`;
};

   const obtenerNombreVehiculo = (id) => {
   const vehiculo = obtenerVehiculo(id);

    if (!vehiculo) {
        return `ID: ${id}`;
    }

    return `${vehiculo.marca} ${vehiculo.modelo}`;
};
  const obtenerPlacaVehiculo = (id) => {

  const vehiculo =
    obtenerVehiculo(id);

  return vehiculo
    ? vehiculo.placa
    : "";
};

const obtenerNombreUsuario = (id) => {

  const usuario =
    obtenerUsuario(id);

  return usuario
    ? usuario.nombre
    : `ID: ${id}`;
};

const obtenerNombrePerfil = (id) => {

  const perfil =
    obtenerPerfil(id);

  return perfil
    ? perfil.nombre
    : `ID: ${id}`;
};

const obtenerDescripcionAlquiler = (id) => {

  const alquiler =
    obtenerAlquiler(id);

  if (!alquiler) {
    return `ID: ${id}`;
  }

  return `#${alquiler.idAlquiler} — ${obtenerNombreCliente(
    alquiler.idCliente
  )}`;
};


// =========================================================
// CONFIRMACIÓN
// =========================================================

const cerrarConfirmacion = () => {

  setModalConfirmacion(false);

  setConfirmacionAccion(null);
};

const ejecutarConfirmacion = async () => {

  const accion =
    confirmacionAccion;

  cerrarConfirmacion();

  if (accion) {
    await accion();
  }
};


// =========================================================
// RENDER
// =========================================================

return (
  <div className="min-h-screen overflow-hidden rounded-3xl bg-gray-900 text-white">

    {/* SIDEBAR */}

    <Sidebar
      section={seccion}
      setSection={setSeccion}
      logo={logo}
    />

    {/* CONTENIDO PRINCIPAL */}

    <main className="min-h-screen overflow-hidden rounded-3xl pt-16 md:pt-0 md:pl-64">

      {/* HEADER */}

<header className="sticky top-0 z-40 hidden items-center justify-between border-b border-white/10 bg-slate-950/90 px-4 py-3 backdrop-blur-xl md:flex md:px-8 md:py-5">

  <div>

    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-400 md:text-xs md:tracking-[0.25em]">
      Sistema de gestión
    </span>

    <h1 className="mt-1 text-xl font-black tracking-tight md:text-2xl">
      AutoDrive
    </h1>

  </div>

  <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5 text-[9px] font-bold text-emerald-400 md:gap-2 md:px-4 md:py-2 md:text-xs">

    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] md:h-2 md:w-2" />

    Sistema conectado

  </div>

</header>


      {/* MENSAJES */}

      <div className="px-8 pt-6">

        {mensaje && (
          <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-300">
            ✓ {mensaje}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-300">
            ⚠ {error}
          </div>
        )}

        {cargando && (
          <div className="mb-4 rounded-2xl border border-sky-500/20 bg-sky-500/10 px-5 py-4 text-sm font-semibold text-sky-300">
            Cargando información...
          </div>
        )}

      </div>


      {/* SECCIONES */}

      <div className="p-8">

        {/* DASHBOARD */}

        {seccion === "inicio" && (
          <Dashboard
            datos={datos}
            logo={logo}
            setSeccion={setSeccion}
            formatearMoneda={
              formatearMoneda
            }
            obtenerNombreCliente={
              obtenerNombreCliente
            }
            obtenerNombreVehiculo={
              obtenerNombreVehiculo
            }
            obtenerDescripcionAlquiler={
              obtenerDescripcionAlquiler
            }
          />
        )}


        {/* VEHÍCULOS */}

        {seccion === "vehiculos" && (
          <Vehiculos
            datos={datos}
            formatearMoneda={
              formatearMoneda
            }
            abrirNuevoVehiculo={
              abrirNuevoVehiculo
            }
            abrirEditarVehiculo={
              abrirEditarVehiculo
            }
            eliminarVehiculo={
              solicitarEliminarVehiculo
            }
            busquedaVehiculos={
              busquedaVehiculos
            }
            setBusquedaVehiculos={
              setBusquedaVehiculos
            }
            filtroVehiculos={
              filtroVehiculos
            }
            setFiltroVehiculos={
              setFiltroVehiculos
            }
          />
        )}


        {/* CLIENTES */}

        {seccion === "clientes" && (
          <Clientes
            datos={datos}
            abrirNuevoCliente={
              abrirNuevoCliente
            }
            abrirEditarCliente={
              abrirEditarCliente
            }
            eliminarCliente={
              solicitarEliminarCliente
            }
          />
        )}


        {/* ALQUILERES */}

        {seccion === "alquileres" && (
          <Alquileres
            datos={datos}
            formatearMoneda={
              formatearMoneda
            }
            obtenerNombreCliente={
              obtenerNombreCliente
            }
            obtenerNombreVehiculo={
              obtenerNombreVehiculo
            }
            obtenerPlacaVehiculo={
              obtenerPlacaVehiculo
            }
            obtenerNombreUsuario={
              obtenerNombreUsuario
            }
            obtenerVehiculo={
              obtenerVehiculo
            }
            calcularDias={
              calcularDias
            }
            abrirNuevoAlquiler={
              abrirNuevoAlquiler
            }
            abrirEditarAlquiler={
              abrirEditarAlquiler
            }
            eliminarAlquiler={
              solicitarEliminarAlquiler
            }
          />
        )}


        {/* PAGOS */}

        {seccion === "pagos" && (
          <Pagos
            datos={datos}
            formatearMoneda={
              formatearMoneda
            }
            obtenerDescripcionAlquiler={
              obtenerDescripcionAlquiler
            }
            abrirNuevoPago={
              abrirNuevoPago
            }
            abrirEditarPago={
              abrirEditarPago
            }
            eliminarPago={
              solicitarEliminarPago
            }
          />
        )}


        {/* USUARIOS */}

        {seccion === "usuarios" && (
          <Usuarios
            datos={datos}
            abrirNuevoUsuario={
              abrirNuevoUsuario
            }
            abrirEditarUsuario={
              abrirEditarUsuario
            }
            eliminarUsuario={
              solicitarEliminarUsuario
            }
          />
        )}


        {/* PERFILES */}

        {seccion === "perfiles" && (
          <Perfiles
            datos={datos}
            abrirNuevoPerfil={
              abrirNuevoPerfil
            }
            abrirEditarPerfil={
              abrirEditarPerfil
            }
            eliminarPerfil={
              solicitarEliminarPerfil
            }
          />
        )}

      </div>

    </main>


    {/* =====================================================
        MODALES
    ===================================================== */}

    <ModalVehiculo
      abierto={modalVehiculo}
      vehiculoEditando={
        vehiculoEditando
      }
      formVehiculo={
        formVehiculo
      }
      setFormVehiculo={
        setFormVehiculo
      }
      guardarVehiculo={
        guardarVehiculo
      }
      cerrarModal={() =>
        setModalVehiculo(false)
      }
    />


    <ModalCliente
      abierto={modalCliente}
      clienteEditando={
        clienteEditando
      }
      formCliente={
        formCliente
      }
      setFormCliente={
        setFormCliente
      }
      guardarCliente={
        guardarCliente
      }
      cerrarModal={() =>
        setModalCliente(false)
      }
    />


    <ModalAlquiler
      abierto={modalAlquiler}
      alquilerEditando={
        alquilerEditando
      }
      formAlquiler={
        formAlquiler
      }
      setFormAlquiler={
        setFormAlquiler
      }
      datos={datos}
      vehiculoSeleccionado={
        vehiculoSeleccionado
      }
      diasAlquiler={
        diasAlquiler
      }
      totalEstimado={
        totalEstimado
      }
      formatearMoneda={
        formatearMoneda
      }
      guardarAlquiler={
        guardarAlquiler
      }
      cerrarModal={() =>
        setModalAlquiler(false)
      }
    />


    <ModalPago
      abierto={modalPago}
      pagoEditando={
        pagoEditando
      }
      formPago={
        formPago
      }
      setFormPago={
        setFormPago
      }
      datos={datos}
      obtenerNombreCliente={
        obtenerNombreCliente
      }
      guardarPago={
        guardarPago
      }
      cerrarModal={() =>
        setModalPago(false)
      }
    />


    <ModalUsuario
      abierto={modalUsuario}
      usuarioEditando={
        usuarioEditando
      }
      formUsuario={
        formUsuario
      }
      setFormUsuario={
        setFormUsuario
      }
      datos={datos}
      guardarUsuario={
        guardarUsuario
      }
      cerrarModal={() =>
        setModalUsuario(false)
      }
    />


    <ModalPerfil
      abierto={modalPerfil}
      perfilEditando={
        perfilEditando
      }
      formPerfil={
        formPerfil
      }
      setFormPerfil={
        setFormPerfil
      }
      guardarPerfil={
        guardarPerfil
      }
      cerrarModal={() =>
        setModalPerfil(false)
      }
    />


    <ModalConfirmacion
      abierto={
        modalConfirmacion
      }
      titulo={
        confirmacionTitulo
      }
      mensaje={
        confirmacionMensaje
      }
      textoConfirmar="Anular"
      textoCancelar="Cancelar"
      confirmar={
        ejecutarConfirmacion
      }
      cerrarModal={
        cerrarConfirmacion
      }
    />

  </div>
);

}

export default App;
