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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 backdrop-blur-sm sm:p-4 animate-[fadeIn_.2s_ease-out]"
      onClick={cerrarModal}
    >
      <div
        className="w-[94vw] max-w-2xl overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-900 shadow-2xl shadow-cyan-500/10 animate-[modalEntrada_.3s_ease-out] sm:w-full sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-4 py-3 sm:px-6 sm:py-5">

          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl sm:h-32 sm:w-32" />
          <div className="absolute -left-10 -bottom-10 h-20 w-20 rounded-full bg-blue-500/10 blur-2xl sm:h-24 sm:w-24" />

          <div className="relative flex items-center justify-between">

            <div className="flex min-w-0 items-center gap-3 sm:gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl shadow-lg shadow-cyan-500/20 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-2xl">
                💳
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-black tracking-wide text-white sm:text-xl">
                  {pagoEditando ? "Editar pago" : "Registrar pago"}
                </h2>

                <p className="mt-0.5 truncate text-[9px] font-medium text-slate-400 sm:mt-1 sm:text-xs">
                  Gestiona los abonos y saldos del alquiler
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={cerrarModal}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:scale-110 hover:bg-red-500/20 hover:text-red-400 sm:h-9 sm:w-9 sm:rounded-xl"
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
          className="space-y-3 p-3 sm:space-y-5 sm:p-6"
        >

          {/* ALQUILER */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-300 sm:mb-2 sm:text-xs">
              Alquiler
            </label>

            <select
              value={formPago.idAlquiler || ""}
              onChange={(e) => seleccionarAlquiler(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2.5 text-xs text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
            >
              <option value="">
                Selecciona un alquiler
              </option>

              {datos.alquileres
                .filter(
                  (alquiler) =>
                    alquiler?.estado === true
                )
                .map((alquiler) => {
                  const cliente = obtenerNombreCliente(
                    alquiler.idCliente
                  );

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
            <div className="grid grid-cols-3 gap-2 sm:gap-3">

              {/* TOTAL */}
              <div className="group rounded-xl border border-blue-400/20 bg-blue-500/10 p-2 sm:rounded-2xl sm:p-4">
                <div className="mb-1 flex items-center justify-between sm:mb-2">

                  <span className="text-[8px] font-black uppercase tracking-wider text-blue-300 sm:text-[10px] sm:tracking-widest">
                    Total
                  </span>

                  <span className="text-sm sm:text-lg">
                    🧾
                  </span>

                </div>

                <p className="whitespace-nowrap text-[11px] font-black text-white sm:text-xl">
                  {formatearMonedaLocal(totalAlquiler)}
                </p>
              </div>

              {/* ABONADO */}
              <div className="group rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-2 sm:rounded-2xl sm:p-4">
                <div className="mb-1 flex items-center justify-between sm:mb-2">

                  <span className="text-[8px] font-black uppercase tracking-wider text-emerald-300 sm:text-[10px] sm:tracking-widest">
                    Abonado
                  </span>

                  <span className="text-sm sm:text-lg">
                    ✓
                  </span>

                </div>

                <p className="whitespace-nowrap text-[11px] font-black text-white sm:text-xl">
                  {formatearMonedaLocal(
                    totalPagadoSinEstePago
                  )}
                </p>
              </div>

              {/* RESTANTE */}
              <div
                className={`group rounded-xl border p-2 sm:rounded-2xl sm:p-4 ${
                  saldoDisponible > 0
                    ? "border-amber-400/20 bg-amber-500/10"
                    : "border-emerald-400/20 bg-emerald-500/10"
                }`}
              >
                <div className="mb-1 flex items-center justify-between sm:mb-2">

                  <span
                    className={`text-[8px] font-black uppercase tracking-wider sm:text-[10px] sm:tracking-widest ${
                      saldoDisponible > 0
                        ? "text-amber-300"
                        : "text-emerald-300"
                    }`}
                  >
                    Restante
                  </span>

                  <span className="text-sm sm:text-lg">
                    {saldoDisponible > 0 ? "⚠️" : "✓"}
                  </span>

                </div>

                <p className="whitespace-nowrap text-[11px] font-black text-white sm:text-xl">
                  {formatearMonedaLocal(saldoDisponible)}
                </p>

              </div>

            </div>
          )}

          {/* ALERTA SI YA ESTÁ PAGADO */}
          {alquilerPagado && (
            <div className="flex items-start gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-2.5 text-emerald-200 sm:gap-3 sm:rounded-2xl sm:p-4">

              <span className="text-lg sm:text-xl">
                ✓
              </span>

              <div>
                <p className="text-xs font-bold sm:text-sm">
                  Alquiler completamente pagado
                </p>

                <p className="mt-0.5 text-[9px] text-emerald-300/80 sm:mt-1 sm:text-xs">
                  No es posible registrar un nuevo abono porque el saldo pendiente es Q0.00.
                </p>
              </div>

            </div>
          )}

          {/* FECHA Y MONTO */}
          <div className="grid grid-cols-[1fr_1.2fr] gap-2.5 sm:grid-cols-2 sm:gap-4">

            {/* FECHA */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-300 sm:mb-2 sm:text-xs">
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
                className="w-full rounded-lg border border-white/10 bg-slate-800 px-2.5 py-2.5 text-[11px] text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
              />
            </div>

            {/* MONTO */}
            <div>

              <div className="mb-1.5 flex items-center justify-between sm:mb-2">

                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 sm:text-xs">
                  Monto del abono
                </label>

                {alquilerSeleccionado &&
                  !alquilerPagado && (
                    <span className="text-[8px] font-bold text-cyan-400 sm:text-[10px]">
                      MÁX.{" "}
                      {formatearMonedaLocal(
                        saldoDisponible
                      )}
                    </span>
                  )}

              </div>

              <div className="relative">

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-400 sm:left-4 sm:text-sm">
                  Q
                </span>

                <input
                  type="number"
                  min="0.01"
                  max={
                    saldoDisponible > 0
                      ? saldoDisponible
                      : undefined
                  }
                  step="0.01"
                  value={formPago.monto || ""}
                  onChange={(e) =>
                    cambiarMonto(e.target.value)
                  }
                  disabled={
                    !alquilerSeleccionado ||
                    alquilerPagado
                  }
                  required={!alquilerPagado}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-white/10 bg-slate-800 py-2.5 pl-8 pr-2.5 text-xs font-bold text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-40 sm:rounded-xl sm:py-3 sm:pl-10 sm:pr-4 sm:text-sm"
                />

              </div>
            </div>

          </div>
          {/* PREVISUALIZACIÓN DEL SALDO */}
          {alquilerSeleccionado &&
            montoIngresado > 0 &&
            !alquilerPagado && (
              <div
                className={`rounded-xl border p-2.5 animate-[fadeIn_.2s_ease-out] sm:rounded-2xl sm:p-4 ${
                  pagoCompletaAlquiler
                    ? "border-emerald-400/30 bg-emerald-500/10"
                    : "border-cyan-400/20 bg-cyan-500/10"
                }`}
              >
                <div className="flex items-center justify-between gap-2">

                  <div className="min-w-0">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 sm:text-[10px]">
                      Después de este abono
                    </p>

                    <p className="mt-0.5 truncate text-[10px] font-bold text-white sm:mt-1 sm:text-sm">
                      {pagoCompletaAlquiler
                        ? "✓ El alquiler quedará completamente pagado"
                        : "Saldo pendiente"}
                    </p>
                  </div>

                  <p
                    className={`shrink-0 text-sm font-black sm:text-xl ${
                      pagoCompletaAlquiler
                        ? "text-emerald-400"
                        : "text-cyan-400"
                    }`}
                  >
                    {formatearMonedaLocal(
                      saldoDespuesDelPago
                    )}
                  </p>

                </div>
              </div>
            )}

          {/* FORMA DE PAGO */}
          <div>

            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-300 sm:mb-2 sm:text-xs">
              Forma de pago
            </label>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">

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
                    className={`rounded-xl border p-2 transition duration-200 sm:rounded-2xl sm:p-3 ${
                      seleccionado
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/10"
                        : "border-white/10 bg-slate-800 text-slate-400 hover:-translate-y-1 hover:border-white/20 hover:text-white"
                    }`}
                  >

                    <div className="text-base sm:text-xl">
                      {opcion.icono}
                    </div>

                    <div className="mt-0.5 text-[8px] font-bold sm:mt-1 sm:text-[11px]">
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
          <div className="flex flex-row gap-2 border-t border-white/10 pt-3 sm:justify-end sm:gap-3 sm:pt-5">

            <button
              type="button"
              onClick={cerrarModal}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white sm:flex-none sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm"
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
              className="flex-1 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 px-3 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 sm:flex-none sm:rounded-xl sm:px-6 sm:py-3 sm:text-sm"
            >
              {pagoEditando
                ? "Guardar cambios"
                : "Registrar abono"}
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
