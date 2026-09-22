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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 px-3 backdrop-blur-sm sm:px-4"
      onMouseDown={cerrarModal}
    >

      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl sm:rounded-3xl"
        onMouseDown={(e) => e.stopPropagation()}
      >

        {/* ICONO */}
        <div className="flex justify-center pt-5 sm:pt-8">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-2xl sm:h-16 sm:w-16 sm:rounded-2xl sm:text-3xl">
            ⚠️
          </div>

        </div>

        {/* CONTENIDO */}
        <div className="px-4 pb-4 pt-4 text-center sm:px-8 sm:pb-6 sm:pt-5">

          <h2 className="text-lg font-bold text-white sm:text-xl">
            {titulo}
          </h2>

          <p className="mt-2 text-sm leading-5 text-slate-400 sm:mt-3 sm:leading-6">
            {mensaje}
          </p>

        </div>

        {/* ACCIONES */}
        <div className="flex flex-col-reverse gap-2 border-t border-white/10 bg-slate-900/40 p-4 sm:flex-row sm:justify-center sm:gap-3 sm:p-5">

          <button
            type="button"
            onClick={cerrarModal}
            className="rounded-xl border border-white/10 bg-slate-900 px-6 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white sm:py-3"
          >
            {textoCancelar}
          </button>

          <button
            type="button"
            onClick={confirmar}
            className="rounded-xl bg-red-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-400 sm:py-3"
          >
            {textoConfirmar}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ModalConfirmacion;
