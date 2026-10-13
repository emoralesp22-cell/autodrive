import { useMemo, useState } from "react";

function Icono({ tipo, className = "h-5 w-5" }) {

  const base = {

    className,

    viewBox: "0 0 24 24",

    fill: "none",

    stroke: "currentColor",

    strokeWidth: 2,

    strokeLinecap: "round",

    strokeLinejoin: "round",

  };

  switch (tipo) {

    case "plus":

      return (

        <svg {...base}>

          <path d="M12 5v14" />

          <path d="M5 12h14" />

        </svg>

      );

    case "credit-card":

      return (

        <svg {...base}>

          <rect x="3" y="5" width="18" height="14" rx="2" />

          <path d="M3 10h18" />

          <path d="M7 15h2" />

          <path d="M11 15h4" />

        </svg>

      );

    case "check":

      return (

        <svg {...base}>

          <path d="m5 12 4 4L19 6" />

        </svg>

      );

    case "clock":

      return (

        <svg {...base}>

          <circle cx="12" cy="12" r="9" />

          <path d="M12 7v5l3 2" />

        </svg>

      );

    case "search":

      return (

        <svg {...base}>

          <circle cx="11" cy="11" r="7" />

          <path d="m20 20-4-4" />

        </svg>

      );

    case "banknote":

      return (

        <svg {...base}>

          <rect x="3" y="6" width="18" height="12" rx="2" />

          <circle cx="12" cy="12" r="2.5" />

          <path d="M7 9h.01" />

          <path d="M17 15h.01" />

        </svg>

      );

    case "pencil":

      return (

        <svg {...base}>

          <path d="M12 20h9" />

          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />

        </svg>

      );

    case "trash":

      return (

        <svg {...base}>

          <path d="M3 6h18" />

          <path d="M8 6V4h8v2" />

          <path d="M19 6l-1 14H6L5 6" />

          <path d="M10 11v5" />

          <path d="M14 11v5" />

        </svg>

      );

    case "history":

      return (

        <svg {...base}>

          <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" />

          <path d="M3 3v5h5" />

          <path d="M12 7v5l3 2" />

        </svg>

      );

    default:

      return null;

  }

}

