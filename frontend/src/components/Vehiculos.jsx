function Vehiculos({
  datos,
  formatearMoneda,
  abrirNuevoVehiculo,
  abrirEditarVehiculo,
  eliminarVehiculo,
  busquedaVehiculos,
  setBusquedaVehiculos,
  filtroVehiculos,
  setFiltroVehiculos,
}) {

  // ==========================================
  // SABER SI UN VEHÍCULO ESTÁ ALQUILADO
  // ==========================================
  const vehiculoEstaAlquilado = (vehiculo) => {
    return datos.alquileres.some((alquiler) => {
      const idVehiculoAlquiler =
        alquiler.idVehiculo ??
        alquiler.vehiculo?.idVehiculo;

      return (
        Number(idVehiculoAlquiler) === Number(vehiculo.idVehiculo) &&
        alquiler.estado === true
      );
    });
  };

  // ==========================================
  // FILTRAR VEHÍCULOS
  // ==========================================
  const vehiculosFiltrados = datos.vehiculos.filter((vehiculo) => {
    const texto = busquedaVehiculos.toLowerCase();

    const coincideBusqueda =
      vehiculo.placa?.toLowerCase().includes(texto) ||
      vehiculo.marca?.toLowerCase().includes(texto) ||
      vehiculo.modelo?.toLowerCase().includes(texto) ||
      vehiculo.color?.toLowerCase().includes(texto) ||
      vehiculo.tipo?.toLowerCase().includes(texto);

    const alquilado = vehiculoEstaAlquilado(vehiculo);
    const disponible = !alquilado;

    let coincideFiltro = true;

    if (filtroVehiculos === "disponible") {
      coincideFiltro = disponible;
    }

    if (filtroVehiculos === "alquilado") {
      coincideFiltro = alquilado;
    }

    return coincideBusqueda && coincideFiltro;
  });

  return (
    <section className="space-y-8">

      {/* ==========================================
          ENCABEZADO
      ========================================== */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-sky-400">
            Administración
          </span>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Vehículos
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Gestiona la flota disponible para alquiler.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirNuevoVehiculo}
          className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 hover:shadow-sky-500/30"
        >
          + Nuevo vehículo
        </button>

      </div>

      {/* ==========================================
          BUSCADOR Y FILTROS
      ========================================== */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-xl">

        <div className="flex flex-col gap-4 lg:flex-row">

          {/* BUSCADOR */}
          <div className="relative flex-1">

            <input
              type="text"
              value={busquedaVehiculos}
              onChange={(e) => setBusquedaVehiculos(e.target.value)}
              placeholder="Buscar por placa, marca, modelo, color o tipo..."
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />

          </div>

          {/* FILTROS */}
          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() => setFiltroVehiculos("todos")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                filtroVehiculos === "todos"
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                  : "border border-white/10 bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              Todos
            </button>

            <button
              type="button"
              onClick={() => setFiltroVehiculos("disponible")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                filtroVehiculos === "disponible"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "border border-white/10 bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              Disponibles
            </button>

            <button
              type="button"
              onClick={() => setFiltroVehiculos("alquilado")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                filtroVehiculos === "alquilado"
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                  : "border border-white/10 bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              Alquilados
            </button>

          </div>

        </div>

      </div>

      {/* ==========================================
          CONTADOR
      ========================================== */}
      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-400">
          Mostrando{" "}
          <span className="font-bold text-white">
            {vehiculosFiltrados.length}
          </span>{" "}
          vehículo(s)
        </p>

      </div>

      {/* ==========================================
          TARJETAS
      ========================================== */}
      {vehiculosFiltrados.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 px-6 py-16 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-3xl">
            🚗
          </div>

          <h3 className="text-lg font-bold text-white">
            No se encontraron vehículos
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Intenta cambiar la búsqueda o el filtro seleccionado.
          </p>

        </div>

      ) : (

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {vehiculosFiltrados.map((vehiculo) => {

            // ==========================================
            // ESTADO REAL DEL VEHÍCULO
            // ==========================================
            const alquilado = vehiculoEstaAlquilado(vehiculo);
            const disponible = !alquilado;

            return (
              <article
                key={vehiculo.idVehiculo}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:shadow-2xl"
              >

                {/* ==========================================
                    PARTE SUPERIOR
                ========================================== */}
                <div className="flex items-center justify-between border-b border-white/10 p-5">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-2xl">
                    🚗
                  </div>

                  <div className="flex items-center gap-2">

                    <button
                      type="button"
                      onClick={() => abrirEditarVehiculo(vehiculo)}
                      className="rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => eliminarVehiculo(vehiculo.idVehiculo)}
                      className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      Eliminar
                    </button>

                  </div>

                </div>

                {/* ==========================================
                    INFORMACIÓN
                ========================================== */}
                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {vehiculo.marca} {vehiculo.modelo}
                      </h3>

                      <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-slate-500">
                        {vehiculo.placa}
                      </p>
                    </div>

                    {/* ESTADO REAL */}
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        disponible
                          ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                          : "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20"
                      }`}
                    >
                      {disponible ? "DISPONIBLE" : "ALQUILADO"}
                    </span>

                  </div>

                  {/* ==========================================
                      DETALLES
                  ========================================== */}
                  <div className="mt-5 space-y-3">

                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        COLOR:
                      </span>

                      <span className="text-sm font-semibold text-slate-200">
                        {vehiculo.color || "No especificado"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        TIPO:
                      </span>

                      <span className="text-sm font-semibold text-slate-200">
                        {vehiculo.tipo || "No especificado"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        PRECIO / DÍA:
                      </span>

                      <span className="text-lg font-bold text-sky-400">
                        {formatearMoneda(vehiculo.precioDia)}
                      </span>
                    </div>

                  </div>

                </div>

                {/* ==========================================
                    PIE DE TARJETA
                ========================================== */}
                <div
                  className={`px-5 py-3 text-center text-xs font-bold uppercase tracking-wider ${
                    disponible
                      ? "bg-emerald-500/5 text-emerald-400"
                      : "bg-amber-500/5 text-amber-400"
                  }`}
                >
                  {disponible
                    ? "Vehículo disponible para alquiler"
                    : "Vehículo actualmente alquilado"}
                </div>

              </article>
            );
          })}

        </div>

      )}

    </section>
  );
}

export default Vehiculos;
