package com.autodrive.autodrive.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AlquilerDTO {

    private Integer idAlquiler;
    private Integer idCliente;
    private Integer idVehiculo;
    private Integer idUsuario;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private BigDecimal total;
    private Boolean estado;

    public AlquilerDTO() {
    }

    public AlquilerDTO(Integer idAlquiler, Integer idCliente, Integer idVehiculo,
                       Integer idUsuario, LocalDate fechaInicio, LocalDate fechaFin,
                       BigDecimal total, Boolean estado) {
        this.idAlquiler = idAlquiler;
        this.idCliente = idCliente;
        this.idVehiculo = idVehiculo;
        this.idUsuario = idUsuario;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.total = total;
        this.estado = estado;
    }

    public Integer getIdAlquiler() {
        return idAlquiler;
    }

    public void setIdAlquiler(Integer idAlquiler) {
        this.idAlquiler = idAlquiler;
    }

    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public Integer getIdVehiculo() {
        return idVehiculo;
    }

    public void setIdVehiculo(Integer idVehiculo) {
        this.idVehiculo = idVehiculo;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}
