
package com.autodrive.autodrive.repository;

import com.autodrive.autodrive.model.Alquiler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlquilerRepository extends JpaRepository<Alquiler, Integer> {

    List<Alquiler> findByCliente_IdCliente(Integer idCliente);
}