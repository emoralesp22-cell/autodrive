function ModalCliente({
  abierto,
  clienteEditando,
  formCliente,
  setFormCliente,
  guardarCliente,
  cerrarModal
}) {

  if (!abierto) {
    return null;
  }

  const cambiarCampo = (campo, valor) => {
    setFormCliente({
      ...formCliente,
      [campo]: valor
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6">

      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl sm:rounded-3xl">

       {/* ENCABEZADO */}
       <div className="relative flex items-center justify-between overflow-hidden border-b border-white/10 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-4 py-3 sm:px-6 sm:py-5 md:px-8">          <div className="min-w-0">

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400 sm:text-xs sm:tracking-[0.25em]">
              Clientes
            </span>

            <h2 className="mt-0.5 text-xl font-bold text-white sm:mt-1 sm:text-2xl">
              {clienteEditando
                ? "Editar cliente"
                : "Nuevo cliente"}
            </h2>

            <p className="mt-0.5 hidden text-sm text-slate-500 sm:mt-1 sm:block">
              {clienteEditando
                ? "Actualiza la información del cliente."
                : "Registra un nuevo cliente."}
            </p>

          </div>

          <button
            type="button"
            onClick={cerrarModal}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-lg text-slate-400 transition hover:border-white/20 hover:bg-slate-800 hover:text-white sm:h-10 sm:w-10 sm:text-xl"
          >
            ×
          </button>

        </div>

        {/* FORMULARIO */}
        <form
          onSubmit={guardarCliente}
          className="space-y-4 p-4 sm:space-y-6 sm:p-6 md:p-8"
        >

          <div className="space-y-3.5 sm:space-y-5">

            {/* NOMBRE */}
            <div>

              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:mb-2 sm:text-xs">
                NOMBRE
              </label>

              <input
                type="text"
                value={formCliente.nombre}
                onChange={(e) =>
                  cambiarCampo("nombre", e.target.value)
                }
                placeholder="Nombre completo"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 sm:px-4 sm:py-3 sm:text-sm"
              />

            </div>

            {/* DPI */}
            <div>

              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:mb-2 sm:text-xs">
                DPI
              </label>

              <input
                type="text"
                value={formCliente.dpi}
                onChange={(e) =>
                  cambiarCampo("dpi", e.target.value)
                }
                placeholder="Número de DPI"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 sm:px-4 sm:py-3 sm:text-sm"
              />

            </div>

            {/* TELÉFONO */}
            <div>

              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:mb-2 sm:text-xs">
                TELÉFONO
              </label>

              <input
                type="text"
                value={formCliente.telefono}
                onChange={(e) =>
                  cambiarCampo("telefono", e.target.value)
                }
                placeholder="Número de teléfono"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 sm:px-4 sm:py-3 sm:text-sm"
              />

            </div>

          </div>

          {/* ACCIONES */}
          <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:gap-3 sm:pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={cerrarModal}
              className="rounded-xl border border-white/10 bg-slate-900 px-5 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white sm:py-3 sm:text-sm"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 sm:py-3 sm:text-sm"
            >
              {clienteEditando
                ? "Guardar cambios"
                : "Agregar cliente"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ModalCliente;
