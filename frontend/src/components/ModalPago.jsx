function ModalPago({
  abierto,
  pagoEditando,
  formPago,
  setFormPago,
  datos,
  obtenerNombreCliente,
  guardarPago,
  cerrarModal
}) {
  if (!abierto) {
    return null;
  }

  // Buscar el alquiler seleccionado
  const alquilerSeleccionado = datos.alquileres.find(
    (alquiler) =>
      Number(alquiler.idAlquiler) === Number(formPago.idAlquiler)
  );

  // Total del alquiler
  const totalAlquiler = Number(alquilerSeleccionado?.total || 0);

  // Pagos activos del alquiler
  const pagosDelAlquiler = datos.pagos.filter(
    (pago) =>
      Number(pago.idAlquiler) === Number(formPago.idAlquiler) &&
      pago.estado === true
  );

  // Total pagado actualmente
  const totalPagadoActual = pagosDelAlquiler.reduce(
    (total, pago) => total + Number(pago.monto || 0),
    0
  );

  // Si estamos editando un pago, quitamos su monto del cálculo
  // para que pueda conservarse o modificarse correctamente.
  const montoPagoActual = pagoEditando
    ? Number(pagoEditando.monto || 0)
    : 0;

  const totalPagadoSinEstePago = Math.max(
    0,
    totalPagadoActual - montoPagoActual
  );

  // Saldo disponible para este pago
  const saldoDisponible = Math.max(
    0,
    totalAlquiler - totalPagadoSinEstePago
  );

  const montoIngresado = Number(formPago.monto || 0);

  const saldoDespuesDelPago = Math.max(
    0,
    saldoDisponible - montoIngresado
  );

  const alquilerPagado =
    totalAlquiler > 0 && saldoDisponible <= 0;

  const pagoCompletaAlquiler =
    totalAlquiler > 0 &&
    montoIngresado >= saldoDisponible &&
    saldoDisponible > 0;

  const formatearMonedaLocal = (valor) => {
    return `Q ${Number(valor || 0).toLocaleString("es-GT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const cambiarMonto = (valor) => {
    let numero = Number(valor);

    if (Number.isNaN(numero)) {
      numero = 0;
    }

    if (numero < 0) {
      numero = 0;
    }

    if (numero > saldoDisponible) {
      numero = saldoDisponible;
    }

    setFormPago({
      ...formPago,
      monto: numero,
    });
  };

  const seleccionarAlquiler = (idAlquiler) => {
    setFormPago({
      ...formPago,
      idAlquiler,
      monto: "",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-[fadeIn_.2s_ease-out]"
      onClick={cerrarModal}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-900 shadow-2xl shadow-cyan-500/10 animate-[modalEntrada_.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-6 py-5">

          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />
          <div className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />

          <div className="relative flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-2xl shadow-lg shadow-cyan-500/20">
                💳
              </div>

              <div>
                <h2 className="text-xl font-black tracking-wide text-white">
                  {pagoEditando ? "Editar pago" : "Registrar pago"}
                </h2>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Gestiona los abonos y saldos del alquiler
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={cerrarModal}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:scale-110 hover:bg-red-500/20 hover:text-red-400"
            >
              ✕
            </button>

          </div>
        </div>

        {/* FORMULARIO */}
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (montoIngresado <= 0) {
              return;
            }

            if (montoIngresado > saldoDisponible) {
              return;
            }

            guardarPago(e);
          }}
          className="space-y-5 p-6"
        >

          {/* ALQUILER */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
              Alquiler
            </label>

            <select
              value={formPago.idAlquiler || ""}
              onChange={(e) => seleccionarAlquiler(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            >
              <option value="">
                Selecciona un alquiler
              </option>

              {datos.alquileres.map((alquiler) => {
                const cliente = obtenerNombreCliente(alquiler.idCliente);

                const pagos = datos.pagos.filter(
                  (pago) =>
                    Number(pago.idAlquiler) ===
                      Number(alquiler.idAlquiler) &&
                    pago.estado === true
                );

                const pagado = pagos.reduce(
                  (total, pago) =>
                    total + Number(pago.monto || 0),
                  0
                );

                const restante = Math.max(
                  0,
                  Number(alquiler.total || 0) - pagado
                );

                return (
                  <option
                    key={alquiler.idAlquiler}
                    value={alquiler.idAlquiler}
                  >
                    Alquiler #{alquiler.idAlquiler}
                    {" - "}
                    {cliente}
                    {" - "}
                    {formatearMonedaLocal(restante)} pendiente
                  </option>
                );
              })}
            </select>
          </div>

          {/* RESUMEN FINANCIERO */}
          {alquilerSeleccionado && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

              {/* TOTAL */}
              <div className="group rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 transition hover:-translate-y-1 hover:border-blue-400/40">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">
                    Total
                  </span>

                  <span className="text-lg">🧾</span>
                </div>

                <p className="text-xl font-black text-white">
                  {formatearMonedaLocal(totalAlquiler)}
                </p>
              </div>

              {/* ABONADO */}
              <div className="group rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 transition hover:-translate-y-1 hover:border-emerald-400/40">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
                    Abonado
                  </span>

                  <span className="text-lg">✓</span>
                </div>

                <p className="text-xl font-black text-white">
                  {formatearMonedaLocal(totalPagadoSinEstePago)}
                </p>
              </div>

              {/* RESTANTE */}
              <div className={`group rounded-2xl border p-4 transition hover:-translate-y-1 ${
                saldoDisponible > 0
                  ? "border-amber-400/20 bg-amber-500/10 hover:border-amber-400/40"
                  : "border-emerald-400/20 bg-emerald-500/10 hover:border-emerald-400/40"
              }`}>
                <div className="mb-2 flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    saldoDisponible > 0
                      ? "text-amber-300"
                      : "text-emerald-300"
                  }`}>
                    Restante
                  </span>

                  <span className="text-lg">
                    {saldoDisponible > 0 ? "⚠️" : "✓"}
                  </span>
                </div>

                <p className="text-xl font-black text-white">
                  {formatearMonedaLocal(saldoDisponible)}
                </p>
              </div>

            </div>
          )}

          {/* ALERTA SI YA ESTÁ PAGADO */}
          {alquilerPagado && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-200 animate-[fadeIn_.2s_ease-out]">
              <span className="text-xl">✓</span>

              <div>
                <p className="font-bold">
                  Alquiler completamente pagado
                </p>

                <p className="mt-1 text-xs text-emerald-300/80">
                  No es posible registrar un nuevo abono porque el saldo
                  pendiente es Q0.00.
                </p>
              </div>
            </div>
          )}

          {/* FECHA Y MONTO */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* FECHA */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Fecha de pago
              </label>

              <input
                type="date"
                value={formPago.fechaPago || ""}
                onChange={(e) =>
                  setFormPago({
                    ...formPago,
                    fechaPago: e.target.value,
                  })
                }
                required
                className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            {/* MONTO */}
            <div>
              <div className="mb-2 flex items-center justify-between">

                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Monto del abono
                </label>

                {alquilerSeleccionado && !alquilerPagado && (
                  <span className="text-[10px] font-bold text-cyan-400">
                    MÁX. {formatearMonedaLocal(saldoDisponible)}
                  </span>
                )}

              </div>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-cyan-400">
                  Q
                </span>

                <input
                  type="number"
                  min="0.01"
                  max={saldoDisponible > 0 ? saldoDisponible : undefined}
                  step="0.01"
                  value={formPago.monto || ""}
                  onChange={(e) => cambiarMonto(e.target.value)}
                  disabled={!alquilerSeleccionado || alquilerPagado}
                  required={!alquilerPagado}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-white/10 bg-slate-800 py-3 pl-10 pr-4 text-sm font-bold text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-40"
                />

              </div>
            </div>

          </div>

          {/* PREVISUALIZACIÓN DEL SALDO */}
          {alquilerSeleccionado &&
            montoIngresado > 0 &&
            !alquilerPagado && (
              <div className={`rounded-2xl border p-4 animate-[fadeIn_.2s_ease-out] ${
                pagoCompletaAlquiler
                  ? "border-emerald-400/30 bg-emerald-500/10"
                  : "border-cyan-400/20 bg-cyan-500/10"
              }`}>

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Después de este abono
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      {pagoCompletaAlquiler
                        ? "✓ El alquiler quedará completamente pagado"
                        : "Saldo pendiente"}
                    </p>
                  </div>

                  <p className={`text-xl font-black ${
                    pagoCompletaAlquiler
                      ? "text-emerald-400"
                      : "text-cyan-400"
                  }`}>
                    {formatearMonedaLocal(saldoDespuesDelPago)}
                  </p>

                </div>

              </div>
            )}

          {/* FORMA DE PAGO */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
              Forma de pago
            </label>

            <div className="grid grid-cols-3 gap-3">

              {[
                {
                  valor: "Efectivo",
                  icono: "💵",
                },
                {
                  valor: "Tarjeta",
                  icono: "💳",
                },
                {
                  valor: "Transferencia",
                  icono: "🏦",
                },
              ].map((opcion) => {

                const seleccionado =
                  formPago.formaPago === opcion.valor;

                return (
                  <button
                    key={opcion.valor}
                    type="button"
                    onClick={() =>
                      setFormPago({
                        ...formPago,
                        formaPago: opcion.valor,
                      })
                    }
                    className={`rounded-2xl border p-3 transition duration-200 ${
                      seleccionado
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/10"
                        : "border-white/10 bg-slate-800 text-slate-400 hover:-translate-y-1 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="text-xl">
                      {opcion.icono}
                    </div>

                    <div className="mt-1 text-[11px] font-bold">
                      {opcion.valor}
                    </div>
                  </button>
                );
              })}

            </div>

            <input
              type="hidden"
              value={formPago.formaPago || ""}
              required
            />
          </div>

          {/* BOTONES */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={cerrarModal}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                !alquilerSeleccionado ||
                alquilerPagado ||
                montoIngresado <= 0 ||
                montoIngresado > saldoDisponible
              }
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {pagoEditando ? "Guardar cambios" : "Registrar abono"}
            </button>

          </div>

        </form>
      </div>

      {/* ANIMACIONES */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalEntrada {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

    </div>
  );
}

export default ModalPago;
