package com.autodrive.autodrive.model;

import java.io.Serializable;
import java.util.Objects;

public class PagoId implements Serializable {

    private Integer idPago;
    private Integer alquiler;

    public PagoId() {
    }

    public PagoId(Integer idPago, Integer alquiler) {
        this.idPago = idPago;
        this.alquiler = alquiler;
    }

    public Integer getIdPago() {
        return idPago;
    }

    public void setIdPago(Integer idPago) {
        this.idPago = idPago;
    }

    public Integer getAlquiler() {
        return alquiler;
    }

    public void setAlquiler(Integer alquiler) {
        this.alquiler = alquiler;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PagoId)) return false;

        PagoId pagoId = (PagoId) o;

        return Objects.equals(idPago, pagoId.idPago)
                && Objects.equals(alquiler, pagoId.alquiler);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPago, alquiler);
    }
}