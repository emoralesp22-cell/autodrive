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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">

      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">

        {/* ENCABEZADO */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-8">

          <div>

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sky-400">
              Alquileres
            </span>

            <h2 className="mt-1 text-2xl font-bold text-white">
              {alquilerEditando
                ? "Editar alquiler"
                : "Nuevo alquiler"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Selecciona el cliente, vehículo y período del alquiler.
            </p>

          </div>

          <button
            type="button"
            onClick={cerrarModal}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-xl text-slate-400 transition hover:border-white/20 hover:bg-slate-800 hover:text-white"
          >
            ×
          </button>

        </div>

        {/* FORMULARIO */}
        <form
          onSubmit={guardarAlquiler}
          className="space-y-6 p-6 md:p-8"
        >

          <div className="grid gap-5 md:grid-cols-2">

            {/* CLIENTE */}
            <div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                CLIENTE
              </label>

              <select
                value={formAlquiler.idCliente}
                onChange={(e) =>
                  cambiarCampo("idCliente", e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >

                <option value="">
                  Seleccionar cliente
                </option>

                {datos.clientes.map((cliente) => (
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

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                VEHÍCULO
              </label>

              <select
                value={formAlquiler.idVehiculo}
                onChange={(e) =>
                  cambiarCampo("idVehiculo", e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >

                <option value="">
                  Seleccionar vehículo
                </option>

                {datos.vehiculos.map((vehiculo) => (
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

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                USUARIO
              </label>

              <select
                value={formAlquiler.idUsuario}
                onChange={(e) =>
                  cambiarCampo("idUsuario", e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
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

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                FECHA INICIO
              </label>

              <input
                type="date"
                value={formAlquiler.fechaInicio}
                onChange={(e) =>
                  cambiarCampo("fechaInicio", e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />

            </div>

            {/* FECHA FIN */}
            <div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                FECHA FIN
              </label>

              <input
                type="date"
                value={formAlquiler.fechaFin}
                onChange={(e) =>
                  cambiarCampo("fechaFin", e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />

            </div>

          </div>

          {/* CALCULADORA */}
          <div className="rounded-2xl border border-sky-500/10 bg-sky-500/5 p-5">

            <div className="mb-4">

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
                Resumen del alquiler
              </span>

            </div>

            <div className="grid gap-4 sm:grid-cols-3">

              {/* PRECIO */}
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">

                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  PRECIO / DÍA:
                </span>

                <p className="mt-2 text-lg font-bold text-white">
                  {vehiculoSeleccionado
                    ? formatearMoneda(
                        vehiculoSeleccionado.precioDia
                      )
                    : "—"}
                </p>

              </div>

              {/* DÍAS */}
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">

                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  DÍAS:
                </span>

                <p className="mt-2 text-lg font-bold text-sky-400">
                  {diasAlquiler || "—"}
                </p>

              </div>

              {/* TOTAL */}
              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">

                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  TOTAL:
                </span>

                <p className="mt-2 text-xl font-bold text-emerald-400">
                  {totalEstimado
                    ? formatearMoneda(totalEstimado)
                    : "—"}
                </p>

              </div>

            </div>

            <p className="mt-4 text-xs text-slate-500">
              El total se calcula automáticamente según el vehículo y las fechas seleccionadas.
            </p>

          </div>

          {/* ACCIONES */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={cerrarModal}
              className="rounded-xl border border-white/10 bg-slate-900 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
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
