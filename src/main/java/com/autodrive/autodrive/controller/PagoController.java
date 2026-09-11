package com.autodrive.autodrive.controller;

import com.autodrive.autodrive.dto.PagoDTO;
import com.autodrive.autodrive.service.PagoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @GetMapping
    public ResponseEntity<List<PagoDTO>> listar() {
        return ResponseEntity.ok(pagoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PagoDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(pagoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<PagoDTO> guardar(@RequestBody PagoDTO dto) {
        return ResponseEntity.ok(pagoService.guardar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PagoDTO> actualizar(
            @PathVariable Integer id,
            @RequestBody PagoDTO dto) {

        return ResponseEntity.ok(pagoService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        pagoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
