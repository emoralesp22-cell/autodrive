package com.autodrive.autodrive.service;

import com.autodrive.autodrive.dto.PagoDTO;
import com.autodrive.autodrive.model.Alquiler;
import com.autodrive.autodrive.model.Pago;
import com.autodrive.autodrive.repository.AlquilerRepository;
import com.autodrive.autodrive.repository.PagoRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PagoService {

    private static final Set<String> FORMAS_PAGO =
            Set.of("Efectivo", "Tarjeta", "Transferencia");
    private static final int MAX_MOTIVO = 500;

    private final PagoRepository pagoRepository;
    private final AlquilerRepository alquilerRepository;

    public PagoService(
            PagoRepository pagoRepository,
            AlquilerRepository alquilerRepository) {
        this.pagoRepository = pagoRepository;
        this.alquilerRepository = alquilerRepository;
    }

    // Lista normal: solo pagos válidos para no contar anulaciones en otros módulos.
    @Transactional(readOnly = true)
    public List<PagoDTO> listar() {
        return pagoRepository.findAll()
                .stream()
                .filter(p -> Boolean.TRUE.equals(p.getEstado()))
                .sorted(Comparator.comparing(Pago::getIdPago))
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Historial completo: incluye pagos activos y anulados.
    @Transactional(readOnly = true)
    public List<PagoDTO> listarHistorial() {
        return pagoRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Pago::getIdPago))
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PagoDTO buscarPorId(Integer id) {
        Pago pago = pagoRepository.findAll()
                .stream()
                .filter(p -> id != null && id.equals(p.getIdPago()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        return convertirADTO(pago);
    }

    @Transactional
    public PagoDTO guardar(PagoDTO dto) {
        validarDatos(dto);
        Alquiler alquiler = buscarAlquilerActivo(dto.getIdAlquiler());

        BigDecimal totalPagado = pagoRepository.sumarPagosActivosPorAlquiler(
                alquiler.getIdAlquiler());
        if (totalPagado == null) {
            totalPagado = BigDecimal.ZERO;
        }
        validarSaldo(alquiler, totalPagado, dto.getMonto());

        Pago pago = new Pago();
        pago.setAlquiler(alquiler);
        pago.setFechaPago(dto.getFechaPago());
        pago.setMonto(dto.getMonto());
        pago.setFormaPago(dto.getFormaPago().trim());
        pago.setEstado(true);
        pago.setMotivoAnulacion(null);
        pago.setFechaAnulacion(null);

        return convertirADTO(pagoRepository.save(pago));
    }

    // Los pagos son inmutables: para corregir uno se anula con motivo y se registra otro.
    @Transactional
    public PagoDTO actualizar(Integer id, PagoDTO dto) {
        buscarPagoActivo(id);
        throw new IllegalArgumentException(
                "Los pagos registrados no se pueden editar. "
                + "Para corregir un registro, anúlalo indicando el motivo y registra un nuevo pago."
        );
    }

    @Transactional
    public void anular(Integer id, String motivo) {
        if (motivo == null || motivo.trim().length() < 5) {
            throw new IllegalArgumentException(
                    "Debes escribir un motivo de anulación de al menos 5 caracteres."
            );
        }
        String motivoLimpio = motivo.trim();
        if (motivoLimpio.length() > MAX_MOTIVO) {
            throw new IllegalArgumentException(
                    "El motivo de anulación no puede superar los 500 caracteres."
            );
        }

        Pago pago = buscarPagoActivo(id);
        pago.setEstado(false);
        pago.setMotivoAnulacion(motivoLimpio);
        pago.setFechaAnulacion(LocalDate.now());
        pagoRepository.save(pago);
    }

    private Pago buscarPagoActivo(Integer id) {
        return pagoRepository.findFirstByIdPagoAndEstadoTrue(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado o ya anulado"));
    }

    private Alquiler buscarAlquilerActivo(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("Debes seleccionar un alquiler.");
        }
        return alquilerRepository.findById(id)
                .filter(a -> Boolean.TRUE.equals(a.getEstado()))
                .orElseThrow(() -> new RuntimeException("Alquiler no encontrado"));
    }

    private void validarDatos(PagoDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Los datos del pago son obligatorios.");
        }
        if (dto.getIdAlquiler() == null) {
            throw new IllegalArgumentException("Debes seleccionar un alquiler.");
        }
        if (dto.getFechaPago() == null) {
            throw new IllegalArgumentException("La fecha de pago es obligatoria.");
        }
        if (dto.getFechaPago().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de pago no puede ser futura.");
        }
        if (dto.getMonto() == null
                || dto.getMonto().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor que cero.");
        }
        if (dto.getMonto().scale() > 2) {
            throw new IllegalArgumentException("El monto no puede tener más de dos decimales.");
        }
        if (dto.getFormaPago() == null
                || !FORMAS_PAGO.contains(dto.getFormaPago().trim())) {
            throw new IllegalArgumentException(
                    "La forma de pago debe ser Efectivo, Tarjeta o Transferencia."
            );
        }
    }

    private void validarSaldo(
            Alquiler alquiler,
            BigDecimal totalPagado,
            BigDecimal montoNuevo) {
        BigDecimal totalAlquiler = alquiler.getTotal();
        if (totalAlquiler == null
                || totalAlquiler.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El alquiler no tiene un total válido.");
        }
        BigDecimal saldoDisponible = totalAlquiler.subtract(totalPagado);
        if (montoNuevo.compareTo(saldoDisponible) > 0) {
            throw new IllegalArgumentException(
                    "El monto supera el saldo disponible de Q"
                    + saldoDisponible.max(BigDecimal.ZERO)
            );
        }
    }

    private PagoDTO convertirADTO(Pago pago) {
        return new PagoDTO(
                pago.getIdPago(),
                pago.getAlquiler().getIdAlquiler(),
                pago.getFechaPago(),
                pago.getMonto(),
                pago.getFormaPago(),
                pago.getEstado(),
                pago.getMotivoAnulacion(),
                pago.getFechaAnulacion()
        );
    }
}
