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
      console.log("ALQUILER:", alquiler);
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

      const precioDia =
        Number(vehiculo?.precioDia) || 0;

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

      const restante = Math.max(
        0,
        total - abonado
      );

      const porcentaje =
        total > 0
          ? Math.min(
              100,
              (abonado / total) * 100
            )
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

        cliente:
          obtenerNombreCliente(
            alquiler.idCliente
          ),

        vehiculoNombre:
          obtenerNombreVehiculo(
            alquiler.idVehiculo
          ),

        placa:
          obtenerPlacaVehiculo(
            alquiler.idVehiculo
          ),

        usuario:
          obtenerNombreUsuario(
            alquiler.idUsuario
          ),
      };
    })
    .filter((item) => {
      const texto =
        busqueda.toLowerCase().trim();

      const coincideBusqueda =
        !texto ||
        String(
          item.alquiler.idAlquiler
        ).includes(texto) ||
        String(item.cliente)
          .toLowerCase()
          .includes(texto) ||
        String(item.vehiculoNombre)
          .toLowerCase()
          .includes(texto) ||
        String(item.placa)
          .toLowerCase()
          .includes(texto);

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
    <section className="min-h-full bg-slate-950 p-4 text-white sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
              Gestión
            </p>

            <h1 className="mt-1 text-3xl font-black text-white">
              Alquileres
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Consulta y administra los alquileres activos.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirNuevoAlquiler}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg transition hover:bg-slate-200"
          >
            + Registrar alquiler
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
            placeholder="Buscar por cliente, vehículo, placa o número..."
            className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-600"
          />

          <div className="flex rounded-2xl border border-slate-800 bg-slate-900 p-1">
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
                    ? "rounded-xl bg-white px-4 py-2 text-xs font-black text-slate-950"
                    : "rounded-xl px-4 py-2 text-xs font-black text-slate-500 hover:text-white"
                }
              >
                {texto}
              </button>
            ))}
          </div>
        </div>

        {alquileres.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 px-6 py-16 text-center">
            <div className="text-4xl">
              📋
            </div>

            <h2 className="mt-4 text-xl font-black text-white">
              No hay alquileres para mostrar
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Prueba otro filtro o registra un nuevo alquiler.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

          {alquileres.map((item) => {
              const alquiler = item.alquiler;
              const vehiculo = item.vehiculo;

              return (
                <article
                  key={alquiler.idAlquiler}
                  className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl transition duration-200 hover:-translate-y-1 hover:border-slate-700"
                >
                  <div className="flex items-center justify-between bg-slate-950 px-5 py-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                        Operación
                      </p>

                      <h2 className="text-xl font-black text-white">
                        ALQUILER #{alquiler.idAlquiler}
                      </h2>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-black text-emerald-400">
                        ACTIVO
                      </span>

                      <span
                        className={
                          item.pagado
                            ? "rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-black text-emerald-400"
                            : "rounded-full bg-amber-500/15 px-3 py-1 text-[10px] font-black text-amber-400"
                        }
                      >
                        {item.pagado
                          ? "PAGADO"
                          : "PENDIENTE"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                          Cliente
                        </p>

                        <p className="mt-1 font-black text-slate-200">
                          {item.cliente}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                          Vehículo
                        </p>

                        <p className="mt-1 font-black text-slate-200">
                          {item.vehiculoNombre}
                        </p>

                        <p className="text-xs font-bold text-slate-500">
                          {item.placa}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                        Usuario responsable
                      </p>

                      <p className="mt-1 font-black text-slate-200">
                        {item.usuario}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-2xl bg-slate-950 p-3">
                        <p className="text-[10px] font-black uppercase text-slate-600">
                          Inicio
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-300">
                          {formatearFecha(alquiler.fechaInicio)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-950 p-3">
                        <p className="text-[10px] font-black uppercase text-slate-600">
                          Fin
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-300">
                          {formatearFecha(alquiler.fechaFin)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
  <p className="text-[10px] font-black uppercase text-slate-600">
    Días
  </p>

  <p className="mt-1 text-sm font-black text-white">
    {item.dias}
  </p>
</div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                        <p className="text-[10px] font-black uppercase text-slate-600">
                          Total
                        </p>

                        <p className="mt-1 text-sm font-black text-white">
                          {moneda(item.total)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-emerald-900/60 bg-emerald-950/30 p-3">
                        <p className="text-[10px] font-black uppercase text-emerald-600">
                          Abonado
                        </p>

                        <p className="mt-1 text-sm font-black text-emerald-300">
                          {moneda(item.abonado)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-amber-900/60 bg-amber-950/30 p-3">
                        <p className="text-[10px] font-black uppercase text-amber-600">
                          Restante
                        </p>

                        <p className="mt-1 text-sm font-black text-amber-300">
                          {moneda(item.restante)}
                        </p>
                      </div>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
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

                    <div className="flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                        Precio / día
                      </span>

                      <span className="font-black text-white">
                        {moneda(vehiculo?.precioDia)}
                      </span>
                    </div>
                    <div className="flex gap-2 border-t border-slate-800 pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          editarAlquiler(alquiler)
                        }
                        className="flex-1 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-700"
                      >
                        ✏️ Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          anularAlquiler(
                            alquiler.idAlquiler
                          )
                        }
                        className="flex-1 rounded-2xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm font-black text-red-400 transition hover:bg-red-950/60"
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
