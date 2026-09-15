function ModalPago({
  abierto,
  pagoEditando,
  formPago,
  setFormPago,
  datos,
  obtenerNombreCliente,
  guardarPago,
  cerrarModal
}) {
  if (!abierto) {
    return null;
  }

  const cambiarCampo = (campo, valor) => {
    setFormPago({
      ...formPago,
      [campo]: valor
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">

      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">

        {/* ENCABEZADO */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-8">

          <div>

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sky-400">
              Finanzas
            </span>

            <h2 className="mt-1 text-2xl font-bold text-white">
              {pagoEditando
                ? "Editar pago"
                : "Nuevo pago"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Registra el pago correspondiente a un alquiler.
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
          onSubmit={guardarPago}
          className="space-y-6 p-6 md:p-8"
        >

          <div className="grid gap-5 md:grid-cols-2">

            {/* ALQUILER */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                ALQUILER
              </label>

              <select
                value={formPago.idAlquiler}
                onChange={(e) =>
                  cambiarCampo("idAlquiler", e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >

                <option value="">
                  Seleccionar alquiler
                </option>

                {datos.alquileres.map((alquiler) => (
                  <option
                    key={alquiler.idAlquiler}
                    value={alquiler.idAlquiler}
                  >
                    #{alquiler.idAlquiler} —{" "}
                    {obtenerNombreCliente(alquiler.idCliente)}
                  </option>
                ))}

              </select>

            </div>

            {/* FECHA */}
            <div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                FECHA DE PAGO
              </label>

              <input
                type="date"
                value={formPago.fechaPago}
                onChange={(e) =>
                  cambiarCampo("fechaPago", e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />

            </div>

            {/* MONTO */}
            <div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                MONTO
              </label>

              <div className="relative">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                  Q
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formPago.monto}
                  onChange={(e) =>
                    cambiarCampo("monto", e.target.value)
                  }
                  placeholder="0.00"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-9 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />

              </div>

            </div>

            {/* FORMA DE PAGO */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                FORMA DE PAGO
              </label>

              <select
                value={formPago.formaPago}
                onChange={(e) =>
                  cambiarCampo("formaPago", e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >

                <option value="">
                  Seleccionar forma de pago
                </option>

                <option value="Efectivo">
                  Efectivo
                </option>

                <option value="Tarjeta">
                  Tarjeta
                </option>

                <option value="Transferencia">
                  Transferencia
                </option>

              </select>

            </div>

          </div>

          {/* AVISO */}
          <div className="rounded-xl border border-sky-500/10 bg-sky-500/5 px-4 py-3">

            <p className="text-xs leading-5 text-slate-400">
              Puedes registrar pagos parciales. El sistema calculará
              automáticamente el saldo pendiente del alquiler.
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
              {pagoEditando
                ? "Guardar cambios"
                : "Registrar pago"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ModalPago;
