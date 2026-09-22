import { useState } from "react";

function Alquileres({
  datos,
  formatearMoneda,
  obtenerNombreCliente,
  obtenerNombreVehiculo,
  obtenerPlacaVehiculo,
  obtenerNombreUsuario,
  obtenerVehiculo,
  calcularDias,
  abrirNuevoAlquiler,
  abrirEditarAlquiler,
  eliminarAlquiler,
}) {
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const alquileres = (datos.alquileres || [])
    .filter((alquiler) => alquiler.estado === true)
    .map((alquiler) => {
      const pagos = (datos.pagos || []).filter(
        (pago) =>
          Number(pago.idAlquiler) === Number(alquiler.idAlquiler) ||
          Number(pago.alquiler?.idAlquiler) === Number(alquiler.idAlquiler)
      );

      const vehiculo = obtenerVehiculo(alquiler.idVehiculo);

      const dias =
        Math.max(
          1,
          Number(
            calcularDias(
              alquiler.fechaInicio,
              alquiler.fechaFin
            )
          ) || 1
        );

      const precioDia = Number(vehiculo?.precioDia) || 0;

      const total =
        Number(alquiler.totalAlquiler) ||
        Number(alquiler.total) ||
        dias * precioDia;

      const abonado = pagos.reduce(
        (suma, pago) =>
          suma +
          (Number(pago.monto) ||
            Number(pago.totalPagado) ||
            Number(pago.montoPago) ||
            0),
        0
      );

      const restante = Math.max(0, total - abonado);

      const porcentaje =
        total > 0
          ? Math.min(100, (abonado / total) * 100)
          : 0;

      return {
        alquiler,
        vehiculo,
        dias,
        precioDia,
        total,
        abonado,
        restante,
        porcentaje,
        pagado: restante <= 0.01,

        cliente: obtenerNombreCliente(alquiler.idCliente),

        vehiculoNombre: obtenerNombreVehiculo(
          alquiler.idVehiculo
        ),

        placa: obtenerPlacaVehiculo(
          alquiler.idVehiculo
        ),

        usuario: obtenerNombreUsuario(
          alquiler.idUsuario
        ),
      };
    })
    .filter((item) => {
      const texto = busqueda.toLowerCase().trim();

      const coincideBusqueda =
        !texto ||
        String(item.alquiler.idAlquiler).includes(texto) ||
        String(item.cliente).toLowerCase().includes(texto) ||
        String(item.vehiculoNombre).toLowerCase().includes(texto) ||
        String(item.placa).toLowerCase().includes(texto);

      if (!coincideBusqueda) {
        return false;
      }

      if (filtro === "pagado") {
        return item.pagado;
      }

      if (filtro === "pendiente") {
        return !item.pagado;
      }

      return true;
    });

  const moneda = (valor) =>
    formatearMoneda(Number(valor) || 0);

  const formatearFecha = (fecha) => {
    if (!fecha) return "—";

    const partes = String(fecha).split("-");

    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return fecha;
  };

  const editarAlquiler = (alquiler) => {
    abrirEditarAlquiler(alquiler);
  };

  const anularAlquiler = (id) => {
    eliminarAlquiler(id);
  };

  return (
    <section className="min-h-full bg-slate-950 p-3 text-white sm:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">

        {/* ENCABEZADO */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 sm:text-xs sm:tracking-[0.25em]">
              Gestión
            </p>

            <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
              Alquileres
            </h1>

            <p className="mt-1 hidden text-sm text-slate-500 sm:block">
              Consulta y administra los alquileres activos.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirNuevoAlquiler}
            className="rounded-xl bg-white px-4 py-2.5 text-xs font-black text-slate-950 shadow-lg transition hover:bg-slate-200 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm"
          >
            + Registrar alquiler
          </button>
        </div>

        {/* BÚSQUEDA Y FILTROS */}
        <div className="grid gap-2 md:grid-cols-[1fr_auto] md:gap-3">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar cliente, vehículo, placa..."
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none placeholder:text-slate-600 focus:border-slate-600 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
          />

          <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1 sm:rounded-2xl">
            {[
              ["todos", "Todos"],
              ["pagado", "Pagados"],
              ["pendiente", "Pendientes"],
            ].map(([valor, texto]) => (
              <button
                key={valor}
                type="button"
                onClick={() => setFiltro(valor)}
                className={
                  filtro === valor
                    ? "flex-1 rounded-lg bg-white px-2 py-1.5 text-[9px] font-black text-slate-950 sm:rounded-xl sm:px-4 sm:py-2 sm:text-xs"
                    : "flex-1 rounded-lg px-2 py-1.5 text-[9px] font-black text-slate-500 hover:text-white sm:rounded-xl sm:px-4 sm:py-2 sm:text-xs"
                }
              >
                {texto}
              </button>
            ))}
          </div>
        </div>

        {alquileres.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-12 text-center sm:rounded-3xl sm:px-6 sm:py-16">
            <div className="text-3xl sm:text-4xl">
              📋
            </div>

            <h2 className="mt-3 text-lg font-black text-white sm:mt-4 sm:text-xl">
              No hay alquileres para mostrar
            </h2>

            <p className="mt-2 text-xs text-slate-500 sm:text-sm">
              Prueba otro filtro o registra un nuevo alquiler.
            </p>
          </div>
        ) : (

          /*
            IMPORTANTE:
            2 tarjetas por fila en móvil.
            En escritorio se mantienen 2 columnas.
          */
          <div className="grid grid-cols-2 gap-2 sm:gap-5 xl:grid-cols-2">

            {alquileres.map((item) => {
              const alquiler = item.alquiler;
              const vehiculo = item.vehiculo;

              return (
                <article
                  key={alquiler.idAlquiler}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg transition duration-200 hover:-translate-y-1 hover:border-slate-700 sm:rounded-3xl sm:shadow-xl"
                >

                  {/* CABECERA */}
                  <div className="flex items-start justify-between gap-1 bg-slate-950 px-2.5 py-2.5 sm:px-5 sm:py-4">
                    <div className="min-w-0">
                      <p className="text-[6px] font-black uppercase tracking-[0.12em] text-slate-600 sm:text-[10px] sm:tracking-[0.2em]">
                        Operación
                      </p>

                      <h2 className="mt-0.5 truncate text-[11px] font-black text-white sm:text-xl">
                        ALQUILER #{alquiler.idAlquiler}
                      </h2>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-0.5">
                      <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[6px] font-black text-emerald-400 sm:px-3 sm:py-1 sm:text-[10px]">
                        ACTIVO
                      </span>

                      <span
                        className={
                          item.pagado
                            ? "rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[6px] font-black text-emerald-400 sm:px-3 sm:py-1 sm:text-[10px]"
                            : "rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[6px] font-black text-amber-400 sm:px-3 sm:py-1 sm:text-[10px]"
                        }
                      >
                        {item.pagado ? "PAGADO" : "PENDIENTE"}
                      </span>
                    </div>
                  </div>

                  {/* CONTENIDO */}
                  <div className="space-y-1.5 p-2.5 sm:space-y-4 sm:p-5">

                    {/* CLIENTE / VEHÍCULO */}
                    <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">

                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-2 sm:rounded-2xl sm:p-4">
                        <p className="text-[6px] font-black uppercase tracking-wider text-slate-600 sm:text-[10px]">
                          Cliente
                        </p>

                        <p className="mt-0.5 truncate text-[9px] font-black text-slate-200 sm:mt-1 sm:text-base">
                          {item.cliente}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-2 sm:rounded-2xl sm:p-4">
                        <p className="text-[6px] font-black uppercase tracking-wider text-slate-600 sm:text-[10px]">
                          Vehículo
                        </p>

                        <p className="mt-0.5 truncate text-[9px] font-black text-slate-200 sm:mt-1 sm:text-base">
                          {item.vehiculoNombre}
                        </p>

                        <p className="truncate text-[7px] font-bold text-slate-500 sm:text-xs">
                          {item.placa}
                        </p>
                      </div>

                    </div>

                    {/* USUARIO */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-2 sm:rounded-2xl sm:p-4">
                      <p className="text-[6px] font-black uppercase tracking-wider text-slate-600 sm:text-[10px]">
                        Usuario responsable
                      </p>

                      <p className="mt-0.5 truncate text-[9px] font-black text-slate-200 sm:mt-1 sm:text-base">
                        {item.usuario}
                      </p>
                    </div>

                    {/* FECHAS */}
                    <div className="grid grid-cols-3 gap-1">

                      <div className="rounded-xl bg-slate-950 p-1.5 sm:rounded-2xl sm:p-3">
                        <p className="text-[6px] font-black uppercase text-slate-600 sm:text-[10px]">
                          Inicio
                        </p>

                        <p className="mt-0.5 text-[7px] font-bold text-slate-300 sm:mt-1 sm:text-xs">
                          {formatearFecha(alquiler.fechaInicio)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-950 p-1.5 sm:rounded-2xl sm:p-3">
                        <p className="text-[6px] font-black uppercase text-slate-600 sm:text-[10px]">
                          Fin
                        </p>

                        <p className="mt-0.5 text-[7px] font-bold text-slate-300 sm:mt-1 sm:text-xs">
                          {formatearFecha(alquiler.fechaFin)}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-1.5 sm:rounded-2xl sm:p-3">
                        <p className="text-[6px] font-black uppercase text-slate-600 sm:text-[10px]">
                          Días
                        </p>

                        <p className="mt-0.5 text-[9px] font-black text-white sm:mt-1 sm:text-sm">
                          {item.dias}
                        </p>
                      </div>

                    </div>

                    {/* TOTALES */}
                    <div className="grid grid-cols-3 gap-1">

                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-1.5 sm:rounded-2xl sm:p-3">
                        <p className="text-[6px] font-black uppercase text-slate-600 sm:text-[10px]">
                          Total
                        </p>

                        <p className="mt-0.5 truncate text-[7px] font-black text-white sm:mt-1 sm:text-sm">
                          {moneda(item.total)}
                        </p>
                      </div>

                      <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-1.5 sm:rounded-2xl sm:p-3">
                        <p className="text-[6px] font-black uppercase text-emerald-600 sm:text-[10px]">
                          Abonado
                        </p>

                        <p className="mt-0.5 truncate text-[7px] font-black text-emerald-300 sm:mt-1 sm:text-sm">
                          {moneda(item.abonado)}
                        </p>
                      </div>

                      <div className="rounded-xl border border-amber-900/60 bg-amber-950/30 p-1.5 sm:rounded-2xl sm:p-3">
                        <p className="text-[6px] font-black uppercase text-amber-600 sm:text-[10px]">
                          Restante
                        </p>

                        <p className="mt-0.5 truncate text-[7px] font-black text-amber-300 sm:mt-1 sm:text-sm">
                          {moneda(item.restante)}
                        </p>
                      </div>

                    </div>

                    {/* PROGRESO */}
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800 sm:h-2">
                      <div
                        className={
                          item.pagado
                            ? "h-full rounded-full bg-emerald-500"
                            : "h-full rounded-full bg-amber-500"
                        }
                        style={{
                          width: `${item.porcentaje}%`,
                        }}
                      />
                    </div>

                    {/* PRECIO */}
                    <div className="flex items-center justify-between gap-1 rounded-xl bg-slate-950 px-2 py-1.5 sm:rounded-2xl sm:px-4 sm:py-3">
                      <span className="text-[6px] font-black uppercase tracking-wider text-slate-600 sm:text-xs">
                        Precio / día
                      </span>

                      <span className="text-[8px] font-black text-white sm:text-base">
                        {moneda(vehiculo?.precioDia)}
                      </span>
                    </div>

                    {/* ACCIONES */}
                    <div className="flex gap-1 border-t border-slate-800 pt-2 sm:gap-2 sm:pt-4">

                      <button
                        type="button"
                        onClick={() => editarAlquiler(alquiler)}
                        className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-1 py-1.5 text-[7px] font-black text-white transition hover:bg-slate-700 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
                      >
                        ✏️ <span className="hidden min-[430px]:inline">Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          anularAlquiler(alquiler.idAlquiler)
                        }
                        className="flex-1 rounded-lg border border-red-900/60 bg-red-950/30 px-1 py-1.5 text-[7px] font-black text-red-400 transition hover:bg-red-950/60 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
                      >
                        Anular
                      </button>

                    </div>

                  </div>
                </article>
              );
            })}

          </div>
        )}
      </div>
    </section>
  );
}

export default Alquileres;
