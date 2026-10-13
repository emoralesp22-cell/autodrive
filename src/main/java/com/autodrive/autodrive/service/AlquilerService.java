package com.autodrive.autodrive.service;

import com.autodrive.autodrive.dto.AlquilerDTO;
import com.autodrive.autodrive.model.Alquiler;
import com.autodrive.autodrive.model.Cliente;
import com.autodrive.autodrive.model.Usuario;
import com.autodrive.autodrive.model.Vehiculo;
import com.autodrive.autodrive.repository.AlquilerRepository;
import com.autodrive.autodrive.repository.ClienteRepository;
import com.autodrive.autodrive.repository.PagoRepository;
import com.autodrive.autodrive.repository.UsuarioRepository;
import com.autodrive.autodrive.repository.VehiculoRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AlquilerService {

    private final AlquilerRepository alquilerRepository;
    private final ClienteRepository clienteRepository;
    private final VehiculoRepository vehiculoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PagoRepository pagoRepository;

    public AlquilerService(
            AlquilerRepository alquilerRepository,
            ClienteRepository clienteRepository,
            VehiculoRepository vehiculoRepository,
            UsuarioRepository usuarioRepository,
            PagoRepository pagoRepository) {

        this.alquilerRepository = alquilerRepository;
        this.clienteRepository = clienteRepository;
        this.vehiculoRepository = vehiculoRepository;
        this.usuarioRepository = usuarioRepository;
        this.pagoRepository = pagoRepository;
    }

    @Transactional(readOnly = true)
    public List<AlquilerDTO> listar() {
        List<Alquiler> alquileres = alquilerRepository.findAll();
        Set<Integer> alquileresConPagos = pagoRepository.findAll()
                .stream()
                .filter(pago -> pago.getAlquiler() != null)
                .map(pago -> pago.getAlquiler().getIdAlquiler())
                .collect(Collectors.toSet());

        return alquileres.stream()
                .map(alquiler -> convertirADTO(
                        alquiler,
                        alquileresConPagos.contains(alquiler.getIdAlquiler())
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AlquilerDTO buscarPorId(Integer id) {
        Alquiler alquiler = alquilerRepository.findById(id)
                .filter(a -> Boolean.TRUE.equals(a.getEstado()))
                .orElseThrow(
                        () -> new RuntimeException("Alquiler no encontrado")
                );

        return convertirADTO(alquiler);
    }

    @Transactional
    public AlquilerDTO guardar(AlquilerDTO dto) {

        if (dto == null
                || dto.getIdCliente() == null
                || dto.getIdVehiculo() == null
                || dto.getIdUsuario() == null
                || dto.getFechaInicio() == null
                || dto.getFechaFin() == null) {

            throw new IllegalArgumentException(
                    "Completa todos los campos del alquiler."
            );
        }

        if (!dto.getFechaFin().isAfter(dto.getFechaInicio())) {
            throw new IllegalArgumentException(
                    "La fecha de fin debe ser posterior a la fecha de inicio."
            );
        }

        Cliente cliente = clienteRepository.findById(dto.getIdCliente())
                .filter(c -> Boolean.TRUE.equals(c.getEstado()))
                .orElseThrow(
                        () -> new RuntimeException("Cliente no encontrado o inactivo")
                );

        Vehiculo vehiculo = vehiculoRepository.findById(dto.getIdVehiculo())
                .filter(v -> Boolean.TRUE.equals(v.getEstado()))
                .orElseThrow(
                        () -> new RuntimeException("Vehículo no encontrado o inactivo")
                );

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .filter(u -> Boolean.TRUE.equals(u.getEstado()))
                .orElseThrow(
                        () -> new RuntimeException("Usuario no encontrado o inactivo")
                );

        long dias = ChronoUnit.DAYS.between(
                dto.getFechaInicio(),
                dto.getFechaFin()
        );

        BigDecimal precioDia = vehiculo.getPrecioDia();

        if (precioDia == null
                || precioDia.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "El vehículo no tiene un precio por día válido."
            );
        }

        BigDecimal total = precioDia.multiply(
                BigDecimal.valueOf(dias)
        );

        Alquiler alquiler = new Alquiler();
        alquiler.setCliente(cliente);
        alquiler.setVehiculo(vehiculo);
        alquiler.setUsuario(usuario);
        alquiler.setFechaInicio(dto.getFechaInicio());
        alquiler.setFechaFin(dto.getFechaFin());
        alquiler.setTotal(total);
        alquiler.setEstado(true);

        Alquiler guardado = alquilerRepository.save(alquiler);

        return convertirADTO(guardado);
    }

    @Transactional
    public AlquilerDTO actualizar(Integer id, AlquilerDTO dto) {

        Alquiler alquiler = alquilerRepository.findById(id)
                .filter(a -> Boolean.TRUE.equals(a.getEstado()))
                .orElseThrow(
                        () -> new RuntimeException("Alquiler no encontrado")
                );

        // Se bloquea cualquier modificación si existe historial de pagos,
        // aunque los pagos estén anulados.
        if (tienePagosRegistrados(id)) {
            throw new IllegalArgumentException(
                    "No se puede modificar el alquiler #" + id
                    + " porque tiene pagos registrados, incluidos los anulados. "
                    + "Para conservar el historial financiero, sus datos originales no se pueden cambiar."
            );
        }

        if (dto == null
                || dto.getIdCliente() == null
                || dto.getIdVehiculo() == null
                || dto.getIdUsuario() == null
                || dto.getFechaInicio() == null
                || dto.getFechaFin() == null) {

            throw new IllegalArgumentException(
                    "Completa todos los campos del alquiler."
            );
        }

        if (!dto.getFechaFin().isAfter(dto.getFechaInicio())) {
            throw new IllegalArgumentException(
                    "La fecha de fin debe ser posterior a la fecha de inicio."
            );
        }

        Cliente cliente = clienteRepository.findById(dto.getIdCliente())
                .filter(c -> Boolean.TRUE.equals(c.getEstado()))
                .orElseThrow(
                        () -> new RuntimeException("Cliente no encontrado o inactivo")
                );

        Vehiculo vehiculo = vehiculoRepository.findById(dto.getIdVehiculo())
                .filter(v -> Boolean.TRUE.equals(v.getEstado()))
                .orElseThrow(
                        () -> new RuntimeException("Vehículo no encontrado o inactivo")
                );

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .filter(u -> Boolean.TRUE.equals(u.getEstado()))
                .orElseThrow(
                        () -> new RuntimeException("Usuario no encontrado o inactivo")
                );

        BigDecimal precioDia = vehiculo.getPrecioDia();

        if (precioDia == null
                || precioDia.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "El vehículo no tiene un precio por día válido."
            );
        }

        long dias = ChronoUnit.DAYS.between(
                dto.getFechaInicio(),
                dto.getFechaFin()
        );

        BigDecimal nuevoTotal = precioDia.multiply(
                BigDecimal.valueOf(dias)
        );

        BigDecimal totalPagado =
                pagoRepository.sumarPagosActivosPorAlquiler(id);

        if (totalPagado == null) {
            totalPagado = BigDecimal.ZERO;
        }

        if (totalPagado.compareTo(BigDecimal.ZERO) > 0
                && nuevoTotal.compareTo(totalPagado) < 0) {

            throw new IllegalStateException(
                    "No se puede reducir el total del alquiler a Q"
                    + nuevoTotal.toPlainString()
                    + " porque ya se han registrado pagos por Q"
                    + totalPagado.toPlainString()
                    + ". Ajusta las fechas o el vehículo sin dejar "
                    + "el total por debajo de lo abonado."
            );
        }

        alquiler.setCliente(cliente);
        alquiler.setVehiculo(vehiculo);
        alquiler.setUsuario(usuario);
        alquiler.setFechaInicio(dto.getFechaInicio());
        alquiler.setFechaFin(dto.getFechaFin());
        alquiler.setTotal(nuevoTotal);

        Alquiler actualizado = alquilerRepository.save(alquiler);

        return convertirADTO(actualizado);
    }

    @Transactional
    public void eliminar(Integer id) {

        Alquiler alquiler = alquilerRepository.findById(id)
                .filter(a -> Boolean.TRUE.equals(a.getEstado()))
                .orElseThrow(
                        () -> new RuntimeException("Alquiler no encontrado")
                );

        if (tienePagosRegistrados(id)) {
            throw new IllegalArgumentException(
                    "No se puede anular el alquiler #" + id
                    + " porque tiene pagos registrados, incluidos los anulados. "
                    + "Para conservar el historial financiero, no se permite anularlo."
            );
        }

        alquiler.setEstado(false);
        alquilerRepository.save(alquiler);
    }

    private boolean tienePagosRegistrados(Integer idAlquiler) {
        return pagoRepository.findAll()
                .stream()
                .anyMatch(pago -> pago.getAlquiler() != null
                        && idAlquiler.equals(pago.getAlquiler().getIdAlquiler()));
    }

    private AlquilerDTO convertirADTO(Alquiler alquiler) {
        return convertirADTO(alquiler, tienePagosRegistrados(alquiler.getIdAlquiler()));
    }

    private AlquilerDTO convertirADTO(Alquiler alquiler, boolean tienePagos) {
        return new AlquilerDTO(
                alquiler.getIdAlquiler(),
                alquiler.getCliente().getIdCliente(),
                alquiler.getVehiculo().getIdVehiculo(),
                alquiler.getUsuario().getIdUsuario(),
                alquiler.getFechaInicio(),
                alquiler.getFechaFin(),
                alquiler.getTotal(),
                alquiler.getEstado(),
                tienePagos
        );
    }
}
