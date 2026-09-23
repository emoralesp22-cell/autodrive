function ModalUsuario({
  abierto,
  usuarioEditando,
  formUsuario,
  setFormUsuario,
  datos,
  guardarUsuario,
  cerrarModal
}) {
  if (!abierto) {
    return null;
  }

  const cambiarCampo = (campo, valor) => {
    setFormUsuario({
      ...formUsuario,
      [campo]: valor
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">

      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">

        {/* ENCABEZADO */}
        <div className="relative flex items-center justify-between overflow-hidden border-b border-white/10 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-3 py-3 sm:px-6 sm:py-5">
          <div>

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sky-400">
              Usuarios
            </span>

            <h2 className="mt-1 text-2xl font-bold text-white">
              {usuarioEditando
                ? "Editar usuario"
                : "Nuevo usuario"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {usuarioEditando
                ? "Actualiza la información del usuario."
                : "Registra un nuevo usuario en el sistema."}
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
          onSubmit={guardarUsuario}
          className="space-y-6 p-6 md:p-8"
        >

          <div className="grid gap-5 md:grid-cols-2">

            {/* PERFIL */}
            <div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                PERFIL
              </label>

              <select
                value={formUsuario.idPerfil}
                onChange={(e) =>
                  cambiarCampo("idPerfil", e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >

                <option value="">
                  Seleccionar perfil
                </option>

                {datos.perfiles.map((perfil) => (
                  <option
                    key={perfil.idPerfil}
                    value={perfil.idPerfil}
                  >
                    {perfil.nombre}
                  </option>
                ))}

              </select>

            </div>

            {/* NOMBRE */}
            <div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                NOMBRE
              </label>

              <input
                type="text"
                value={formUsuario.nombre}
                onChange={(e) =>
                  cambiarCampo("nombre", e.target.value)
                }
                placeholder="Nombre completo"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />

            </div>

            {/* USUARIO */}
            <div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                USUARIO
              </label>

              <input
                type="text"
                value={formUsuario.usuario}
                onChange={(e) =>
                  cambiarCampo("usuario", e.target.value)
                }
                placeholder="Nombre de usuario"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />

            </div>

            {/* CORREO */}
            <div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                CORREO
              </label>

              <input
                type="email"
                value={formUsuario.correo}
                onChange={(e) =>
                  cambiarCampo("correo", e.target.value)
                }
                placeholder="correo@ejemplo.com"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />

            </div>

            {/* CONTRASEÑA */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                CONTRASEÑA
              </label>

              <input
                type="password"
                value={formUsuario.contrasena}
                onChange={(e) =>
                  cambiarCampo("contrasena", e.target.value)
                }
                placeholder={
                  usuarioEditando
                    ? "Dejar vacío para conservar la actual"
                    : "Contraseña"
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />

            </div>

          </div>

          {/* INFORMACIÓN */}
          <div className="rounded-xl border border-sky-500/10 bg-sky-500/5 px-4 py-3">

            <p className="text-xs leading-5 text-slate-400">
              El usuario tendrá acceso al sistema según el perfil
              seleccionado.
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
              {usuarioEditando
                ? "Guardar cambios"
                : "Agregar usuario"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ModalUsuario;
