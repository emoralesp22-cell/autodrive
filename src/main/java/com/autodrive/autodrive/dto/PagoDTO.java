package com.autodrive.autodrive.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PagoDTO {

    private Integer idPago;
    private Integer idAlquiler;
    private LocalDate fechaPago;
    private BigDecimal monto;
    private String formaPago;
    private Boolean estado;

    public PagoDTO() {}

    public PagoDTO(Integer idPago, Integer idAlquiler, LocalDate fechaPago,
                   BigDecimal monto, String formaPago, Boolean estado) {
        this.idPago = idPago;
        this.idAlquiler = idAlquiler;
        this.fechaPago = fechaPago;
        this.monto = monto;
        this.formaPago = formaPago;
        this.estado = estado;
    }

    public Integer getIdPago() {
        return idPago;
    }

    public void setIdPago(Integer idPago) {
        this.idPago = idPago;
    }

    public Integer getIdAlquiler() {
        return idAlquiler;
    }

    public void setIdAlquiler(Integer idAlquiler) {
        this.idAlquiler = idAlquiler;
    }

    public LocalDate getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDate fechaPago) {
        this.fechaPago = fechaPago;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public String getFormaPago() {
        return formaPago;
    }

    public void setFormaPago(String formaPago) {
        this.formaPago = formaPago;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}
