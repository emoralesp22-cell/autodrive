package com.autodrive.autodrive.repository;

import com.autodrive.autodrive.model.Pago;
import com.autodrive.autodrive.model.PagoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface PagoRepository extends JpaRepository<Pago, PagoId> {

    Optional<Pago> findFirstByIdPagoAndEstadoTrue(Integer idPago);

    @Query("""
        SELECT COALESCE(SUM(p.monto), 0)
        FROM Pago p
        WHERE p.alquiler.idAlquiler = :idAlquiler
          AND p.estado = true
        """)
    BigDecimal sumarPagosActivosPorAlquiler(
            @Param("idAlquiler") Integer idAlquiler
    );

    @Query("""
        SELECT COALESCE(SUM(p.monto), 0)
        FROM Pago p
        WHERE p.alquiler.idAlquiler = :idAlquiler
          AND p.estado = true
          AND p.idPago <> :idPago
        """)
    BigDecimal sumarPagosActivosExcluyendoPago(
            @Param("idAlquiler") Integer idAlquiler,
            @Param("idPago") Integer idPago
    );
}