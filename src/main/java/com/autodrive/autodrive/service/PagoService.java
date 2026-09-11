package com.autodrive.autodrive.service;

import com.autodrive.autodrive.dto.PagoDTO;
import com.autodrive.autodrive.model.Alquiler;
import com.autodrive.autodrive.model.Pago;
import com.autodrive.autodrive.repository.AlquilerRepository;
import com.autodrive.autodrive.repository.PagoRepository;
import org.springframework.stereotype.Service;

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

        pago.setEstado(false);
        pagoRepository.save(pago);
    }

    private PagoDTO convertirADTO(Pago pago) {

        return new PagoDTO(
                pago.getIdPago(),
                pago.getAlquiler().getIdAlquiler(),
                pago.getFechaPago(),
                pago.getMonto(),
                pago.getFormaPago(),
                pago.getEstado()
        );
    }
}