function Pagos({

  datos,

  formatearMoneda,

  abrirNuevoPago,


  eliminarPago,

}) {

  const [busqueda, setBusqueda] = useState("");

  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [alquileresExpandidos, setAlquileresExpandidos] = useState(() => new Set());
  const [alquilerHistorialId, setAlquilerHistorialId] = useState(null);
  const [pagoParaAnular, setPagoParaAnular] = useState(null);
  const [motivoAnulacion, setMotivoAnulacion] = useState("");
  const [guardandoAnulacion, setGuardandoAnulacion] = useState(false);
  const [errorAnulacion, setErrorAnulacion] = useState("");

  const pagosActivosCargados = Array.isArray(datos?.pagos)
    ? datos.pagos
    : [];
  const pagos = Array.isArray(datos?.historialPagos)
    ? datos.historialPagos
    : pagosActivosCargados;

  const alquileres = Array.isArray(datos?.alquileres)

    ? datos.alquileres

    : [];

  const clientes = Array.isArray(datos?.clientes)

    ? datos.clientes

    : [];

  const vehiculos = Array.isArray(datos?.vehiculos)

    ? datos.vehiculos

    : [];

  const dinero = (valor) => {

    if (typeof formatearMoneda === "function") {

      return formatearMoneda(Number(valor) || 0);

    }

    return `Q${(Number(valor) || 0).toFixed(2)}`;

  };

  // =========================================================

  // RELACIONES

  // =========================================================

  const obtenerIdAlquiler = (pago) => {

    const valor =

      pago?.idAlquiler ??

      pago?.alquiler?.idAlquiler;

    const numero = Number(valor);

    return Number.isFinite(numero)

      ? numero

      : 0;

  };

  const obtenerIdCliente = (alquiler) => {

    const valor =

      alquiler?.idCliente ??

      alquiler?.cliente?.idCliente;

    const numero = Number(valor);

    return Number.isFinite(numero)

      ? numero

      : 0;

  };

  const obtenerIdVehiculo = (alquiler) => {

    const valor =

      alquiler?.idVehiculo ??

      alquiler?.vehiculo?.idVehiculo;

    const numero = Number(valor);

    return Number.isFinite(numero)

      ? numero

      : 0;

  };

  const obtenerAlquiler = (pago) => {

    const idAlquiler = obtenerIdAlquiler(pago);

    return (

      alquileres.find(

        (alquiler) =>

          Number(alquiler?.idAlquiler) ===

          idAlquiler

      ) || null

    );

  };

  const obtenerCliente = (pago) => {

    const alquiler = obtenerAlquiler(pago);

    if (alquiler?.cliente?.nombre) {

      return alquiler.cliente;

    }

    const idCliente =

      obtenerIdCliente(alquiler);

    if (idCliente) {

      return (

        clientes.find(

          (cliente) =>

            Number(cliente?.idCliente) ===

            idCliente

        ) || null

      );

    }

    if (pago?.alquiler?.cliente?.nombre) {

      return pago.alquiler.cliente;

    }

    return null;

  };

  const obtenerVehiculo = (pago) => {

    const alquiler = obtenerAlquiler(pago);

    if (alquiler?.vehiculo) {

      return alquiler.vehiculo;

    }

    const idVehiculo =

      obtenerIdVehiculo(alquiler);

    if (idVehiculo) {

      return (

        vehiculos.find(

          (vehiculo) =>

            Number(vehiculo?.idVehiculo) ===

            idVehiculo

        ) || null

      );

    }

    if (pago?.alquiler?.vehiculo) {

      return pago.alquiler.vehiculo;

    }

    return null;

  };

const obtenerNombreCliente = (pago) => {

  const cliente = obtenerCliente(pago);

  if (!cliente?.nombre) {

    return "Cliente no disponible";

  }

  return cliente.estado === false

    ? `${cliente.nombre} (Inactivo)`

    : cliente.nombre;

};

  const obtenerNombreVehiculo = (pago) => {

    const vehiculo = obtenerVehiculo(pago);

    if (!vehiculo) {

      return "Vehículo no disponible";

    }

    const nombre =

      `${vehiculo?.marca || ""} ${vehiculo?.modelo || ""}`.trim();

    return (

      nombre ||

      "Vehículo no disponible"

    );

  };

  const obtenerPlacaVehiculo = (pago) => {

    const vehiculo =

      obtenerVehiculo(pago);

    return (

      vehiculo?.placa ||

      "Sin placa"

    );

  };

  const obtenerResumen = (idAlquiler) => {

    const alquiler = alquileres.find(

      (item) =>

        Number(item?.idAlquiler) ===

        Number(idAlquiler)

    );

    const total =

      Number(alquiler?.total || 0);

    const pagosDelAlquiler =

      pagos.filter((pago) => {

        const mismoAlquiler =

          Number(

            obtenerIdAlquiler(pago)

          ) === Number(idAlquiler);

const activo = pago?.estado === true;

        return (

          mismoAlquiler &&

          activo

        );

      });

    const totalPagado =

      pagosDelAlquiler.reduce(

        (suma, pago) =>

          suma +

          Number(pago?.monto || 0),

        0

      );

    const restante = Math.max(

      total - totalPagado,

      0

    );

    const porcentaje =

      total > 0

        ? Math.min(

            (totalPagado / total) * 100,

            100

          )

        : 0;

    return {

      total,

      totalPagado,

      restante,

      porcentaje,

      pagado: restante <= 0,

    };

  };

  const formatearFecha = (fecha) => {

    if (!fecha) {

      return "Sin fecha";

    }

    const texto = String(fecha);

    const partes = texto.split("-");

    if (partes.length === 3) {

      return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }

    return texto;

  };

  // Kardex: cada abono reduce el saldo y cada anulación lo incrementa.
  const obtenerMovimientosHistorial = (idAlquiler) => {
    const alquiler = alquileres.find(
      (item) => Number(item?.idAlquiler) === Number(idAlquiler)
    );
    const total = Number(alquiler?.total || 0);
    const pagosDelAlquiler = pagos.filter(
      (pago) => obtenerIdAlquiler(pago) === Number(idAlquiler)
    );
    const movimientos = [];

    if (alquiler && total > 0) {
      movimientos.push({
        clave: `cargo-${idAlquiler}`,
        idPago: null,
        fecha: alquiler.fechaInicio || "",
        fechaDetalle: "Fecha de inicio del alquiler",
        tipo: "CARGO",
        descripcion: "Cargo inicial del alquiler",
        variacion: total,
        monto: total,
        formaPago: "",
        motivo: "",
      });
    }

    pagosDelAlquiler.forEach((pago) => {
      const monto = Number(pago?.monto || 0);
      movimientos.push({
        clave: `pago-${pago.idPago}`,
        idPago: pago.idPago,
        fecha: pago.fechaPago || "",
        tipo: "ABONO",
        descripcion: "Abono registrado",
        variacion: -monto,
        monto,
        formaPago: pago.formaPago || "No especificada",
        motivo: "",
      });

      if (pago?.estado === false) {
        movimientos.push({
          clave: `anulacion-${pago.idPago}`,
          idPago: pago.idPago,
          fecha: pago.fechaAnulacion || "",
          tipo: "ANULACION",
          descripcion: "Anulación del pago",
          variacion: monto,
          monto,
          formaPago: pago.formaPago || "No especificada",
          motivo: pago.motivoAnulacion || "Motivo no registrado en el sistema anterior.",
        });
      }
    });

    movimientos.sort((a, b) => {
      // El cargo del alquiler siempre aparece primero como saldo inicial.
      if (a.tipo === "CARGO" && b.tipo !== "CARGO") return -1;
      if (b.tipo === "CARGO" && a.tipo !== "CARGO") return 1;
      if (!a.fecha && b.fecha) return 1;
      if (a.fecha && !b.fecha) return -1;
      if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
      if (a.tipo !== b.tipo) return a.tipo === "ABONO" ? -1 : 1;
      return Number(a.idPago || 0) - Number(b.idPago || 0);
    });

    let saldo = 0;
    return movimientos.map((movimiento) => {
      saldo = Math.max(0, saldo + movimiento.variacion);
      return { ...movimiento, saldoDespues: saldo };
    });
  };

  const abrirModalAnulacion = (pago) => {
    setPagoParaAnular(pago);
    setMotivoAnulacion("");
    setErrorAnulacion("");
  };

  const cerrarModalAnulacion = () => {
    if (guardandoAnulacion) return;
    setPagoParaAnular(null);
    setMotivoAnulacion("");
    setErrorAnulacion("");
  };

  const confirmarAnulacion = async (e) => {
    e.preventDefault();
    const motivo = motivoAnulacion.trim();
    if (motivo.length < 5) {
      setErrorAnulacion("Escribe un motivo de al menos 5 caracteres.");
      return;
    }
    if (motivo.length > 500) {
      setErrorAnulacion("El motivo no puede superar los 500 caracteres.");
      return;
    }
    setGuardandoAnulacion(true);
    setErrorAnulacion("");
    try {
      await eliminarPago(pagoParaAnular.idPago, motivo);
      setPagoParaAnular(null);
      setMotivoAnulacion("");
    } catch (err) {
      setErrorAnulacion(err?.message || "No se pudo anular el pago.");
    } finally {
      setGuardandoAnulacion(false);
    }
  };

  // =========================================================

  // DATOS PROCESADOS

  // =========================================================

  const pagosProcesados = useMemo(() => {

    return pagos
      .map((pago) => {

        const idAlquiler =

          obtenerIdAlquiler(pago);

        const resumen =

          obtenerResumen(idAlquiler);

        const cliente =

          obtenerNombreCliente(pago);

        const vehiculo =

          obtenerNombreVehiculo(pago);

        const placa =

          obtenerPlacaVehiculo(pago);

        return {

          pago,

          idAlquiler,

          resumen,

          cliente,

          vehiculo,

          placa,

          estado: pago?.estado === false
            ? "ANULADO"
            : resumen.pagado
              ? "PAGADO"
              : "PENDIENTE",

        };

      });

  }, [

    pagos,

    alquileres,

    clientes,

    vehiculos,

  ]);

  const pagosFiltrados = useMemo(() => {

    const texto =

      busqueda.trim().toLowerCase();

    return pagosProcesados.filter(

      (item) => {

        const coincideBusqueda =

          texto === "" ||

          String(

            item?.pago?.idPago ?? ""

          )

            .toLowerCase()

            .includes(texto) ||

          String(item.idAlquiler)

            .toLowerCase()

            .includes(texto) ||

          item.cliente

            .toLowerCase()

            .includes(texto) ||

          item.vehiculo

            .toLowerCase()

            .includes(texto) ||

          item.placa

            .toLowerCase()

            .includes(texto) ||

          String(

            item?.pago?.formaPago ?? ""

          )

            .toLowerCase()

            .includes(texto);

        const coincideEstado =

          filtroEstado === "todos" ||

          item.estado === filtroEstado;

        return (

          coincideBusqueda &&

          coincideEstado

        );

      }

    );

  }, [

    pagosProcesados,

    busqueda,

    filtroEstado,

  ]);

  // Agrupar los abonos por alquiler para no repetir una tarjeta por cada pago.
  const gruposPagos = useMemo(() => {
    const grupos = new Map();

    pagosFiltrados.forEach((item) => {
      const id = Number(item.idAlquiler);
      if (!grupos.has(id)) {
        grupos.set(id, {
          idAlquiler: id,
          cliente: item.cliente,
          vehiculo: item.vehiculo,
          placa: item.placa,
          resumen: item.resumen,
          items: [],
        });
      }
      grupos.get(id).items.push(item);
    });

    return Array.from(grupos.values()).sort(
      (a, b) => b.idAlquiler - a.idAlquiler
    );
  }, [pagosFiltrados]);

  const alternarAbonosAlquiler = (idAlquiler) => {
    setAlquileresExpandidos((actuales) => {
      const nuevos = new Set(actuales);
      if (nuevos.has(idAlquiler)) {
        nuevos.delete(idAlquiler);
      } else {
        nuevos.add(idAlquiler);
      }
      return nuevos;
    });
  };

  // =========================================================

  // RESUMEN GENERAL

  // =========================================================

  const resumenGeneral = useMemo(() => {

    const pagosActivos = pagosProcesados.filter((item) => item.pago?.estado === true);
    const totalPagos = pagosActivos.length;
    const totalCobrado = pagosActivos.reduce(
      (suma, item) => suma + Number(item?.pago?.monto || 0),
      0
    );

    const idsAlquilerActivos = [

      ...new Set(

        alquileres

          .filter(

            (alquiler) =>

              alquiler?.estado !== false

          )

          .map(

            (alquiler) =>

              Number(alquiler?.idAlquiler)

          )

          .filter((id) => id > 0)

      ),

    ];

    let pendiente = 0;

    idsAlquilerActivos.forEach(

      (id) => {

        const resumen =

          obtenerResumen(id);

        pendiente +=

          resumen.restante;

      }

    );

    const alquileresPagados = new Set(
        pagosActivos.filter((item) => item.estado === "PAGADO")

          .map(

            (item) =>

              Number(item.idAlquiler)

          )

          .filter((id) => id > 0)

      );

    const pagados =

      alquileresPagados.size;

    return {

      totalPagos,

      totalCobrado,

      pendiente,

      pagados,

    };

  }, [

    pagosProcesados,

    alquileres,

  ]);

  // =========================================================

  // RENDER

  // =========================================================

  return (

   <section className="space-y-3 rounded-3xl border border-white/10 bg-slate-950   p-3 text-white shadow-2xl sm:space-y-5 sm:p-6">

      {/* ENCABEZADO */}

      <div className="flex flex-col gap-3 sm:gap-5 md:flex-row md:items-end md:justify-between">

        <div>

          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400 sm:text-xs sm:tracking-[0.25em]">

            Gestión financiera

          </span>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:mt-2 sm:text-3xl">

            Pagos

          </h2>

          <p className="mt-1 text-xs text-slate-400 sm:mt-2 sm:text-sm">

            Control de abonos, saldos y pagos de alquileres.

          </p>

        </div>

        <button

          type="button"

          onClick={abrirNuevoPago}

          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 hover:shadow-sky-500/30 sm:px-5 sm:py-3 sm:text-sm"

        >

          <Icono

            tipo="plus"

            className="h-4 w-4 sm:h-5 sm:w-5"

          />

          Registrar abono

        </button>

      </div>

      {/* RESUMEN */}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">

        {/* PAGOS */}

        <div className="rounded-xl border border-white/10 bg-slate-900/70 p-2.5 shadow-xl transition hover:-translate-y-1 hover:border-sky-400/30 sm:rounded-2xl sm:p-5">

          <div className="flex items-center justify-between gap-1.5">

            <div className="min-w-0">

              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">

                Pagos registrados

              </p>

              <p className="mt-0.5 text-xl font-black text-white sm:mt-2 sm:text-3xl">

                {resumenGeneral.totalPagos}

              </p>

            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 sm:h-12 sm:w-12 sm:rounded-xl">

              <Icono

                tipo="credit-card"

                className="h-4 w-4 sm:h-6 sm:w-6"

              />

            </div>

          </div>

        </div>

        {/* TOTAL COBRADO */}

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 shadow-xl transition hover:-translate-y-1 hover:border-emerald-400/30 sm:rounded-2xl sm:p-5">

          <div className="flex items-center justify-between gap-1.5">

            <div className="min-w-0">

              <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-400 sm:text-xs">

                Total cobrado

              </p>

              <p className="mt-0.5 whitespace-nowrap text-base font-black text-white sm:mt-2 sm:text-2xl">

                {dinero(

                  resumenGeneral.totalCobrado

                )}

              </p>

            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 sm:h-12 sm:w-12 sm:rounded-xl">

              <Icono

                tipo="check"

                className="h-4 w-4 sm:h-6 sm:w-6"

              />

            </div>

          </div>

        </div>

        {/* SALDO PENDIENTE */}

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 shadow-xl transition hover:-translate-y-1 hover:border-amber-400/30 sm:rounded-2xl sm:p-5">

          <div className="flex items-center justify-between gap-1.5">

            <div className="min-w-0">

              <p className="text-[8px] font-bold uppercase tracking-wider text-amber-400 sm:text-xs">

                Saldo pendiente

              </p>

              <p className="mt-0.5 whitespace-nowrap text-base font-black text-white sm:mt-2 sm:text-2xl">

                {dinero(

                  resumenGeneral.pendiente

                )}

              </p>

            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 sm:h-12 sm:w-12 sm:rounded-xl">

              <Icono

                tipo="clock"

                className="h-4 w-4 sm:h-6 sm:w-6"

              />

            </div>

          </div>

        </div>

        {/* ALQUILERES PAGADOS */}

        <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-2.5 shadow-xl transition hover:-translate-y-1 hover:border-sky-400/30 sm:rounded-2xl sm:p-5">

          <div className="flex items-center justify-between gap-1.5">

            <div className="min-w-0">

              <p className="text-[8px] font-bold uppercase tracking-wider text-sky-400 sm:text-xs">

                Alquileres pagados

              </p>

              <p className="mt-0.5 text-xl font-black text-white sm:mt-2 sm:text-3xl">

                {resumenGeneral.pagados}

              </p>

            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 sm:h-12 sm:w-12 sm:rounded-xl">

              <Icono

                tipo="check"

                className="h-4 w-4 sm:h-6 sm:w-6"

              />

            </div>

          </div>

        </div>

      </div>

      {/* BUSCADOR Y FILTRO */}

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3 shadow-xl sm:p-4">

        <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">

          <div className="relative flex-1">

            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 sm:left-4">

              <Icono

                tipo="search"

                className="h-4 w-4 sm:h-5 sm:w-5"

              />

            </span>

            <input

              type="text"

              value={busqueda}

              onChange={(e) =>

                setBusqueda(e.target.value)

              }

              placeholder="Buscar pago, alquiler, cliente, vehículo..."

              className="w-full rounded-xl border border-white/10 bg-slate-950 py-2.5 pl-10 pr-4 text-xs font-medium text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 sm:py-3 sm:pl-11 sm:text-sm"

            />

          </div>

          {/* FILTROS MÓVILES */}

          <div className="grid grid-cols-4 gap-2 sm:hidden">

            <button

              type="button"

              onClick={() =>

                setFiltroEstado("todos")

              }

              className={

                filtroEstado === "todos"

                  ? "rounded-xl border border-sky-400/50 bg-sky-500 px-2 py-2.5 text-[10px] font-bold text-white shadow-lg shadow-sky-500/20 transition"

                  : "rounded-xl border border-white/10 bg-slate-950 px-2 py-2.5 text-[10px] font-bold text-slate-400 transition hover:border-sky-400/30 hover:text-white"

              }

            >

              Todos

            </button>

            <button

              type="button"

              onClick={() =>

                setFiltroEstado("PAGADO")

              }

              className={

                filtroEstado === "PAGADO"

                  ? "rounded-xl border border-emerald-400/50 bg-emerald-500 px-2 py-2.5 text-[10px] font-bold text-white shadow-lg shadow-emerald-500/20 transition"

                  : "rounded-xl border border-white/10 bg-slate-950 px-2 py-2.5 text-[10px] font-bold text-slate-400 transition hover:border-emerald-400/30 hover:text-white"

              }

            >

              Pagados

            </button>

            <button

              type="button"

              onClick={() =>

                setFiltroEstado("PENDIENTE")

              }

              className={

                filtroEstado === "PENDIENTE"

                  ? "rounded-xl border border-amber-400/50 bg-amber-500 px-2 py-2.5 text-[10px] font-bold text-white shadow-lg shadow-amber-500/20 transition"

                  : "rounded-xl border border-white/10 bg-slate-950 px-2 py-2.5 text-[10px] font-bold text-slate-400 transition hover:border-amber-400/30 hover:text-white"

              }

            >

              Pendientes

            </button>
            <button
              type="button"
              onClick={() => setFiltroEstado("ANULADO")}
              className={filtroEstado === "ANULADO" ? "rounded-xl border border-rose-400/50 bg-rose-500 px-2 py-2.5 text-[10px] font-bold text-white transition" : "rounded-xl border border-white/10 bg-slate-950 px-2 py-2.5 text-[10px] font-bold text-slate-400 transition hover:border-rose-400/30 hover:text-white"}
            >Anulados</button>

          </div>

          {/* SELECT ORIGINAL DE PC */}

          <select

            value={filtroEstado}

            onChange={(e) =>

              setFiltroEstado(e.target.value)

            }

            className="hidden rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-bold text-slate-300 outline-none transition focus:border-sky-400 sm:block"

          >

            <option value="todos">

              Todos los estados

            </option>

            <option value="PAGADO">

              Pagados

            </option>

            <option value="PENDIENTE">

              Pendientes

            </option>
<option value="ANULADO">Anulados</option>

          </select>

        </div>

      </div>

      {/* LISTADO AGRUPADO POR ALQUILER */}
      {gruposPagos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-sky-400">
            <Icono tipo="credit-card" className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-white">No hay pagos para mostrar</h3>
          <p className="mt-2 text-sm text-slate-500">
            {busqueda ? "Prueba con otro término de búsqueda." : "Todavía no se han registrado abonos."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 xl:gap-5">
          {gruposPagos.map((grupo) => {
            const expandido = alquileresExpandidos.has(grupo.idAlquiler);
            const resumen = grupo.resumen;
            const pagado = resumen.restante <= 0;
            const porcentaje = pagado
              ? 100
              : Math.max(0, Math.min(Number(resumen.porcentaje) || 0, 100));

            return (
              <article
                key={grupo.idAlquiler}
                className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl transition hover:border-sky-400/30"
              >
                <div className="space-y-4 p-4 sm:p-5">
                  {/* Encabezado compacto */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-sky-400">
                        {grupo.cliente}
                      </p>
                      <h3 className="mt-1 text-lg font-black text-white">
                        Alquiler #{grupo.idAlquiler}
                      </h3>
                      <p className="mt-1 truncate text-sm text-slate-400">
                        {grupo.vehiculo} · {grupo.placa}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ring-1 ${pagado ? "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20" : "bg-amber-500/15 text-amber-400 ring-amber-500/20"}`}>
                      {pagado ? "PAGADO" : "PENDIENTE"}
                    </span>
                  </div>

                  {/* Resumen financiero único por alquiler */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="min-w-0 rounded-xl border border-white/10 bg-slate-950 p-2.5 sm:p-3">
                      <p className="text-[8px] font-black uppercase tracking-wider text-slate-500 sm:text-[10px]">Total</p>
                      <p className="mt-1 truncate text-xs font-black text-white sm:text-sm">{dinero(resumen.total)}</p>
                    </div>
                    <div className="min-w-0 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 sm:p-3">
                      <p className="text-[8px] font-black uppercase tracking-wider text-emerald-400 sm:text-[10px]">Abonado</p>
                      <p className="mt-1 truncate text-xs font-black text-emerald-300 sm:text-sm">{dinero(resumen.totalPagado)}</p>
                    </div>
                    <div className="min-w-0 rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 sm:p-3">
                      <p className="text-[8px] font-black uppercase tracking-wider text-amber-400 sm:text-[10px]">Restante</p>
                      <p className="mt-1 truncate text-xs font-black text-amber-300 sm:text-sm">{dinero(resumen.restante)}</p>
                    </div>
                  </div>

                  {/* Progreso */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Progreso del pago</span>
                      <span className="text-xs font-black text-slate-300">{Math.round(porcentaje)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${pagado ? "bg-emerald-500" : "bg-amber-500"}`}
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>

                  {/* Acciones principales */}
                  <div className="flex flex-col gap-2 border-t border-white/5 pt-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => alternarAbonosAlquiler(grupo.idAlquiler)}
                      aria-expanded={expandido}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-sky-500/20 bg-sky-500/5 px-3 py-3 text-sm font-bold text-sky-300 transition hover:bg-sky-500/10"
                    >
                      <svg className={`h-4 w-4 transition-transform ${expandido ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                      {expandido ? "Ocultar abonos" : `Mostrar abonos (${grupo.items.length})`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlquilerHistorialId(grupo.idAlquiler)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm font-bold text-slate-300 transition hover:border-sky-500/40 hover:text-sky-300"
                    >
                      <Icono tipo="history" className="h-4 w-4" />
                      Kardex completo
                    </button>
                  </div>
                </div>

                {/* Abonos individuales ocultos hasta expandir */}
                {expandido && (
                  <div className="space-y-2 border-t border-white/10 bg-slate-950/60 p-3 sm:p-4">
                    {grupo.items.map(({ pago }) => {
                      const anulado = pago?.estado === false;
                      return (
                        <div
                          key={pago?.idPago}
                          className={`rounded-2xl border p-3 ${anulado ? "border-rose-500/20 bg-rose-500/5" : "border-white/10 bg-slate-900/70"}`}
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-black text-white">Pago #{pago?.idPago ?? "—"}</span>
                                <span className={`rounded-full px-2 py-1 text-[9px] font-black uppercase ${anulado ? "bg-rose-500/15 text-rose-300" : "bg-sky-500/15 text-sky-300"}`}>
                                  {anulado ? "ANULADO" : "ABONO REGISTRADO"}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-slate-400">
                                {formatearFecha(pago?.fechaPago)} · {pago?.formaPago || "Forma no especificada"}
                              </p>
                              {anulado && (
                                <p className="mt-2 break-words text-xs text-rose-200">
                                  Motivo: {pago?.motivoAnulacion || "Motivo no disponible"}
                                  {pago?.fechaAnulacion ? ` · Anulado el ${formatearFecha(pago.fechaAnulacion)}` : ""}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                              <span className={`whitespace-nowrap text-base font-black ${anulado ? "text-rose-300 line-through" : "text-emerald-300"}`}>
                                {dinero(pago?.monto)}
                              </span>
                              <button
                                type="button"
                                onClick={() => abrirModalAnulacion(pago)}
                                disabled={anulado}
                                className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                                title={anulado ? "Este pago ya está anulado" : "Anular este abono"}
                              >
                                {anulado ? "Anulado" : "Anular"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {alquilerHistorialId !== null && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) setAlquilerHistorialId(null); }}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950 text-white shadow-2xl">
            {(() => {
              const alquiler = alquileres.find((item) => Number(item?.idAlquiler) === Number(alquilerHistorialId));
              const movimientos = obtenerMovimientosHistorial(alquilerHistorialId);
              const cliente = alquiler ? obtenerNombreCliente({ idAlquiler: alquilerHistorialId }) : "Cliente no disponible";
              const vehiculo = alquiler ? obtenerNombreVehiculo({ idAlquiler: alquilerHistorialId }) : "Vehículo no disponible";
              const resumen = obtenerResumen(alquilerHistorialId);
              return (
                <>
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-slate-900 p-4 sm:p-6">
                    <div><p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-400">Kardex de pagos</p><h3 className="mt-1 text-xl font-black">Alquiler #{alquilerHistorialId}</h3><p className="mt-1 text-sm text-slate-400">{cliente} · {vehiculo}</p></div>
                    <button type="button" onClick={() => setAlquilerHistorialId(null)} className="rounded-xl border border-white/10 px-3 py-2 text-slate-300 hover:bg-white/5" aria-label="Cerrar historial">✕</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 border-b border-white/10 p-3 sm:gap-3 sm:p-5">
                    <div className="rounded-xl border border-white/10 bg-slate-900 p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">Total</p><p className="mt-1 text-xs font-black sm:text-base">{dinero(resumen.total)}</p></div>
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 sm:text-xs">Pagado válido</p><p className="mt-1 text-xs font-black text-emerald-300 sm:text-base">{dinero(resumen.totalPagado)}</p></div>
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-amber-400 sm:text-xs">Pendiente</p><p className="mt-1 text-xs font-black text-amber-300 sm:text-base">{dinero(resumen.restante)}</p></div>
                  </div>
                  <div className="max-h-[52vh] space-y-3 overflow-y-auto p-3 sm:p-5">
                    {movimientos.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">Este alquiler todavía no tiene movimientos de pago.</div> : movimientos.map((movimiento) => (
                      <div key={movimiento.clave} className={`rounded-2xl border p-3 sm:p-4 ${movimiento.tipo === "ANULACION" ? "border-rose-500/20 bg-rose-500/5" : movimiento.tipo === "CARGO" ? "border-amber-500/20 bg-amber-500/5" : "border-white/10 bg-slate-900/60"}`}>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wider ${movimiento.tipo === "ANULACION" ? "bg-rose-500/15 text-rose-300" : movimiento.tipo === "CARGO" ? "bg-amber-500/15 text-amber-300" : "bg-sky-500/15 text-sky-300"}`}>{movimiento.descripcion}</span>{movimiento.idPago != null && <span className="text-xs text-slate-500">Pago #{movimiento.idPago}</span>}</div>
                            <p className="mt-2 text-xs text-slate-400">{movimiento.fecha ? formatearFecha(movimiento.fecha) : (movimiento.tipo === "ANULACION" ? "Fecha de anulación no registrada" : "Sin fecha registrada")}{movimiento.fechaDetalle ? ` · ${movimiento.fechaDetalle}` : movimiento.tipo === "ABONO" ? ` · ${movimiento.formaPago}` : ""}</p>
                            {movimiento.tipo === "ANULACION" && <p className="mt-2 break-words text-sm text-rose-200">Motivo: {movimiento.motivo}</p>}
                          </div>
                          <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1"><span className={`text-sm font-black ${movimiento.tipo === "CARGO" ? "text-amber-300" : movimiento.variacion < 0 ? "text-emerald-300" : "text-rose-300"}`}>{movimiento.variacion < 0 ? "−" : "+"}{dinero(Math.abs(movimiento.variacion))}</span><span className="text-xs text-slate-400">Saldo: <strong className="text-white">{dinero(movimiento.saldoDespues)}</strong></span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {pagoParaAnular && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6">
          <form onSubmit={confirmarAnulacion} className="w-full max-w-lg space-y-4 rounded-3xl border border-rose-500/20 bg-slate-950 p-5 text-white shadow-2xl sm:p-6">
            <div><p className="text-[10px] font-black uppercase tracking-[0.22em] text-rose-400">Control financiero</p><h3 className="mt-1 text-xl font-black">Anular pago #{pagoParaAnular.idPago}</h3><p className="mt-2 text-sm text-slate-400">El monto {dinero(pagoParaAnular.monto)} dejará de contar como abono y el saldo pendiente aumentará por ese importe. El registro original se conservará.</p></div>
            <label className="block space-y-2"><span className="text-sm font-bold text-slate-200">Motivo de anulación <span className="text-rose-400">*</span></span><textarea value={motivoAnulacion} onChange={(e) => { setMotivoAnulacion(e.target.value); setErrorAnulacion(""); }} maxLength={500} rows={4} required minLength={5} placeholder="Ej. Se registró un monto incorrecto; se creará un nuevo pago con el valor correcto." className="w-full resize-y rounded-xl border border-white/10 bg-slate-900 p-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-rose-400/60 focus:ring-2 focus:ring-rose-400/10" /><span className="block text-right text-xs text-slate-500">{motivoAnulacion.length}/500</span></label>
            {errorAnulacion && <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-300">{errorAnulacion}</p>}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" disabled={guardandoAnulacion} onClick={cerrarModalAnulacion} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/5 disabled:opacity-50">Cancelar</button><button type="submit" disabled={guardandoAnulacion || motivoAnulacion.trim().length < 5} className="rounded-xl bg-rose-500 px-4 py-3 text-sm font-black text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50">{guardandoAnulacion ? "Guardando..." : "Confirmar anulación"}</button></div>
          </form>
        </div>
      )}


    </section>

  );

}

export default Pagos;
