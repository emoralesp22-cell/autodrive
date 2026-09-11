package com.autodrive.autodrive.repository;

import com.autodrive.autodrive.model.Pago;
import com.autodrive.autodrive.model.PagoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PagoRepository extends JpaRepository<Pago, PagoId> {
}
