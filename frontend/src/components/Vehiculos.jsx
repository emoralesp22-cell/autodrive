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
    <section className="min-h-full bg-slate-950 p-4 text-white sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ENCABEZADO */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
              Gestión
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
              Vehículos
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Administra la flota disponible para alquiler.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirNuevoVehiculo}
            className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/10 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-cyan-400/20"
          >
            + Registrar vehículo
          </button>

        </div>

        {/* BUSCADOR Y FILTROS */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-xl backdrop-blur">

          <div className="flex flex-col gap-3 lg:flex-row">

            <input
              type="text"
              value={busquedaVehiculos}
              onChange={(e) => setBusquedaVehiculos(e.target.value)}
              placeholder="Buscar por placa, marca, modelo, color o tipo..."
              className="w-full flex-1 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
            />

            <div className="flex flex-wrap gap-2 rounded-2xl border border-white/5 bg-slate-950 p-1">

              <button
                type="button"
                onClick={() => setFiltroVehiculos("todos")}
                className={`rounded-xl px-4 py-2.5 text-xs font-black transition duration-300 ${
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
                className={`rounded-xl px-4 py-2.5 text-xs font-black transition duration-300 ${
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
                className={`rounded-xl px-4 py-2.5 text-xs font-black transition duration-300 ${
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

        {/* CONTADOR */}
        <div className="flex items-center justify-between">

          <p className="text-sm text-slate-500">
            Mostrando{" "}
            <span className="font-black text-white">
              {vehiculosFiltrados.length}
            </span>{" "}
            vehículo(s)
          </p>

        </div>

        {/* VEHÍCULOS */}
        {vehiculosFiltrados.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/50 px-6 py-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-3xl">
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

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {vehiculosFiltrados.map((vehiculo) => {

              const alquilado = vehiculoEstaAlquilado(vehiculo);
              const disponible = !alquilado;

              return (
                <article
                  key={vehiculo.idVehiculo}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:shadow-2xl"
                >

                  {/* CABECERA */}
                  <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/40 p-5">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/10 text-xl">
                      🚗
                    </div>

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={() => abrirEditarVehiculo(vehiculo)}
                        className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs font-black text-slate-300 transition duration-300 hover:bg-slate-700 hover:text-white"
                      >
                        ✏️ Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => eliminarVehiculo(vehiculo.idVehiculo)}
                        className="rounded-xl border border-red-400/10 bg-red-400/10 px-3 py-2 text-xs font-black text-red-300 transition duration-300 hover:bg-red-500 hover:text-white"
                      >
                        Anular
                      </button>

                    </div>

                  </div>

                  {/* INFORMACIÓN */}
                  <div className="space-y-5 p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                          Vehículo
                        </p>

                        <h3 className="mt-1 truncate text-xl font-black text-white">
                          {vehiculo.marca} {vehiculo.modelo}
                        </h3>

                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-500">
                          {vehiculo.placa}
                        </p>

                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-black tracking-wider ${
                          disponible
                            ? "border-emerald-400/10 bg-emerald-400/10 text-emerald-300"
                            : "border-amber-400/10 bg-amber-400/10 text-amber-300"
                        }`}
                      >
                        {disponible ? "DISPONIBLE" : "ALQUILADO"}
                      </span>

                    </div>

                    {/* DETALLES */}
                    <div className="space-y-2">

                      <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/70 px-4 py-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                          Color
                        </span>

                        <span className="text-sm font-bold text-slate-200">
                          {vehiculo.color || "No especificado"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/70 px-4 py-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                          Tipo
                        </span>

                        <span className="text-sm font-bold text-slate-200">
                          {vehiculo.tipo || "No especificado"}
                        </span>
                      </div>

                    </div>

                    {/* PRECIO */}
                    <div className="flex items-end justify-between rounded-2xl border border-cyan-400/10 bg-cyan-400/5 px-4 py-4">

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Precio / día
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          Tarifa de alquiler
                        </p>
                      </div>

                      <span className="text-xl font-black text-cyan-300">
                        {formatearMoneda(vehiculo.precioDia)}
                      </span>

                    </div>

                  </div>

                  {/* ESTADO */}
                  <div
                    className={`border-t px-5 py-3 text-center text-[10px] font-black uppercase tracking-wider ${
                      disponible
                        ? "border-emerald-400/10 bg-emerald-400/5 text-emerald-300"
                        : "border-amber-400/10 bg-amber-400/5 text-amber-300"
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

      </div>
    </section>
  );
}

export default Vehiculos;
