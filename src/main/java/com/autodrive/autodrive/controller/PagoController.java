package com.autodrive.autodrive.controller;

import com.autodrive.autodrive.dto.PagoDTO;
import com.autodrive.autodrive.service.PagoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@CrossOrigin(
    origins = "http://localhost:5173",
    allowedHeaders = "*",
    methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.PATCH,
        RequestMethod.DELETE,
        RequestMethod.OPTIONS
    }
)
@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    // La lista normal solo devuelve pagos válidos y sirve para los cálculos actuales.
    @GetMapping
    public ResponseEntity<List<PagoDTO>> listar() {
        return ResponseEntity.ok(pagoService.listar());
    }

    // El kardex necesita consultar también los registros anulados.
    @GetMapping("/historial")
    public ResponseEntity<List<PagoDTO>> listarHistorial() {
        return ResponseEntity.ok(pagoService.listarHistorial());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PagoDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(pagoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<PagoDTO> guardar(@RequestBody PagoDTO dto) {
        return ResponseEntity.ok(pagoService.guardar(dto));
    }

    // Se conserva la ruta PUT por compatibilidad, pero el servicio impide editar pagos.
@PutMapping("/{id}")
public ResponseEntity<?> actualizar(
        @PathVariable Integer id,
        @RequestBody PagoDTO dto) {

    try {
        return ResponseEntity.ok(
                pagoService.actualizar(id, dto)
        );
    } catch (IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(
                Map.of("error", ex.getMessage())
        );
    }
}

    @PatchMapping("/{id}/anular")
    public ResponseEntity<Void> anular(
            @PathVariable Integer id,
            @RequestBody Map<String, String> solicitud) {
        pagoService.anular(id, solicitud == null ? null : solicitud.get("motivo"));
        return ResponseEntity.noContent().build();
    }

    // Compatibilidad de ruta: también exige motivo; ya no permite anulación silenciosa.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Integer id,
            @RequestBody(required = false) Map<String, String> solicitud) {
        pagoService.anular(id, solicitud == null ? null : solicitud.get("motivo"));
        return ResponseEntity.noContent().build();
    }
}
