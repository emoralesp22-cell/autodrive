function ModalAlquiler({
  abierto,
  alquilerEditando,
  formAlquiler,
  setFormAlquiler,
  datos,
  vehiculoSeleccionado,
  diasAlquiler,
  totalEstimado,
  formatearMoneda,
  guardarAlquiler,
  cerrarModal
}) {

  if (!abierto) {
    return null;
  }

  const cambiarCampo = (campo, valor) => {
    setFormAlquiler({
      ...formAlquiler,
      [campo]: valor
    });
  };

  // VEHÍCULOS DISPONIBLES
  const vehiculosDisponibles = (datos.vehiculos || []).filter((vehiculo) => {

    const estaAlquilado = (datos.alquileres || []).some((alquiler) => {

      const idVehiculoAlquiler =
        alquiler.idVehiculo ??
        alquiler.vehiculo?.idVehiculo;

      // Si estamos editando, permitimos el vehículo
      // que pertenece al alquiler actual.
      const esAlquilerActual =
        alquilerEditando &&
        Number(alquiler.idAlquiler) ===
          Number(alquilerEditando.idAlquiler);

      if (esAlquilerActual) {
        return false;
      }

      return (
        Number(idVehiculoAlquiler) === Number(vehiculo.idVehiculo) &&
        alquiler.estado === true
      );
    });

    return !estaAlquilado;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-6">

      <div className="max-h-[94vh] w-[92vw] max-w-3xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950 shadow-2xl">

        {/* ENCABEZADO */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6 sm:py-5 md:px-8">

          <div className="min-w-0">

            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-sky-400 sm:text-xs sm:tracking-[0.25em]">
              Alquileres
            </span>

            <h2 className="mt-0.5 text-xl font-bold text-white sm:mt-1 sm:text-2xl">
              {alquilerEditando
                ? "Editar alquiler"
                : "Nuevo alquiler"}
            </h2>

            <p className="mt-0.5 max-w-[250px] text-[10px] leading-tight text-slate-500 sm:mt-1 sm:max-w-none sm:text-sm">
              Selecciona el cliente, vehículo y período del alquiler.
            </p>

          </div>

          <button
            type="button"
            onClick={cerrarModal}
            className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-lg text-slate-400 transition hover:border-white/20 hover:bg-slate-800 hover:text-white sm:h-10 sm:w-10 sm:text-xl"
          >
            ×
          </button>

        </div>

        {/* FORMULARIO */}
        <form
          onSubmit={guardarAlquiler}
          className="max-h-[calc(94vh-120px)] space-y-6 overflow-y-auto p-6 md:p-8"
        >

          <div className="grid grid-cols-2 gap-2.5 sm:gap-5">

            {/* CLIENTE */}
            <div>

              <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:mb-2 sm:text-xs">
                CLIENTE
              </label>

              <select
                value={formAlquiler.idCliente}
                onChange={(e) =>
                  cambiarCampo("idCliente", e.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-2.5 py-2.5 text-[10px] text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
              >

                <option value="">
                  Seleccionar cliente
                </option>

                {datos.clientes
                  .filter((cliente) => cliente.estado === true)
                  .map((cliente) => (
                    <option
                      key={cliente.idCliente}
                      value={cliente.idCliente}
                    >
                      {cliente.nombre}
                    </option>
                  ))}

              </select>

            </div>

            {/* VEHÍCULO */}
            <div>

              <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:mb-2 sm:text-xs">
                VEHÍCULO
              </label>

              <select
                value={formAlquiler.idVehiculo}
                onChange={(e) =>
                  cambiarCampo("idVehiculo", e.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-2.5 py-2.5 text-[10px] text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
              >

                <option value="">
                  Seleccionar vehículo
                </option>

                {vehiculosDisponibles.map((vehiculo) => (
                  <option
                    key={vehiculo.idVehiculo}
                    value={vehiculo.idVehiculo}
                  >
                    {vehiculo.marca} {vehiculo.modelo} — {vehiculo.placa}
                  </option>
                ))}

              </select>

            </div>

            {/* USUARIO */}
            <div>

              <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:mb-2 sm:text-xs">
                USUARIO
              </label>

              <select
                value={formAlquiler.idUsuario}
                onChange={(e) =>
                  cambiarCampo("idUsuario", e.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-2.5 py-2.5 text-[10px] text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
              >

                <option value="">
                  Seleccionar usuario
                </option>

                {datos.usuarios.map((usuario) => (
                  <option
                    key={usuario.idUsuario}
                    value={usuario.idUsuario}
                  >
                    {usuario.nombre}
                  </option>
                ))}

              </select>

            </div>

            {/* FECHA INICIO */}
            <div>

              <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:mb-2 sm:text-xs">
                FECHA INICIO
              </label>

              <input
                type="date"
                value={formAlquiler.fechaInicio}
                onChange={(e) =>
                  cambiarCampo("fechaInicio", e.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-2.5 py-2.5 text-[10px] text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
              />

            </div>

            {/* FECHA FIN */}
            <div className="col-span-2 sm:col-span-1">

              <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:mb-2 sm:text-xs">
                FECHA FIN
              </label>

              <input
                type="date"
                value={formAlquiler.fechaFin}
                onChange={(e) =>
                  cambiarCampo("fechaFin", e.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-2.5 py-2.5 text-[10px] text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
              />

            </div>

          </div>

          {/* CALCULADORA */}
          <div className="rounded-xl border border-sky-500/10 bg-sky-500/5 p-3 sm:rounded-2xl sm:p-5">

            <div className="mb-2 sm:mb-4">

              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-sky-400 sm:text-xs sm:tracking-[0.2em]">
                Resumen del alquiler
              </span>

            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-4">

              {/* PRECIO */}
              <div className="rounded-lg border border-white/5 bg-slate-950/60 p-2 sm:rounded-xl sm:p-4">

                <span className="text-[7px] font-bold uppercase tracking-wider text-slate-500 sm:text-[11px]">
                  PRECIO / DÍA:
                </span>

                <p className="mt-1 text-[10px] font-bold text-white sm:mt-2 sm:text-lg">
                  {vehiculoSeleccionado
                    ? formatearMoneda(
                        vehiculoSeleccionado.precioDia
                      )
                    : "—"}
                </p>

              </div>

              {/* DÍAS */}
              <div className="rounded-lg border border-white/5 bg-slate-950/60 p-2 sm:rounded-xl sm:p-4">

                <span className="text-[7px] font-bold uppercase tracking-wider text-slate-500 sm:text-[11px]">
                  DÍAS:
                </span>

                <p className="mt-1 text-[10px] font-bold text-sky-400 sm:mt-2 sm:text-lg">
                  {diasAlquiler || "—"}
                </p>

              </div>

              {/* TOTAL */}
              <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-2 sm:rounded-xl sm:p-4">

                <span className="text-[7px] font-bold uppercase tracking-wider text-slate-500 sm:text-[11px]">
                  TOTAL:
                </span>

                <p className="mt-1 whitespace-nowrap text-[10px] font-bold text-emerald-400 sm:mt-2 sm:text-xl">
                  {totalEstimado
                    ? formatearMoneda(totalEstimado)
                    : "—"}
                </p>

              </div>

            </div>

            <p className="mt-2 text-[8px] leading-tight text-slate-500 sm:mt-4 sm:text-xs">
              El total se calcula automáticamente según el vehículo y las fechas seleccionadas.
            </p>

          </div>

          {/* ACCIONES */}
          <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-3 sm:flex-row sm:justify-end sm:gap-3 sm:pt-6">

            <button
              type="button"
              onClick={cerrarModal}
              className="rounded-lg border border-white/10 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-lg bg-sky-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm"
            >
              {alquilerEditando
                ? "Guardar cambios"
                : "Registrar alquiler"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ModalAlquiler;
