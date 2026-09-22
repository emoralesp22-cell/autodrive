function Clientes({
  datos,
  abrirNuevoCliente,
  abrirEditarCliente,
  eliminarCliente
}) {
  const clientes = (datos.clientes || []).filter(
    (cliente) => cliente.estado === true
  );

  return (
    <section className="space-y-5 sm:space-y-8">

      {/* ENCABEZADO */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">

        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 sm:text-xs sm:tracking-[0.25em]">
            Administración
          </span>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-white sm:mt-2 sm:text-3xl">
            Clientes
          </h2>

          <p className="mt-1 hidden text-sm text-slate-400 sm:block">
            Gestiona la información de los clientes registrados.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirNuevoCliente}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-sky-500/20 transition duration-200 hover:bg-sky-400 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm"
        >
          <span className="text-lg">+</span>
          Nuevo cliente
        </button>

      </div>

      {/* RESUMEN */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3 shadow-xl sm:rounded-3xl sm:p-5">

        <div className="flex items-center justify-between gap-3">

          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-500 sm:text-[10px] sm:tracking-[0.2em]">
              Registro de clientes
            </p>

            <h3 className="mt-1 text-base font-black text-white sm:text-xl">
              Clientes registrados
            </h3>
          </div>

          <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-center sm:rounded-2xl sm:px-4 sm:py-3">
            <p className="text-[8px] font-black uppercase tracking-wider text-sky-400 sm:text-[10px]">
              Total
            </p>

            <p className="mt-0.5 text-xl font-black text-white sm:mt-1 sm:text-2xl">
              {clientes.length}
            </p>
          </div>

        </div>

      </div>

      {/* CONTENIDO */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-2xl sm:rounded-3xl">

        {clientes.length > 0 ? (

          <>
            {/* =========================
                MÓVIL: TARJETAS
            ========================= */}
            <div className="space-y-2 p-2 md:hidden">

              {clientes.map((cliente) => (

                <article
                  key={cliente.idCliente}
                  className="rounded-xl border border-white/10 bg-slate-950 p-3"
                >

                  <div className="flex items-center gap-2">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-400/20 bg-sky-500/10 text-lg">
                      👤
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center justify-between gap-2">

                        <p className="truncate text-xs font-black text-white">
                          {cliente.nombre}
                        </p>

                        <span className="shrink-0 rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-[8px] font-black text-slate-400">
                          #{cliente.idCliente}
                        </span>

                      </div>

                      <p className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-500">
                        Cliente registrado
                      </p>

                    </div>

                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">

                    <div className="rounded-lg bg-slate-900 p-2">
                      <p className="text-[7px] font-black uppercase text-slate-600">
                        DPI
                      </p>

                      <p className="mt-0.5 truncate text-[9px] font-bold text-slate-300">
                        {cliente.dpi}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-900 p-2">
                      <p className="text-[7px] font-black uppercase text-slate-600">
                        Teléfono
                      </p>

                      <p className="mt-0.5 truncate text-[9px] font-bold text-slate-300">
                        {cliente.telefono}
                      </p>
                    </div>

                  </div>

                  <div className="mt-2 flex gap-2">

                    <button
                      type="button"
                      onClick={() => abrirEditarCliente(cliente)}
                      className="flex-1 rounded-lg border border-sky-500/20 bg-sky-500/10 px-2 py-2 text-[9px] font-black text-sky-400 transition hover:bg-sky-500 hover:text-white"
                    >
                      ✏️ Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => eliminarCliente(cliente.idCliente)}
                      className="flex-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-2 text-[9px] font-black text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      Anular
                    </button>

                  </div>

                </article>

              ))}

            </div>

            {/* =========================
                ESCRITORIO: TABLA
            ========================= */}
            <div className="hidden overflow-x-auto md:block">

              <table className="w-full text-left">

                <thead className="border-b border-white/10 bg-slate-950/80">

                  <tr>

                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                      ID
                    </th>

                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                      Cliente
                    </th>

                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                      DPI
                    </th>

                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                      Teléfono
                    </th>

                    <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                      Acciones
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-white/5">

                  {clientes.map((cliente) => (

                    <tr
                      key={cliente.idCliente}
                      className="group transition duration-200 hover:bg-sky-500/[0.04]"
                    >

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-xs font-black text-slate-400">
                          #{cliente.idCliente}
                        </span>
                      </td>

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-500/10 text-xl">
                            👤
                          </div>

                          <div>

                            <p className="text-sm font-black text-white">
                              {cliente.nombre}
                            </p>

                            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Cliente registrado
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-300">
                          {cliente.dpi}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm font-semibold text-slate-300">
                          {cliente.telefono}
                        </span>
                      </td>

                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() => abrirEditarCliente(cliente)}
                            className="rounded-xl border border-sky-500/20 bg-sky-500/10 px-4 py-2.5 text-xs font-black text-sky-400 transition hover:bg-sky-500 hover:text-white"
                          >
                            ✏️ Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => eliminarCliente(cliente.idCliente)}
                            className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-black text-red-400 transition hover:bg-red-500 hover:text-white"
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

        ) : (

          <div className="px-4 py-14 text-center sm:px-6 sm:py-20">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-3xl sm:h-20 sm:w-20 sm:rounded-3xl sm:text-4xl">
              👤
            </div>

            <h3 className="mt-4 text-lg font-black text-white sm:mt-5 sm:text-xl">
              No hay clientes registrados
            </h3>

            <p className="mx-auto mt-2 max-w-md text-xs text-slate-500 sm:text-sm">
              Agrega el primer cliente para comenzar a gestionar
              los registros de AutoDrive.
            </p>

            <button
              type="button"
              onClick={abrirNuevoCliente}
              className="mt-5 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 sm:mt-6 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm"
            >
              + Registrar primer cliente
            </button>

          </div>

        )}

      </div>

    </section>
  );
}

export default Clientes;
