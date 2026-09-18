package com.autodrive.autodrive.service;

import com.autodrive.autodrive.dto.ClienteDTO;
import com.autodrive.autodrive.model.Cliente;
import com.autodrive.autodrive.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

public List<ClienteDTO> listar() {
    return clienteRepository.findAll()
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
}


    public ClienteDTO buscarPorId(Integer id) {
        Cliente cliente = clienteRepository.findById(id)
                .filter(c -> Boolean.TRUE.equals(c.getEstado()))
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        return convertirADTO(cliente);
    }

    public ClienteDTO guardar(ClienteDTO dto) {
        Cliente cliente = new Cliente();

        cliente.setNombre(dto.getNombre());
        cliente.setDpi(dto.getDpi());
        cliente.setTelefono(dto.getTelefono());
        cliente.setEstado(true);

        Cliente guardado = clienteRepository.save(cliente);

        return convertirADTO(guardado);
    }

    public ClienteDTO actualizar(Integer id, ClienteDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .filter(c -> Boolean.TRUE.equals(c.getEstado()))
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        cliente.setNombre(dto.getNombre());
        cliente.setDpi(dto.getDpi());
        cliente.setTelefono(dto.getTelefono());

        Cliente actualizado = clienteRepository.save(cliente);

        return convertirADTO(actualizado);
    }

    public void eliminar(Integer id) {
        Cliente cliente = clienteRepository.findById(id)
                .filter(c -> Boolean.TRUE.equals(c.getEstado()))
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        cliente.setEstado(false);
        clienteRepository.save(cliente);
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
