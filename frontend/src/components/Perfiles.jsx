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
    <section className="min-h-full rounded-3xl bg-slate-950 p-3 text-white sm:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">

        {/* ENCABEZADO */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 sm:text-xs sm:tracking-[0.25em]">
              Administración
            </p>

            <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
              Perfiles
            </h1>

            <p className="mt-1 hidden text-sm text-slate-500 sm:block">
              Administra los perfiles y roles disponibles en el sistema.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirNuevoPerfil}
            className="rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 hover:shadow-sky-500/30 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm"
          >
            + Nuevo perfil
          </button>

        </div>

        {/* RESUMEN */}
        <div className="grid gap-3">

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3 shadow-xl sm:rounded-3xl sm:p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-600 sm:text-[10px] sm:tracking-[0.2em]">
                  Perfiles registrados
                </p>

                <span className="mt-1 block text-2xl font-black text-white sm:text-3xl">
                  {perfiles.length}
                </span>

                <p className="mt-1 text-[9px] font-bold text-slate-500 sm:text-xs">
                  Perfiles activos del sistema
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-lg sm:h-11 sm:w-11 sm:rounded-2xl sm:text-xl">
                🛡️
              </div>

            </div>

          </div>

        </div>

        {/* CONTENIDO */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl sm:rounded-3xl">

          {perfiles.length === 0 ? (

            <div className="px-4 py-14 text-center sm:px-6 sm:py-16">

              <div className="text-4xl sm:text-5xl">
                🛡️
              </div>

              <h3 className="mt-3 text-lg font-black text-white sm:mt-4 sm:text-xl">
                No hay perfiles registrados
              </h3>

              <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                Agrega el primer perfil al sistema.
              </p>

              <button
                type="button"
                onClick={abrirNuevoPerfil}
                className="mt-5 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-slate-950 transition hover:bg-slate-200 sm:mt-6 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm"
              >
                + Crear perfil
              </button>

            </div>

          ) : (

            <>
              {/* =========================
                  MÓVIL
              ========================= */}
              <div className="space-y-2 p-2 md:hidden">

                {perfiles.map((perfil) => (

                  <article
                    key={perfil.idPerfil}
                    className="rounded-xl border border-white/10 bg-slate-950 p-3"
                  >

                    <div className="flex items-center gap-2">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-lg">
                        🛡️
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center justify-between gap-2">

                          <p className="truncate text-xs font-black text-white">
                            {perfil.nombre}
                          </p>

                          <span className="shrink-0 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-[8px] font-black text-slate-400">
                            #{perfil.idPerfil}
                          </span>

                        </div>

                        <p className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-600">
                          Perfil del sistema
                        </p>

                      </div>

                    </div>

                    <div className="mt-2 flex items-center justify-between">

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[8px] font-black text-emerald-400">

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                        ACTIVO

                      </span>

                      <div className="flex gap-1.5">

                        <button
                          type="button"
                          onClick={() => editarPerfil(perfil)}
                          className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[8px] font-black text-slate-300 transition hover:border-sky-500/40 hover:text-sky-400"
                        >
                          ✏️
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            anularPerfil(perfil.idPerfil)
                          }
                          className="rounded-lg border border-red-900/50 bg-red-950/20 px-2.5 py-1.5 text-[8px] font-black text-red-400 transition hover:bg-red-950/50"
                        >
                          Anular
                        </button>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

              {/* =========================
                  ESCRITORIO
              ========================= */}
              <div className="hidden overflow-x-auto md:block">

                <table className="w-full text-left">

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

                        <td className="px-6 py-5">

                          <span className="inline-flex rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-black text-slate-400">
                            #{perfil.idPerfil}
                          </span>

                        </td>

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

                        <td className="px-6 py-5">

                          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black text-emerald-400">

                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                            ACTIVO

                          </span>

                        </td>

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
            </>

          )}

        </div>

      </div>
    </section>
  );
}

export default Perfiles;
