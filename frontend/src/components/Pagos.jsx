import { useMemo, useState } from "react";

function Pagos({
  datos,
  formatearMoneda,
  abrirNuevoPago,
  abrirEditarPago,
  eliminarPago,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const pagos = Array.isArray(datos?.pagos) ? datos.pagos : [];
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

    return Number.isFinite(numero) ? numero : 0;
  };

  const obtenerIdCliente = (alquiler) => {
    const valor =
      alquiler?.idCliente ??
      alquiler?.cliente?.idCliente;

    const numero = Number(valor);

    return Number.isFinite(numero) ? numero : 0;
  };

  const obtenerIdVehiculo = (alquiler) => {
    const valor =
      alquiler?.idVehiculo ??
      alquiler?.vehiculo?.idVehiculo;

    const numero = Number(valor);

    return Number.isFinite(numero) ? numero : 0;
  };

  const obtenerAlquiler = (pago) => {
    const idAlquiler = obtenerIdAlquiler(pago);

    return (
      alquileres.find(
        (alquiler) =>
          Number(alquiler?.idAlquiler) === idAlquiler
      ) || null
    );
  };

  const obtenerCliente = (pago) => {
    const alquiler = obtenerAlquiler(pago);

    if (alquiler?.cliente?.nombre) {
      return alquiler.cliente;
    }

    const idCliente = obtenerIdCliente(alquiler);

    if (idCliente) {
      return (
        clientes.find(
          (cliente) =>
            Number(cliente?.idCliente) === idCliente
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

    const idVehiculo = obtenerIdVehiculo(alquiler);

    if (idVehiculo) {
      return (
        vehiculos.find(
          (vehiculo) =>
            Number(vehiculo?.idVehiculo) === idVehiculo
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

    return cliente?.nombre || "Cliente no disponible";
  };

  const obtenerNombreVehiculo = (pago) => {
    const vehiculo = obtenerVehiculo(pago);

    if (!vehiculo) {
      return "Vehículo no disponible";
    }

    const nombre =
      `${vehiculo?.marca || ""} ${vehiculo?.modelo || ""}`.trim();

    return nombre || "Vehículo no disponible";
  };

  const obtenerPlacaVehiculo = (pago) => {
    const vehiculo = obtenerVehiculo(pago);

    return vehiculo?.placa || "Sin placa";
  };

  const obtenerResumen = (idAlquiler) => {
    const alquiler = alquileres.find(
      (item) =>
        Number(item?.idAlquiler) === Number(idAlquiler)
    );

    const total = Number(alquiler?.total || 0);

    const pagosDelAlquiler = pagos.filter((pago) => {
      const mismoAlquiler =
        Number(obtenerIdAlquiler(pago)) ===
        Number(idAlquiler);

      const activo =
        pago?.estado === undefined ||
        pago?.estado === true;

      return mismoAlquiler && activo;
    });

    const totalPagado = pagosDelAlquiler.reduce(
      (suma, pago) =>
        suma + Number(pago?.monto || 0),
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
    if (!fecha) return "Sin fecha";

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
        const idAlquiler = obtenerIdAlquiler(pago);
        const resumen = obtenerResumen(idAlquiler);

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

    return pagosProcesados.filter((item) => {
      const coincideBusqueda =
        texto === "" ||
        String(item?.pago?.idPago ?? "")
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
        String(item?.pago?.formaPago ?? "")
          .toLowerCase()
          .includes(texto);

      const coincideEstado =
        filtroEstado === "todos" ||
        item.estado === filtroEstado;

      return (
        coincideBusqueda &&
        coincideEstado
      );
    });
  }, [
    pagosProcesados,
    busqueda,
    filtroEstado,
  ]);

  // =========================================================
  // RESUMEN GENERAL
  // =========================================================

  const resumenGeneral = useMemo(() => {
  const totalPagos = pagosProcesados.length;

  const totalCobrado = pagosProcesados.reduce(
    (suma, item) => suma + Number(item?.pago?.monto || 0),
    0
  );

  // =========================================================
  // SALDO PENDIENTE
  // Incluye todos los alquileres activos,
  // incluso aquellos que todavía no tienen pagos.
  // =========================================================
  const idsAlquilerActivos = [
    ...new Set(
      alquileres
        .filter((alquiler) => alquiler?.estado !== false)
        .map((alquiler) => Number(alquiler?.idAlquiler))
        .filter((id) => id > 0)
    ),
  ];

  let pendiente = 0;

  idsAlquilerActivos.forEach((id) => {
    const resumen = obtenerResumen(id);
    pendiente += resumen.restante;
  });

  // =========================================================
  // ALQUILERES PAGADOS
  // Se cuentan según los pagos que realmente están
  // marcados como PAGADO.
  // =========================================================
  const alquileresPagados = new Set(
    pagosProcesados
      .filter((item) => item.estado === "PAGADO")
      .map((item) => Number(item.idAlquiler))
      .filter((id) => id > 0)
  );

  const pagados = alquileresPagados.size;

  return {
    totalPagos,
    totalCobrado,
    pendiente,
    pagados,
  };
}, [pagosProcesados, alquileres]
);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <section className="space-y-8">

      {/* ENCABEZADO */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-sky-400">
            Gestión financiera
          </span>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Pagos
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Control de abonos, saldos y pagos de alquileres.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirNuevoPago}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 hover:shadow-sky-500/30"
        >
          <span className="text-lg">+</span>
          Registrar abono
        </button>

      </div>

      {/* RESUMEN */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* PAGOS */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl transition hover:-translate-y-1 hover:border-sky-400/30">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pagos registrados
              </p>

              <p className="mt-2 text-3xl font-black text-white">
                {resumenGeneral.totalPagos}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-xl">
              💳
            </div>

          </div>

        </div>

        {/* TOTAL COBRADO */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-xl transition hover:-translate-y-1 hover:border-emerald-400/30">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Total cobrado
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                {dinero(resumenGeneral.totalCobrado)}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-xl text-emerald-400">
              ✓
            </div>

          </div>

        </div>

        {/* SALDO PENDIENTE */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 shadow-xl transition hover:-translate-y-1 hover:border-amber-400/30">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Saldo pendiente
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                {dinero(resumenGeneral.pendiente)}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-xl">
              ⏳
            </div>

          </div>

        </div>

        {/* ALQUILERES PAGADOS */}
        <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5 shadow-xl transition hover:-translate-y-1 hover:border-sky-400/30">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Alquileres pagados
              </p>

              <p className="mt-2 text-3xl font-black text-white">
                {resumenGeneral.pagados}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-xl">
              ✓
            </div>

          </div>

        </div>

      </div>

      {/* BUSCADOR Y FILTRO */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-xl">

        <div className="flex flex-col gap-4 lg:flex-row">

          <div className="relative flex-1">

            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              🔎
            </span>

            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar pago, alquiler, cliente, vehículo..."
              className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm font-medium text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />

          </div>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-bold text-slate-300 outline-none transition focus:border-sky-400"
          >
            <option value="todos">Todos los estados</option>
            <option value="PAGADO">Pagados</option>
            <option value="PENDIENTE">Pendientes</option>
          </select>

        </div>

      </div>

      {/* LISTADO */}
      {pagosFiltrados.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 px-6 py-16 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-2xl">
            💳
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

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

          {pagosFiltrados.map((item, indice) => {

            const pago = item.pago;
            const resumen = item.resumen;
            const pagado = item.estado === "PAGADO";

            const porcentaje = pagado
  ? 100
  : Math.max(
      0,
      Math.min(Number(resumen.porcentaje) || 0, 100)
    );
    

            return (

              <article
                key={
                  pago?.idPago ??
                  `${item.idAlquiler}-${indice}`
                }
                className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:shadow-2xl"
              >

                {/* CABECERA */}
                <div className="flex items-center justify-between border-b border-white/10 bg-slate-950 p-5">

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                      Pago #{pago?.idPago ?? "—"}
                    </p>

                    <h2 className="mt-1 text-xl font-black text-white">
                      ALQUILER #{item.idAlquiler || "—"}
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
                          {dinero(resumen.total)}
                        </p>

                      </div>

                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3">

                        <p className="text-[10px] font-black uppercase tracking-wide text-emerald-500">
                          Abonado
                        </p>

                        <p className="mt-1 text-sm font-black text-emerald-300">
                          {dinero(resumen.totalPagado)}
                        </p>

                      </div>

                      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3">

                        <p className="text-[10px] font-black uppercase tracking-wide text-amber-500">
                          Restante
                        </p>

                        <p className="mt-1 text-sm font-black text-amber-300">
                          {dinero(resumen.restante)}
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
                          {Math.round(porcentaje)}%
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
                        {formatearFecha(pago?.fechaPago)}
                      </p>

                    </div>

                    <div>

                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                        Forma de pago
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-300">
                        {pago?.formaPago || "No especificada"}
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
                          {dinero(pago?.monto)}
                        </p>

                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-xl">
                        💵
                      </div>

                    </div>

                  </div>

                  {/* ACCIONES */}
                  <div className="flex flex-col gap-2 border-t border-white/5 pt-4 sm:flex-row">

                    <button
                      type="button"
                      onClick={() =>
                        abrirEditarPago(pago)
                      }
                      className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-sky-500/40 hover:text-sky-400"
                    >
                      ✏️ Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        eliminarPago(pago.idPago)
                      }
                      className="flex-1 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/10"
                    >
                      Anular
                    </button>

                  </div>

                </div>

              </article>

            );
          })}

        </div>

      )}

    </section>
  );
}

export default Pagos;
