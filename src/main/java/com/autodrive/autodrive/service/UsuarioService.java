package com.autodrive.autodrive.service;

import com.autodrive.autodrive.dto.UsuarioDTO;
import com.autodrive.autodrive.model.Perfil;
import com.autodrive.autodrive.model.Usuario;
import com.autodrive.autodrive.repository.PerfilRepository;
import com.autodrive.autodrive.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PerfilRepository perfilRepository;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          PerfilRepository perfilRepository) {
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
    }

    public List<UsuarioDTO> listar() {
        return usuarioRepository.findAll()
                .stream()
                .filter(u -> Boolean.TRUE.equals(u.getEstado()))
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO buscarPorId(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .filter(u -> Boolean.TRUE.equals(u.getEstado()))
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return convertirADTO(usuario);
    }

    public UsuarioDTO guardar(UsuarioDTO dto) {

        Perfil perfil = perfilRepository.findById(dto.getIdPerfil())
                .filter(p -> Boolean.TRUE.equals(p.getEstado()))
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));

        Usuario usuario = new Usuario();

        usuario.setPerfil(perfil);
        usuario.setNombre(dto.getNombre());
        usuario.setUsuario(dto.getUsuario());
        usuario.setContrasena(dto.getContrasena());
        usuario.setCorreo(dto.getCorreo());
        usuario.setEstado(true);

        Usuario guardado = usuarioRepository.save(usuario);

        return convertirADTO(guardado);
    }

    public UsuarioDTO actualizar(Integer id, UsuarioDTO dto) {

        Usuario usuario = usuarioRepository.findById(id)
                .filter(u -> Boolean.TRUE.equals(u.getEstado()))
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Perfil perfil = perfilRepository.findById(dto.getIdPerfil())
                .filter(p -> Boolean.TRUE.equals(p.getEstado()))
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));

        usuario.setPerfil(perfil);
        usuario.setNombre(dto.getNombre());
        usuario.setUsuario(dto.getUsuario());
        usuario.setContrasena(dto.getContrasena());
        usuario.setCorreo(dto.getCorreo());

        Usuario actualizado = usuarioRepository.save(usuario);

        return convertirADTO(actualizado);
    }

    public void eliminar(Integer id) {

        Usuario usuario = usuarioRepository.findById(id)
                .filter(u -> Boolean.TRUE.equals(u.getEstado()))
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setEstado(false);
        usuarioRepository.save(usuario);
    }

    private UsuarioDTO convertirADTO(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getIdUsuario(),
                usuario.getPerfil().getIdPerfil(),
                usuario.getNombre(),
                usuario.getUsuario(),
                usuario.getContrasena(),
                usuario.getCorreo(),
                usuario.getEstado()
        );
    }
}

