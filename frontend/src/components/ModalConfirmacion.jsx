function ModalConfirmacion({
  abierto,
  titulo = "¿Confirmar acción?",
  mensaje = "¿Estás seguro de que deseas realizar esta acción?",
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  confirmar,
  cerrarModal
}) {
  if (!abierto) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
      onMouseDown={cerrarModal}
    >

      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >

        {/* ICONO */}
        <div className="flex justify-center pt-8">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-3xl">
            ⚠️
          </div>

        </div>

        {/* CONTENIDO */}
        <div className="px-6 pb-6 pt-5 text-center md:px-8">

          <h2 className="text-xl font-bold text-white">
            {titulo}
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {mensaje}
          </p>

        </div>

        {/* ACCIONES */}
        <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-slate-900/40 p-5 sm:flex-row sm:justify-center">

          <button
            type="button"
            onClick={cerrarModal}
            className="rounded-xl border border-white/10 bg-slate-900 px-6 py-3 text-sm font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            {textoCancelar}
          </button>

          <button
            type="button"
            onClick={confirmar}
            className="rounded-xl bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-400"
          >
            {textoConfirmar}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ModalConfirmacion;
