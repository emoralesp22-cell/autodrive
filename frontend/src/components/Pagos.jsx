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

    default:
      return null;
  }
}

function Pagos({
  datos,
  formatearMoneda,
  abrirNuevoPago,
  abrirEditarPago,
  eliminarPago,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const pagos = Array.isArray(datos?.pagos)
    ? datos.pagos
    : [];

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

    return (
      cliente?.nombre ||
      "Cliente no disponible"
    );
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

        const activo =
          pago?.estado === undefined ||
          pago?.estado === true;

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
  // =========================================================
  // DATOS PROCESADOS
  // =========================================================

  const pagosProcesados = useMemo(() => {
    return pagos
      .filter(
        (pago) =>
          pago?.estado === undefined ||
          pago?.estado === true
      )
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
          estado: resumen.pagado
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

  // =========================================================
  // RESUMEN GENERAL
  // =========================================================

  const resumenGeneral = useMemo(() => {
    const totalPagos =
      pagosProcesados.length;

    const totalCobrado =
      pagosProcesados.reduce(
        (suma, item) =>
          suma +
          Number(item?.pago?.monto || 0),
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

    const alquileresPagados =
      new Set(
        pagosProcesados
          .filter(
            (item) =>
              item.estado === "PAGADO"
          )
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
   <section className="space-y-3 rounded-3xl border border-white/10 bg-slate-950 p-3 text-white shadow-2xl sm:space-y-5 sm:p-6">

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
          <div className="grid grid-cols-3 gap-2 sm:hidden">

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
          </select>

        </div>

      </div>

      {/* LISTADO */}
      {pagosFiltrados.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 px-6 py-16 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-sky-400">
            <Icono
              tipo="credit-card"
              className="h-8 w-8"
            />
          </div>

          <h3 className="mt-4 text-lg font-bold text-white">
            No hay pagos para mostrar
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {busqueda
              ? "Prueba con otro término de búsqueda."
              : "Todavía no se han registrado abonos."}
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-2 gap-3 md:grid-cols-1 xl:grid-cols-2 xl:gap-5">

          {pagosFiltrados.map(
            (item, indice) => {

              const pago = item.pago;
              const resumen = item.resumen;
              const pagado =
                item.estado === "PAGADO";

              const porcentaje = pagado
                ? 100
                : Math.max(
                    0,
                    Math.min(
                      Number(
                        resumen.porcentaje
                      ) || 0,
                      100
                    )
                  );

              return (
                <article
                  key={
                    pago?.idPago ??
                    `${item.idAlquiler}-${indice}`
                  }
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:shadow-2xl"
                >

                  {/* =====================================================
                      VISTA MÓVIL
                      ===================================================== */}
                  <div className="md:hidden">

                    {/* CABECERA */}
                    <div className="border-b border-white/10 bg-slate-950 p-3">

                      <div className="flex items-start justify-between gap-1">

                        <div className="min-w-0">

                          <p className="text-[8px] font-black uppercase tracking-wider text-slate-600">
                            Pago #
                            {pago?.idPago ?? "—"}
                          </p>

                          <h2 className="mt-1 truncate text-xs font-black text-white">
                            Alquiler #
                            {item.idAlquiler || "—"}
                          </h2>

                        </div>

                        <span
                          className={
                            pagado
                              ? "shrink-0 rounded-full bg-emerald-500/15 px-2 py-1 text-[7px] font-black uppercase text-emerald-400 ring-1 ring-emerald-500/20"
                              : "shrink-0 rounded-full bg-amber-500/15 px-2 py-1 text-[7px] font-black uppercase text-amber-400 ring-1 ring-amber-500/20"
                          }
                        >
                          {item.estado}
                        </span>

                      </div>

                    </div>

                    {/* CONTENIDO */}
                    <div className="space-y-2.5 p-3">

                      {/* CLIENTE */}
                      <div className="rounded-xl border border-white/10 bg-slate-950 p-2.5">

                        <p className="text-[7px] font-black uppercase tracking-wider text-slate-600">
                          Cliente
                        </p>

                        <p className="mt-1 truncate text-[10px] font-black text-slate-200">
                          {item.cliente}
                        </p>

                      </div>

                      {/* VEHÍCULO */}
                      <div className="rounded-xl border border-white/10 bg-slate-950 p-2.5">

                        <p className="text-[7px] font-black uppercase tracking-wider text-slate-600">
                          Vehículo
                        </p>

                        <p className="mt-1 truncate text-[10px] font-black text-slate-200">
                          {item.vehiculo}
                        </p>

                        <p className="mt-0.5 truncate text-[8px] font-bold text-slate-500">
                          {item.placa}
                        </p>

                      </div>

                      {/* ABONADO */}
                      <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-2.5">

                        <p className="text-[7px] font-black uppercase tracking-wider text-sky-400">
                          Abonado
                        </p>

                        <p className="mt-1 whitespace-nowrap text-sm font-black text-white">
                          {dinero(pago?.monto)}
                        </p>

                      </div>

                      {/* PROGRESO */}
                      <div>

                        <div className="mb-1.5 flex items-center justify-between">

                          <span className="text-[7px] font-bold text-slate-500">
                            Progreso
                          </span>

                          <span className="text-[8px] font-black text-slate-300">
                            {Math.round(
                              porcentaje
                            )}
                            %
                          </span>

                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                          <div
                            className={
                              pagado
                                ? "h-full rounded-full bg-emerald-500 transition-all duration-500"
                                : "h-full rounded-full bg-amber-500 transition-all duration-500"
                            }
                            style={{
                              width: `${porcentaje}%`,
                            }}
                          />

                        </div>

                      </div>

                      {/* TOTAL / RESTANTE */}
                      <div className="grid grid-cols-2 gap-1.5">

                        <div className="min-w-0 rounded-lg border border-white/10 bg-slate-950 p-2">

                          <p className="text-[7px] font-black uppercase text-slate-600">
                            Total
                          </p>

                          <p className="mt-1 whitespace-nowrap text-[9px] font-black text-white">
                            {dinero(
                              resumen.total
                            )}
                          </p>

                        </div>

                        <div className="min-w-0 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2">

                          <p className="text-[7px] font-black uppercase text-amber-500">
                            Restante
                          </p>

                          <p className="mt-1 whitespace-nowrap text-[9px] font-black text-amber-300">
                            {dinero(
                              resumen.restante
                            )}
                          </p>

                        </div>

                      </div>

                      {/* FECHA */}
                      <div className="border-t border-white/5 pt-2">

                        <p className="text-[7px] font-black uppercase tracking-wider text-slate-600">
                          Fecha
                        </p>

                        <p className="mt-1 text-[9px] font-bold text-slate-300">
                          {formatearFecha(
                            pago?.fechaPago
                          )}
                        </p>

                      </div>

                      {/* ACCIONES */}
                      <div className="grid grid-cols-2 gap-2 pt-1">

                        <button
                          type="button"
                          onClick={() =>
                            abrirEditarPago(
                              pago
                            )
                          }
                          className="flex items-center justify-center rounded-xl border border-white/10 bg-slate-950 py-2.5 text-slate-300 transition hover:border-sky-500/40 hover:text-sky-400"
                          title="Editar pago"
                        >
                          <Icono
                            tipo="pencil"
                            className="h-4 w-4"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            eliminarPago(
                              pago.idPago
                            )
                          }
                          className="flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 py-2.5 text-red-400 transition hover:bg-red-500/10"
                          title="Anular pago"
                        >
                          <Icono
                            tipo="trash"
                            className="h-4 w-4"
                          />
                        </button>

                      </div>

                    </div>

                  </div>

                  {/* =====================================================
                      VISTA DESKTOP
                      ===================================================== */}
                  <div className="hidden md:block">

                    {/* CABECERA */}
                    <div className="flex items-center justify-between border-b border-white/10 bg-slate-950 p-5">

                      <div>

                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                          Pago #
                          {pago?.idPago ?? "—"}
                        </p>

                        <h2 className="mt-1 text-xl font-black text-white">
                          ALQUILER #
                          {item.idAlquiler || "—"}
                        </h2>

                      </div>

                      <span
                        className={
                          pagado
                            ? "rounded-full bg-emerald-500/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-500/20"
                            : "rounded-full bg-amber-500/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400 ring-1 ring-amber-500/20"
                        }
                      >
                        {item.estado}
                      </span>

                    </div>

                    <div className="space-y-5 p-5">

                      {/* CLIENTE / VEHÍCULO */}
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">

                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                            Cliente
                          </p>

                          <p className="mt-1 text-sm font-black text-slate-200">
                            {item.cliente}
                          </p>

                        </div>

                        <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">

                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                            Vehículo
                          </p>

                          <p className="mt-1 text-sm font-black text-slate-200">
                            {item.vehiculo}
                          </p>

                          <p className="mt-0.5 text-xs font-bold text-slate-500">
                            {item.placa}
                          </p>

                        </div>

                      </div>

                      {/* RESUMEN FINANCIERO */}
                      <div>

                        <div className="grid grid-cols-3 gap-2">

                          <div className="rounded-2xl border border-white/10 bg-slate-950 p-3">

                            <p className="text-[10px] font-black uppercase tracking-wide text-slate-600">
                              Total
                            </p>

                            <p className="mt-1 text-sm font-black text-white">
                              {dinero(
                                resumen.total
                              )}
                            </p>

                          </div>

                          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3">

                            <p className="text-[10px] font-black uppercase tracking-wide text-emerald-500">
                              Abonado
                            </p>

                            <p className="mt-1 text-sm font-black text-emerald-300">
                              {dinero(
                                resumen.totalPagado
                              )}
                            </p>

                          </div>

                          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3">

                            <p className="text-[10px] font-black uppercase tracking-wide text-amber-500">
                              Restante
                            </p>

                            <p className="mt-1 text-sm font-black text-amber-300">
                              {dinero(
                                resumen.restante
                              )}
                            </p>

                          </div>

                        </div>

                        {/* PROGRESO */}
                        <div className="mt-4">

                          <div className="mb-2 flex items-center justify-between">

                            <span className="text-xs font-bold text-slate-500">
                              Progreso del pago
                            </span>

                            <span className="text-xs font-black text-slate-300">
                              {Math.round(
                                porcentaje
                              )}
                              %
                            </span>

                          </div>

                          <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">

                            <div
                              className={
                                pagado
                                  ? "h-full rounded-full bg-emerald-500 transition-all duration-500"
                                  : "h-full rounded-full bg-amber-500 transition-all duration-500"
                              }
                              style={{
                                width: `${porcentaje}%`,
                              }}
                            />

                          </div>

                        </div>

                      </div>

                      {/* DATOS DEL ABONO */}
                      <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">

                        <div>

                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                            Fecha
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-300">
                            {formatearFecha(
                              pago?.fechaPago
                            )}
                          </p>

                        </div>

                        <div>

                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                            Forma de pago
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-300">
                            {pago?.formaPago ||
                              "No especificada"}
                          </p>

                        </div>

                      </div>

                      {/* ABONO REGISTRADO */}
                      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4">

                        <div className="flex items-center justify-between">

                          <div>

                            <p className="text-[10px] font-black uppercase tracking-wider text-sky-400">
                              Abono registrado
                            </p>

                            <p className="mt-1 text-2xl font-black text-white">
                              {dinero(
                                pago?.monto
                              )}
                            </p>

                          </div>

                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                            <Icono
                              tipo="banknote"
                              className="h-6 w-6"
                            />
                          </div>

                        </div>

                      </div>

                      {/* ACCIONES */}
                      <div className="flex flex-col gap-2 border-t border-white/5 pt-4 sm:flex-row">

                        <button
                          type="button"
                          onClick={() =>
                            abrirEditarPago(
                              pago
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-sky-500/40 hover:text-sky-400"
                        >
                          <Icono
                            tipo="pencil"
                            className="h-4 w-4"
                          />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            eliminarPago(
                              pago.idPago
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/10"
                        >
                          <Icono
                            tipo="trash"
                            className="h-4 w-4"
                          />
                          Anular
                        </button>

                      </div>

                    </div>

                  </div>

                </article>
              );
            }
          )}

        </div>

      )}

    </section>
  );
}

export default Pagos;
