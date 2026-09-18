function ModalPerfil({
  abierto,
  perfilEditando,
  formPerfil,
  setFormPerfil,
  guardarPerfil,
  cerrarModal
}) {
  if (!abierto) {
    return null;
  }

  const cambiarCampo = (campo, valor) => {
    setFormPerfil({
      ...formPerfil,
      [campo]: valor
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">

      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">

        {/* ENCABEZADO */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-8">

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sky-400">
              Perfiles
            </span>

            <h2 className="mt-1 text-2xl font-bold text-white">
              {perfilEditando
                ? "Editar perfil"
                : "Nuevo perfil"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {perfilEditando
                ? "Actualiza el nombre del perfil."
                : "Crea un nuevo perfil para los usuarios."}
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
          onSubmit={guardarPerfil}
          className="space-y-6 p-6 md:p-8"
        >

          {/* NOMBRE */}
          <div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              NOMBRE DEL PERFIL
            </label>

            <input
              type="text"
              value={formPerfil.nombre}
              onChange={(e) =>
                cambiarCampo("nombre", e.target.value)
              }
              placeholder="Ej. Administrador"
              required
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />

          </div>

          {/* INFORMACIÓN */}
          <div className="rounded-xl border border-sky-500/10 bg-sky-500/5 px-4 py-3">

            <p className="text-xs leading-5 text-slate-400">
              Los perfiles permiten organizar los tipos de usuarios
              que tendrán acceso al sistema.
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
              {perfilEditando
                ? "Guardar cambios"
                : "Agregar perfil"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ModalPerfil;
