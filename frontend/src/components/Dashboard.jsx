function Dashboard({
  datos,
  logo,
  setSeccion,
  formatearMoneda,
  obtenerNombreCliente,
  obtenerNombreVehiculo,
  obtenerDescripcionAlquiler
}) {
  const vehiculos = datos?.vehiculos || [];
  const clientes = (datos?.clientes || []).filter(
  (cliente) => cliente.estado === true
);
  const alquileres = datos?.alquileres || [];
  const pagos = datos?.pagos || [];

  // ==========================================
  // VEHÍCULOS DISPONIBLES
  // ==========================================
  const vehiculosDisponibles = vehiculos.filter((vehiculo) => {
    const alquilado = alquileres.some((alquiler) => {
      return (
        Number(alquiler.idVehiculo) === Number(vehiculo.idVehiculo) &&
        alquiler.estado === true
      );
    });

    return !alquilado;
  }).length;

  // ==========================================
  // ALQUILERES ACTIVOS
  // ==========================================
  const alquileresActivos = alquileres.filter(
    (alquiler) => alquiler.estado !== false
  ).length;

  // ==========================================
  // TOTAL PAGADO
  // ==========================================
  const totalPagado = pagos.reduce(
    (total, pago) => total + Number(pago.monto || 0),
    0
  );

  // ==========================================
  // SALDO PENDIENTE
  // ==========================================
  const pendiente = alquileres
    .filter((alquiler) => alquiler.estado !== false)
    .reduce((total, alquiler) => {
      const pagosAlquiler = pagos.filter(
        (pago) =>
          Number(pago.idAlquiler) === Number(alquiler.idAlquiler)
      );

      const abonado = pagosAlquiler.reduce(
        (suma, pago) => suma + Number(pago.monto || 0),
        0
      );

      const totalAlquiler = Number(alquiler.total || 0);

      return total + Math.max(totalAlquiler - abonado, 0);
    }, 0);

  // ==========================================
  // ALQUILERES RECIENTES
  // ==========================================
  const alquileresRecientes = [...alquileres]
    .sort((a, b) => {
      const fechaA = new Date(a.fechaInicio || 0);
      const fechaB = new Date(b.fechaInicio || 0);
      return fechaB - fechaA;
    })
    .slice(0, 5);

  // ==========================================
  // ESTADO DEL ALQUILER
  // ==========================================
  const obtenerEstadoAlquiler = (alquiler) => {
    const pagosAlquiler = pagos.filter(
      (pago) =>
        Number(pago.idAlquiler) === Number(alquiler.idAlquiler)
    );

    const pagado = pagosAlquiler.reduce(
      (total, pago) =>
        total + Number(pago.monto || 0),
      0
    );

    const total = Number(alquiler.total || 0);

    return pagado >= total && total > 0
      ? "PAGADO"
      : "PENDIENTE";
  };

  // ==========================================
  // TARJETAS DE ESTADÍSTICAS
  // ==========================================
  const tarjeta = (
    titulo,
    valor,
    icono,
    descripcion,
    seccion
  ) => (
    <button
      type="button"
      onClick={() => setSeccion(seccion)}
      className="group rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-left shadow-lg backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-slate-900 sm:p-5"
    >
      <div className="flex items-start justify-between">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-lg sm:h-12 sm:w-12 sm:rounded-xl sm:text-2xl">
          {icono}
        </div>

        <span className="text-sm text-slate-500 transition group-hover:text-cyan-300 sm:text-base">
          →
        </span>

      </div>

      <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 sm:mt-5 sm:text-xs">
        {titulo}
      </p>

      <p className="mt-1 text-xl font-black text-white sm:text-3xl">
        {valor}
      </p>

      <p className="mt-1 text-[9px] text-slate-500 sm:mt-2 sm:text-xs">
        {descripcion}
      </p>

    </button>
  );

  return (
   <main className="min-h-screen overflow-hidden rounded-3xl bg-slate-950 p-2.5 text-white sm:p-6 lg:p-8">

      {/* ==========================================
          ENCABEZADO
      ========================================== */}

      <section className="relative mb-4 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 p-3.5 shadow-2xl sm:mb-6 sm:p-8">

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="absolute -bottom-20 left-20 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative flex items-center justify-between gap-3 sm:gap-6">

          <div className="min-w-0">

            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300 sm:mb-2 sm:text-xs sm:tracking-[0.3em]">
              PANEL PRINCIPAL
            </p>

            <h1 className="text-xl font-black leading-tight tracking-tight sm:text-4xl">
              Bienvenido a AutoDrive
            </h1>

            <p className="mt-1.5 max-w-2xl text-[10px] leading-4 text-slate-300 sm:mt-3 sm:text-sm sm:leading-6">
              Administra vehículos, clientes, alquileres, pagos y usuarios
              desde un solo lugar.
            </p>

          </div>

          {logo && (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-950/60 p-1.5 shadow-xl sm:h-28 sm:w-28 sm:rounded-2xl sm:p-2">

              <img
                src={logo}
                alt="AutoDrive"
                className="h-full w-full rounded-lg object-contain sm:rounded-xl"
              />

            </div>
          )}

        </div>

      </section>

      {/* ==========================================
          ESTADÍSTICAS
      ========================================== */}

      <section className="mb-4 grid grid-cols-2 gap-2.5 sm:mb-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">

        {tarjeta(
          "Disponibles",
          vehiculosDisponibles,
          "🚗",
          "Vehículos registrados",
          "vehiculos"
        )}

        {tarjeta(
          "Alquileres activos",
          alquileresActivos,
          "👤",
          "Alquileres en proceso",
          "alquileres"
        )}

        {tarjeta(
          "Pagado",
          formatearMoneda(totalPagado),
          "💳",
          "Total recibido",
          "pagos"
        )}

        {tarjeta(
          "Pendiente",
          formatearMoneda(pendiente),
          "💰",
          "Saldo por cobrar",
          "pagos"
        )}

      </section>

      {/* ==========================================
          CONTENIDO PRINCIPAL
      ========================================== */}

      <section className="grid grid-cols-1 gap-3 sm:gap-6 xl:grid-cols-2">

        {/* ==========================================
            ALQUILERES RECIENTES
        ========================================== */}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl">

          {/* ENCABEZADO */}

          <div className="flex flex-col gap-2.5 border-b border-white/10 bg-slate-950/50 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-5">

            <div>

              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-300 sm:text-xs">
                ACTIVIDAD
              </p>

              <h2 className="mt-1 text-base font-black text-white sm:text-xl">
                Alquileres recientes
              </h2>

              <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                Últimas operaciones registradas
              </p>

            </div>

            <button
              type="button"
              onClick={() => setSeccion("alquileres")}
              className="self-start rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-black text-cyan-300 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-400/20 sm:self-auto sm:px-4 sm:py-2 sm:text-xs"
            >
              Ver todos →
            </button>

          </div>

          {/* LISTA */}

          <div className="divide-y divide-white/5">

            {alquileresRecientes.length === 0 ? (

              <div className="p-7 text-center sm:p-10">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-xl sm:h-14 sm:w-14 sm:text-2xl">
                  📋
                </div>

                <p className="mt-4 text-sm font-bold text-slate-300">
                  No hay alquileres registrados
                </p>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Los alquileres aparecerán aquí.
                </p>

              </div>

            ) : (

              alquileresRecientes.map((alquiler) => {

                const estado = obtenerEstadoAlquiler(alquiler);

                return (
                  <div
                    key={alquiler.idAlquiler}
                    className="group flex flex-col gap-2 p-3 transition duration-300 hover:bg-white/[0.035] sm:gap-4 sm:p-5 md:flex-row md:items-center md:justify-between"
                  >

                    {/* INFORMACIÓN */}

                    <div className="min-w-0">

                      <div className="flex items-center gap-2.5 md:gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/10 text-sm md:h-10 md:w-10 md:rounded-xl md:text-lg">
                          👤
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-xs font-black text-white sm:text-base">
                            {obtenerNombreCliente(alquiler.idCliente)}
                          </p>

                          <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-400 sm:text-sm">
                            {obtenerNombreVehiculo(alquiler.idVehiculo)}
                          </p>

                        </div>

                      </div>

                      <div className="mt-2 flex items-center gap-2 md:mt-3">

                        <span className="rounded-lg border border-white/5 bg-slate-950 px-2 py-1 text-[9px] font-bold text-slate-500 sm:text-[10px]">
                          #{alquiler.idAlquiler}
                        </span>

                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 sm:text-[10px]">
                          Alquiler
                        </span>

                      </div>

                    </div>

                    {/* ESTADO Y TOTAL */}

                    <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-4">

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">

                        <span className="rounded-full border border-emerald-400/10 bg-emerald-400/10 px-2 py-1 text-[8px] font-black tracking-wider text-emerald-300 sm:px-3 sm:py-1.5 sm:text-[10px]">
                          ACTIVO
                        </span>

                        <span
                          className={`rounded-full border px-2 py-1 text-[8px] font-black tracking-wider sm:px-3 sm:py-1.5 sm:text-[10px] ${
                            estado === "PAGADO"
                              ? "border-emerald-400/10 bg-emerald-400/10 text-emerald-300"
                              : "border-amber-400/10 bg-amber-400/10 text-amber-300"
                          }`}
                        >
                          {estado === "PAGADO"
                            ? "PAGADO"
                            : "PENDIENTE"}
                        </span>

                      </div>

                      <div className="min-w-[80px] text-right sm:min-w-[110px]">

                        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-600 sm:text-[10px]">
                          Total
                        </p>

                        <p className="mt-0.5 text-sm font-black text-white sm:text-lg">
                          {formatearMoneda(alquiler.total || 0)}
                        </p>

                      </div>

                    </div>

                  </div>
                );

              })

            )}

          </div>

        </div>

        {/* ==========================================
            RESUMEN / ESTADO DE LA FLOTA
        ========================================== */}

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3 shadow-xl md:p-5">

          <div className="mb-4 md:mb-6">

            <p className="text-[9px] font-bold uppercase tracking-widest text-cyan-300 md:text-xs">
              RESUMEN
            </p>

            <h2 className="mt-1 text-lg font-black md:text-xl">
              Estado de la flota
            </h2>

          </div>

          <div className="space-y-2 md:space-y-4">

            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-3 md:p-5">

              <div className="flex items-center justify-between">

                <span className="text-[10px] text-slate-400 md:text-sm">
                  Vehículos registrados
                </span>

                <span className="text-lg font-black text-white md:text-2xl">
                  {vehiculos.length}
                </span>

              </div>

            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-3 md:p-5">

              <div className="flex items-center justify-between">

                <span className="text-[10px] text-slate-400 md:text-sm">
                  Clientes registrados
                </span>

                <span className="text-lg font-black text-white md:text-2xl">
                  {clientes.length}
                </span>

              </div>

            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-3 md:p-5">

              <div className="flex items-center justify-between">

                <span className="text-[10px] text-slate-400 md:text-sm">
                  Alquileres registrados
                </span>

                <span className="text-lg font-black text-white md:text-2xl">
                  {alquileres.length}
                </span>

              </div>

            </div>

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-3 md:p-5">

              <div className="flex items-center justify-between gap-2">

                <span className="text-[10px] font-semibold text-cyan-200 md:text-sm">
                  Saldo pendiente
                </span>

                <span className="text-lg font-black text-cyan-300 md:text-2xl">
                  {formatearMoneda(pendiente)}
                </span>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={() => setSeccion("vehiculos")}
            className="mt-3 w-full rounded-xl bg-cyan-400 px-4 py-2.5 text-[10px] font-black text-slate-950 transition hover:bg-cyan-300 md:mt-5 md:py-3 md:text-sm"
          >
            Administrar vehículos →
          </button>

        </div>

      </section>

    </main>
  );
}

export default Dashboard;
