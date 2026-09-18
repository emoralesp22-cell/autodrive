function Sidebar({ section, setSection, logo }) {
  const opciones = [
    { id: "inicio", nombre: "Inicio", icono: "⌂" },
    { id: "vehiculos", nombre: "Vehículos", icono: "🚗" },
    { id: "clientes", nombre: "Clientes", icono: "👤" },
    { id: "alquileres", nombre: "Alquileres", icono: "📋" },
    { id: "pagos", nombre: "Pagos", icono: "💳" },
    { id: "usuarios", nombre: "Usuarios", icono: "👥" },
    { id: "perfiles", nombre: "Perfiles", icono: "🛡️" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-white/10 bg-slate-950 text-white shadow-2xl">

      {/* LOGO */}
      <div className="flex h-24 items-center gap-3 border-b border-white/10 px-5">

        {logo ? (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-900 p-1">
            <img
              src={logo}
              alt="AutoDrive"
              className="h-full w-full rounded-lg object-contain"
            />
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
            🚗
          </div>
        )}

        <div>
          <h1 className="text-lg font-black tracking-tight">
            AutoDrive
          </h1>

          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">
            Sistema de gestión
          </p>
        </div>
      </div>

      {/* MENÚ */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6">

        <p className="mb-4 px-3 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
          Menú principal
        </p>

        {opciones.map((opcion) => {
          const activo = section === opcion.id;

          return (
            <button
              key={opcion.id}
              type="button"
              onClick={() => setSection(opcion.id)}
              className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition-all duration-200 ${
                activo
                  ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/10"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >

              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition ${
                  activo
                    ? "bg-slate-950/10"
                    : "bg-white/5 group-hover:bg-cyan-400/10"
                }`}
              >
                {opcion.icono}
              </span>

              <span className="flex-1">
                {opcion.nombre}
              </span>

              {activo && (
                <span className="h-2 w-2 rounded-full bg-slate-950" />
              )}

            </button>
          );
        })}
      </nav>

      {/* PIE */}
      <div className="border-t border-white/10 p-4">

        <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-4">

          <p className="text-xs font-black text-white">
            AutoDrive
          </p>

          <p className="mt-1 text-[10px] text-slate-500">
            Sistema de alquiler
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-[10px] font-semibold text-emerald-300">
              Sistema conectado
            </span>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;
