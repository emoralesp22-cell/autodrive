function Pagos({
  datos,
  formatearMoneda,
  obtenerDescripcionAlquiler,
  abrirNuevoPago,
  abrirEditarPago,
  eliminarPago
}) {
  return (
    <section className="space-y-8">

      {/* ENCABEZADO */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-sky-400">
            Finanzas
          </span>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Pagos
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Registro e historial de pagos.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirNuevoPago}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
        >
          <span className="text-lg">+</span>
          Nuevo pago
        </button>

      </div>

      {/* TABLA */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl">

        {datos.pagos.length === 0 ? (

          <div className="px-6 py-16 text-center">

            <div className="text-5xl">💳</div>

            <h3 className="mt-4 text-lg font-bold text-white">
              No hay pagos registrados
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Los pagos registrados aparecerán aquí.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px] text-left">

              <thead className="border-b border-white/10 bg-slate-950/70">

                <tr>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    ID
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    ALQUILER
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    FECHA
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    MONTO
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    FORMA DE PAGO
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    ACCIONES
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-white/5">

                {datos.pagos.map((pago) => (

                  <tr
                    key={pago.idPago}
                    className="transition hover:bg-white/[0.03]"
                  >

                    {/* ID */}
                    <td className="px-6 py-5">

                      <span className="inline-flex rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs font-bold text-slate-400">
                        #{pago.idPago}
                      </span>

                    </td>

                    {/* ALQUILER */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-lg">
                          📋
                        </div>

                        <div>

                          <strong className="block text-sm font-semibold text-white">
                            ALQUILER #{pago.idAlquiler}
                          </strong>

                          <span className="mt-1 block text-xs text-slate-500">
                            {obtenerDescripcionAlquiler(
                              pago.idAlquiler
                            )}
                          </span>

                        </div>

                      </div>

                    </td>

                    {/* FECHA */}
                    <td className="px-6 py-5">

                      <span className="text-sm text-slate-300">
                        {pago.fechaPago}
                      </span>

                    </td>

                    {/* MONTO */}
                    <td className="px-6 py-5">

                      <strong className="text-base font-bold text-emerald-400">
                        {formatearMoneda(pago.monto)}
                      </strong>

                    </td>

                    {/* FORMA DE PAGO */}
                    <td className="px-6 py-5">

                      <span className="inline-flex rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-300">
                        {pago.formaPago}
                      </span>

                    </td>

                    {/* ACCIONES */}
                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => abrirEditarPago(pago)}
                          className="rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-sky-500/40 hover:text-sky-400"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => eliminarPago(pago.idPago)}
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

export default Pagos;
