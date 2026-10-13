package com.autodrive.autodrive.service;

import com.autodrive.autodrive.dto.ClienteDTO;
import com.autodrive.autodrive.model.Alquiler;
import com.autodrive.autodrive.model.Cliente;
import com.autodrive.autodrive.repository.AlquilerRepository;
import com.autodrive.autodrive.repository.ClienteRepository;
import com.autodrive.autodrive.repository.PagoRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final AlquilerRepository alquilerRepository;
    private final PagoRepository pagoRepository;

    public ClienteService(
            ClienteRepository clienteRepository,
            AlquilerRepository alquilerRepository,
            PagoRepository pagoRepository) {

        this.clienteRepository = clienteRepository;
        this.alquilerRepository = alquilerRepository;
        this.pagoRepository = pagoRepository;
    }

    @Transactional(readOnly = true)
    public List<ClienteDTO> listar() {
        return clienteRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClienteDTO buscarPorId(Integer id) {
        Cliente cliente = clienteRepository.findById(id)
                .filter(c -> Boolean.TRUE.equals(c.getEstado()))
                .orElseThrow(
                        () -> new RuntimeException("Cliente no encontrado")
                );

        return convertirADTO(cliente);
    }

    @Transactional
    public ClienteDTO guardar(ClienteDTO dto) {
        validarDatos(dto);

        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre().trim());
        cliente.setDpi(dto.getDpi().trim());
        cliente.setTelefono(dto.getTelefono().trim());
        cliente.setEstado(true);

        Cliente guardado = clienteRepository.save(cliente);

        return convertirADTO(guardado);
    }

    @Transactional
    public ClienteDTO actualizar(Integer id, ClienteDTO dto) {
        validarDatos(dto);

        Cliente cliente = clienteRepository.findById(id)
                .filter(c -> Boolean.TRUE.equals(c.getEstado()))
                .orElseThrow(
                        () -> new RuntimeException("Cliente no encontrado")
                );

        cliente.setNombre(dto.getNombre().trim());
        cliente.setDpi(dto.getDpi().trim());
        cliente.setTelefono(dto.getTelefono().trim());

        Cliente actualizado = clienteRepository.save(cliente);

        return convertirADTO(actualizado);
    }

    @Transactional
    public void eliminar(Integer id) {
        Cliente cliente = clienteRepository.findById(id)
                .filter(c -> Boolean.TRUE.equals(c.getEstado()))
                .orElseThrow(
                        () -> new RuntimeException("Cliente no encontrado")
                );

        BigDecimal cero = BigDecimal.ZERO;

List<Alquiler> alquileresCliente =
        alquilerRepository.findByCliente_IdCliente(id);

        for (Alquiler alquiler : alquileresCliente) {
            BigDecimal totalAlquiler = alquiler.getTotal();

            if (totalAlquiler == null) {
                throw new IllegalStateException(
                        "No se puede anular el cliente porque el alquiler #"
                        + alquiler.getIdAlquiler()
                        + " no tiene un total válido."
                );
            }

            BigDecimal totalPagado =
                    pagoRepository.sumarPagosActivosPorAlquiler(
                            alquiler.getIdAlquiler()
                    );

            if (totalPagado == null) {
                totalPagado = cero;
            }

            BigDecimal saldoPendiente =
                    totalAlquiler.subtract(totalPagado);

            if (saldoPendiente.compareTo(cero) > 0) {
                throw new IllegalStateException(
                        "No se puede anular el cliente "
                        + cliente.getNombre()
                        + " porque el alquiler #"
                        + alquiler.getIdAlquiler()
                        + " tiene un saldo pendiente de Q"
                        + saldoPendiente.toPlainString()
                        + ". Registra los abonos restantes antes de anularlo."
                );
            }
        }

        cliente.setEstado(false);
        clienteRepository.save(cliente);
    }

    private void validarDatos(ClienteDTO dto) {
        if (dto == null
                || dto.getNombre() == null
                || dto.getNombre().isBlank()
                || dto.getDpi() == null
                || dto.getDpi().isBlank()
                || dto.getTelefono() == null
                || dto.getTelefono().isBlank()) {

            throw new IllegalArgumentException(
                    "Completa el nombre, DPI y teléfono del cliente."
            );
        }
    }

    private ClienteDTO convertirADTO(Cliente cliente) {
        return new ClienteDTO(
                cliente.getIdCliente(),
                cliente.getNombre(),
                cliente.getDpi(),
                cliente.getTelefono(),
                cliente.getEstado()
        );
    }
}
