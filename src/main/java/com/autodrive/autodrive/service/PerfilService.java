package com.autodrive.autodrive.service;

import com.autodrive.autodrive.dto.PerfilDTO;
import com.autodrive.autodrive.model.Perfil;
import com.autodrive.autodrive.repository.PerfilRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PerfilService {

    private final PerfilRepository perfilRepository;

    public PerfilService(PerfilRepository perfilRepository) {
        this.perfilRepository = perfilRepository;
    }

    public List<PerfilDTO> listar() {
        return perfilRepository.findAll()
                .stream()
                .filter(p -> Boolean.TRUE.equals(p.getEstado()))
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public PerfilDTO buscarPorId(Integer id) {
        Perfil perfil = perfilRepository.findById(id)
                .filter(p -> Boolean.TRUE.equals(p.getEstado()))
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));

        return convertirADTO(perfil);
    }

    public PerfilDTO guardar(PerfilDTO dto) {
        Perfil perfil = new Perfil();

        perfil.setNombre(dto.getNombre());
        perfil.setEstado(true);

        Perfil guardado = perfilRepository.save(perfil);

        return convertirADTO(guardado);
    }

    public PerfilDTO actualizar(Integer id, PerfilDTO dto) {
        Perfil perfil = perfilRepository.findById(id)
                .filter(p -> Boolean.TRUE.equals(p.getEstado()))
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));

        perfil.setNombre(dto.getNombre());

        Perfil actualizado = perfilRepository.save(perfil);

        return convertirADTO(actualizado);
    }

    public void eliminar(Integer id) {
        Perfil perfil = perfilRepository.findById(id)
                .filter(p -> Boolean.TRUE.equals(p.getEstado()))
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));

        perfil.setEstado(false);
        perfilRepository.save(perfil);
    }

    private PerfilDTO convertirADTO(Perfil perfil) {
        return new PerfilDTO(
                perfil.getIdPerfil(),
                perfil.getNombre(),
                perfil.getEstado()
        );
    }
}
