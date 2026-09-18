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
    <section className="space-y-8">

      {/* ENCABEZADO */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

        <div>
          <span className="text-xs font-black uppercase tracking-[0.25em] text-sky-400">
            Administración
          </span>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
            Clientes
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Gestiona la información de los clientes registrados.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirNuevoCliente}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-sky-400 hover:shadow-sky-500/30"
        >
          <span className="text-lg">+</span>
          Nuevo cliente
        </button>

      </div>

      {/* RESUMEN */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Registro de clientes
            </p>

            <h3 className="mt-1 text-xl font-black text-white">
              Clientes registrados
            </h3>
          </div>

          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-center">
            <p className="text-[10px] font-black uppercase tracking-wider text-sky-400">
              Total
            </p>

            <p className="mt-1 text-2xl font-black text-white">
              {clientes.length}
            </p>
          </div>

        </div>

      </div>

      {/* TABLA */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl">

        {clientes.length > 0 ? (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[760px] text-left">

              {/* CABECERA */}
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

              {/* CUERPO */}
              <tbody className="divide-y divide-white/5">

                {clientes.map((cliente) => (

                  <tr
                    key={cliente.idCliente}
                    className="group transition duration-200 hover:bg-sky-500/[0.04]"
                  >

                    {/* ID */}
                    <td className="px-6 py-5">

                      <span className="inline-flex rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-xs font-black text-slate-400">
                        #{cliente.idCliente}
                      </span>

                    </td>

                    {/* CLIENTE */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-500/10 text-xl shadow-inner">
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

                    {/* DPI */}
                    <td className="px-6 py-5">

                      <span className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-300">
                        {cliente.dpi}
                      </span>

                    </td>

                    {/* TELÉFONO */}
                    <td className="px-6 py-5">

                      <span className="text-sm font-semibold text-slate-300">
                        {cliente.telefono}
                      </span>

                    </td>

                    {/* ACCIONES */}
                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => abrirEditarCliente(cliente)}
                          className="rounded-xl border border-sky-500/20 bg-sky-500/10 px-4 py-2.5 text-xs font-black text-sky-400 transition duration-200 hover:-translate-y-0.5 hover:bg-sky-500 hover:text-white hover:shadow-lg hover:shadow-sky-500/20"
                        >
                          ✏️ Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => eliminarCliente(cliente.idCliente)}
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

        ) : (

          /* SIN CLIENTES */
          <div className="px-6 py-20 text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-sky-500/20 bg-sky-500/10 text-4xl">
              👤
            </div>

            <h3 className="mt-5 text-xl font-black text-white">
              No hay clientes registrados
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Agrega el primer cliente para comenzar a gestionar
              los registros de AutoDrive.
            </p>

            <button
              type="button"
              onClick={abrirNuevoCliente}
              className="mt-6 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
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
