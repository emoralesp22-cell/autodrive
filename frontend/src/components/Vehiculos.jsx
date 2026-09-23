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
    <section className="min-h-full rounded-3xl bg-slate-950 p-3 text-white sm:p-6 md:rounded-none">

      <div className="mx-auto max-w-7xl space-y-5 md:space-y-6">

        {/* ==========================================
            ENCABEZADO
        ========================================== */}

        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 md:text-xs md:tracking-[0.25em]">
              Gestión
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-white md:text-3xl">
              Vehículos
            </h1>

            <p className="mt-1 text-xs text-slate-500 md:text-sm">
              Administra la flota disponible para alquiler.
            </p>

          </div>

          <button
            type="button"
            onClick={abrirNuevoVehiculo}
            className="w-full rounded-2xl bg-cyan-400 px-4 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/10 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-cyan-400/20 md:w-auto md:px-5 md:py-3"
          >
            + Registrar vehículo
          </button>

        </div>

        {/* ==========================================
            BUSCADOR Y FILTROS
        ========================================== */}

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3 shadow-xl backdrop-blur md:rounded-3xl md:p-4">

          <div className="flex flex-col gap-2 md:gap-3 lg:flex-row">

            <input
              type="text"
              value={busquedaVehiculos}
              onChange={(e) => setBusquedaVehiculos(e.target.value)}
              placeholder="Buscar por placa, marca, modelo..."
              className="w-full flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 md:rounded-2xl md:px-4 md:py-3 md:text-sm"
            />

            <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/5 bg-slate-950 p-1 md:flex md:gap-2 md:rounded-2xl">

              <button
                type="button"
                onClick={() => setFiltroVehiculos("todos")}
                className={`rounded-lg px-2 py-2 text-[10px] font-black transition duration-300 md:rounded-xl md:px-4 md:py-2.5 md:text-xs ${
                  filtroVehiculos === "todos"
                    ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/10"
                    : "text-slate-500 hover:bg-slate-900 hover:text-white"
                }`}
              >
                Todos
              </button>

              <button
                type="button"
                onClick={() => setFiltroVehiculos("disponible")}
                className={`rounded-lg px-2 py-2 text-[10px] font-black transition duration-300 md:rounded-xl md:px-4 md:py-2.5 md:text-xs ${
                  filtroVehiculos === "disponible"
                    ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/10"
                    : "text-slate-500 hover:bg-slate-900 hover:text-white"
                }`}
              >
                Disponibles
              </button>

              <button
                type="button"
                onClick={() => setFiltroVehiculos("alquilado")}
                className={`rounded-lg px-2 py-2 text-[10px] font-black transition duration-300 md:rounded-xl md:px-4 md:py-2.5 md:text-xs ${
                  filtroVehiculos === "alquilado"
                    ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/10"
                    : "text-slate-500 hover:bg-slate-900 hover:text-white"
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

          <p className="text-sm text-slate-500">
            Mostrando{" "}
            <span className="font-black text-white">
              {vehiculosFiltrados.length}
            </span>{" "}
            vehículo(s)
          </p>

        </div>

        {/* ==========================================
            VEHÍCULOS
        ========================================== */}

        {vehiculosFiltrados.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/50 px-5 py-12 text-center md:px-6 md:py-16">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-2xl md:h-16 md:w-16 md:text-3xl">
              🚗
            </div>

            <h3 className="mt-4 text-lg font-black text-white">
              No se encontraron vehículos
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Intenta cambiar la búsqueda o el filtro seleccionado.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-2 md:gap-5 xl:grid-cols-3">

            {vehiculosFiltrados.map((vehiculo) => {

              const alquilado = vehiculoEstaAlquilado(vehiculo);
              const disponible = !alquilado;

              return (

                <article
                  key={vehiculo.idVehiculo}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl backdrop-blur transition duration-300 hover:border-cyan-400/20 md:rounded-3xl md:hover:-translate-y-1 md:hover:shadow-2xl"
                >

                  {/* ==========================================
                      BOTONES
                  ========================================== */}

                  <div className="flex items-center justify-between gap-1 border-b border-white/10 bg-slate-950/40 p-2 md:p-5">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/10 text-sm md:h-11 md:w-11 md:rounded-xl md:text-xl">
                      🚗
                    </div>

                    <div className="flex min-w-0 gap-1">

                      <button
                        type="button"
                        onClick={() => abrirEditarVehiculo(vehiculo)}
                        className="rounded-lg border border-white/10 bg-slate-800 px-1.5 py-1.5 text-[8px] font-black text-slate-300 transition hover:bg-slate-700 hover:text-white sm:px-2 md:rounded-xl md:px-3 md:py-2 md:text-xs"
                      >
                        ✏️ <span className="hidden sm:inline">Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          eliminarVehiculo(vehiculo.idVehiculo)
                        }
                        className="rounded-lg border border-red-400/10 bg-red-400/10 px-1.5 py-1.5 text-[8px] font-black text-red-300 transition hover:bg-red-500 hover:text-white sm:px-2 md:rounded-xl md:px-3 md:py-2 md:text-xs"
                      >
                        <span className="hidden sm:inline">Anular</span>
                        <span className="sm:hidden">✕</span>
                      </button>

                    </div>

                  </div>

                  {/* ==========================================
                      INFORMACIÓN
                  ========================================== */}

                  <div className="space-y-2.5 p-2.5 md:space-y-5 md:p-5">

                    <div className="flex items-start justify-between gap-1.5">

                      <div className="min-w-0">

                        <p className="text-[7px] font-black uppercase tracking-[0.15em] text-slate-600 md:text-[10px] md:tracking-[0.2em]">
                          Vehículo
                        </p>

                        <h3 className="mt-0.5 truncate text-xs font-black text-white sm:text-sm md:mt-1 md:text-xl">
                          {vehiculo.marca} {vehiculo.modelo}
                        </h3>

                        <p className="mt-0.5 truncate text-[7px] font-bold uppercase tracking-widest text-slate-500 md:mt-1 md:text-xs">
                          {vehiculo.placa}
                        </p>

                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-1.5 py-1 text-[6px] font-black tracking-wide md:px-3 md:py-1.5 md:text-[10px] md:tracking-wider ${
                          disponible
                            ? "border-emerald-400/10 bg-emerald-400/10 text-emerald-300"
                            : "border-amber-400/10 bg-amber-400/10 text-amber-300"
                        }`}
                      >
                        <span className="sm:hidden">
                          {disponible ? "DISP." : "ALQ."}
                        </span>

                        <span className="hidden sm:inline">
                          {disponible ? "DISPONIBLE" : "ALQUILADO"}
                        </span>
                      </span>

                    </div>

                    {/* ==========================================
                        COLOR Y TIPO
                    ========================================== */}

                    <div className="space-y-1.5 md:space-y-2">

                      <div className="flex items-center justify-between gap-1 rounded-lg border border-white/5 bg-slate-950/70 px-2 py-2 md:rounded-2xl md:px-4 md:py-3">

                        <span className="text-[7px] font-black uppercase tracking-wider text-slate-600 md:text-[10px]">
                          Color
                        </span>

                        <span className="max-w-[60%] truncate text-[8px] font-bold text-slate-200 md:text-sm">
                          {vehiculo.color || "No especificado"}
                        </span>

                      </div>

                      <div className="flex items-center justify-between gap-1 rounded-lg border border-white/5 bg-slate-950/70 px-2 py-2 md:rounded-2xl md:px-4 md:py-3">

                        <span className="text-[7px] font-black uppercase tracking-wider text-slate-600 md:text-[10px]">
                          Tipo
                        </span>

                        <span className="max-w-[60%] truncate text-[8px] font-bold text-slate-200 md:text-sm">
                          {vehiculo.tipo || "No especificado"}
                        </span>

                      </div>

                    </div>

                    {/* ==========================================
                        PRECIO
                    ========================================== */}

                    <div className="flex items-end justify-between gap-1 rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-2 py-2 md:rounded-2xl md:px-4 md:py-4">

                      <div className="min-w-0">

                        <p className="text-[7px] font-black uppercase tracking-wider text-slate-500 md:text-[10px]">
                          Precio / día
                        </p>

                        <p className="mt-0.5 hidden text-[9px] text-slate-600 md:block md:text-xs">
                          Tarifa de alquiler
                        </p>

                      </div>

                      <span className="shrink-0 text-[10px] font-black text-cyan-300 sm:text-xs md:text-xl">
                        {formatearMoneda(vehiculo.precioDia)}
                      </span>

                    </div>

                  </div>

                  {/* ==========================================
                      ESTADO
                  ========================================== */}

                  <div
                    className={`border-t px-1.5 py-2 text-center text-[6px] font-black uppercase tracking-wide md:px-5 md:py-3 md:text-[10px] md:tracking-wider ${
                      disponible
                        ? "border-emerald-400/10 bg-emerald-400/5 text-emerald-300"
                        : "border-amber-400/10 bg-amber-400/5 text-amber-300"
                    }`}
                  >
                    <span className="sm:hidden">
                      {disponible ? "Disponible" : "Alquilado"}
                    </span>

                    <span className="hidden sm:inline">
                      {disponible
                        ? "Vehículo disponible para alquiler"
                        : "Vehículo actualmente alquilado"}
                    </span>
                  </div>

                </article>
              );
            })}

          </div>

        )}

      </div>
    </section>
  );
}

export default Vehiculos;
