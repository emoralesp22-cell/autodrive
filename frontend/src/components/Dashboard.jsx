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
  const clientes = datos?.clientes || [];
  const alquileres = datos?.alquileres || [];
  const pagos = datos?.pagos || [];

 const vehiculosDisponibles = vehiculos.filter((vehiculo) => {
  const alquilado = alquileres.some((alquiler) => {
    return (
      Number(alquiler.idVehiculo) === Number(vehiculo.idVehiculo) &&
      alquiler.estado === true
    );
  });

  return !alquilado;
}).length;


  const alquileresActivos = alquileres.filter(
    (alquiler) => alquiler.estado !== false
  ).length;

  const totalPagado = pagos.reduce(
    (total, pago) => total + Number(pago.monto || 0),
    0
  );

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
  }, 0
);

const alquileresRecientes = [...alquileres]
    .sort((a, b) => {
      const fechaA = new Date(a.fechaInicio || 0);
      const fechaB = new Date(b.fechaInicio || 0);
      return fechaB - fechaA;
    })
    .slice(0, 5);

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

  const tarjeta = (titulo, valor, icono, descripcion, seccion) => (
    <button
      type="button"
      onClick={() => setSeccion(seccion)}
      className="group rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-left shadow-lg backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-slate-900"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
          {icono}
        </div>

        <span className="text-slate-500 transition group-hover:text-cyan-300">
          →
        </span>
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-widest text-slate-400">
        {titulo}
      </p>

      <p className="mt-1 text-3xl font-black text-white">
        {valor}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {descripcion}
      </p>
    </button>
  );

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white sm:p-6 lg:p-8">

      {/* ENCABEZADO */}
      <section className="relative mb-6 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-20 left-20 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              PANEL PRINCIPAL
            </p>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Bienvenido a AutoDrive
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Administra vehículos, clientes, alquileres, pagos y usuarios
              desde un solo lugar.
            </p>
          </div>

          {logo && (
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 p-2 shadow-xl">
              <img
                src={logo}
                alt="AutoDrive"
                className="h-full w-full rounded-xl object-contain"
              />
            </div>
          )}
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

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

      {/* CONTENIDO PRINCIPAL */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* ALQUILERES RECIENTES */}
<div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl">

  {/* ENCABEZADO */}
  <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/50 p-5">

    <div>
      <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
        ACTIVIDAD
      </p>

      <h2 className="mt-1 text-xl font-black text-white">
        Alquileres recientes
      </h2>

      <p className="mt-1 text-xs text-slate-500">
        Últimas operaciones registradas
      </p>
    </div>

    <button
      type="button"
      onClick={() => setSeccion("alquileres")}
      className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black text-cyan-300 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-400/20"
    >
      Ver todos →
    </button>

  </div>

  {/* LISTA */}
  <div className="divide-y divide-white/5">

    {alquileresRecientes.length === 0 ? (

      <div className="p-10 text-center">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-2xl">
          📋
        </div>

        <p className="mt-4 font-bold text-slate-300">
          No hay alquileres registrados
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Los alquileres aparecerán aquí.
        </p>

      </div>

    ) : (

      alquileresRecientes.map((alquiler) => {

        const estado = obtenerEstadoAlquiler(alquiler);

        return (
          <div
            key={alquiler.idAlquiler}
            className="group flex flex-col gap-4 p-5 transition duration-300 hover:bg-white/[0.035] sm:flex-row sm:items-center sm:justify-between"
          >

            {/* INFORMACIÓN */}
            <div className="min-w-0">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/10 text-lg">
                  👤
                </div>

                <div className="min-w-0">

                  <p className="truncate font-black text-white">
                    {obtenerNombreCliente(alquiler.idCliente)}
                  </p>

                  <p className="mt-0.5 truncate text-sm font-semibold text-slate-400">
                    {obtenerNombreVehiculo(alquiler.idVehiculo)}
                  </p>

                </div>

              </div>

              <div className="mt-3 flex items-center gap-2">

                <span className="rounded-lg border border-white/5 bg-slate-950 px-2 py-1 text-[10px] font-bold text-slate-500">
                  #{alquiler.idAlquiler}
                </span>

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Alquiler
                </span>

              </div>

            </div>

            {/* ESTADO Y TOTAL */}
            <div className="flex items-center justify-between gap-4 sm:justify-end">

              <div className="flex flex-wrap items-center justify-end gap-2">

                {/* ESTADO DEL ALQUILER */}
                <span className="rounded-full border border-emerald-400/10 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black tracking-wider text-emerald-300">
                  ACTIVO
                </span>

                {/* ESTADO DEL PAGO */}
                <span
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-black tracking-wider ${
                    estado === "PAGADO"
                      ? "border-emerald-400/10 bg-emerald-400/10 text-emerald-300"
                      : "border-amber-400/10 bg-amber-400/10 text-amber-300"
                  }`}
                >
                  {estado === "PAGADO" ? "PAGADO" : "PENDIENTE"}
                </span>

              </div>

              <div className="min-w-[110px] text-right">

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Total
                </p>

                <p className="mt-0.5 text-lg font-black text-white">
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

        {/* RESUMEN */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">

          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
              RESUMEN
            </p>

            <h2 className="mt-1 text-xl font-black">
              Estado de la flota
            </h2>
          </div>

          <div className="space-y-4">

            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  Vehículos registrados
                </span>

                <span className="text-2xl font-black text-white">
                  {vehiculos.length}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  Clientes registrados
                </span>

                <span className="text-2xl font-black text-white">
                  {clientes.length}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  Alquileres registrados
                </span>

                <span className="text-2xl font-black text-white">
                  {alquileres.length}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-cyan-200">
                  Saldo pendiente
                </span>

                <span className="text-2xl font-black text-cyan-300">
                  {formatearMoneda(pendiente)}
                </span>
              </div>
            </div>

          </div>

          <button
            type="button"
            onClick={() => setSeccion("vehiculos")}
            className="mt-5 w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300"
          >
            Administrar vehículos →
          </button>

        </div>
      </section>

    </main>
  );
}

export default Dashboard;
