package com.autodrive.autodrive.service;

import com.autodrive.autodrive.dto.AlquilerDTO;
import com.autodrive.autodrive.model.Alquiler;
import com.autodrive.autodrive.model.Cliente;
import com.autodrive.autodrive.model.Usuario;
import com.autodrive.autodrive.model.Vehiculo;
import com.autodrive.autodrive.repository.AlquilerRepository;
import com.autodrive.autodrive.repository.ClienteRepository;
import com.autodrive.autodrive.repository.UsuarioRepository;
import com.autodrive.autodrive.repository.VehiculoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlquilerService {

    private final AlquilerRepository alquilerRepository;
    private final ClienteRepository clienteRepository;
    private final VehiculoRepository vehiculoRepository;
    private final UsuarioRepository usuarioRepository;

    public AlquilerService(
            AlquilerRepository alquilerRepository,
            ClienteRepository clienteRepository,
            VehiculoRepository vehiculoRepository,
            UsuarioRepository usuarioRepository) {

        this.alquilerRepository = alquilerRepository;
        this.clienteRepository = clienteRepository;
        this.vehiculoRepository = vehiculoRepository;
        this.usuarioRepository = usuarioRepository;
    }

 public List<AlquilerDTO> listar() {
    return alquilerRepository.findAll()
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
}

    public AlquilerDTO buscarPorId(Integer id) {
        Alquiler alquiler = alquilerRepository.findById(id)
                .filter(a -> Boolean.TRUE.equals(a.getEstado()))
                .orElseThrow(() -> new RuntimeException("Alquiler no encontrado"));

        return convertirADTO(alquiler);
    }

    public AlquilerDTO guardar(AlquilerDTO dto) {

        Cliente cliente = clienteRepository.findById(dto.getIdCliente())
                .filter(c -> Boolean.TRUE.equals(c.getEstado()))
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Vehiculo vehiculo = vehiculoRepository.findById(dto.getIdVehiculo())
                .filter(v -> Boolean.TRUE.equals(v.getEstado()))
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .filter(u -> Boolean.TRUE.equals(u.getEstado()))
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Alquiler alquiler = new Alquiler();

        alquiler.setCliente(cliente);
        alquiler.setVehiculo(vehiculo);
        alquiler.setUsuario(usuario);
        alquiler.setFechaInicio(dto.getFechaInicio());
        alquiler.setFechaFin(dto.getFechaFin());

        // Calcular automáticamente los días del alquiler
        long dias = ChronoUnit.DAYS.between(
                dto.getFechaInicio(),
                dto.getFechaFin()
        );

        // Calcular automáticamente el total
        BigDecimal total = vehiculo.getPrecioDia()
                .multiply(BigDecimal.valueOf(dias));

        alquiler.setTotal(total);
        alquiler.setEstado(true);

        Alquiler guardado = alquilerRepository.save(alquiler);

        return convertirADTO(guardado);
    }

    public AlquilerDTO actualizar(Integer id, AlquilerDTO dto) {

        Alquiler alquiler = alquilerRepository.findById(id)
                .filter(a -> Boolean.TRUE.equals(a.getEstado()))
                .orElseThrow(() -> new RuntimeException("Alquiler no encontrado"));

        Cliente cliente = clienteRepository.findById(dto.getIdCliente())
                .filter(c -> Boolean.TRUE.equals(c.getEstado()))
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Vehiculo vehiculo = vehiculoRepository.findById(dto.getIdVehiculo())
                .filter(v -> Boolean.TRUE.equals(v.getEstado()))
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .filter(u -> Boolean.TRUE.equals(u.getEstado()))
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        alquiler.setCliente(cliente);
        alquiler.setVehiculo(vehiculo);
        alquiler.setUsuario(usuario);
        alquiler.setFechaInicio(dto.getFechaInicio());
        alquiler.setFechaFin(dto.getFechaFin());

        // Recalcular automáticamente los días
        long dias = ChronoUnit.DAYS.between(
                dto.getFechaInicio(),
                dto.getFechaFin()
        );

        // Recalcular automáticamente el total
        BigDecimal total = vehiculo.getPrecioDia()
                .multiply(BigDecimal.valueOf(dias));

        alquiler.setTotal(total);

        Alquiler actualizado = alquilerRepository.save(alquiler);

        return convertirADTO(actualizado);
    }

    public void eliminar(Integer id) {

        Alquiler alquiler = alquilerRepository.findById(id)
                .filter(a -> Boolean.TRUE.equals(a.getEstado()))
                .orElseThrow(() -> new RuntimeException("Alquiler no encontrado"));

        alquiler.setEstado(false);

        alquilerRepository.save(alquiler);
    }

    private AlquilerDTO convertirADTO(Alquiler alquiler) {
        return new AlquilerDTO(
                alquiler.getIdAlquiler(),
                alquiler.getCliente().getIdCliente(),
                alquiler.getVehiculo().getIdVehiculo(),
                alquiler.getUsuario().getIdUsuario(),
                alquiler.getFechaInicio(),
                alquiler.getFechaFin(),
                alquiler.getTotal(),
                alquiler.getEstado()
        );
    }
}
