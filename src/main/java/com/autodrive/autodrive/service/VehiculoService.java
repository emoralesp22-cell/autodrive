package com.autodrive.autodrive.service;

import com.autodrive.autodrive.dto.VehiculoDTO;
import com.autodrive.autodrive.model.Vehiculo;
import com.autodrive.autodrive.repository.VehiculoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehiculoService {

    private final VehiculoRepository vehiculoRepository;

    public VehiculoService(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    public List<VehiculoDTO> listar() {
        return vehiculoRepository.findAll()
                .stream()
                .filter(vehiculo -> Boolean.TRUE.equals(vehiculo.getEstado()))
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public VehiculoDTO buscarPorId(Integer id) {
        Vehiculo vehiculo = vehiculoRepository.findById(id)
                .filter(v -> Boolean.TRUE.equals(v.getEstado()))
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));

        return convertirADTO(vehiculo);
    }

    public VehiculoDTO guardar(VehiculoDTO dto) {
        Vehiculo vehiculo = new Vehiculo();

        vehiculo.setPlaca(dto.getPlaca());
        vehiculo.setMarca(dto.getMarca());
        vehiculo.setModelo(dto.getModelo());
        vehiculo.setPrecioDia(dto.getPrecioDia());
        vehiculo.setEstado(true);

        Vehiculo guardado = vehiculoRepository.save(vehiculo);

        return convertirADTO(guardado);
    }

    public VehiculoDTO actualizar(Integer id, VehiculoDTO dto) {
        Vehiculo vehiculo = vehiculoRepository.findById(id)
                .filter(v -> Boolean.TRUE.equals(v.getEstado()))
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));

        vehiculo.setPlaca(dto.getPlaca());
        vehiculo.setMarca(dto.getMarca());
        vehiculo.setModelo(dto.getModelo());
        vehiculo.setPrecioDia(dto.getPrecioDia());
        vehiculo.setEstado(dto.getEstado());

        Vehiculo actualizado = vehiculoRepository.save(vehiculo);

        return convertirADTO(actualizado);
    }

    public void eliminar(Integer id) {
        Vehiculo vehiculo = vehiculoRepository.findById(id)
                .filter(v -> Boolean.TRUE.equals(v.getEstado()))
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));

        vehiculo.setEstado(false);

        vehiculoRepository.save(vehiculo);
    }

    private VehiculoDTO convertirADTO(Vehiculo vehiculo) {
        return new VehiculoDTO(
                vehiculo.getIdVehiculo(),
                vehiculo.getPlaca(),
                vehiculo.getMarca(),
                vehiculo.getModelo(),
                vehiculo.getPrecioDia(),
                vehiculo.getEstado()
        );
    }
}
