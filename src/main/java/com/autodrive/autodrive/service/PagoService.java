package com.autodrive.autodrive.service;

import com.autodrive.autodrive.dto.PagoDTO;
import com.autodrive.autodrive.model.Alquiler;
import com.autodrive.autodrive.model.Pago;
import com.autodrive.autodrive.repository.AlquilerRepository;
import com.autodrive.autodrive.repository.PagoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PagoService {

    private final PagoRepository pagoRepository;
    private final AlquilerRepository alquilerRepository;

    public PagoService(
            PagoRepository pagoRepository,
            AlquilerRepository alquilerRepository) {

        this.pagoRepository = pagoRepository;
        this.alquilerRepository = alquilerRepository;
    }

    public List<PagoDTO> listar() {

        return pagoRepository.findAll()
                .stream()
                .filter(p -> Boolean.TRUE.equals(p.getEstado()))
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public PagoDTO buscarPorId(Integer id) {

        Pago pago = pagoRepository.findAll()
                .stream()
                .filter(p -> p.getIdPago().equals(id))
                .filter(p -> Boolean.TRUE.equals(p.getEstado()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        return convertirADTO(pago);
    }

    public PagoDTO guardar(PagoDTO dto) {

        Alquiler alquiler = alquilerRepository.findById(dto.getIdAlquiler())
                .filter(a -> Boolean.TRUE.equals(a.getEstado()))
                .orElseThrow(() -> new RuntimeException("Alquiler no encontrado"));

        validarMonto(dto.getMonto());

        BigDecimal totalAlquiler = obtenerTotalAlquiler(alquiler);
        BigDecimal totalPagadoActual = obtenerTotalPagado(alquiler.getIdAlquiler());

        BigDecimal saldoActual = totalAlquiler.subtract(totalPagadoActual);

        if (dto.getMonto().compareTo(saldoActual) > 0) {
            throw new RuntimeException(
                    "El pago supera el saldo pendiente. Saldo disponible: Q"
                            + saldoActual
            );
        }

        Pago pago = new Pago();

        pago.setAlquiler(alquiler);
        pago.setFechaPago(dto.getFechaPago());
        pago.setMonto(dto.getMonto());
        pago.setFormaPago(dto.getFormaPago());
        pago.setEstado(true);

        Pago guardado = pagoRepository.save(pago);

        return convertirADTO(guardado);
    }

    public PagoDTO actualizar(Integer id, PagoDTO dto) {

        Pago pago = pagoRepository.findAll()
                .stream()
                .filter(p -> p.getIdPago().equals(id))
                .filter(p -> Boolean.TRUE.equals(p.getEstado()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        Alquiler alquiler = alquilerRepository.findById(dto.getIdAlquiler())
                .filter(a -> Boolean.TRUE.equals(a.getEstado()))
                .orElseThrow(() -> new RuntimeException("Alquiler no encontrado"));

        validarMonto(dto.getMonto());

        BigDecimal totalAlquiler = obtenerTotalAlquiler(alquiler);

        // Restamos el pago que estamos editando
        BigDecimal totalPagadoSinEstePago =
                obtenerTotalPagado(alquiler.getIdAlquiler())
                        .subtract(pago.getMonto());

        BigDecimal saldoDisponible =
                totalAlquiler.subtract(totalPagadoSinEstePago);

        if (dto.getMonto().compareTo(saldoDisponible) > 0) {
            throw new RuntimeException(
                    "El pago supera el saldo pendiente. Saldo disponible: Q"
                            + saldoDisponible
            );
        }

        pago.setAlquiler(alquiler);
        pago.setFechaPago(dto.getFechaPago());
        pago.setMonto(dto.getMonto());
        pago.setFormaPago(dto.getFormaPago());

        Pago actualizado = pagoRepository.save(pago);

        return convertirADTO(actualizado);
    }

    public void eliminar(Integer id) {

        Pago pago = pagoRepository.findAll()
                .stream()
                .filter(p -> p.getIdPago().equals(id))
                .filter(p -> Boolean.TRUE.equals(p.getEstado()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        // Eliminación lógica
        pago.setEstado(false);

        pagoRepository.save(pago);
    }

    /**
     * Calcula cuánto se ha pagado actualmente de un alquiler.
     */
    private BigDecimal obtenerTotalPagado(Integer idAlquiler) {

        return pagoRepository.findAll()
                .stream()
                .filter(p -> Boolean.TRUE.equals(p.getEstado()))
                .filter(p -> p.getAlquiler() != null)
                .filter(p -> p.getAlquiler().getIdAlquiler().equals(idAlquiler))
                .map(Pago::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Obtiene el total del alquiler.
     */
    private BigDecimal obtenerTotalAlquiler(Alquiler alquiler) {

        if (alquiler.getTotal() == null) {
            throw new RuntimeException(
                    "El alquiler no tiene un total definido"
            );
        }

        return alquiler.getTotal();
    }

    /**
     * Valida que el monto sea válido.
     */
    private void validarMonto(BigDecimal monto) {

        if (monto == null) {
            throw new RuntimeException("El monto del pago es obligatorio");
        }

        if (monto.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException(
                    "El monto del pago debe ser mayor a Q0"
            );
        }
    }

    /**
     * Convierte Pago a PagoDTO incluyendo
     * información del estado de pago.
     */
    private PagoDTO convertirADTO(Pago pago) {

        Integer idAlquiler = pago.getAlquiler().getIdAlquiler();

        BigDecimal totalAlquiler =
                obtenerTotalAlquiler(pago.getAlquiler());

        BigDecimal totalPagado =
                obtenerTotalPagado(idAlquiler);

        BigDecimal saldoPendiente =
                totalAlquiler.subtract(totalPagado);

        if (saldoPendiente.compareTo(BigDecimal.ZERO) < 0) {
            saldoPendiente = BigDecimal.ZERO;
        }

        String estadoPago;

        if (totalPagado.compareTo(BigDecimal.ZERO) == 0) {
            estadoPago = "Pendiente";
        } else if (totalPagado.compareTo(totalAlquiler) >= 0) {
            estadoPago = "Pagado";
        } else {
            estadoPago = "Abono";
        }

        PagoDTO dto = new PagoDTO(
                pago.getIdPago(),
                idAlquiler,
                pago.getFechaPago(),
                pago.getMonto(),
                pago.getFormaPago(),
                pago.getEstado()
        );

        dto.setTotalAlquiler(totalAlquiler);
        dto.setTotalPagado(totalPagado);
        dto.setSaldoPendiente(saldoPendiente);
        dto.setEstadoPago(estadoPago);

        return dto;
    }
}
