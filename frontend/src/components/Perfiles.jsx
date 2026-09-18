function Perfiles({
  datos,
  abrirNuevoPerfil,
  abrirEditarPerfil,
  eliminarPerfil
}) {
  const perfiles = (datos.perfiles || []).filter(
    (perfil) => perfil.estado === true
  );

  const editarPerfil = (perfil) => {
    abrirEditarPerfil(perfil);
  };

  const anularPerfil = (idPerfil) => {
    eliminarPerfil(idPerfil);
  };

  return (
    <section className="min-h-full bg-slate-950 p-4 text-white sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ENCABEZADO */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
              Administración
            </p>

            <h1 className="mt-1 text-3xl font-black text-white">
              Perfiles
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Administra los perfiles y roles disponibles en el sistema.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirNuevoPerfil}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg transition hover:bg-slate-200"
          >
            + Nuevo perfil
          </button>

        </div>

        {/* RESUMEN */}
        <div className="grid gap-4">

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
              Perfiles registrados
            </p>

            <div className="mt-3 flex items-end justify-between">

              <span className="text-3xl font-black text-white">
                {perfiles.length}
              </span>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-xl">
                🛡️
              </div>

            </div>

            <p className="mt-2 text-xs font-bold text-slate-500">
              Perfiles activos del sistema
            </p>
          </div>

        </div>

        {/* TABLA */}
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">

          {perfiles.length === 0 ? (

            <div className="px-6 py-16 text-center">

              <div className="text-5xl">
                🛡️
              </div>

              <h3 className="mt-4 text-xl font-black text-white">
                No hay perfiles registrados
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Agrega el primer perfil al sistema.
              </p>

              <button
                type="button"
                onClick={abrirNuevoPerfil}
                className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-200"
              >
                + Crear perfil
              </button>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px] text-left">

                <thead className="border-b border-slate-800 bg-slate-950">

                  <tr>

                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                      ID
                    </th>

                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                      Perfil
                    </th>

                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                      Estado
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                      Acciones
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-800">

                  {perfiles.map((perfil) => (

                    <tr
                      key={perfil.idPerfil}
                      className="transition hover:bg-slate-950/70"
                    >

                      {/* ID */}
                      <td className="px-6 py-5">

                        <span className="inline-flex rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-black text-slate-400">
                          #{perfil.idPerfil}
                        </span>

                      </td>

                      {/* PERFIL */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-lg">
                            🛡️
                          </div>

                          <div>
                            <p className="text-sm font-black text-white">
                              {perfil.nombre}
                            </p>

                            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                              Perfil del sistema
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* ESTADO */}
                      <td className="px-6 py-5">

                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black text-emerald-400">

                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                          ACTIVO

                        </span>

                      </td>

                      {/* ACCIONES */}
                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() => editarPerfil(perfil)}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-black text-slate-300 transition hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-sky-400"
                          >
                            ✏️ Editar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              anularPerfil(perfil.idPerfil)
                            }
                            className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-2.5 text-xs font-black text-red-400 transition hover:bg-red-950/50"
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

      </div>
    </section>
  );
}

export default Perfiles;
