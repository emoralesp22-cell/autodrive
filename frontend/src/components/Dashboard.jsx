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

  const vehiculosDisponibles = vehiculos.length;

  const alquileresActivos = alquileres.filter(
    (alquiler) => alquiler.estado !== false
  ).length;

  const totalPagado = pagos.reduce(
    (total, pago) => total + Number(pago.monto || 0),
    0
  );

  const totalAlquileres = alquileres.reduce(
    (total, alquiler) => total + Number(alquiler.total || 0),
    0
  );

  const pendiente = Math.max(totalAlquileres - totalPagado, 0);

  const alquileresRecientes = [...alquileres]
    .sort((a, b) => {
      const fechaA = new Date(a.fechaInicio || 0);
      const fechaB = new Date(b.fechaInicio || 0);
      return fechaB - fechaA;
    })
    .slice(0, 5);

  const obtenerEstadoAlquiler = (alquiler) => {
    const pagosAlquiler = pagos.filter(
      (pago) => Number(pago.idAlquiler) === Number(alquiler.idAlquiler)
    );

    const pagado = pagosAlquiler.reduce(
      (total, pago) => total + Number(pago.monto || 0),
      0
    );

    const total = Number(alquiler.total || 0);

    if (pagado >= total && total > 0) {
      return "PAGADO";
    }

    if (pagado > 0) {
      return "ABONO";
    }

    return "ACTIVO";
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
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl">

          <div className="flex items-center justify-between border-b border-white/10 p-5">

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                ACTIVIDAD
              </p>

              <h2 className="mt-1 text-xl font-black">
                Alquileres recientes
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setSeccion("alquileres")}
              className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-300 transition hover:bg-cyan-400/20"
            >
              Ver todos →
            </button>
          </div>

          <div className="divide-y divide-white/5">

            {alquileresRecientes.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl">📋</div>
                <p className="mt-3 font-semibold text-slate-300">
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
                    className="flex flex-col gap-4 p-5 transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="min-w-0">

                      <p className="truncate font-bold text-white">
                        {obtenerNombreCliente(alquiler.idCliente)}
                      </p>

                      <p className="mt-1 truncate text-sm text-slate-400">
                        {obtenerNombreVehiculo(alquiler.idVehiculo)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {obtenerDescripcionAlquiler
                          ? obtenerDescripcionAlquiler(alquiler)
                          : `Alquiler #${alquiler.idAlquiler}`}
                      </p>

                    </div>

                    <div className="flex shrink-0 items-center gap-3">

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black tracking-wider ${
                          estado === "PAGADO"
                            ? "bg-emerald-400/10 text-emerald-300"
                            : estado === "ABONO"
                            ? "bg-amber-400/10 text-amber-300"
                            : "bg-cyan-400/10 text-cyan-300"
                        }`}
                      >
                        {estado}
                      </span>

                      <span className="font-bold text-white">
                        {formatearMoneda(alquiler.total || 0)}
                      </span>

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
