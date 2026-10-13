package com.autodrive.autodrive.controller;

import com.autodrive.autodrive.dto.AlquilerDTO;
import com.autodrive.autodrive.service.AlquilerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alquileres")
public class AlquilerController {

    private final AlquilerService alquilerService;

    public AlquilerController(AlquilerService alquilerService) {
        this.alquilerService = alquilerService;
    }

    @GetMapping
    public ResponseEntity<List<AlquilerDTO>> listar() {
        return ResponseEntity.ok(alquilerService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlquilerDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(alquilerService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<AlquilerDTO> guardar(@RequestBody AlquilerDTO dto) {
        return ResponseEntity.ok(alquilerService.guardar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Integer id,
            @RequestBody AlquilerDTO dto) {
        try {
            return ResponseEntity.ok(alquilerService.actualizar(id, dto));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", ex.getMessage())
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            alquilerService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", ex.getMessage())
            );
        }
    }
}
