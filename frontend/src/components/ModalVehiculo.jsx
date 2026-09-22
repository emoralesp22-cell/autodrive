function ModalVehiculo({
  abierto,
  vehiculoEditando,
  formVehiculo,
  setFormVehiculo,
  guardarVehiculo,
  cerrarModal,
}) {
  if (!abierto) return null;

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormVehiculo({
      ...formVehiculo,
      [name]: value,
    });
  };

  return (
    <>
      <style>
        {`
          @keyframes autodriveBackdrop {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes autodriveModal {
            from {
              opacity: 0;
              transform: translateY(35px) scale(0.94);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes autodriveIcon {
            from {
              opacity: 0;
              transform: scale(0.7) rotate(-8deg);
            }
            to {
              opacity: 1;
              transform: scale(1) rotate(0);
            }
          }

          .autodrive-backdrop {
            animation: autodriveBackdrop 0.25s ease-out forwards;
          }

          .autodrive-modal {
            animation: autodriveModal 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .autodrive-icon {
            animation: autodriveIcon 0.4s ease-out 0.08s both;
          }
        `}
      </style>

      <div
        className="autodrive-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-2 backdrop-blur-md sm:p-4"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            cerrarModal();
          }
        }}
      >

        <div
          className="autodrive-modal w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50 sm:rounded-3xl"
          onMouseDown={(e) => e.stopPropagation()}
        >

          {/* ENCABEZADO */}
          <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/50 px-4 py-4 sm:px-6 sm:py-6">

            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative flex items-start justify-between gap-3">

              <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                <div className="autodrive-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-500/10 text-2xl shadow-lg shadow-sky-500/10 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-3xl">
                  🚗
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400 sm:text-[11px] sm:tracking-[0.25em]">
                    AutoDrive
                  </span>

                  <h2 className="mt-1 truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {vehiculoEditando
                      ? "Editar vehículo"
                      : "Nuevo vehículo"}
                  </h2>

                  <p className="mt-1 hidden text-sm text-slate-400 sm:block">
                    {vehiculoEditando
                      ? "Actualiza la información del vehículo."
                      : "Registra un nuevo vehículo en la flota."}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={cerrarModal}
                className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg text-slate-400 transition duration-200 hover:rotate-90 hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-400 sm:h-10 sm:w-10 sm:text-xl"
                aria-label="Cerrar"
              >
                ×
              </button>

            </div>

          </div>

          {/* FORMULARIO */}
          <form
            onSubmit={guardarVehiculo}
            className="max-h-[78vh] overflow-y-auto"
          >

            <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">

              <div>

                <div className="mb-3 sm:mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    Información del vehículo
                  </h3>

                  <p className="mt-1 hidden text-xs text-slate-500 sm:block">
                    Completa los datos básicos de la unidad.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">

                  {/* PLACA */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400 sm:mb-2">
                      Placa
                    </label>

                    <input
                      type="text"
                      name="placa"
                      value={formVehiculo.placa || ""}
                      onChange={manejarCambio}
                      placeholder="Ej. P123ABC"
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white uppercase outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 sm:px-4 sm:py-3"
                    />
                  </div>

                  {/* MARCA */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400 sm:mb-2">
                      Marca
                    </label>

                    <input
                      type="text"
                      name="marca"
                      value={formVehiculo.marca || ""}
                      onChange={manejarCambio}
                      placeholder="Ej. Honda"
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 sm:px-4 sm:py-3"
                    />
                  </div>

                  {/* MODELO */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400 sm:mb-2">
                      Modelo
                    </label>

                    <input
                      type="text"
                      name="modelo"
                      value={formVehiculo.modelo || ""}
                      onChange={manejarCambio}
                      placeholder="Ej. Civic"
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 sm:px-4 sm:py-3"
                    />
                  </div>

                  {/* COLOR */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400 sm:mb-2">
                      Color
                    </label>

                    <input
                      type="text"
                      name="color"
                      value={formVehiculo.color || ""}
                      onChange={manejarCambio}
                      placeholder="Ej. Azul Marino"
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 sm:px-4 sm:py-3"
                    />
                  </div>

                  {/* TIPO */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400 sm:mb-2">
                      Tipo
                    </label>

                    <select
                      name="tipo"
                      value={formVehiculo.tipo || ""}
                      onChange={manejarCambio}
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 sm:px-4 sm:py-3"
                    >
                      <option value="" disabled>
                        Seleccionar tipo
                      </option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Coupe">Coupe</option>
                      <option value="Minivan">Minivan</option>
                    </select>
                  </div>

                  {/* PRECIO */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400 sm:mb-2">
                      Precio por día
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500 sm:left-4">
                        Q
                      </span>

                      <input
                        type="number"
                        name="precioDia"
                        value={formVehiculo.precioDia || ""}
                        onChange={manejarCambio}
                        placeholder="350"
                        min="1"
                        step="0.01"
                        required
                        className="w-full rounded-xl border border-white/10 bg-slate-950 py-2.5 pl-8 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 sm:py-3 sm:pl-9 sm:pr-4"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* RESUMEN */}
              <div className="rounded-2xl border border-sky-400/10 bg-sky-500/5 p-3 sm:p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-lg sm:h-10 sm:w-10 sm:text-xl">
                    🚘
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-sky-400 sm:text-xs">
                      Vista previa
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-white">
                      {formVehiculo.marca || "Marca"}{" "}
                      {formVehiculo.modelo || "Modelo"}
                    </p>
                  </div>

                  <div className="ml-auto shrink-0 text-right">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 sm:text-[10px]">
                      Precio
                    </p>

                    <p className="text-sm font-bold text-sky-400 sm:text-base">
                      Q{Number(formVehiculo.precioDia || 0).toFixed(2)}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* BOTONES */}
            <div className="flex flex-col-reverse gap-2 border-t border-white/10 bg-slate-950/40 p-4 sm:flex-row sm:justify-end sm:gap-3 sm:p-6">

              <button
                type="button"
                onClick={cerrarModal}
                className="rounded-xl border border-white/10 bg-slate-800 px-5 py-2.5 text-sm font-bold text-slate-300 transition duration-200 hover:bg-slate-700 hover:text-white active:scale-[0.98] sm:py-3"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-sky-400 hover:shadow-sky-500/30 active:translate-y-0 active:scale-[0.98] sm:py-3"
              >
                {vehiculoEditando
                  ? "Guardar cambios"
                  : "Registrar vehículo"}
              </button>

            </div>

          </form>

        </div>
      </div>
    </>
  );
}

export default ModalVehiculo;