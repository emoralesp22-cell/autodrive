package com.autodrive.autodrive.controller;

import com.autodrive.autodrive.dto.PerfilDTO;
import com.autodrive.autodrive.service.PerfilService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/perfiles")
public class PerfilController {

    private final PerfilService perfilService;

    public PerfilController(PerfilService perfilService) {
        this.perfilService = perfilService;
    }

    @GetMapping
    public ResponseEntity<List<PerfilDTO>> listar() {
        return ResponseEntity.ok(perfilService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PerfilDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(perfilService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<PerfilDTO> guardar(@RequestBody PerfilDTO dto) {
        return ResponseEntity.ok(perfilService.guardar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PerfilDTO> actualizar(
            @PathVariable Integer id,
            @RequestBody PerfilDTO dto) {

        return ResponseEntity.ok(perfilService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        perfilService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

