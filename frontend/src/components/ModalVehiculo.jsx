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
      {/* ==========================================
          ANIMACIONES DEL MODAL
      ========================================== */}
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

      {/* ==========================================
          FONDO
      ========================================== */}
      <div
        className="autodrive-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            cerrarModal();
          }
        }}
      >
        {/* ==========================================
            MODAL
        ========================================== */}
        <div
          className="autodrive-modal w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50"
          onMouseDown={(e) => e.stopPropagation()}
        >

          {/* ==========================================
              ENCABEZADO
          ========================================== */}
          <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/50 px-6 py-6">

            {/* Brillo decorativo */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative flex items-start justify-between gap-4">

              <div className="flex items-center gap-4">

                {/* ICONO */}
                <div className="autodrive-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-500/10 text-3xl shadow-lg shadow-sky-500/10">
                  🚗
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400">
                    AutoDrive
                  </span>

                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
                    {vehiculoEditando
                      ? "Editar vehículo"
                      : "Nuevo vehículo"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {vehiculoEditando
                      ? "Actualiza la información del vehículo."
                      : "Registra un nuevo vehículo en la flota."}
                  </p>
                </div>

              </div>

              {/* CERRAR */}
              <button
                type="button"
                onClick={cerrarModal}
                className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl text-slate-400 transition duration-200 hover:rotate-90 hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-400"
                aria-label="Cerrar"
              >
                ×
              </button>

            </div>

          </div>

          {/* ==========================================
              FORMULARIO
          ========================================== */}
          <form
            onSubmit={guardarVehiculo}
            className="max-h-[75vh] overflow-y-auto"
          >

            <div className="space-y-6 p-6">

              {/* ==========================================
                  DATOS PRINCIPALES
              ========================================== */}
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    Información del vehículo
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Completa los datos básicos de la unidad.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  {/* PLACA */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Placa
                    </label>

                    <input
                      type="text"
                      name="placa"
                      value={formVehiculo.placa || ""}
                      onChange={manejarCambio}
                      placeholder="Ej. P123ABC"
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white uppercase outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    />
                  </div>

                  {/* MARCA */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Marca
                    </label>

                    <input
                      type="text"
                      name="marca"
                      value={formVehiculo.marca || ""}
                      onChange={manejarCambio}
                      placeholder="Ej. Honda"
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    />
                  </div>

                  {/* MODELO */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Modelo
                    </label>

                    <input
                      type="text"
                      name="modelo"
                      value={formVehiculo.modelo || ""}
                      onChange={manejarCambio}
                      placeholder="Ej. Civic"
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    />
                  </div>

                  {/* COLOR */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Color
                    </label>

                    <input
                      type="text"
                      name="color"
                      value={formVehiculo.color || ""}
                      onChange={manejarCambio}
                      placeholder="Ej. Azul Marino"
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    />
                  </div>

                  {/* TIPO */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Tipo
                    </label>

                    <select
                      name="tipo"
                      value={formVehiculo.tipo || ""}
                      onChange={manejarCambio}
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
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
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Precio por día
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
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
                        className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-9 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* ==========================================
                  RESUMEN VISUAL
              ========================================== */}
              <div className="rounded-2xl border border-sky-400/10 bg-sky-500/5 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-xl">
                    🚘
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-sky-400">
                      Vista previa
                    </p>

                    <p className="mt-1 truncate font-semibold text-white">
                      {formVehiculo.marca || "Marca"}{" "}
                      {formVehiculo.modelo || "Modelo"}
                    </p>
                  </div>

                  <div className="ml-auto text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Precio
                    </p>

                    <p className="font-bold text-sky-400">
                      Q{Number(formVehiculo.precioDia || 0).toFixed(2)}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* ==========================================
                BOTONES
            ========================================== */}
            <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-slate-950/40 p-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={cerrarModal}
                className="rounded-xl border border-white/10 bg-slate-800 px-5 py-3 text-sm font-bold text-slate-300 transition duration-200 hover:bg-slate-700 hover:text-white active:scale-[0.98]"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-sky-400 hover:shadow-sky-500/30 active:translate-y-0 active:scale-[0.98]"
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
