function ModalVehiculo({
  abierto,
  vehiculoEditando,
  formVehiculo,
  setFormVehiculo,
  guardarVehiculo,
  cerrarModal
}) {
  if (!abierto) {
    return null;
  }

  const cambiarCampo = (campo, valor) => {
    setFormVehiculo({
      ...formVehiculo,
      [campo]: valor
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">

        {/* ENCABEZADO */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-8">

          <div>

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sky-400">
              Flota
            </span>

            <h2 className="mt-1 text-2xl font-bold text-white">
              {vehiculoEditando
                ? "Editar vehículo"
                : "Nuevo vehículo"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {vehiculoEditando
                ? "Actualiza la información del vehículo."
                : "Registra un nuevo vehículo en la flota."}
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
          onSubmit={guardarVehiculo}
          className="space-y-6 p-6 md:p-8"
        >

          <div className="grid gap-5 md:grid-cols-2">

            {/* PLACA */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                PLACA
              </label>

              <input
                type="text"
                value={formVehiculo.placa}
                onChange={(e) =>
                  cambiarCampo("placa", e.target.value)
                }
                placeholder="Ej. P250BPM"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            {/* MARCA */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                MARCA
              </label>

              <input
                type="text"
                value={formVehiculo.marca}
                onChange={(e) =>
                  cambiarCampo("marca", e.target.value)
                }
                placeholder="Ej. Toyota"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            {/* MODELO */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                MODELO
              </label>

              <input
                type="text"
                value={formVehiculo.modelo}
                onChange={(e) =>
                  cambiarCampo("modelo", e.target.value)
                }
                placeholder="Ej. RAV4"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            {/* COLOR */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                COLOR
              </label>

              <input
                type="text"
                value={formVehiculo.color}
                onChange={(e) =>
                  cambiarCampo("color", e.target.value)
                }
                placeholder="Ej. Rojo"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            {/* TIPO */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                TIPO
              </label>

              <input
                type="text"
                value={formVehiculo.tipo}
                onChange={(e) =>
                  cambiarCampo("tipo", e.target.value)
                }
                placeholder="Ej. SUV"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            {/* PRECIO */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                PRECIO / DÍA
              </label>

              <div className="relative">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                  Q
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formVehiculo.precioDia}
                  onChange={(e) =>
                    cambiarCampo("precioDia", e.target.value)
                  }
                  placeholder="400"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-9 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />

              </div>
            </div>

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
              {vehiculoEditando
                ? "Guardar cambios"
                : "Agregar vehículo"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ModalVehiculo;
