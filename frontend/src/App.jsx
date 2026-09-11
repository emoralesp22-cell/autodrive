import { useEffect, useMemo, useState } from 'react';
import './App.css';
import logo from './assets/autodrive-logo.jpeg';

const API = 'http://localhost:8080/api';

function App() {

  const [seccion, setSeccion] = useState('inicio');

  const [datos, setDatos] = useState({
    vehiculos: [],
    clientes: [],
    alquileres: [],
    pagos: [],
    usuarios: [],
    perfiles: []
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // =========================
  // MODALES
  // =========================

  const [modalVehiculo, setModalVehiculo] = useState(false);
  const [modalCliente, setModalCliente] = useState(false);
  const [modalAlquiler, setModalAlquiler] = useState(false);
  const [modalPago, setModalPago] = useState(false);
  const [modalUsuario, setModalUsuario] = useState(false);
  const [modalPerfil, setModalPerfil] = useState(false);

  // =========================
  // ELEMENTOS EN EDICIÓN
  // =========================

  const [vehiculoEditando, setVehiculoEditando] = useState(null);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [alquilerEditando, setAlquilerEditando] = useState(null);
  const [pagoEditando, setPagoEditando] = useState(null);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [perfilEditando, setPerfilEditando] = useState(null);

  // =========================
  // FORMULARIOS
  // =========================

  const [formVehiculo, setFormVehiculo] = useState({
    placa: '',
    marca: '',
    modelo: '',
    color: '',
    tipo: '',
    precioDia: ''
  });

  const [formCliente, setFormCliente] = useState({
    nombre: '',
    dpi: '',
    telefono: ''
  });

  const [formAlquiler, setFormAlquiler] = useState({
    idCliente: '',
    idVehiculo: '',
    idUsuario: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const [formPago, setFormPago] = useState({
    idAlquiler: '',
    fechaPago: '',
    monto: '',
    formaPago: ''
  });

  const [formUsuario, setFormUsuario] = useState({
    idPerfil: '',
    nombre: '',
    usuario: '',
    contrasena: '',
    correo: ''
  });

  const [formPerfil, setFormPerfil] = useState({
    nombre: ''
  });

  // =========================
  // CARGAR DATOS
  // =========================

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    setError('');

    try {
      const endpoints = [
        'vehiculos',
        'clientes',
        'alquileres',
        'pagos',
        'usuarios',
        'perfiles'
      ];

      const respuestas = await Promise.all(
        endpoints.map(endpoint =>
          fetch(`${API}/${endpoint}`)
        )
      );

      for (const respuesta of respuestas) {
        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar los datos del servidor.');
        }
      }

      const resultados = await Promise.all(
        respuestas.map(respuesta => respuesta.json())
      );

      setDatos({
        vehiculos: resultados[0],
        clientes: resultados[1],
        alquileres: resultados[2],
        pagos: resultados[3],
        usuarios: resultados[4],
        perfiles: resultados[5]
      });

    } catch (err) {
      console.error(err);
      setError(
        'No se pudo conectar con el backend. Verifica que Spring Boot esté ejecutándose.'
      );
    } finally {
      setCargando(false);
    }
  };

  // =========================
  // PETICIONES
  // =========================

  const realizarPeticion = async (url, opciones = {}) => {

    const respuesta = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(opciones.headers || {})
      },
      ...opciones
    });

    if (!respuesta.ok) {

      let mensajeError = 'Ocurrió un error en la operación.';

      try {
        const texto = await respuesta.text();

        if (texto) {
          mensajeError = texto;
        }
      } catch {
        // Se mantiene el mensaje predeterminado
      }

      throw new Error(mensajeError);
    }

    if (respuesta.status === 204) {
      return null;
    }

    const texto = await respuesta.text();

    return texto ? JSON.parse(texto) : null;
  };

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setError('');

    setTimeout(() => {
      setMensaje('');
    }, 3000);
  };

  const mostrarError = (texto) => {
    setError(texto);
    setMensaje('');

    setTimeout(() => {
      setError('');
    }, 5000);
  };
  // =========================================================
  // VEHÍCULOS
  // =========================================================

  const abrirNuevoVehiculo = () => {

    setVehiculoEditando(null);

    setFormVehiculo({
      placa: '',
      marca: '',
      modelo: '',
      color: '',
      tipo: '',
      precioDia: ''
    });

    setModalVehiculo(true);
  };

  const abrirEditarVehiculo = (vehiculo) => {

    setVehiculoEditando(vehiculo);

    setFormVehiculo({
      placa: vehiculo.placa || '',
      marca: vehiculo.marca || '',
      modelo: vehiculo.modelo || '',
      color: vehiculo.color || '',
      tipo: vehiculo.tipo || '',
      precioDia: vehiculo.precioDia ?? ''
    });

    setModalVehiculo(true);
  };

  const guardarVehiculo = async (e) => {

    e.preventDefault();

    try {

      const datosEnviar = {
        placa: formVehiculo.placa.trim(),
        marca: formVehiculo.marca.trim(),
        modelo: formVehiculo.modelo.trim(),
        color: formVehiculo.color.trim(),
        tipo: formVehiculo.tipo.trim(),
        precioDia: Number(formVehiculo.precioDia)
      };

      if (
        !datosEnviar.placa ||
        !datosEnviar.marca ||
        !datosEnviar.modelo ||
        !datosEnviar.color ||
        !datosEnviar.tipo
      ) {
        throw new Error('Completa todos los campos del vehículo.');
      }

      if (datosEnviar.precioDia <= 0) {
        throw new Error('El precio por día debe ser mayor que cero.');
      }

      if (vehiculoEditando) {

        await realizarPeticion(
          `${API}/vehiculos/${vehiculoEditando.idVehiculo}`,
          {
            method: 'PUT',
            body: JSON.stringify(datosEnviar)
          }
        );

        mostrarMensaje('Vehículo actualizado correctamente.');

      } else {

        await realizarPeticion(
          `${API}/vehiculos`,
          {
            method: 'POST',
            body: JSON.stringify(datosEnviar)
          }
        );

        mostrarMensaje('Vehículo agregado correctamente.');
      }

      setModalVehiculo(false);
      await cargarDatos();

    } catch (err) {
      mostrarError(err.message);
    }
  };

  const eliminarVehiculo = async (id) => {

    if (!window.confirm('¿Deseas anular este vehículo?')) {
      return;
    }

    try {

      await realizarPeticion(
        `${API}/vehiculos/${id}`,
        {
          method: 'DELETE'
        }
      );

      mostrarMensaje('Vehículo anulado correctamente.');

      await cargarDatos();

    } catch (err) {
      mostrarError(err.message);
    }
  };


  // =========================================================
  // CLIENTES
  // =========================================================

  const abrirNuevoCliente = () => {

    setClienteEditando(null);

    setFormCliente({
      nombre: '',
      dpi: '',
      telefono: ''
    });

    setModalCliente(true);
  };

  const abrirEditarCliente = (cliente) => {

    setClienteEditando(cliente);

    setFormCliente({
      nombre: cliente.nombre || '',
      dpi: cliente.dpi || '',
      telefono: cliente.telefono || ''
    });

    setModalCliente(true);
  };

  const guardarCliente = async (e) => {

    e.preventDefault();

    try {

      const datosEnviar = {
        nombre: formCliente.nombre.trim(),
        dpi: formCliente.dpi.trim(),
        telefono: formCliente.telefono.trim()
      };

      if (
        !datosEnviar.nombre ||
        !datosEnviar.dpi ||
        !datosEnviar.telefono
      ) {
        throw new Error('Completa todos los campos del cliente.');
      }

      if (clienteEditando) {

        await realizarPeticion(
          `${API}/clientes/${clienteEditando.idCliente}`,
          {
            method: 'PUT',
            body: JSON.stringify(datosEnviar)
          }
        );

        mostrarMensaje('Cliente actualizado correctamente.');

      } else {

        await realizarPeticion(
          `${API}/clientes`,
          {
            method: 'POST',
            body: JSON.stringify(datosEnviar)
          }
        );

        mostrarMensaje('Cliente agregado correctamente.');
      }

      setModalCliente(false);
      await cargarDatos();

    } catch (err) {
      mostrarError(err.message);
    }
  };

  const eliminarCliente = async (id) => {

    if (!window.confirm('¿Deseas anular este cliente?')) {
      return;
    }

    try {

      await realizarPeticion(
        `${API}/clientes/${id}`,
        {
          method: 'DELETE'
        }
      );

      mostrarMensaje('Cliente anulado correctamente.');

      await cargarDatos();

    } catch (err) {
      mostrarError(err.message);
    }
  };


  // =========================================================
  // ALQUILERES
  // =========================================================

  const abrirNuevoAlquiler = () => {

    setAlquilerEditando(null);

    setFormAlquiler({
      idCliente: '',
      idVehiculo: '',
      idUsuario: '',
      fechaInicio: '',
      fechaFin: ''
    });

    setModalAlquiler(true);
  };

  const abrirEditarAlquiler = (alquiler) => {

    setAlquilerEditando(alquiler);

    setFormAlquiler({
      idCliente: alquiler.idCliente ?? '',
      idVehiculo: alquiler.idVehiculo ?? '',
      idUsuario: alquiler.idUsuario ?? '',
      fechaInicio: alquiler.fechaInicio || '',
      fechaFin: alquiler.fechaFin || ''
    });

    setModalAlquiler(true);
  };

  const guardarAlquiler = async (e) => {

    e.preventDefault();

    try {

      if (
        !formAlquiler.idCliente ||
        !formAlquiler.idVehiculo ||
        !formAlquiler.idUsuario ||
        !formAlquiler.fechaInicio ||
        !formAlquiler.fechaFin
      ) {
        throw new Error('Completa todos los campos del alquiler.');
      }

      if (
        formAlquiler.fechaFin <= formAlquiler.fechaInicio
      ) {
        throw new Error(
          'La fecha de fin debe ser posterior a la fecha de inicio.'
        );
      }

      const datosEnviar = {
        idCliente: Number(formAlquiler.idCliente),
        idVehiculo: Number(formAlquiler.idVehiculo),
        idUsuario: Number(formAlquiler.idUsuario),
        fechaInicio: formAlquiler.fechaInicio,
        fechaFin: formAlquiler.fechaFin
      };

      if (alquilerEditando) {

        await realizarPeticion(
          `${API}/alquileres/${alquilerEditando.idAlquiler}`,
          {
            method: 'PUT',
            body: JSON.stringify(datosEnviar)
          }
        );

        mostrarMensaje('Alquiler actualizado correctamente.');

      } else {

        await realizarPeticion(
          `${API}/alquileres`,
          {
            method: 'POST',
            body: JSON.stringify(datosEnviar)
          }
        );

        mostrarMensaje('Alquiler registrado correctamente.');
      }

      setModalAlquiler(false);
      await cargarDatos();

    } catch (err) {
      mostrarError(err.message);
    }
  };

  const eliminarAlquiler = async (id) => {

    if (!window.confirm('¿Deseas anular este alquiler?')) {
      return;
    }

    try {

      await realizarPeticion(
        `${API}/alquileres/${id}`,
        {
          method: 'DELETE'
        }
      );

      mostrarMensaje('Alquiler anulado correctamente.');

      await cargarDatos();

    } catch (err) {
      mostrarError(err.message);
    }
  };


  // =========================================================
  // PAGOS
  // =========================================================

  const abrirNuevoPago = () => {

    setPagoEditando(null);

    setFormPago({
      idAlquiler: '',
      fechaPago: new Date().toISOString().split('T')[0],
      monto: '',
      formaPago: ''
    });

    setModalPago(true);
  };

  const abrirEditarPago = (pago) => {

    setPagoEditando(pago);

    setFormPago({
      idAlquiler: pago.idAlquiler ?? '',
      fechaPago: pago.fechaPago || '',
      monto: pago.monto ?? '',
      formaPago: pago.formaPago || ''
    });

    setModalPago(true);
  };

  const guardarPago = async (e) => {

    e.preventDefault();

    try {

      const monto = Number(formPago.monto);

      if (
        !formPago.idAlquiler ||
        !formPago.fechaPago ||
        !formPago.formaPago
      ) {
        throw new Error('Completa todos los campos del pago.');
      }

      if (!monto || monto <= 0) {
        throw new Error('El monto debe ser mayor que cero.');
      }

      const datosEnviar = {
        idAlquiler: Number(formPago.idAlquiler),
        fechaPago: formPago.fechaPago,
        monto,
        formaPago: formPago.formaPago
      };

      if (pagoEditando) {

        await realizarPeticion(
          `${API}/pagos/${pagoEditando.idPago}`,
          {
            method: 'PUT',
            body: JSON.stringify(datosEnviar)
          }
        );

        mostrarMensaje('Pago actualizado correctamente.');

      } else {

        await realizarPeticion(
          `${API}/pagos`,
          {
            method: 'POST',
            body: JSON.stringify(datosEnviar)
          }
        );

        mostrarMensaje('Pago registrado correctamente.');
      }

      setModalPago(false);
      await cargarDatos();

    } catch (err) {
      mostrarError(err.message);
    }
  };

  const eliminarPago = async (id) => {

    if (!window.confirm('¿Deseas anular este pago?')) {
      return;
    }

    try {

      await realizarPeticion(
        `${API}/pagos/${id}`,
        {
          method: 'DELETE'
        }
      );

      mostrarMensaje('Pago anulado correctamente.');

      await cargarDatos();

    } catch (err) {
      mostrarError(err.message);
    }
  };
  // =========================================================
  // USUARIOS
  // =========================================================

  const abrirNuevoUsuario = () => {

    setUsuarioEditando(null);

    setFormUsuario({
      idPerfil: '',
      nombre: '',
      usuario: '',
      contrasena: '',
      correo: ''
    });

    setModalUsuario(true);
  };

  const abrirEditarUsuario = (usuario) => {

    setUsuarioEditando(usuario);

    setFormUsuario({
      idPerfil: usuario.idPerfil ?? '',
      nombre: usuario.nombre || '',
      usuario: usuario.usuario || '',
      contrasena: usuario.contrasena || '',
      correo: usuario.correo || ''
    });

    setModalUsuario(true);
  };

  const guardarUsuario = async (e) => {

    e.preventDefault();

    try {

      if (
        !formUsuario.idPerfil ||
        !formUsuario.nombre ||
        !formUsuario.usuario ||
        !formUsuario.contrasena ||
        !formUsuario.correo
      ) {
        throw new Error('Completa todos los campos del usuario.');
      }

      const datosEnviar = {
        idPerfil: Number(formUsuario.idPerfil),
        nombre: formUsuario.nombre.trim(),
        usuario: formUsuario.usuario.trim(),
        contrasena: formUsuario.contrasena,
        correo: formUsuario.correo.trim()
      };

      if (usuarioEditando) {

        await realizarPeticion(
          `${API}/usuarios/${usuarioEditando.idUsuario}`,
          {
            method: 'PUT',
            body: JSON.stringify(datosEnviar)
          }
        );

        mostrarMensaje('Usuario actualizado correctamente.');

      } else {

        await realizarPeticion(
          `${API}/usuarios`,
          {
            method: 'POST',
            body: JSON.stringify(datosEnviar)
          }
        );

        mostrarMensaje('Usuario agregado correctamente.');
      }

      setModalUsuario(false);
      await cargarDatos();

    } catch (err) {
      mostrarError(err.message);
    }
  };

  const eliminarUsuario = async (id) => {

    if (!window.confirm('¿Deseas anular este usuario?')) {
      return;
    }

    try {

      await realizarPeticion(
        `${API}/usuarios/${id}`,
        {
          method: 'DELETE'
        }
      );

      mostrarMensaje('Usuario anulado correctamente.');

      await cargarDatos();

    } catch (err) {
      mostrarError(err.message);
    }
  };


  // =========================================================
  // PERFILES
  // =========================================================

  const abrirNuevoPerfil = () => {

    setPerfilEditando(null);

    setFormPerfil({
      nombre: ''
    });

    setModalPerfil(true);
  };

  const abrirEditarPerfil = (perfil) => {

    setPerfilEditando(perfil);

    setFormPerfil({
      nombre: perfil.nombre || ''
    });

    setModalPerfil(true);
  };

  const guardarPerfil = async (e) => {

    e.preventDefault();

    try {

      if (!formPerfil.nombre.trim()) {
        throw new Error('Ingresa el nombre del perfil.');
      }

      const datosEnviar = {
        nombre: formPerfil.nombre.trim()
      };

      if (perfilEditando) {

        await realizarPeticion(
          `${API}/perfiles/${perfilEditando.idPerfil}`,
          {
            method: 'PUT',
            body: JSON.stringify(datosEnviar)
          }
        );

        mostrarMensaje('Perfil actualizado correctamente.');

      } else {

        await realizarPeticion(
          `${API}/perfiles`,
          {
            method: 'POST',
            body: JSON.stringify(datosEnviar)
          }
        );

        mostrarMensaje('Perfil agregado correctamente.');
      }

      setModalPerfil(false);
      await cargarDatos();

    } catch (err) {
      mostrarError(err.message);
    }
  };

  const eliminarPerfil = async (id) => {

    if (!window.confirm('¿Deseas anular este perfil?')) {
      return;
    }

    try {

      await realizarPeticion(
        `${API}/perfiles/${id}`,
        {
          method: 'DELETE'
        }
      );

      mostrarMensaje('Perfil anulado correctamente.');

      await cargarDatos();

    } catch (err) {
      mostrarError(err.message);
    }
  };


  // =========================================================
  // FUNCIONES AUXILIARES
  // =========================================================

  const obtenerCliente = (id) => {
    return datos.clientes.find(
      cliente => Number(cliente.idCliente) === Number(id)
    );
  };

  const obtenerVehiculo = (id) => {
    return datos.vehiculos.find(
      vehiculo => Number(vehiculo.idVehiculo) === Number(id)
    );
  };

  const obtenerUsuario = (id) => {
    return datos.usuarios.find(
      usuario => Number(usuario.idUsuario) === Number(id)
    );
  };

  const obtenerPerfil = (id) => {
    return datos.perfiles.find(
      perfil => Number(perfil.idPerfil) === Number(id)
    );
  };

  const obtenerAlquiler = (id) => {
    return datos.alquileres.find(
      alquiler => Number(alquiler.idAlquiler) === Number(id)
    );
  };

  const formatearMoneda = (valor) => {

    const numero = Number(valor || 0);

    return numero.toLocaleString('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2
    });
  };

  const calcularDias = (fechaInicio, fechaFin) => {

    if (!fechaInicio || !fechaFin) {
      return 0;
    }

    const inicio = new Date(`${fechaInicio}T00:00:00`);
    const fin = new Date(`${fechaFin}T00:00:00`);

    const diferencia = fin - inicio;

    const dias = Math.round(
      diferencia / (1000 * 60 * 60 * 24)
    );

    return dias > 0 ? dias : 0;
  };

  const vehiculoSeleccionado = useMemo(() => {

    return obtenerVehiculo(formAlquiler.idVehiculo);

  }, [formAlquiler.idVehiculo, datos.vehiculos]);

  const diasAlquiler = calcularDias(
    formAlquiler.fechaInicio,
    formAlquiler.fechaFin
  );

  const totalEstimado =
    vehiculoSeleccionado && diasAlquiler > 0
      ? Number(vehiculoSeleccionado.precioDia) * diasAlquiler
      : 0;

  const obtenerNombreCliente = (id) => {

    const cliente = obtenerCliente(id);

    return cliente ? cliente.nombre : `ID: ${id}`;
  };

  const obtenerNombreVehiculo = (id) => {

    const vehiculo = obtenerVehiculo(id);

    if (!vehiculo) {
      return `ID: ${id}`;
    }

    return `${vehiculo.marca} ${vehiculo.modelo}`;
  };

  const obtenerPlacaVehiculo = (id) => {

    const vehiculo = obtenerVehiculo(id);

    return vehiculo ? vehiculo.placa : '';
  };

  const obtenerNombreUsuario = (id) => {

    const usuario = obtenerUsuario(id);

    return usuario ? usuario.nombre : `ID: ${id}`;
  };

  const obtenerNombrePerfil = (id) => {

    const perfil = obtenerPerfil(id);

    return perfil ? perfil.nombre : `ID: ${id}`;
  };

  const obtenerDescripcionAlquiler = (id) => {

    const alquiler = obtenerAlquiler(id);

    if (!alquiler) {
      return `ID: ${id}`;
    }

    return `#${alquiler.idAlquiler} — ${obtenerNombreCliente(alquiler.idCliente)}`;
  };
  // =========================================================
  // RENDER PRINCIPAL
  // =========================================================

  return (
    <div className="app">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <img src={logo} alt="AutoDrive" />
        </div>

        <nav className="sidebar-menu">

          <button
            className={seccion === 'inicio' ? 'menu-item active' : 'menu-item'}
            onClick={() => setSeccion('inicio')}
          >
            <span className="menu-icon">⌂</span>
            <span>Inicio</span>
          </button>

          <button
            className={seccion === 'vehiculos' ? 'menu-item active' : 'menu-item'}
            onClick={() => setSeccion('vehiculos')}
          >
            <span className="menu-icon">🚗</span>
            <span>Vehículos</span>
          </button>

          <button
            className={seccion === 'clientes' ? 'menu-item active' : 'menu-item'}
            onClick={() => setSeccion('clientes')}
          >
            <span className="menu-icon">👤</span>
            <span>Clientes</span>
          </button>

          <button
            className={seccion === 'alquileres' ? 'menu-item active' : 'menu-item'}
            onClick={() => setSeccion('alquileres')}
          >
            <span className="menu-icon">📋</span>
            <span>Alquileres</span>
          </button>

          <button
            className={seccion === 'pagos' ? 'menu-item active' : 'menu-item'}
            onClick={() => setSeccion('pagos')}
          >
            <span className="menu-icon">💳</span>
            <span>Pagos</span>
          </button>

          <button
            className={seccion === 'usuarios' ? 'menu-item active' : 'menu-item'}
            onClick={() => setSeccion('usuarios')}
          >
            <span className="menu-icon">👨‍💼</span>
            <span>Usuarios</span>
          </button>

          <button
            className={seccion === 'perfiles' ? 'menu-item active' : 'menu-item'}
            onClick={() => setSeccion('perfiles')}
          >
            <span className="menu-icon">🛡️</span>
            <span>Perfiles</span>
          </button>

        </nav>

        <div className="sidebar-footer">
          <span>AutoDrive</span>
          <small>Sistema de alquiler</small>
        </div>

      </aside>


      {/* =========================
          CONTENIDO
      ========================= */}

      <main className="main-content">

        <header className="topbar">

          <div>
            <span className="topbar-label">SISTEMA DE GESTIÓN</span>
            <h1>AutoDrive</h1>
          </div>

          <div className="topbar-status">
            <span className="status-dot"></span>
            Sistema conectado
          </div>

        </header>


        {/* =========================
            MENSAJES
        ========================= */}

        {mensaje && (
          <div className="alert success-alert">
            ✓ {mensaje}
          </div>
        )}

        {error && (
          <div className="alert error-alert">
            ⚠ {error}
          </div>
        )}


        {cargando && (
          <div className="loading">
            Cargando información...
          </div>
        )}


        {/* =====================================================
            INICIO
        ===================================================== */}

        {seccion === 'inicio' && (

          <section className="dashboard">

            <div className="welcome-card">

              <div className="welcome-text">

                <span className="section-kicker">
                  PANEL PRINCIPAL
                </span>

                <h2>Bienvenido a AutoDrive</h2>

                <p>
                  Administra vehículos, clientes, alquileres,
                  pagos y usuarios desde un solo lugar.
                </p>

              </div>

              <img
                src={logo}
                alt="AutoDrive"
                className="welcome-logo"
              />

            </div>


            <div className="stats-grid">

              <StatCard
                icon="🚗"
                title="Vehículos"
                value={datos.vehiculos.length}
                onClick={() => setSeccion('vehiculos')}
              />

              <StatCard
                icon="👤"
                title="Clientes"
                value={datos.clientes.length}
                onClick={() => setSeccion('clientes')}
              />

              <StatCard
                icon="📋"
                title="Alquileres"
                value={datos.alquileres.length}
                onClick={() => setSeccion('alquileres')}
              />

              <StatCard
                icon="💳"
                title="Pagos"
                value={datos.pagos.length}
                onClick={() => setSeccion('pagos')}
              />

            </div>


            <div className="dashboard-grid">

              <div className="dashboard-panel">

                <div className="panel-header">
                  <div>
                    <span className="section-kicker">
                      FLOTA
                    </span>
                    <h3>Vehículos disponibles</h3>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => setSeccion('vehiculos')}
                  >
                    Ver todos →
                  </button>
                </div>

                {datos.vehiculos.length === 0 ? (

                  <div className="empty-state">
                    No hay vehículos disponibles.
                  </div>

                ) : (

                  <div className="mini-vehicles">

                    {datos.vehiculos.slice(0, 4).map(vehiculo => (

                      <div
                        className="mini-vehicle"
                        key={vehiculo.idVehiculo}
                      >

                        <div className="mini-vehicle-icon">
                          🚗
                        </div>

                        <div>
                          <strong>
                            {vehiculo.marca} {vehiculo.modelo}
                          </strong>

                          <span>
                            PLACA: {vehiculo.placa}
                          </span>
                        </div>

                        <b>
                          {formatearMoneda(vehiculo.precioDia)}
                        </b>

                      </div>

                    ))}

                  </div>
                )}

              </div>


              <div className="dashboard-panel">

                <div className="panel-header">

                  <div>
                    <span className="section-kicker">
                      RESUMEN
                    </span>

                    <h3>Estado de la flota</h3>
                  </div>

                </div>

                <FleetStatus
                  disponibles={datos.vehiculos.length}
                  alquileres={datos.alquileres.length}
                />

              </div>

            </div>


            <div className="dashboard-grid">

              <div className="dashboard-panel">

                <div className="panel-header">

                  <div>
                    <span className="section-kicker">
                      ACTIVIDAD
                    </span>

                    <h3>Alquileres recientes</h3>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => setSeccion('alquileres')}
                  >
                    Ver todos →
                  </button>

                </div>

                {datos.alquileres.length === 0 ? (

                  <div className="empty-state">
                    No hay alquileres registrados.
                  </div>

                ) : (

                  <div className="recent-list">

                    {datos.alquileres.slice(-5).reverse().map(alquiler => (

                      <div
                        className="recent-item"
                        key={alquiler.idAlquiler}
                      >

                        <div className="recent-icon">
                          📋
                        </div>

                        <div className="recent-info">

                          <strong>
                            {obtenerNombreCliente(alquiler.idCliente)}
                          </strong>

                          <span>
                            VEHÍCULO: {obtenerNombreVehiculo(alquiler.idVehiculo)}
                          </span>

                        </div>

                        <b>
                          {formatearMoneda(alquiler.total)}
                        </b>

                      </div>

                    ))}

                  </div>
                )}

              </div>


              <div className="dashboard-panel">

                <div className="panel-header">

                  <div>
                    <span className="section-kicker">
                      FINANZAS
                    </span>

                    <h3>Pagos recientes</h3>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => setSeccion('pagos')}
                  >
                    Ver todos →
                  </button>

                </div>

                {datos.pagos.length === 0 ? (

                  <div className="empty-state">
                    No hay pagos registrados.
                  </div>

                ) : (

                  <div className="recent-list">

                    {datos.pagos.slice(-5).reverse().map(pago => (

                      <div
                        className="recent-item"
                        key={pago.idPago}
                      >

                        <div className="recent-icon">
                          💳
                        </div>

                        <div className="recent-info">

                          <strong>
                            {obtenerDescripcionAlquiler(
                              pago.idAlquiler
                            )}
                          </strong>

                          <span>
                            FORMA DE PAGO: {pago.formaPago}
                          </span>

                        </div>

                        <b>
                          {formatearMoneda(pago.monto)}
                        </b>

                      </div>

                    ))}

                  </div>
                )}

              </div>

            </div>

          </section>
        )}
        {/* =====================================================
            INICIO / DASHBOARD
        ===================================================== */}

        {seccion === 'inicio' && (

          <section className="dashboard">

            {/* TARJETA DE BIENVENIDA */}

            <div className="welcome-card">

              <div className="welcome-text">

                <span className="section-kicker">
                  PANEL PRINCIPAL
                </span>

                <h2>
                  Bienvenido a AutoDrive
                </h2>

                <p>
                  Administra vehículos, clientes, alquileres,
                  pagos y usuarios desde un solo lugar.
                </p>

              </div>

              <img
                src={logo}
                alt="AutoDrive"
                className="welcome-logo"
              />

            </div>


            {/* ESTADÍSTICAS */}

            <div className="stats-grid">

              <StatCard
                icon="🚗"
                title="Vehículos"
                value={datos.vehiculos.length}
                onClick={() => setSeccion('vehiculos')}
              />

              <StatCard
                icon="👤"
                title="Clientes"
                value={datos.clientes.length}
                onClick={() => setSeccion('clientes')}
              />

              <StatCard
                icon="📋"
                title="Alquileres"
                value={datos.alquileres.length}
                onClick={() => setSeccion('alquileres')}
              />

              <StatCard
                icon="💳"
                title="Pagos"
                value={datos.pagos.length}
                onClick={() => setSeccion('pagos')}
              />

            </div>


            {/* VEHÍCULOS + ESTADO */}

            <div className="dashboard-grid">

              <div className="dashboard-panel">

                <div className="panel-header">

                  <div>

                    <span className="section-kicker">
                      FLOTA
                    </span>

                    <h3>
                      Vehículos disponibles
                    </h3>

                  </div>

                  <button
                    className="text-button"
                    onClick={() => setSeccion('vehiculos')}
                  >
                    Ver todos →
                  </button>

                </div>


                {datos.vehiculos.length === 0 ? (

                  <div className="empty-state">
                    No hay vehículos disponibles.
                  </div>

                ) : (

                  <div className="mini-vehicles">

                    {datos.vehiculos.slice(0, 4).map(vehiculo => (

                      <div
                        className="mini-vehicle"
                        key={vehiculo.idVehiculo}
                      >

                        <div className="mini-vehicle-icon">
                          🚗
                        </div>

                        <div>

                          <strong>
                            {vehiculo.marca} {vehiculo.modelo}
                          </strong>

                          <span>
                            PLACA: {vehiculo.placa}
                          </span>

                        </div>

                        <b>
                          {formatearMoneda(vehiculo.precioDia)}
                        </b>

                      </div>

                    ))}

                  </div>

                )}

              </div>


              <div className="dashboard-panel">

                <div className="panel-header">

                  <div>

                    <span className="section-kicker">
                      RESUMEN
                    </span>

                    <h3>
                      Estado de la flota
                    </h3>

                  </div>

                </div>

                <FleetStatus
                  disponibles={datos.vehiculos.length}
                  alquileres={datos.alquileres.length}
                />

              </div>

            </div>


            {/* ACTIVIDAD */}

            <div className="dashboard-grid">

              {/* ALQUILERES RECIENTES */}

              <div className="dashboard-panel">

                <div className="panel-header">

                  <div>

                    <span className="section-kicker">
                      ACTIVIDAD
                    </span>

                    <h3>
                      Alquileres recientes
                    </h3>

                  </div>

                  <button
                    className="text-button"
                    onClick={() => setSeccion('alquileres')}
                  >
                    Ver todos →
                  </button>

                </div>


                {datos.alquileres.length === 0 ? (

                  <div className="empty-state">
                    No hay alquileres registrados.
                  </div>

                ) : (

                  <div className="recent-list">

                    {datos.alquileres
                      .slice(-5)
                      .reverse()
                      .map(alquiler => (

                        <div
                          className="recent-item"
                          key={alquiler.idAlquiler}
                        >

                          <div className="recent-icon">
                            📋
                          </div>

                          <div className="recent-info">

                            <strong>
                              {obtenerNombreCliente(
                                alquiler.idCliente
                              )}
                            </strong>

                            <span>
                              VEHÍCULO: {
                                obtenerNombreVehiculo(
                                  alquiler.idVehiculo
                                )
                              }
                            </span>

                          </div>

                          <b>
                            {formatearMoneda(alquiler.total)}
                          </b>

                        </div>

                      ))}

                  </div>

                )}

              </div>


              {/* PAGOS RECIENTES */}

              <div className="dashboard-panel">

                <div className="panel-header">

                  <div>

                    <span className="section-kicker">
                      FINANZAS
                    </span>

                    <h3>
                      Pagos recientes
                    </h3>

                  </div>

                  <button
                    className="text-button"
                    onClick={() => setSeccion('pagos')}
                  >
                    Ver todos →
                  </button>

                </div>


                {datos.pagos.length === 0 ? (

                  <div className="empty-state">
                    No hay pagos registrados.
                  </div>

                ) : (

                  <div className="recent-list">

                    {datos.pagos
                      .slice(-5)
                      .reverse()
                      .map(pago => (

                        <div
                          className="recent-item"
                          key={pago.idPago}
                        >

                          <div className="recent-icon">
                            💳
                          </div>

                          <div className="recent-info">

                            <strong>
                              ALQUILER #{pago.idAlquiler}
                            </strong>

                            <span>
                              FORMA DE PAGO: {pago.formaPago}
                            </span>

                          </div>

                          <b>
                            {formatearMoneda(pago.monto)}
                          </b>

                        </div>

                      ))}

                  </div>

                )}

              </div>

            </div>

          </section>

        )}


        {/* =====================================================
            VEHÍCULOS
        ===================================================== */}

        {seccion === 'vehiculos' && (

          <section className="module-section">

            <div className="module-header">

              <div>

                <span className="section-kicker">
                  ADMINISTRACIÓN
                </span>

                <h2>
                  Vehículos
                </h2>

                <p>
                  Gestiona la flota disponible para alquiler.
                </p>

              </div>

              <button
                className="primary-button"
                onClick={abrirNuevoVehiculo}
              >
                + Nuevo vehículo
              </button>

            </div>


            {datos.vehiculos.length === 0 ? (

              <div className="empty-large">

                <span>
                  🚗
                </span>

                <h3>
                  No hay vehículos registrados
                </h3>

                <p>
                  Agrega el primer vehículo de la flota.
                </p>

              </div>

            ) : (

              <div className="vehicle-grid">

                {datos.vehiculos.map(vehiculo => (

                  <article
                    className="vehicle-card"
                    key={vehiculo.idVehiculo}
                  >

                    <div className="vehicle-card-top">

                      <div className="vehicle-brand-icon">
                        🚗
                      </div>

                      <div className="vehicle-actions">

                        <button
                          className="icon-button"
                          onClick={() =>
                            abrirEditarVehiculo(vehiculo)
                          }
                          title="Editar"
                        >
                          ✎
                        </button>

                        <button
                          className="icon-button danger"
                          onClick={() =>
                            eliminarVehiculo(
                              vehiculo.idVehiculo
                            )
                          }
                          title="Anular"
                        >
                          🗑
                        </button>

                      </div>

                    </div>


                    <div className="vehicle-name">

                      <span>
                        {vehiculo.marca}
                      </span>

                      <h3>
                        {vehiculo.modelo}
                      </h3>

                    </div>


                    <div className="vehicle-plate">
                      PLACA: {vehiculo.placa}
                    </div>


                    <div className="vehicle-details">

                      <div>
                        <span>
                          COLOR:
                        </span>

                        <strong>
                          {vehiculo.color}
                        </strong>
                      </div>

                      <div>
                        <span>
                          TIPO:
                        </span>

                        <strong>
                          {vehiculo.tipo}
                        </strong>
                      </div>

                      <div>
                        <span>
                          PRECIO / DÍA:
                        </span>

                        <strong>
                          {formatearMoneda(
                            vehiculo.precioDia
                          )}
                        </strong>
                      </div>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </section>

        )}


        {/* =====================================================
            CLIENTES
        ===================================================== */}

        {seccion === 'clientes' && (

          <section className="module-section">

            <div className="module-header">

              <div>

                <span className="section-kicker">
                  ADMINISTRACIÓN
                </span>

                <h2>
                  Clientes
                </h2>

                <p>
                  Administra la información de los clientes.
                </p>

              </div>

              <button
                className="primary-button"
                onClick={abrirNuevoCliente}
              >
                + Nuevo cliente
              </button>

            </div>


            <div className="data-table-container">

              <table className="data-table">

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>NOMBRE</th>
                    <th>DPI</th>
                    <th>TELÉFONO</th>
                    <th>ACCIONES</th>
                  </tr>

                </thead>

                <tbody>

                  {datos.clientes.map(cliente => (

                    <tr key={cliente.idCliente}>

                      <td>
                        #{cliente.idCliente}
                      </td>

                      <td>
                        <strong>
                          {cliente.nombre}
                        </strong>
                      </td>

                      <td>
                        DPI: {cliente.dpi}
                      </td>

                      <td>
                        TELÉFONO: {cliente.telefono}
                      </td>

                      <td>

                        <div className="table-actions">

                          <button
                            className="edit-button"
                            onClick={() =>
                              abrirEditarCliente(cliente)
                            }
                          >
                            Editar
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              eliminarCliente(
                                cliente.idCliente
                              )
                            }
                          >
                            Anular
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>


              {datos.clientes.length === 0 && (

                <div className="empty-state">
                  No hay clientes registrados.
                </div>

              )}

            </div>

          </section>

        )}
        {/* =====================================================
            ALQUILERES
        ===================================================== */}

        {seccion === 'alquileres' && (

          <section className="module-section">

            <div className="module-header">

              <div>

                <span className="section-kicker">
                  OPERACIONES
                </span>

                <h2>
                  Alquileres
                </h2>

                <p>
                  Gestiona los alquileres de vehículos.
                </p>

              </div>

              <button
                className="primary-button"
                onClick={abrirNuevoAlquiler}
              >
                + Nuevo alquiler
              </button>

            </div>


            <div className="rental-grid">

              {datos.alquileres.map(alquiler => {

                const vehiculo = obtenerVehiculo(
                  alquiler.idVehiculo
                );

                const dias = calcularDias(
                  alquiler.fechaInicio,
                  alquiler.fechaFin
                );

                return (

                  <article
                    className="rental-card"
                    key={alquiler.idAlquiler}
                  >

                    <div className="rental-header">

                      <div>

                        <span className="rental-number">
                          ALQUILER #{alquiler.idAlquiler}
                        </span>

                        <h3>
                          {obtenerNombreCliente(
                            alquiler.idCliente
                          )}
                        </h3>

                      </div>

                      <span className="active-badge">
                        ACTIVO
                      </span>

                    </div>


                    <div className="rental-info">

                      <div>
                        <span>
                          CLIENTE:
                        </span>

                        <strong>
                          {obtenerNombreCliente(
                            alquiler.idCliente
                          )}
                        </strong>
                      </div>


                      <div>
                        <span>
                          VEHÍCULO:
                        </span>

                        <strong>
                          {obtenerNombreVehiculo(
                            alquiler.idVehiculo
                          )}
                        </strong>
                      </div>


                      <div>
                        <span>
                          PLACA:
                        </span>

                        <strong>
                          {obtenerPlacaVehiculo(
                            alquiler.idVehiculo
                          )}
                        </strong>
                      </div>


                      <div>
                        <span>
                          USUARIO:
                        </span>

                        <strong>
                          {obtenerNombreUsuario(
                            alquiler.idUsuario
                          )}
                        </strong>
                      </div>


                      <div>
                        <span>
                          FECHA INICIO:
                        </span>

                        <strong>
                          {alquiler.fechaInicio}
                        </strong>
                      </div>


                      <div>
                        <span>
                          FECHA FIN:
                        </span>

                        <strong>
                          {alquiler.fechaFin}
                        </strong>
                      </div>


                      <div>
                        <span>
                          DÍAS:
                        </span>

                        <strong>
                          {dias}
                        </strong>
                      </div>

                    </div>


                    <div className="rental-total">

                      <span>
                        TOTAL:
                      </span>

                      <strong>
                        {formatearMoneda(
                          alquiler.total
                        )}
                      </strong>

                    </div>


                    {vehiculo && (

                      <div className="rental-price">

                        PRECIO / DÍA: {
                          formatearMoneda(
                            vehiculo.precioDia
                          )
                        }

                      </div>

                    )}


                    <div className="card-actions">

                      <button
                        className="edit-button"
                        onClick={() =>
                          abrirEditarAlquiler(alquiler)
                        }
                      >
                        Editar
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          eliminarAlquiler(
                            alquiler.idAlquiler
                          )
                        }
                      >
                        Anular
                      </button>

                    </div>

                  </article>

                );

              })}

            </div>


            {datos.alquileres.length === 0 && (

              <div className="empty-large">

                <span>
                  📋
                </span>

                <h3>
                  No hay alquileres registrados
                </h3>

                <p>
                  Registra un nuevo alquiler para comenzar.
                </p>

              </div>

            )}

          </section>

        )}


        {/* =====================================================
            PAGOS
        ===================================================== */}

        {seccion === 'pagos' && (

          <section className="module-section">

            <div className="module-header">

              <div>

                <span className="section-kicker">
                  FINANZAS
                </span>

                <h2>
                  Pagos
                </h2>

                <p>
                  Registro e historial de pagos.
                </p>

              </div>

              <button
                className="primary-button"
                onClick={abrirNuevoPago}
              >
                + Nuevo pago
              </button>

            </div>


            <div className="data-table-container">

              <table className="data-table">

                <thead>

                  <tr>

                    <th>ID</th>
                    <th>ALQUILER</th>
                    <th>FECHA</th>
                    <th>MONTO</th>
                    <th>FORMA DE PAGO</th>
                    <th>ACCIONES</th>

                  </tr>

                </thead>


                <tbody>

                  {datos.pagos.map(pago => (

                    <tr key={pago.idPago}>

                      <td>
                        #{pago.idPago}
                      </td>


                      <td>

                        <strong>
                          ALQUILER #{pago.idAlquiler}
                        </strong>

                        <small className="table-subtext">
                          {obtenerDescripcionAlquiler(
                            pago.idAlquiler
                          )}
                        </small>

                      </td>


                      <td>
                        FECHA: {pago.fechaPago}
                      </td>


                      <td>

                        <strong className="money">
                          {formatearMoneda(
                            pago.monto
                          )}
                        </strong>

                      </td>


                      <td>
                        FORMA DE PAGO: {pago.formaPago}
                      </td>


                      <td>

                        <div className="table-actions">

                          <button
                            className="edit-button"
                            onClick={() =>
                              abrirEditarPago(pago)
                            }
                          >
                            Editar
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              eliminarPago(
                                pago.idPago
                              )
                            }
                          >
                            Anular
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>


              {datos.pagos.length === 0 && (

                <div className="empty-state">
                  No hay pagos registrados.
                </div>

              )}

            </div>

          </section>

        )}
        {/* =====================================================
            USUARIOS
        ===================================================== */}

        {seccion === 'usuarios' && (

          <section className="module-section">

            <div className="module-header">

              <div>

                <span className="section-kicker">
                  ADMINISTRACIÓN
                </span>

                <h2>
                  Usuarios
                </h2>

                <p>
                  Administra los usuarios del sistema.
                </p>

              </div>

              <button
                className="primary-button"
                onClick={abrirNuevoUsuario}
              >
                + Nuevo usuario
              </button>

            </div>


            <div className="user-grid">

              {datos.usuarios.map(usuario => (

                <article
                  className="user-card"
                  key={usuario.idUsuario}
                >

                  <div className="user-avatar">

                    {usuario.nombre
                      ?.charAt(0)
                      ?.toUpperCase() || 'U'}

                  </div>


                  <div className="user-card-info">

                    <span className="user-id">
                      USUARIO #{usuario.idUsuario}
                    </span>

                    <h3>
                      {usuario.nombre}
                    </h3>

                    <div>
                      USUARIO: {usuario.usuario}
                    </div>

                    <div>
                      CORREO: {usuario.correo}
                    </div>

                    <div>
                      PERFIL: {
                        obtenerNombrePerfil(
                          usuario.idPerfil
                        )
                      }
                    </div>

                  </div>


                  <div className="card-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        abrirEditarUsuario(usuario)
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        eliminarUsuario(
                          usuario.idUsuario
                        )
                      }
                    >
                      Anular
                    </button>

                  </div>

                </article>

              ))}

            </div>


            {datos.usuarios.length === 0 && (

              <div className="empty-large">

                <span>
                  👨‍💼
                </span>

                <h3>
                  No hay usuarios registrados
                </h3>

                <p>
                  Agrega un usuario para comenzar.
                </p>

              </div>

            )}

          </section>

        )}


        {/* =====================================================
            PERFILES
        ===================================================== */}

        {seccion === 'perfiles' && (

          <section className="module-section">

            <div className="module-header">

              <div>

                <span className="section-kicker">
                  SEGURIDAD
                </span>

                <h2>
                  Perfiles
                </h2>

                <p>
                  Gestiona los perfiles de acceso.
                </p>

              </div>

              <button
                className="primary-button"
                onClick={abrirNuevoPerfil}
              >
                + Nuevo perfil
              </button>

            </div>


            <div className="profile-grid">

              {datos.perfiles.map(perfil => (

                <article
                  className="profile-card"
                  key={perfil.idPerfil}
                >

                  <div className="profile-icon">
                    🛡️
                  </div>


                  <div>

                    <span>
                      PERFIL #{perfil.idPerfil}
                    </span>

                    <h3>
                      {perfil.nombre}
                    </h3>

                    <p>
                      ESTADO: Activo
                    </p>

                  </div>


                  <div className="card-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        abrirEditarPerfil(perfil)
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        eliminarPerfil(
                          perfil.idPerfil
                        )
                      }
                    >
                      Anular
                    </button>

                  </div>

                </article>

              ))}

            </div>


            {datos.perfiles.length === 0 && (

              <div className="empty-large">

                <span>
                  🛡️
                </span>

                <h3>
                  No hay perfiles registrados
                </h3>

                <p>
                  Agrega un perfil de acceso.
                </p>

              </div>

            )}

          </section>

        )}
        {/* =====================================================
            MODAL VEHÍCULO
        ===================================================== */}

        {modalVehiculo && (

          <div
            className="modal-overlay"
            onMouseDown={() => setModalVehiculo(false)}
          >

            <div
              className="modal"
              onMouseDown={e => e.stopPropagation()}
            >

              <div className="modal-header">

                <div>

                  <span className="section-kicker">
                    FLOTA
                  </span>

                  <h2>
                    {vehiculoEditando
                      ? 'Editar vehículo'
                      : 'Nuevo vehículo'}
                  </h2>

                </div>

                <button
                  className="modal-close"
                  onClick={() => setModalVehiculo(false)}
                >
                  ×
                </button>

              </div>


              <form
                className="modal-form"
                onSubmit={guardarVehiculo}
              >

                <div className="form-grid">

                  <FormInput
                    label="PLACA"
                    value={formVehiculo.placa}
                    onChange={e =>
                      setFormVehiculo({
                        ...formVehiculo,
                        placa: e.target.value
                      })
                    }
                    placeholder="Ej. P250BPM"
                  />


                  <FormInput
                    label="MARCA"
                    value={formVehiculo.marca}
                    onChange={e =>
                      setFormVehiculo({
                        ...formVehiculo,
                        marca: e.target.value
                      })
                    }
                    placeholder="Ej. Toyota"
                  />


                  <FormInput
                    label="MODELO"
                    value={formVehiculo.modelo}
                    onChange={e =>
                      setFormVehiculo({
                        ...formVehiculo,
                        modelo: e.target.value
                      })
                    }
                    placeholder="Ej. RAV4"
                  />


                  <FormInput
                    label="COLOR"
                    value={formVehiculo.color}
                    onChange={e =>
                      setFormVehiculo({
                        ...formVehiculo,
                        color: e.target.value
                      })
                    }
                    placeholder="Ej. Rojo"
                  />


                  <FormInput
                    label="TIPO"
                    value={formVehiculo.tipo}
                    onChange={e =>
                      setFormVehiculo({
                        ...formVehiculo,
                        tipo: e.target.value
                      })
                    }
                    placeholder="Ej. SUV"
                  />


                  <FormInput
                    label="PRECIO / DÍA"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formVehiculo.precioDia}
                    onChange={e =>
                      setFormVehiculo({
                        ...formVehiculo,
                        precioDia: e.target.value
                      })
                    }
                    placeholder="400"
                  />

                </div>


                <div className="modal-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      setModalVehiculo(false)
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                  >
                    {vehiculoEditando
                      ? 'Guardar cambios'
                      : 'Agregar vehículo'}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}


        {/* =====================================================
            MODAL CLIENTE
        ===================================================== */}

        {modalCliente && (

          <div
            className="modal-overlay"
            onMouseDown={() => setModalCliente(false)}
          >

            <div
              className="modal"
              onMouseDown={e => e.stopPropagation()}
            >

              <div className="modal-header">

                <div>

                  <span className="section-kicker">
                    CLIENTES
                  </span>

                  <h2>
                    {clienteEditando
                      ? 'Editar cliente'
                      : 'Nuevo cliente'}
                  </h2>

                </div>

                <button
                  className="modal-close"
                  onClick={() => setModalCliente(false)}
                >
                  ×
                </button>

              </div>


              <form
                className="modal-form"
                onSubmit={guardarCliente}
              >

                <div className="form-grid">

                  <FormInput
                    label="NOMBRE"
                    value={formCliente.nombre}
                    onChange={e =>
                      setFormCliente({
                        ...formCliente,
                        nombre: e.target.value
                      })
                    }
                    placeholder="Nombre completo"
                  />


                  <FormInput
                    label="DPI"
                    value={formCliente.dpi}
                    onChange={e =>
                      setFormCliente({
                        ...formCliente,
                        dpi: e.target.value
                      })
                    }
                    placeholder="Número de DPI"
                  />


                  <FormInput
                    label="TELÉFONO"
                    value={formCliente.telefono}
                    onChange={e =>
                      setFormCliente({
                        ...formCliente,
                        telefono: e.target.value
                      })
                    }
                    placeholder="Número de teléfono"
                  />

                </div>


                <div className="modal-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      setModalCliente(false)
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                  >
                    {clienteEditando
                      ? 'Guardar cambios'
                      : 'Agregar cliente'}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}
        {/* =====================================================
            MODAL ALQUILER
        ===================================================== */}

        {modalAlquiler && (

          <div
            className="modal-overlay"
            onMouseDown={() => setModalAlquiler(false)}
          >

            <div
              className="modal modal-large"
              onMouseDown={e => e.stopPropagation()}
            >

              <div className="modal-header">

                <div>

                  <span className="section-kicker">
                    ALQUILERES
                  </span>

                  <h2>
                    {alquilerEditando
                      ? 'Editar alquiler'
                      : 'Nuevo alquiler'}
                  </h2>

                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setModalAlquiler(false)
                  }
                >
                  ×
                </button>

              </div>


              <form
                className="modal-form"
                onSubmit={guardarAlquiler}
              >

                <div className="form-grid">

                  <FormSelect
                    label="CLIENTE"
                    value={formAlquiler.idCliente}
                    onChange={e =>
                      setFormAlquiler({
                        ...formAlquiler,
                        idCliente: e.target.value
                      })
                    }
                  >

                    <option value="">
                      Seleccionar cliente
                    </option>

                    {datos.clientes.map(cliente => (

                      <option
                        key={cliente.idCliente}
                        value={cliente.idCliente}
                      >
                        {cliente.nombre}
                      </option>

                    ))}

                  </FormSelect>


                  <FormSelect
                    label="VEHÍCULO"
                    value={formAlquiler.idVehiculo}
                    onChange={e =>
                      setFormAlquiler({
                        ...formAlquiler,
                        idVehiculo: e.target.value
                      })
                    }
                  >

                    <option value="">
                      Seleccionar vehículo
                    </option>

                    {datos.vehiculos.map(vehiculo => (

                      <option
                        key={vehiculo.idVehiculo}
                        value={vehiculo.idVehiculo}
                      >
                        {vehiculo.marca} {vehiculo.modelo} — {
                          vehiculo.placa
                        }
                      </option>

                    ))}

                  </FormSelect>


                  <FormSelect
                    label="USUARIO"
                    value={formAlquiler.idUsuario}
                    onChange={e =>
                      setFormAlquiler({
                        ...formAlquiler,
                        idUsuario: e.target.value
                      })
                    }
                  >

                    <option value="">
                      Seleccionar usuario
                    </option>

                    {datos.usuarios.map(usuario => (

                      <option
                        key={usuario.idUsuario}
                        value={usuario.idUsuario}
                      >
                        {usuario.nombre}
                      </option>

                    ))}

                  </FormSelect>


                  <FormInput
                    label="FECHA INICIO"
                    type="date"
                    value={formAlquiler.fechaInicio}
                    onChange={e =>
                      setFormAlquiler({
                        ...formAlquiler,
                        fechaInicio: e.target.value
                      })
                    }
                  />


                  <FormInput
                    label="FECHA FIN"
                    type="date"
                    value={formAlquiler.fechaFin}
                    onChange={e =>
                      setFormAlquiler({
                        ...formAlquiler,
                        fechaFin: e.target.value
                      })
                    }
                  />

                </div>


                <div className="rental-calculator">

                  <div>

                    <span>
                      PRECIO / DÍA:
                    </span>

                    <strong>
                      {vehiculoSeleccionado
                        ? formatearMoneda(
                            vehiculoSeleccionado.precioDia
                          )
                        : '—'}
                    </strong>

                  </div>


                  <div>

                    <span>
                      DÍAS:
                    </span>

                    <strong>
                      {diasAlquiler || '—'}
                    </strong>

                  </div>


                  <div className="calculator-total">

                    <span>
                      TOTAL:
                    </span>

                    <strong>
                      {totalEstimado
                        ? formatearMoneda(totalEstimado)
                        : '—'}
                    </strong>

                  </div>

                </div>


                <p className="form-help">
                  El total será calculado automáticamente
                  según el vehículo y las fechas seleccionadas.
                </p>


                <div className="modal-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      setModalAlquiler(false)
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                  >
                    {alquilerEditando
                      ? 'Guardar cambios'
                      : 'Registrar alquiler'}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}


        {/* =====================================================
            MODAL PAGO
        ===================================================== */}

        {modalPago && (

          <div
            className="modal-overlay"
            onMouseDown={() => setModalPago(false)}
          >

            <div
              className="modal"
              onMouseDown={e => e.stopPropagation()}
            >

              <div className="modal-header">

                <div>

                  <span className="section-kicker">
                    FINANZAS
                  </span>

                  <h2>
                    {pagoEditando
                      ? 'Editar pago'
                      : 'Nuevo pago'}
                  </h2>

                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setModalPago(false)
                  }
                >
                  ×
                </button>

              </div>


              <form
                className="modal-form"
                onSubmit={guardarPago}
              >

                <div className="form-grid">

                  <FormSelect
                    label="ALQUILER"
                    value={formPago.idAlquiler}
                    onChange={e =>
                      setFormPago({
                        ...formPago,
                        idAlquiler: e.target.value
                      })
                    }
                  >

                    <option value="">
                      Seleccionar alquiler
                    </option>

                    {datos.alquileres.map(alquiler => (

                      <option
                        key={alquiler.idAlquiler}
                        value={alquiler.idAlquiler}
                      >
                        #{alquiler.idAlquiler} — {
                          obtenerNombreCliente(
                            alquiler.idCliente
                          )
                        }
                      </option>

                    ))}

                  </FormSelect>


                  <FormInput
                    label="FECHA DE PAGO"
                    type="date"
                    value={formPago.fechaPago}
                    onChange={e =>
                      setFormPago({
                        ...formPago,
                        fechaPago: e.target.value
                      })
                    }
                  />


                  <FormInput
                    label="MONTO"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formPago.monto}
                    onChange={e =>
                      setFormPago({
                        ...formPago,
                        monto: e.target.value
                      })
                    }
                    placeholder="0.00"
                  />


                  <FormSelect
                    label="FORMA DE PAGO"
                    value={formPago.formaPago}
                    onChange={e =>
                      setFormPago({
                        ...formPago,
                        formaPago: e.target.value
                      })
                    }
                  >

                    <option value="">
                      Seleccionar forma de pago
                    </option>

                    <option value="Efectivo">
                      Efectivo
                    </option>

                    <option value="Tarjeta">
                      Tarjeta
                    </option>

                    <option value="Transferencia">
                      Transferencia
                    </option>

                  </FormSelect>

                </div>


                <div className="modal-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      setModalPago(false)
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                  >
                    {pagoEditando
                      ? 'Guardar cambios'
                      : 'Registrar pago'}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}


        {/* =====================================================
            MODAL USUARIO
        ===================================================== */}

        {modalUsuario && (

          <div
            className="modal-overlay"
            onMouseDown={() => setModalUsuario(false)}
          >

            <div
              className="modal modal-large"
              onMouseDown={e => e.stopPropagation()}
            >

              <div className="modal-header">

                <div>

                  <span className="section-kicker">
                    USUARIOS
                  </span>

                  <h2>
                    {usuarioEditando
                      ? 'Editar usuario'
                      : 'Nuevo usuario'}
                  </h2>

                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setModalUsuario(false)
                  }
                >
                  ×
                </button>

              </div>


              <form
                className="modal-form"
                onSubmit={guardarUsuario}
              >

                <div className="form-grid">

                  <FormSelect
                    label="PERFIL"
                    value={formUsuario.idPerfil}
                    onChange={e =>
                      setFormUsuario({
                        ...formUsuario,
                        idPerfil: e.target.value
                      })
                    }
                  >

                    <option value="">
                      Seleccionar perfil
                    </option>

                    {datos.perfiles.map(perfil => (

                      <option
                        key={perfil.idPerfil}
                        value={perfil.idPerfil}
                      >
                        {perfil.nombre}
                      </option>

                    ))}

                  </FormSelect>


                  <FormInput
                    label="NOMBRE"
                    value={formUsuario.nombre}
                    onChange={e =>
                      setFormUsuario({
                        ...formUsuario,
                        nombre: e.target.value
                      })
                    }
                    placeholder="Nombre completo"
                  />


                  <FormInput
                    label="USUARIO"
                    value={formUsuario.usuario}
                    onChange={e =>
                      setFormUsuario({
                        ...formUsuario,
                        usuario: e.target.value
                      })
                    }
                    placeholder="Nombre de usuario"
                  />


                  <FormInput
                    label="CONTRASEÑA"
                    type="password"
                    value={formUsuario.contrasena}
                    onChange={e =>
                      setFormUsuario({
                        ...formUsuario,
                        contrasena: e.target.value
                      })
                    }
                    placeholder="Contraseña"
                  />


                  <FormInput
                    label="CORREO"
                    type="email"
                    value={formUsuario.correo}
                    onChange={e =>
                      setFormUsuario({
                        ...formUsuario,
                        correo: e.target.value
                      })
                    }
                    placeholder="correo@ejemplo.com"
                  />

                </div>


                <div className="modal-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      setModalUsuario(false)
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                  >
                    {usuarioEditando
                      ? 'Guardar cambios'
                      : 'Agregar usuario'}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}


        {/* =====================================================
            MODAL PERFIL
        ===================================================== */}

        {modalPerfil && (

          <div
            className="modal-overlay"
            onMouseDown={() => setModalPerfil(false)}
          >

            <div
              className="modal"
              onMouseDown={e => e.stopPropagation()}
            >

              <div className="modal-header">

                <div>

                  <span className="section-kicker">
                    SEGURIDAD
                  </span>

                  <h2>
                    {perfilEditando
                      ? 'Editar perfil'
                      : 'Nuevo perfil'}
                  </h2>

                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setModalPerfil(false)
                  }
                >
                  ×
                </button>

              </div>


              <form
                className="modal-form"
                onSubmit={guardarPerfil}
              >

                <FormInput
                  label="NOMBRE DEL PERFIL"
                  value={formPerfil.nombre}
                  onChange={e =>
                    setFormPerfil({
                      ...formPerfil,
                      nombre: e.target.value
                    })
                  }
                  placeholder="Ej. Administrador"
                />


                <div className="modal-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      setModalPerfil(false)
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                  >
                    {perfilEditando
                      ? 'Guardar cambios'
                      : 'Agregar perfil'}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}
// =========================================================
// COMPONENTE INPUT
// =========================================================

function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  min,
  step
}) {

  return (

    <div className="form-group">

      <label>
        {label}:
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        step={step}
      />

    </div>

  );
}


// =========================================================
// COMPONENTE SELECT
// =========================================================

function FormSelect({
  label,
  value,
  onChange,
  children
}) {

  return (

    <div className="form-group">

      <label>
        {label}:
      </label>

      <select
        value={value}
        onChange={onChange}
      >
        {children}
      </select>

    </div>

  );
}


// =========================================================
// TARJETA DE ESTADÍSTICA
// =========================================================

function StatCard({
  icon,
  title,
  value,
  onClick
}) {

  return (

    <button
      className="stat-card"
      onClick={onClick}
    >

      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-content">

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

      </div>

      <span className="stat-arrow">
        →
      </span>

    </button>

  );
}


// =========================================================
// ESTADO DE FLOTA
// =========================================================

function FleetStatus({
  disponibles,
  alquileres
}) {

  const total = disponibles + alquileres;

  const porcentaje =
    total > 0
      ? Math.round((disponibles / total) * 100)
      : 0;

  return (

    <div className="fleet-status">

      <div className="fleet-number">

        <strong>
          {disponibles}
        </strong>

        <span>
          vehículos disponibles
        </span>

      </div>


      <div className="fleet-bar">

        <div
          className="fleet-bar-fill"
          style={{
            width: `${porcentaje}%`
          }}
        />

      </div>


      <div className="fleet-legend">

        <span>
          DISPONIBLES: {disponibles}
        </span>

        <span>
          ALQUILERES ACTIVOS: {alquileres}
        </span>

      </div>

    </div>

  );
}


export default App;
