function Alquileres({
  datos,
  formatearMoneda,
  obtenerNombreCliente,
  obtenerNombreVehiculo,
  obtenerPlacaVehiculo,
  obtenerNombreUsuario,
  obtenerVehiculo,
  calcularDias,
  abrirNuevoAlquiler,
  abrirEditarAlquiler,
  eliminarAlquiler
}) {
  return (
    <section className="space-y-8">

      {/* ENCABEZADO */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-sky-400">
            Operaciones
          </span>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Alquileres
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Gestiona los alquileres de vehículos.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirNuevoAlquiler}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
        >
          <span className="text-lg">+</span>
          Nuevo alquiler
        </button>

      </div>

      {/* LISTA DE ALQUILERES */}
      {datos.alquileres.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 px-6 py-16 text-center">

          <div className="text-5xl">📋</div>

          <h3 className="mt-4 text-lg font-bold text-white">
            No hay alquileres registrados
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Registra el primer alquiler del sistema.
          </p>

        </div>

      ) : (

        <div className="grid gap-5 xl:grid-cols-2">

          {datos.alquileres.map((alquiler) => {

            const vehiculo = obtenerVehiculo(alquiler.idVehiculo);

            const dias = calcularDias(
              alquiler.fechaInicio,
              alquiler.fechaFin
            );

            return (
              <article
                key={alquiler.idAlquiler}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl transition duration-300 hover:border-sky-500/30 hover:shadow-sky-500/5"
              >

                {/* CABECERA */}
                <div className="flex items-start justify-between gap-4">

                  <div>

                    <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                      ALQUILER #{alquiler.idAlquiler}
                    </span>

                    <h3 className="mt-2 text-xl font-bold text-white">
                      {obtenerNombreCliente(alquiler.idCliente)}
                    </h3>

                  </div>

                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
                    ACTIVO
                  </span>

                </div>

                {/* INFORMACIÓN */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      CLIENTE:
                    </span>

                    <p className="mt-1 text-sm font-semibold text-slate-200">
                      {obtenerNombreCliente(alquiler.idCliente)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      VEHÍCULO:
                    </span>

                    <p className="mt-1 text-sm font-semibold text-slate-200">
                      {obtenerNombreVehiculo(alquiler.idVehiculo)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      PLACA:
                    </span>

                    <p className="mt-1 text-sm font-semibold text-slate-200">
                      {obtenerPlacaVehiculo(alquiler.idVehiculo)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      USUARIO:
                    </span>

                    <p className="mt-1 text-sm font-semibold text-slate-200">
                      {obtenerNombreUsuario(alquiler.idUsuario)}
                    </p>
                  </div>

                </div>

                {/* FECHAS */}
                <div className="mt-4 grid gap-4 sm:grid-cols-3">

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      FECHA INICIO:
                    </span>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {alquiler.fechaInicio}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      FECHA FIN:
                    </span>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {alquiler.fechaFin}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      DÍAS:
                    </span>

                    <p className="mt-1 text-sm font-bold text-sky-400">
                      {dias}
                    </p>
                  </div>

                </div>

                {/* TOTAL */}
                <div className="mt-6 rounded-xl border border-sky-500/10 bg-sky-500/5 p-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        TOTAL:
                      </span>

                      <p className="mt-1 text-2xl font-bold text-white">
                        {formatearMoneda(alquiler.total)}
                      </p>
                    </div>

                    {vehiculo && (
                      <div className="text-right">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          PRECIO / DÍA:
                        </span>

                        <p className="mt-1 text-sm font-bold text-sky-400">
                          {formatearMoneda(vehiculo.precioDia)}
                        </p>
                      </div>
                    )}

                  </div>

                </div>

                {/* ACCIONES */}
                <div className="mt-5 flex justify-end gap-2 border-t border-white/10 pt-5">

                  <button
                    type="button"
                    onClick={() => abrirEditarAlquiler(alquiler)}
                    className="rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:border-sky-500/40 hover:text-sky-400"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      eliminarAlquiler(alquiler.idAlquiler)
                    }
                    className="rounded-lg border border-red-500/10 bg-slate-950 px-4 py-2.5 text-xs font-bold text-slate-400 transition hover:border-red-500/40 hover:text-red-400"
                  >
                    Anular
                  </button>

                </div>

              </article>
            );
          })}

        </div>

      )}

    </section>
  );
}

export default Alquileres;
