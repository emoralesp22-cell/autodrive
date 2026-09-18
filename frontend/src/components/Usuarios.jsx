function Usuarios({
  datos,
  abrirNuevoUsuario,
  abrirEditarUsuario,
  eliminarUsuario
}) {
  const usuarios = datos.usuarios || [];

  return (
    <section className="space-y-8">

      {/* ENCABEZADO */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

        <div>
          <span className="text-xs font-black uppercase tracking-[0.25em] text-sky-400">
            Administración
          </span>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
            Usuarios
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Gestiona los usuarios y perfiles del sistema.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirNuevoUsuario}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-sky-400 hover:shadow-sky-500/30"
        >
          <span className="text-lg">+</span>
          Nuevo usuario
        </button>

      </div>

      {/* RESUMEN */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Control de acceso
            </p>

            <h3 className="mt-1 text-xl font-black text-white">
              Usuarios registrados
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Administra las cuentas disponibles en AutoDrive.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-xl">
              👥
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Total
              </p>

              <p className="text-2xl font-black text-white">
                {usuarios.length}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* TABLA */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl">

        {usuarios.length === 0 ? (

          /* SIN USUARIOS */
          <div className="px-6 py-20 text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-sky-500/20 bg-sky-500/10 text-4xl">
              👥
            </div>

            <h3 className="mt-5 text-xl font-black text-white">
              No hay usuarios registrados
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Agrega el primer usuario para comenzar a gestionar
              el acceso al sistema.
            </p>

            <button
              type="button"
              onClick={abrirNuevoUsuario}
              className="mt-6 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
            >
              + Registrar primer usuario
            </button>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px] text-left">

              {/* CABECERA */}
              <thead className="border-b border-white/10 bg-slate-950/80">

                <tr>

                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                    ID
                  </th>

                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                    Usuario
                  </th>

                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                    Nombre
                  </th>

                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                    Correo
                  </th>

                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                    Perfil
                  </th>

                  <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                    Acciones
                  </th>

                </tr>

              </thead>

              {/* CUERPO */}
              <tbody className="divide-y divide-white/5">

                {usuarios.map((usuario) => (

                  <tr
                    key={usuario.idUsuario}
                    className="group transition duration-200 hover:bg-sky-500/[0.04]"
                  >

                    {/* ID */}
                    <td className="px-6 py-5">

                      <span className="inline-flex rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-xs font-black text-slate-400">
                        #{usuario.idUsuario}
                      </span>

                    </td>

                    {/* USUARIO */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-xl shadow-inner">
                          👤
                        </div>

                        <div>

                          <p className="text-sm font-black text-white">
                            {usuario.usuario}
                          </p>

                          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Cuenta del sistema
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* NOMBRE */}
                    <td className="px-6 py-5">

                      <span className="text-sm font-semibold text-slate-200">
                        {usuario.nombre}
                      </span>

                    </td>

                    {/* CORREO */}
                    <td className="px-6 py-5">

                      <span className="text-sm font-medium text-slate-400">
                        {usuario.correo}
                      </span>

                    </td>

                    {/* PERFIL */}
                    <td className="px-6 py-5">

                      <span className="inline-flex rounded-xl border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-xs font-black text-sky-400">
                        {usuario.nombrePerfil || `Perfil #${usuario.idPerfil}`}
                      </span>

                    </td>

                    {/* ACCIONES */}
                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => abrirEditarUsuario(usuario)}
                          className="rounded-xl border border-sky-500/20 bg-sky-500/10 px-4 py-2.5 text-xs font-black text-sky-400 transition duration-200 hover:-translate-y-0.5 hover:bg-sky-500 hover:text-white hover:shadow-lg hover:shadow-sky-500/20"
                        >
                          ✏️ Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => eliminarUsuario(usuario.idUsuario)}
                          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-black text-red-400 transition duration-200 hover:-translate-y-0.5 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20"
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
