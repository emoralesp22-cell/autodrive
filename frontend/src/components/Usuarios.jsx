function Usuarios({
  datos,
  abrirNuevoUsuario,
  abrirEditarUsuario,
  eliminarUsuario
}) {
  return (
    <section className="space-y-8">

      {/* ENCABEZADO */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-sky-400">
            Administración
          </span>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Usuarios
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Administra los usuarios del sistema.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirNuevoUsuario}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
        >
          <span className="text-lg">+</span>
          Nuevo usuario
        </button>

      </div>

      {/* TABLA */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl">

        {datos.usuarios.length === 0 ? (

          <div className="px-6 py-16 text-center">

            <div className="text-5xl">👥</div>

            <h3 className="mt-4 text-lg font-bold text-white">
              No hay usuarios registrados
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Agrega el primer usuario al sistema.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left">

              <thead className="border-b border-white/10 bg-slate-950/70">

                <tr>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    ID
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    NOMBRE
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    USUARIO
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    CORREO
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    PERFIL
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    ACCIONES
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-white/5">

                {datos.usuarios.map((usuario) => (

                  <tr
                    key={usuario.idUsuario}
                    className="transition hover:bg-white/[0.03]"
                  >

                    {/* ID */}
                    <td className="px-6 py-5">

                      <span className="inline-flex rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs font-bold text-slate-400">
                        #{usuario.idUsuario}
                      </span>

                    </td>

                    {/* NOMBRE */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 text-lg">
                          👤
                        </div>

                        <strong className="text-sm font-semibold text-white">
                          {usuario.nombre}
                        </strong>

                      </div>

                    </td>

                    {/* USUARIO */}
                    <td className="px-6 py-5">

                      <span className="text-sm font-medium text-slate-300">
                        {usuario.usuario}
                      </span>

                    </td>

                    {/* CORREO */}
                    <td className="px-6 py-5">

                      <span className="text-sm text-slate-400">
                        {usuario.correo}
                      </span>

                    </td>

                    {/* PERFIL */}
                    <td className="px-6 py-5">

                      <span className="inline-flex rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-xs font-bold text-sky-400">
                        {usuario.nombrePerfil || `Perfil #${usuario.idPerfil}`}
                      </span>

                    </td>

                    {/* ACCIONES */}
                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => abrirEditarUsuario(usuario)}
                          className="rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-sky-500/40 hover:text-sky-400"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => eliminarUsuario(usuario.idUsuario)}
                          className="rounded-lg border border-red-500/10 bg-slate-950 px-4 py-2 text-xs font-bold text-slate-400 transition hover:border-red-500/40 hover:text-red-400"
                        >
                          Anular
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </section>
  );
}

export default Usuarios;
